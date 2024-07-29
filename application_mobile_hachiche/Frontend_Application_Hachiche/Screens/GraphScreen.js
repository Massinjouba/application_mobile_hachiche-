import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Animated, TouchableWithoutFeedback, Alert, Modal, TouchableOpacity } from 'react-native';
import VerticalBarChart from '../components/VerticalBarChart/VerticalBarChart';
import axios from 'axios';
import Sidebar from '../components/Sidebar/Sidebar';
import Topbar from '../components/Topbar/Topbar';
import BottomBar from '../components/BottomBar/BottomBar';
import CircleGraph from '../components/VerticalBarChart/CircleGraph';
import { ScrollView } from 'react-native-gesture-handler';

const GraphScreen = () => {
  const [stock, setStock] = useState(0);
  const [capacity, setCapacity] = useState(2000); // Capacité par défaut
  const [loading, setLoading] = useState(true);
  const [newCapacity, setNewCapacity] = useState('2000');
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-250)).current;
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);

  useEffect(() => {
    const fetchPlantules = async () => {
      try {
        const response = await axios.get('http://192.168.2.17:3000/plantules');
        const plantules = response.data;
        const activePlantules = plantules.filter(plantule => plantule.actif);
        const inactivePlantules = plantules.filter(plantule => !plantule.actif);
        setStock(activePlantules.length);
        setActiveCount(activePlantules.length);
        setInactiveCount(inactivePlantules.length);
      } catch (error) {
        console.error('Erreur lors de la récupération des plantules:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlantules();
  }, []);

  const toggleSidebar = () => {
    if (isSidebarVisible) {
      Animated.timing(slideAnim, {
        toValue: -250,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setSidebarVisible(false);
      });
    } else {
      setSidebarVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleOutsidePress = () => {
    if (isSidebarVisible) {
      toggleSidebar();
    }
  };

  const handleUpdateCapacity = () => {
    const newCap = parseInt(newCapacity, 10);
    if (isNaN(newCap) || newCap <= 0) {
      Alert.alert("Erreur", "Veuillez entrer une capacité valide.");
      return;
    }
    if (newCap < stock) {
      Alert.alert("Erreur", "La nouvelle capacité ne peut pas être inférieure au stock actuel.");
      return;
    }
    setCapacity(newCap);
    setModalVisible(false);
    Alert.alert("Succès", "La capacité a été mise à jour avec succès.");
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text>Chargement des données...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isSidebarVisible && (
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}
      <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
        <Sidebar />
      </Animated.View>
      <ScrollView style={styles.mainContent} contentContainerStyle={styles.scrollContentContainer}>
        <Topbar onToggleSidebar={toggleSidebar} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Stock de Plantes</Text>
          <VerticalBarChart stock={stock} capacity={capacity} />
          <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonText}>Modifier la capacité de stockage</Text>
          </TouchableOpacity>
          <View style={styles.statusTextContainer}>
            <Text style={styles.statuttext}>Actives: {activeCount} et Inactives: {inactiveCount}</Text>
          </View>
          <CircleGraph active={activeCount} inactive={inactiveCount} />
        </View>
      </ScrollView>
      <BottomBar />

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.subtitle}>Modifier la capacité de stockage</Text>
            <TextInput
              style={styles.input}
              value={newCapacity}
              onChangeText={setNewCapacity}
              keyboardType="numeric"
              accessibilityLabel="Nouveau champ de saisie de capacité"
              accessibilityHint="Entrez la nouvelle capacité de stockage"
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleUpdateCapacity}>
              <Text style={styles.modalButtonText}>Mettre à jour la capacité</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column', 
    backgroundColor: '#9BA78F',
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 250,
    zIndex: 2,
    backgroundColor: '#56776C',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  mainContent: {
    flex: 1,
    padding: 10,
  },
  scrollContentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#474F44',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#9BA78F',
    borderRadius: 10,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 20,
  },
  button: {
    backgroundColor: '#474F44',
    paddingVertical: 10,
    marginBottom: 40,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#F3F7E8',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusTextContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  modalButton: {
    backgroundColor: '#474F44',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  modalButtonText: {
    color: '#F3F7E8',
    fontSize: 16,
  },
  statuttext: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#F3F7E8',
  },
});

export default GraphScreen;
