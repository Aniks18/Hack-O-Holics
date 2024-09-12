import requests
import json
import os
import logging
from collections import Counter
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import time

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

RAPIDAPI_KEY = "6d1abe9edamsh6daae6a50b72ab8p1a01dcjsna66d4b8e8627"  # replace with your RapidAPI key
RAPIDAPI_HOST = "twitter241.p.rapidapi.com"

# Define disaster-related keywords and additional keywords to filter the tweets
DISASTER_KEYWORDS = [
    'flood', 'earthquake', 'cyclone', 'storm', 'landslide', 'tsunami',
    'hurricane', 'wildfire', 'disaster', 'tornado', 'volcano'
]

ADDITIONAL_KEYWORDS = [
    'disaster', 'flood', 'tragedy', 'kill', 'massive', 'destruction'
]

def fetch_tweets(query, count=50):
    url = f"https://{RAPIDAPI_HOST}/search-v2"
    headers = {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST
    }
    params = {
        'type': 'Top',
        'count': count,
        'query': query
    }

    try:
        response = requests.get(url, headers=headers, params=params)
        if response.status_code != 200:
            raise Exception(f"Failed to fetch tweets: {response.status_code}, {response.text}")

        tweets_data = response.json()
        logging.debug('Raw tweet data: %s', tweets_data)

        tweets = []
        for entry in tweets_data.get('result', {}).get('timeline', {}).get('instructions', []):
            for tweet_entry in entry.get('entries', []):
                tweet_content = tweet_entry.get('content', {})
                tweet = tweet_content.get('itemContent', {}).get('tweet_results', {}).get('result', {})
                
                if not tweet:
                    continue

                legacy = tweet.get('legacy', {})
                entities = legacy.get('entities', {})
                hashtags = [h['text'].lower() for h in entities.get('hashtags', [])]
                
                tweet_info = {
                    'content': legacy.get('full_text', ''),
                    'username': legacy.get('user', {}).get('screen_name', ''),
                    'date': legacy.get('created_at', ''),  # Date is included but not used in filtering
                    'like_count': legacy.get('favorite_count', 0),
                    'retweet_count': legacy.get('retweet_count', 0),
                    'profile_image_url': legacy.get('user', {}).get('profile_image_url_https', ''),
                    'media_url': entities.get('media', [{}])[0].get('media_url_https', ''),
                    'hashtags': hashtags
                }
                tweets.append(tweet_info)

        logging.info('Fetched %d tweets for query "%s"', len(tweets), query)
        return tweets

    except Exception as e:
        logging.error('Error fetching tweets for query "%s": %s', query, str(e))
        return []

def extract_related_hashtags(tweets, original_hashtags):
    hashtags = []
    for tweet in tweets:
        hashtags.extend([h for h in tweet.get('hashtags', []) if h.lower() not in original_hashtags])
    hashtag_counts = Counter(hashtags)
    most_common_hashtags = [h for h, count in hashtag_counts.most_common(3)]  # Limit to 3 hashtags
    return most_common_hashtags

def get_query_and_location_from_json():
    try:
        file_path = 'backend/data.json'  # Adjusted based on your directory structure
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")

        with open(file_path, 'r') as json_file:
            data = json.load(json_file)
            query = data.get('query', '')
            location = data.get('location', '')

            if not query or not location:
                raise ValueError('Query and location must be provided in data.json')

            return query, location

    except FileNotFoundError as fnf_error:
        logging.error(fnf_error)
        return '', ''
    except Exception as e:
        logging.error('Error reading data.json: %s', str(e))
        return '', ''

def save_tweets_to_json(tweets):
    try:
        with open('../my-app/src/Components/Common/twitterresult.json', 'w', encoding='utf-8') as json_file:
            json.dump(tweets, json_file, ensure_ascii=False, indent=4)
        logging.info("Results saved to twitterresult.json successfully.")
    except Exception as e:
        logging.error(f"Error saving results to twitterresult.json: {str(e)}")

class DataFileHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.src_path.endswith('data.json'):
            logging.info("data.json has been modified. Running the update script...")
            main()  # Call the main function to rerun the logic

def main():
    logging.info("Starting the script.")
    query, location = get_query_and_location_from_json()

    if query and location:
        hashtag_query = f"#{query} AND #{location}"
        original_hashtags = {query.lower(), location.lower()}

        logging.info(f"Searching for tweets with both hashtags: {hashtag_query}")
        tweets_with_both_hashtags = fetch_tweets(hashtag_query)

        related_hashtags = extract_related_hashtags(tweets_with_both_hashtags, original_hashtags)
        logging.info(f"Related hashtags found: {', '.join(['#'+h for h in related_hashtags])}")

        all_tweets = tweets_with_both_hashtags.copy()
        for hashtag in related_hashtags:
            search_hashtag = f"#{hashtag}"
            logging.info(f"Searching for related hashtag: {search_hashtag}")
            related_tweets = fetch_tweets(search_hashtag)
            all_tweets.extend(related_tweets)

        # Remove duplicates based on tweet content
        unique_tweets = {tweet['content']: tweet for tweet in all_tweets}.values()

        # Save all unique tweets to JSON file
        save_tweets_to_json(list(unique_tweets))

        # Log the tweets
        logging.info(f"Tweets saved successfully.")

    else:
        logging.warning("Query or location not provided in data.json")

if __name__ == "__main__":
    event_handler = DataFileHandler()
    observer = Observer()
    observer.schedule(event_handler, path='backend', recursive=False)
    observer.start()

    logging.info("Monitoring data.json for changes. Press Ctrl+C to stop.")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
