import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSpring, animated } from '@react-spring/web';
import './dashboard.css';
import wordcloud from '../Common/wordcloud.png';
import kmeansClusters from '../Common/kmeans_clusters.png';
import outputPDF from '../Common/output.pdf';
import kmeansPlusClusters from '../Common/kmeans++_clusters.png';
import minibatchKmeansClusters from '../Common/minibatchkmeans_clusters.png';
import twitterData from './twitterresult.json';

const NewsCard = ({ article }) => (
  <div className="news-card">
    {article.image && article.image !== "No Image" ? (
      <img src={article.image} alt={article.title} className="news-image" />
    ) : (
      <div className="news-image-placeholder">No Image</div>
    )}
    <div className="news-content">
      <h3 className="news-title">{article.title}</h3>
      <p className="news-source">{article.source}</p>
      <p className="news-date">{article.publishedAt !== "No Date" ? article.publishedAt : "Date not available"}</p>
      <a href={article.link} target="_blank" rel="noopener noreferrer" className="news-link">Read more</a>
    </div>
  </div>
);

const TwitterCard = ({ tweet }) => (
  <div className="twitter-card">
    {tweet.media_url && (
      <img src={tweet.media_url} alt="Tweet media" className="twitter-image" />
    )}
    <div className="twitter-content">
      <p className="twitter-text">{tweet.content}</p>
      <p className="twitter-date">{tweet.date}</p>
      <div className="twitter-stats">
        <span>Likes: {tweet.like_count}</span>
        <span>Retweets: {tweet.retweet_count}</span>
      </div>
      <div className="twitter-hashtags">
        {tweet.hashtags.map((tag, index) => (
          <span key={index} className="twitter-hashtag">#{tag}</span>
        ))}
      </div>
    </div>
  </div>
);

const SummaryCard = ({ timestamp, query, location, newsCount, twitterCount }) => (
  <div className="summary-card">
    <h2 className="summary-heading">Search Summary</h2>
    <p><strong>Timestamp:</strong> {timestamp}</p>
    <p><strong>Query:</strong> {query}</p>
    <p><strong>Location:</strong> {location}</p>
    <p><strong>News Articles:</strong> {newsCount}</p>
    <p><strong>Twitter Posts:</strong> {twitterCount}</p>
  </div>
);

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [searchResult, setSearchResult] = useState('');
  const [error, setError] = useState(null);
  const [newsData, setNewsData] = useState([]);
  const [twitterResults, setTwitterResults] = useState([]);
  const [timestamp, setTimestamp] = useState('');
  
  const [rotate, setRotate] = useState(false);
  const props = useSpring({
    transform: rotate ? 'rotateX(360deg)' : 'rotateX(0deg)',
    config: { duration: 600 },
    reset: true
  });

  const handleSearchQueryChange = (e) => setSearchQuery(e.target.value);
  const handleLocationChange = (e) => setLocation(e.target.value);

  const handleSearch = async () => {
    console.log('Search initiated with:', { searchQuery, location });

    try {
      setSearchResult('');
      setError(null);
      setTimestamp(new Date().toLocaleString());

      console.log('Sending search request to backend...');
      const response = await axios.post('http://localhost:5000/search', {
        query: searchQuery,
        location: location,
      });

      console.log('Received response from /search:', response.data);
      setSearchResult(response.data.message);

      console.log('Search successful. Now sending processing request...');
      await axios.post('http://localhost:5000/process', {
        query: searchQuery,
        location: location,
      });

      fetchProcessedData();
    } catch (error) {
      console.error('Error during search or processing:', error);
      setError(error.response?.data?.error || error.message || 'An unexpected error occurred');
    }
  };

  const fetchProcessedData = async () => {
    try {
      console.log('Fetching processed data from /api/results...');
      const response = await axios.get('http://localhost:5000/api/results', {
        responseType: 'json',
        timeout: 5000,
      });
  
      if (response.status === 200 && response.data) {
        console.log('Received processed data:', response.data);
        const fetchedNewsData = Array.isArray(response.data.results) ? response.data.results : [];
        setNewsData(fetchedNewsData);
        setError(null);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error fetching processed data:', error);
      setError(error.response?.data?.error || error.message || 'Failed to fetch results');
      setNewsData([]);
    }
  };

  useEffect(() => {
    console.log('Dashboard component mounted. Setting up data fetch interval...');
    const interval = setInterval(fetchProcessedData, 1000);
    setTwitterResults(twitterData);
    return () => {
      console.log('Dashboard component unmounted. Clearing data fetch interval...');
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="dashboard">
      <div className="header">
        <h1 className="heading">UDDHRTI REPORT DASHBOARD</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search Query..."
            value={searchQuery}
            onChange={handleSearchQueryChange}
            className="search-input"
          />
          <input
            type="text"
            placeholder="Location..."
            value={location}
            onChange={handleLocationChange}
            className="search-input"
          />
          <animated.button
            onClick={() => {
              setRotate(true);
              setTimeout(() => setRotate(false), 600);
              handleSearch();
            }}
            className="search-button"
            style={props}
          >
            Search
          </animated.button>
        </div>
      </div>

      {error && (
        <div className="error-message" role="alert">
          <strong className="font-bold">Error!</strong>
          <span>{error}</span>
        </div>
      )}

      {searchResult && (
        <div className="search-result">
          <div className="font-bold">Search Result:</div>
          <p>{searchResult}</p>
        </div>
      )}

      <SummaryCard
        timestamp={timestamp}
        query={searchQuery}
        location={location}
        newsCount={newsData.length}
        twitterCount={twitterResults.length}
      />

      {newsData.length > 0 && (
        <div className="news-container">
          <h2 className="news-heading">Latest News</h2>
          <div className="news-scroll">
            {newsData.map((article, index) => (
              <NewsCard key={index} article={article} />
            ))}
          </div>
        </div>
      )}

      {twitterResults.length > 0 && (
        <div className="twitter-container">
          <h2 className="twitter-heading">Twitter Results</h2>
          <div className="twitter-scroll">
            {twitterResults.map((tweet, index) => (
              <TwitterCard key={index} tweet={tweet} />
            ))}
          </div>
        </div>
      )}

      <div className="resources-container">
        <h2 className="resources-heading">Additional Resources</h2>
        <div className="resources-cards">
          <div className="resource-card">
            <img src={wordcloud} alt="Word Cloud" className="resource-image" />
            <p className="resource-detail">Word Cloud</p>
          </div>
          <div className="resource-card">
            <img src={kmeansClusters} alt="K-means Clusters" className="resource-image" />
            <p className="resource-detail">K-means Clusters</p>
          </div>
          <div className="resource-card">
            <img src={kmeansPlusClusters} alt="K-means++ Clusters" className="resource-image" />
            <p className="resource-detail">K-means++ Clusters</p>
          </div>
          <div className="resource-card">
            <img src={minibatchKmeansClusters} alt="Minibatch K-means Clusters" className="resource-image" />
            <p className="resource-detail">Minibatch K-means Clusters</p>
          </div>
        </div>
      </div>

      <div className="pdf-container">
        <h2>Download Analytic PDF</h2>
        <a href={outputPDF} target="_blank" rel="noopener noreferrer">
          <button className="pdf-button">View PDF</button>
        </a>
      </div>
    </div>
  );
};

export default Dashboard;