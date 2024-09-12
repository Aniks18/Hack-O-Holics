import json
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from wordcloud import WordCloud
from collections import Counter
import os

# Get the current script's directory
script_dir = os.path.dirname(os.path.abspath(__file__))

# Construct the path to data.json
data_path = os.path.join(script_dir, 'twitterresult.json')

# Load JSON data
try:
    with open(data_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
except FileNotFoundError:
    print(f"Error: The file 'data.json' was not found in the directory: {script_dir}")
    print("Please ensure that the data file is in the same directory as this script.")
    exit(1)

# Convert JSON data to DataFrame
df = pd.json_normalize(data)

# Check for 'date' column
if 'date' not in df.columns:
    print("Error: 'date' column not found in the dataset. Skipping temporal analysis.")
else:
    # Convert 'date' to datetime
    df['date'] = pd.to_datetime(df['date'])

    # Temporal Analysis
    def temporal_analysis(df):
        df.set_index('date', inplace=True)
        daily_counts = df.resample('D').size()
        monthly_counts = df.resample('ME').size()

        plt.figure(figsize=(14, 7))
        plt.subplot(2, 1, 1)
        daily_counts.plot()
        plt.title('Daily Post Counts')
        plt.xlabel('Date')
        plt.ylabel('Number of Posts')

        plt.subplot(2, 1, 2)
        monthly_counts.plot()
        plt.title('Monthly Post Counts')
        plt.xlabel('Date')
        plt.ylabel('Number of Posts')

        plt.tight_layout()
        plt.savefig('temporal_analysis.png')
        plt.close()  # Close the figure to free up memory

    # Call the temporal analysis function if the 'date' column exists
    temporal_analysis(df)

# Hashtag Analysis
def hashtag_analysis(df):
    if 'hashtags' not in df.columns:
        print("Error: 'hashtags' column not found in the dataset.")
        return

    hashtags = df['hashtags'].dropna().apply(lambda x: [tag.lower() for tag in x])
    all_hashtags = [hashtag for sublist in hashtags for hashtag in sublist]
    hashtag_counts = Counter(all_hashtags)

    top_hashtags = hashtag_counts.most_common(10)
    hashtag_df = pd.DataFrame(top_hashtags, columns=['Hashtag', 'Count'])

    plt.figure(figsize=(10, 8))
    sns.barplot(x='Count', y='Hashtag', data=hashtag_df)
    plt.title('Top 10 Hashtags')
    plt.xlabel('Count')
    plt.ylabel('Hashtag')
    plt.savefig('hashtag_analysis.png')
    plt.close()  # Close the figure to free up memory

    # Word Cloud for Hashtags
    wordcloud = WordCloud(width=800, height=400, background_color='white').generate_from_frequencies(hashtag_counts)
    plt.figure(figsize=(10, 8))
    plt.imshow(wordcloud, interpolation='bilinear')
    plt.axis('off')
    plt.title('Hashtag Word Cloud')
    plt.savefig('hashtag_wordcloud.png')
    plt.close()  # Close the figure to free up memory

# Mention Analysis
def mention_analysis(df):
    if 'content' not in df.columns:
        print("Error: 'content' column not found in the dataset.")
        return

    mentions = df['content'].dropna().apply(lambda x: [mention.lower() for mention in x.split() if mention.startswith('@')])
    all_mentions = [mention for sublist in mentions for mention in sublist]
    mention_counts = Counter(all_mentions)

    top_mentions = mention_counts.most_common(10)
    mention_df = pd.DataFrame(top_mentions, columns=['Mention', 'Count'])

    plt.figure(figsize=(10, 8))
    sns.barplot(x='Count', y='Mention', data=mention_df)
    plt.title('Top 10 Mentions')
    plt.xlabel('Count')
    plt.ylabel('Mention')
    plt.savefig('mention_analysis.png')
    plt.close()  # Close the figure to free up memory

# Call analysis functions
hashtag_analysis(df)
mention_analysis(df)

print("Analysis complete. Check the current directory for output images.")
