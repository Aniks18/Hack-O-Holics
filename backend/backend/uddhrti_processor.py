import time
import json
import requests
from bs4 import BeautifulSoup
from googlesearch import search
from opencage.geocoder import OpenCageGeocode
from deep_translator import GoogleTranslator
from typing import List, Dict, Any
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Initialize geocoder with your API key
OPENCAGE_API_KEY = '302c8df39373432c8da414cb42b669c6'
geocoder = OpenCageGeocode(OPENCAGE_API_KEY)

# Initialize translator
translator = GoogleTranslator(source='auto', target='en')

# News API key and endpoint
NEWS_API_KEY = '4ea6499bb61b4442a2b5fb6cab66cad9'
NEWS_API_URL = 'https://newsapi.org/v2/everything'

# News channels by city/state
NEWS_CHANNELS = {
    'Delhi': ['NDTV', 'Aaj Tak', 'India TV'],
    'Mumbai': ['Times Now', 'CNN-News18', 'Star News'],
    'Noida': ['Zee News', 'News18 India'],
    'Kolkata': ['ABP Ananda', '24 Ghanta'],
    'Chennai': ['Sun TV', 'Raj TV'],
    'Hyderabad': ['TV9 Telugu', 'NTV'],
    'Bengaluru': ['Public TV', 'TV9 Kannada'],
    'Pune': ['Zee 24 Taas']
}

def process_query(query: str, location: str) -> Dict[str, Any]:
    """
    Process the query and location to generate search results and additional information.
    """
    try:
        # Get location suggestions
        location_info = geocoder.geocode(location)
        location_suggestions = [result['formatted'] for result in location_info] if location_info else [location]
        
        # Use the first suggestion for simplicity
        if location_suggestions:
            location = location_suggestions[0]

        # Search for news articles using Google Search and News API
        google_search_results = search(f"{query} {location}", num_results=15)
        news_api_results = fetch_news_api_results(query, location)

        # Fetch news articles from Google Search
        results = []
        for url in google_search_results:
            try:
                article_data = fetch_article_data(url)
                if article_data:
                    results.append(article_data)
            except Exception as e:
                print(f"Error fetching data for {url}: {e}")
                continue

        # Append news articles from News API
        for article in news_api_results:
            if len(results) >= 20:
                break
            if not any(article['url'] == result['link'] for result in results):  # Avoid duplicates
                results.append({
                    'title': article['title'],
                    'snippet': article['description'],
                    'link': article['url'],
                    'publishedAt': article['publishedAt'],
                    'source': article['source']['name'],
                    'image': article['urlToImage'] if article['urlToImage'] else 'No Image',
                    'report_links': []
                })

        # Get news from local channels
        local_results = search_local_news(query, location)

        return {
            "query": query,
            "location": location,
            "results": results,
            "local_results": local_results
        }

    except Exception as e:
        print(f"Error during processing: {e}")
        return {"error": str(e)}

def fetch_news_api_results(query: str, location: str) -> List[Dict[str, Any]]:
    """
    Fetch news articles from News API.
    """
    params = {
        'q': f"{query} {location}",
        'apiKey': NEWS_API_KEY,
        'pageSize': 20,  # Fetch up to 20 articles
        'language': 'en'
    }
    response = requests.get(NEWS_API_URL, params=params)
    data = response.json()
    return data.get('articles', [])

def fetch_article_data(url: str) -> Dict[str, Any]:
    """
    Fetch and parse article data from a given URL.
    """
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    title = soup.title.string if soup.title else "No Title"
    snippet = ' '.join(p.text for p in soup.find_all('p')[:3])
    published_date = soup.find('meta', {'property': 'article:published_time'})
    published_date = published_date['content'] if published_date else "No Date"
    source = soup.find('meta', {'property': 'og:site_name'})
    source = source['content'] if source else "No Source"
    image = soup.find('meta', {'property': 'og:image'})
    image_url = image['content'] if image else "No Image"

    report_links = find_report_links(soup, url)

    return {
        'title': title,
        'snippet': snippet,
        'link': url,
        'publishedAt': published_date,
        'source': source,
        'image': image_url,
        'report_links': report_links[:2]  # Show only up to 2 report links
    }

def find_report_links(soup: BeautifulSoup, url: str) -> List[Dict[str, str]]:
    """
    Find related report links from the parsed HTML.
    """
    report_links = []
    disaster_keywords = [
        'disaster', 'accident', 'destruction', 'flood', 'landslide', 'earthquake', 
        'hurricane', 'tornado', 'tsunami', 'fire', 'explosion'
    ]
    
    if 'reliefweb.int' in url:
        report_elements = soup.find_all('a', class_='resource-title')
        for element in report_elements:
            if any(keyword in element.text.lower() for keyword in disaster_keywords):
                report_links.append({
                    'title': element.text.strip(),
                    'url': 'https://reliefweb.int' + element['href'] if element['href'].startswith('/') else element['href']
                })
                if len(report_links) == 5:
                    return report_links
    else:
        for a in soup.find_all('a', href=True):
            if any(keyword in a.text.lower() for keyword in disaster_keywords):
                report_links.append({
                    'title': a.text.strip(),
                    'url': a['href'] if a['href'].startswith('http') else f"{url.rstrip('/')}/{a['href'].lstrip('/')}"
                })
                if len(report_links) == 5:
                    return report_links
    
    return report_links

def search_local_news(query: str, location: str) -> List[Dict[str, Any]]:
    """
    Search for local news channels based on city/state.
    """
    city = location.split(',')[0].strip()  # Extract city from location
    channels = NEWS_CHANNELS.get(city, [])
    
    local_results = []
    for channel in channels:
        search_query = f"{query} {channel}"
        search_results = search(search_query, num_results=5)
        
        for url in search_results:
            try:
                article_data = fetch_article_data(url)
                if article_data:
                    local_results.append(article_data)
            except Exception as e:
                print(f"Error fetching data for {url}: {e}")
                continue
    
    return local_results

def process_data_json():
    """
    Process the data from data.json and write results to results.json.
    """
    try:
        # Read data from data.json
        with open('data.json', 'r') as f:
            data = json.load(f)
        
        query = data.get('query', '')
        location = data.get('location', '')
        
        if not query or not location:
            raise ValueError("Query and location must be provided in data.json")
        
        # Process the query and location
        results = process_query(query, location)
        
        # Write results to a file
        with open('results.json', 'w') as f:
            json.dump(results, f, indent=2)
        
        print("Results have been written to results.json")
    
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        # Write error to a file
        with open('error.json', 'w') as f:
            json.dump({"error": str(e)}, f, indent=2)

class DataJSONHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.src_path.endswith('data.json'):
            print("data.json has been modified. Processing...")
            process_data_json()

def main():
    """
    Main function to set up the file watcher and start monitoring data.json.
    """
    event_handler = DataJSONHandler()
    observer = Observer()
    observer.schedule(event_handler, path='.', recursive=False)
    observer.start()

    try:
        print("Monitoring data.json for changes. Press Ctrl+C to stop.")
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

if __name__ == "__main__":
    main()
