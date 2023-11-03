import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import Axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    if (accessToken) {
      setLoggedIn(true);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await Axios.post(
        'https://fakeapi.platzi.com/en/rest/auth-jwt',
        {
          email,
          password,
        }
      );
      const { accessToken, refreshToken } = response.data;

      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      setLoggedIn(true);

      // Show a login success alert
      Alert.alert('Login Successful', 'You are now logged in!');
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    setLoggedIn(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {loggedIn ? (
        <>
          <Text>You are logged in!</Text>
          <Button title="Logout" onPress={handleLogout} />
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
          />
          <Button title="Login" onPress={handleLogin} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      },
      headingBox: {
        padding: 20,
        backgroundColor: 'lightblue',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'blue',
        marginBottom: 20,
      },
      title: {
        fontSize: 24,
      },
      loginBox: {
        padding: 20,
        backgroundColor: 'green',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'green',
      },
      input: {
        width: '830%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginVertical: 10,
        paddingLeft: 10,
      },
    });


export default LoginScreen;