import React, { useEffect, useState } from 'react';
import supabase from './supabaseClient';

const DriverLocation = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  useEffect(() => {
    const updateLocation = async (latitude, longitude) => {
      const { data, error } = await supabase
        .from('driver_locations')
        .upsert({ id: 1, latitude, longitude, timestamp: new Date() });
      if (error) console.error(error);
    };

    const success = (pos) => {
      const { latitude, longitude } = pos.coords;
      setLocation({ latitude, longitude });
      updateLocation(latitude, longitude);
    };

    const error = (err) => {
      console.error(`ERROR(${err.code}): ${err.message}`);
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    navigator.geolocation.watchPosition(success, error, options);
  }, []);

  return (
    <div>
      <h1>Driver Location</h1>
      <p>Latitude: {location.latitude}</p>
      <p>Longitude: {location.longitude}</p>
    </div>
  );
};

export default DriverLocation;
