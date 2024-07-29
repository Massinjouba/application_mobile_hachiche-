import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (username && password) {
      try {
        const response = await axios.post('http://192.168.2.17:3000/login', { 
          email: username,
          motDePasse: password
        });
        

        const data = response.data;

        if (response.status === 200) {
          navigation.navigate('Home', { token: data.token });
        } else {
          Alert.alert('Erreur', `Erreur: ${data.message}`);
        }
      } catch (error) {
        console.error('Login error:', error.response || error.message);
        if (error.response) {
          // Affiche les détails complets de la réponse d'erreur
          console.error('Error response data:', error.response.data);
          console.error('Error response status:', error.response.status);
          Alert.alert('Erreur', `Erreur du serveur : ${error.response.status} - ${error.response.data.message}`);
        } else if (error.request) {
          // Affiche les détails de la requête qui n'a pas reçu de réponse
          console.error('Error request data:', error.request);
          Alert.alert('Erreur', 'Aucune réponse du serveur. Veuillez vérifier votre connexion réseau.');
        } else {
          // Affiche les détails de l'erreur de configuration
          console.error('Error message:', error.message);
          Alert.alert('Erreur', `Erreur de requête : ${error.message}`);
        }
      }
    } else {
      Alert.alert('Erreur', 'Veuillez entrer un nom d\'utilisateur et un mot de passe valides.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Connexion</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom d'utilisateur"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Change from 'center' to 'flex-start'
    alignItems: 'center',
    backgroundColor: '#474F44',
    paddingTop: 150, // Adjust padding to move content up
    paddingHorizontal: 20,
  },
  logo: {
    width: 100, // Adjust the size of the logo if necessary
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#F3F7E8',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: 'rgba(155, 167, 143, 0.4)',
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: '#F3F7E8',
  },
  button: {
    marginTop: 10,
    backgroundColor: 'rgba(155, 167, 143, 1)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#F3F7E8',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
