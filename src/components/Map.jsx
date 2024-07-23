import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2hpbmRlYmhhdiIsImEiOiJjbHlwaDJsaGwwMXgwMmpxd3B1ODl3dGdqIn0.kpyIx5fkCjrolHi5KdNVkA';

const Map = () => {
  const [map, setMap] = useState(null);
  const [directions, setDirections] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    const fetchDriverLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setDriverLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Error fetching driver's location: ", error);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    fetchDriverLocation();
    const interval = setInterval(fetchDriverLocation, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (driverLocation) {
      const initializeMap = ({ setMap, setDirections, mapboxgl }) => {
        const map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [driverLocation.lng, driverLocation.lat],
          zoom: 12,
        });

        const directions = new MapboxDirections({
          accessToken: mapboxgl.accessToken,
          unit: 'metric',
          profile: 'mapbox/driving',
        });

        map.addControl(directions, 'top-left');
        directions.setOrigin([driverLocation.lng, driverLocation.lat]);

        map.on('load', () => {
          setMap(map);
          setDirections(directions);
        });
      };

      if (!map) initializeMap({ setMap, setDirections, mapboxgl });
    }
  }, [driverLocation]);

  useEffect(() => {
    if (map && directions && driverLocation && destination) {
      map.flyTo({
        center: [driverLocation.lng, driverLocation.lat],
        essential: true,
        zoom: 14,
      });

      directions.setOrigin([driverLocation.lng, driverLocation.lat]);
      directions.setDestination([destination.lng, destination.lat]);
    }
  }, [map, directions, driverLocation, destination]);

  const handleDestinationChange = (event) => {
    const { name, value } = event.target;
    setDestination((prevDestination) => ({
      ...prevDestination,
      [name]: parseFloat(value),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (destination.lat && destination.lng) {
      directions.setDestination([destination.lng, destination.lat]);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <label>
          Latitude:
          <input
            type="text"
            name="lat"
            onChange={handleDestinationChange}
            required
          />
        </label>
        <label>
          Longitude:
          <input
            type="text"
            name="lng"
            onChange={handleDestinationChange}
            required
          />
        </label>
        <button type="submit">Set Destination</button>
      </form>
      <div id="map" style={{ width: '100%', height: '500px' }}></div>
    </div>
  );
};

export default Map;
