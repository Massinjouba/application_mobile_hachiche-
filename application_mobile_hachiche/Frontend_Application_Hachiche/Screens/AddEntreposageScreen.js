import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Platform, Image, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const AddEntreposageScreen = () => {
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [id, setId] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    if (route.params && route.params.isEditing) {
      const { entreposage } = route.params;
      setNom(entreposage.nom);
      setDescription(entreposage.description);
      setId(entreposage.id);
      setIsEditing(true);
    }
  }, [route.params]);
  

  const handleSubmit = async () => {
    if (!nom || !description) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }

    try {
      if (isEditing) {
        await axios.put(`http://192.168.2.17:3000/entreposage/${id}`, { nom, description });
        Alert.alert('Succès', 'Entreposage mis à jour avec succès');
      } else {
        await axios.post('http://192.168.2.17:3000/entreposage', { nom, description });
        Alert.alert('Succès', 'Entreposage ajouté avec succès');
      }
      navigation.goBack(); // Revenir à l'écran précédent
    } catch (error) {
      Alert.alert('Erreur', `Impossible d'enregistrer l'entreposage: ${error.response ? error.response.data.error : error.message}`);
    }
  };

  return (
    <View style={styles.modalContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image source={require('../assets/retour.png')} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.title}>{isEditing ? 'Modifier' : 'Ajouter'} un Entreposage</Text>
        </View>
        <Text style={styles.label}>Nom</Text>
        <TextInput
          style={styles.input}
          placeholder="Nom"
          value={nom}
          onChangeText={setNom}
        />
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>{isEditing ? 'Modifier' : 'Soumettre'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#474F44',
  },
  container: {
    backgroundColor: '#474F44',
    paddingTop: 40,
    padding: Platform.select({
      ios: 20,
      android: 10,
    }),
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    position: 'relative',
    top: Platform.select({
      ios: 5,
      android: 2,
    }),
    marginBottom: 200,
    left: 2,
    marginTop: Platform.select({
      ios: 20,
      android: 10,
    }),
    zIndex: 1,
    padding: 1,
  },
  backIcon: {
    width: 32,
    height: 32,
  },
  title: {
    marginTop: Platform.select({
      ios: 10,
      android: 5,
    }),
    fontSize: Platform.select({
      ios: 20,
      android: 24,
    }),
    marginBottom: 10,
    color: '#F3F7E8',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingLeft: Platform.select({
      ios: 10,
      android: 30,
    }),
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
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
    fontSize: 16,
  },
  textArea: {
    backgroundColor: 'rgba(155, 167, 143, 0.4)',
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: '#F3F7E8',
    height: 100,
    fontSize: 16,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 100,
    marginTop: 20,
  },
  button: {
    backgroundColor: 'rgba(155, 167, 143, 1)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    width: '48%',
  },
  buttonText: {
    color: '#F3F7E8',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddEntreposageScreen;
