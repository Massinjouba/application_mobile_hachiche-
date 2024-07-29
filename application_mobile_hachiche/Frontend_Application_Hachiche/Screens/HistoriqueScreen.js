import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const HistoriqueScreen = ({ route }) => {
  const { plantuleId } = route.params;
  const [historique, setHistorique] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchHistorique = async () => {
      try {
        const response = await axios.get(`http://192.168.2.17:3000/historique/plantule/${plantuleId}`);
        setHistorique(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching historique:', error);
        setLoading(false);
      }
    };

    fetchHistorique();
  }, [plantuleId]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={require('../assets/retour.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>Historique des modifications</Text>
      </View>
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={historique}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <Text style={styles.historyText}>Champ modifié: {item.champ_modifie}</Text>
            <Text style={styles.historyText}>Ancienne valeur: {item.ancienne_valeur}</Text>
            <Text style={styles.historyText}>Nouvelle valeur: {item.nouvelle_valeur}</Text>
            <Text style={styles.historyText}>Date: {item.date_modification}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#474F44',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
    marginTop: 10,
    color: '#F3F7E8',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingLeft: 30,
  },
  listContainer: {
    paddingBottom: 20,
  },
  historyItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: 'rgba(155, 167, 143, 0.4)',
    borderRadius: 5,
  },
  historyText: {
    fontSize: 16,
    color: '#F3F7E8',
  },
});

export default HistoriqueScreen;
