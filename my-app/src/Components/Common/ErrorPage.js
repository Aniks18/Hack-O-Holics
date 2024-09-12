// Components/Common/ErrorPage.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import './ErrorPage.css'; // Assuming you want to add some styles

const ErrorPage = () => {
  const location = useLocation();

  return (
    <div className="error-page">
      <div className="error-content">
        <h1 className="error-code">404</h1>
        <p className="error-message">Page Not Found</p>
        <p className="error-description">
          The page at <code>{location.pathname}</code> does not exist.
        </p>
        <p className="error-suggestion">
          Oops! It seems like you’ve followed a broken link or entered a URL that doesn't exist.
        </p>
        <a href="/" className="error-link">Go Back to Home</a>
      </div>
    </div>
  );
};

export default ErrorPage;
