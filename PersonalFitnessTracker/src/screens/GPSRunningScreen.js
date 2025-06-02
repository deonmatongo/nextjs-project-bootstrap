import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Button, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import haversine from 'haversine-distance';

export default function GPSRunningScreen() {
  const [tracking, setTracking] = useState(false);
  const [distance, setDistance] = useState(0);
  const [error, setError] = useState(null);
  const watchId = useRef(null);
  const prevPosition = useRef(null);

  useEffect(() => {
    if (tracking) {
      watchId.current = Geolocation.watchPosition(
        (position) => {
          if (prevPosition.current) {
            const dist = haversine(prevPosition.current, position.coords);
            setDistance((prev) => prev + dist);
          }
          prevPosition.current = position.coords;
        },
        (err) => {
          setError(err.message);
          Alert.alert('Location Error', err.message);
          setTracking(false);
        },
        { enableHighAccuracy: true, distanceFilter: 1, interval: 1000, fastestInterval: 500 }
      );
    } else {
      if (watchId.current !== null) {
        Geolocation.clearWatch(watchId.current);
        watchId.current = null;
        prevPosition.current = null;
      }
    }
    return () => {
      if (watchId.current !== null) {
        Geolocation.clearWatch(watchId.current);
      }
    };
  }, [tracking]);

  const toggleTracking = () => {
    setError(null);
    setTracking(!tracking);
    if (tracking) {
      setDistance(0);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Running Distance Tracker</Text>
      <Text style={styles.distance}>{(distance / 1000).toFixed(2)} km</Text>
      <Button title={tracking ? 'Stop' : 'Start'} onPress={toggleTracking} />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  distance: { fontSize: 48, fontWeight: 'bold', marginBottom: 24 },
  error: { color: 'red', marginTop: 16 },
});
