import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to fetch user details using the access token
    const fetchUserDetails = async () => {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        // Redirect to the login screen if the access token is not found
        navigation.navigate('Login');
        return;
      }

      try {
        const response = await Axios.get('https://api.example.com/user-details', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUserDetails(response.data);
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    };

    fetchUserDetails();
  }, [navigation]);

  const handleLogout = async () => {
    // Clear tokens and navigate to the login screen
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    navigation.navigate('Login');
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome, {userDetails.name}</Text>
      <Text style={styles.text}>Email: {userDetails.email}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default ProfileScreen;