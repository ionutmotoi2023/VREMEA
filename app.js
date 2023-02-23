import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { weatherConditions } from './utils/WeatherConditions';

const API_KEY = '210127e93d4c3e122783cc7f9f2cdc29';

export default function App() { 
  const [location, setLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMessage('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      const { latitude, longitude } = location.coords;
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
      );
      const weatherData = await weatherResponse.json();
      setWeather(weatherData);
    })();
  }, []);

  if (weather) {
    const { main: { temp }, weather: [details], name } = weather;
    const { icon, main, description } = details;
    return (
      <View style={[styles.weatherContainer, { backgroundColor: weatherConditions[main].color }]}>
        <ImageBackground source={weatherConditions[main].background} style={styles.backgroundImage}>
          <StatusBar style="auto" />
          <View style={styles.headerContainer}>
            <FontAwesome5 name={weatherConditions[main].icon} size={72} color={'#fff'} />
            <Text style={styles.tempText}>{Math.round(temp)}°C</Text>
          </View>
          <View style={styles.bodyContainer}>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.subtitle}>{description}</Text>
          </View>
          <View style={styles.footerContainer}>
            <MaterialCommunityIcons name="weather-rainy" size={72} color={'#fff'} />
            <Text style={styles.title}>{main}</Text>
            <Text style={styles.subtitle}>{description}</Text>
          </View>
        </ImageBackground>
      </View>
    );
  } else {
    return (
      <View style={styles.weatherContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }
}
