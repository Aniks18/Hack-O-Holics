import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
<link
  rel="stylesheet"
  href="https://unpkg.com/leaflet/dist/leaflet.css"
/>

const Map = ({ address }) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/get_location', {
          address: address
        });
        setLocation(response.data);
      } catch (error) {
        setError('Failed to fetch location.');
      }
    };

    if (address) {
      fetchLocation();
    }
  }, [address]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ height: '500px', width: '100%' }}>
      {location ? (
        <MapContainer center={[location.lat, location.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          <Marker position={[location.lat, location.lng]}>
            <Popup>
              Location: {location.address}
            </Popup>
          </Marker>
        </MapContainer>
      ) : (
        <div>Loading map...</div>
      )}
    </div>
  );
};

export default Map;
