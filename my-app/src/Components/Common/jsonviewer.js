import React, { useState, useCallback } from 'react';

const JSONViewer = ({ json }) => {
  const [expandedKeys, setExpandedKeys] = useState(new Set());

  const toggleExpand = useCallback((key) => {
    setExpandedKeys((prevKeys) => {
      const newKeys = new Set(prevKeys);
      if (newKeys.has(key)) {
        newKeys.delete(key);
      } else {
        newKeys.add(key);
      }
      return newKeys;
    });
  }, []);

  const renderValue = useCallback((value, key, depth = 0) => {
    if (value === null) {
      return (
        <div key={key} style={{ marginLeft: `${depth * 20}px` }}>
          <span>{key}: </span>
          <span style={{ color: '#8085e9' }}>null</span>
        </div>
      );
    }

    if (typeof value === 'object') {
      const isExpanded = expandedKeys.has(key);
      const isArray = Array.isArray(value);
      return (
        <div key={key} style={{ marginLeft: `${depth * 20}px` }}>
          <span
            onClick={() => toggleExpand(key)}
            style={{ cursor: 'pointer', userSelect: 'none' }}
          >
            {isExpanded ? '▼' : '▶'} {key}: {isArray ? '[]' : '{}'}
          </span>
          {isExpanded && (
            <div>
              {Object.entries(value).map(([k, v]) => renderValue(v, `${key}.${k}`, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div key={key} style={{ marginLeft: `${depth * 20}px` }}>
        <span>{key}: </span>
        <span style={{ color: typeof value === 'string' ? '#690' : '#905' }}>
          {JSON.stringify(value)}
        </span>
      </div>
    );
  }, [expandedKeys, toggleExpand]);

  let parsedJson;
  try {
    parsedJson = JSON.parse(json);
  } catch (error) {
    return (
      <div className="json-viewer error">
        <p>Error parsing JSON: {error.message}</p>
        <p>Raw input:</p>
        <pre>{json}</pre>
      </div>
    );
  }

  return (
    <div className="json-viewer">
      {Object.entries(parsedJson).map(([key, value]) => renderValue(value, key))}
    </div>
  );
};

export default JSONViewer;