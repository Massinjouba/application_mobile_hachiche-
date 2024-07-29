import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PlantInfoScreen = ({ route }) => {
  const { plantData } = route.params;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={require('../assets/retour.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>Informations sur la plante</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.text}>Identification: {plantData.identification}</Text>
        <Text style={styles.text}>État de santé: {plantData.etat_sante}</Text>
        <Text style={styles.text}>Date d'arrivée: {plantData.date_arrivee}</Text>
        <Text style={styles.text}>Provenance: {plantData.provenance}</Text>
        <Text style={styles.text}>Description: {plantData.description}</Text>
        <Text style={styles.text}>Stade: {plantData.stade}</Text>
        <Text style={styles.text}>Actif: {plantData.actif ? 'Oui' : 'Non'}</Text>
        {plantData.date_retrait && <Text style={styles.text}>Date de retrait: {plantData.date_retrait}</Text>}
        {plantData.item_retire && <Text style={styles.text}>Item retiré: {plantData.item_retire}</Text>}
        <Text style={styles.text}>Note: {plantData.note}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#474F44',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    position: 'relative',
    left: 2,
    zIndex: 1,
    padding: 1,
    marginTop:30,
    marginBottom: 200,
  },
  backIcon: {
    width: 32,
    height: 32,
  },
  title: {
    fontSize: 24,
    color: '#F3F7E8',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingLeft: 30,
  },
  infoContainer: {
    backgroundColor: '#F3F7E8',
    borderRadius: 5,
    backgroundColor: 'rgba(155, 167, 143, 0.4)',
    padding: 20,
  },
  text: {
    fontSize: 18,
    color: '#F3F7E8',
    marginVertical: 5,
  },
});

export default PlantInfoScreen;
