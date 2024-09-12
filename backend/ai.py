import json
import os
import time
import nltk
from nltk.corpus import stopwords
from textblob import TextBlob
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans, MiniBatchKMeans
from sklearn.metrics import silhouette_score
import matplotlib.pyplot as plt
from fpdf import FPDF
import spacy
from collections import Counter
from wordcloud import WordCloud

# Set up paths
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(current_dir, 'backend')
results_file = os.path.join(backend_dir, 'results.json')
output_dir = os.path.abspath(os.path.join(current_dir, '../my-app/src/Components/Common'))

print(f"Current directory: {current_dir}")
print(f"Backend directory: {backend_dir}")
print(f"Results file path: {results_file}")
print(f"Output directory: {output_dir}")

# Ensure output directory exists
os.makedirs(output_dir, exist_ok=True)


print(f"New output directory: {output_dir}")

# Download NLTK stopwords
nltk.download('stopwords', quiet=True)
stop_words = set(stopwords.words('english'))

# Load spaCy English model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Downloading spaCy model...")
    os.system("python -m spacy download en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

def process_data(captions):
    # 1. Sentiment Analysis
    sentiments = []
    for caption in captions:
        analysis = TextBlob(caption)
        if analysis.sentiment.polarity > 0:
            sentiments.append("Positive")
        elif analysis.sentiment.polarity < 0:
            sentiments.append("Negative")
        else:
            sentiments.append("Neutral")

    # 2. Keyword Extraction
    keywords_list = []
    for caption in captions:
        doc = nlp(caption)
        keywords = [token.text for token in doc if token.is_alpha and token.text.lower() not in stop_words]
        keywords_list.append(' '.join(keywords))

    # 3. Word Frequency Analysis
    keywords_all = ' '.join(keywords_list)
    word_freq = Counter(keywords_all.split())
    most_common_words = word_freq.most_common(10)

    # 4. K-Means Clustering
    tfidf_vectorizer = TfidfVectorizer(stop_words='english')
    X = tfidf_vectorizer.fit_transform(keywords_list)

    models = {
        "KMeans": KMeans(n_clusters=min(len(keywords_list), 3), random_state=42),
        "KMeans++": KMeans(n_clusters=min(len(keywords_list), 3), init='k-means++', random_state=42),
        "MiniBatchKMeans": MiniBatchKMeans(n_clusters=min(len(keywords_list), 3), random_state=42)
    }

    # Generate PDF report
    pdf_filename = os.path.join(output_dir, 'output.pdf')
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=16)
    pdf.cell(200, 10, txt="Analysis Report", ln=True, align='C')
    pdf.ln(10)

    # Sentiment Analysis Results
    pdf.set_font("Arial", size=14)
    pdf.cell(200, 10, txt="1. Sentiment Analysis Results", ln=True, align='L')
    pdf.set_font("Arial", size=12)
    for i, sentiment in enumerate(sentiments):
        pdf.cell(200, 10, txt=f"Caption {i+1}: {sentiment}", ln=True)
    pdf.ln(10)

    # Most Common Words
    pdf.set_font("Arial", size=14)
    pdf.cell(200, 10, txt="2. Most Common Words", ln=True, align='L')
    pdf.set_font("Arial", size=12)
    for word, freq in most_common_words:
        pdf.cell(200, 10, txt=f"{word}: {freq}", ln=True)
    pdf.ln(10)

    # Clustering Results
    for model_name, model in models.items():
        model.fit(X)
        cluster_labels = model.labels_
        
        pca = PCA(n_components=2)
        X_pca = pca.fit_transform(X.toarray())
        
        plt.figure(figsize=(10, 7))
        scatter = plt.scatter(X_pca[:, 0], X_pca[:, 1], c=cluster_labels, cmap='viridis')
        plt.colorbar(scatter)
        plt.title(f'{model_name} Clustering of Keywords')
        plt.xlabel('PCA Component 1')
        plt.ylabel('PCA Component 2')
        
        plot_filename = os.path.join(output_dir, f'{model_name.lower().replace(" ", "_")}_clusters.png')
        plt.savefig(plot_filename)
        plt.close()
        
        pdf.set_font("Arial", size=14)
        pdf.cell(200, 10, txt=f"3. {model_name} Clustering Results", ln=True, align='L')
        pdf.set_font("Arial", size=12)
        pdf.cell(200, 10, txt=f"Silhouette Score: {silhouette_score(X, cluster_labels):.2f}", ln=True)
        pdf.image(plot_filename, x=10, y=pdf.get_y() + 10, w=180)
        pdf.ln(100)  # Add space after image

    # Word Cloud
    wordcloud = WordCloud(width=800, height=400, background_color='white').generate(keywords_all)
    wordcloud_filename = os.path.join(output_dir, 'wordcloud.png')
    wordcloud.to_file(wordcloud_filename)

    pdf.add_page()
    pdf.set_font("Arial", size=14)
    pdf.cell(200, 10, txt="4. Word Cloud of Keywords", ln=True, align='L')
    pdf.image(wordcloud_filename, x=10, y=pdf.get_y() + 10, w=180)

    pdf.output(pdf_filename)
    print(f"PDF report generated: {pdf_filename}")

def monitor_file(file_path):
    last_modified = os.path.getmtime(file_path)
    while True:
        time.sleep(5)  # Check every 5 seconds
        current_modified = os.path.getmtime(file_path)
        if current_modified > last_modified:
            print("File changed. Processing...")
            process_file(file_path)
            last_modified = current_modified

def process_file(file_path):
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        # Extract all snippets from data
        captions = [result["snippet"].strip() for result in data["results"]]
        
        print(f"Number of snippets read: {len(captions)}")
        print("First snippet:", captions[0] if captions else "No snippets found")

        if captions:
            process_data(captions)
        else:
            print("No snippets found to process.")
    except FileNotFoundError:
        print(f"Error: results.json not found at {file_path}")
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON in results.json")

if __name__ == "__main__":
    print("Initial processing...")
    
    process_file(results_file)
    print("Starting file monitoring...")
    monitor_file(results_file)