import React from 'react';
import './LoadingSkeleton.css';

const LoadingSkeleton = ({ type = 'card', count = 1 }) => {
  if (type === 'hero') {
    return (
      <div className="skeleton-hero">
        <div className="skeleton skeleton-banner"></div>
        <div className="skeleton-hero-content">
          <div className="skeleton skeleton-title"></div>
          <div className="skeleton skeleton-text"></div>
          <div className="skeleton skeleton-text short"></div>
          <div className="skeleton-buttons">
            <div className="skeleton skeleton-button"></div>
            <div className="skeleton skeleton-button"></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="skeleton-cards">
        {Array(count).fill(0).map((_, index) => (
          <div key={index} className="skeleton-card">
            <div className="skeleton skeleton-card-img"></div>
            <div className="skeleton skeleton-card-title"></div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default LoadingSkeleton;
