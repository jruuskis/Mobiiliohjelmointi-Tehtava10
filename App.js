import React, { useState, useEffect } from 'react';
import { StyleSheet, StatusBar, View, TextInput, Button, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [lng, setLng] = useState(0);
  const [lat, setLat] = useState (0);

  useEffect(() => (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('No permission to get location')
        return;
      } 
      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        setLocation(location)
        setLat(location.coords.latitude)
        setLng(location.coords.longitude)
        console.log('Current location:', location)
      })(), []);
  
  const getCoordinates = () => {
      fetch(`http://www.mapquestapi.com/geocoding/v1/address?key=fdQsfg6wx6172u2XGTMPmlJlBPhRsCpk&street=${address}`)
      .then((response) => response.json()) 
      .then((data) => {
          setLat(data.results[0].locations[0].latLng.lat);
          setLng(data.results[0].locations[0].latLng.lng);
      })
      .catch((error) => {
        Alert.alert('Error: ', error.message);
      });
    }
  
  const regionCoordinates = {
    latitude: lat,
    longitude: lng,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0221
  }
  const placeCoordinates = {
    latitude: lat,
    longitude: lng
  }  

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map}
        region ={regionCoordinates}
      >
        <Marker 
          coordinate={placeCoordinates}
          title={address}
        />
      </MapView>
        <TextInput style={{
            fontSize: 15,
            borderColor: 'gray',
            borderWidth: 1,
            width: 200,}}
          placeholder='Enter address'
          onChangeText={(text) => setAddress(text)}
          value={address}
        />
        <Button title='Search' onPress={getCoordinates}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%"
  }
});