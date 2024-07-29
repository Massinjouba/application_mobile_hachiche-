import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Animated, TouchableWithoutFeedback, FlatList, Text, TouchableOpacity, Alert, Image } from 'react-native';
import Sidebar from '../components/Sidebar/Sidebar';
import Topbar from '../components/Topbar/Topbar';
import BottomBar from '../components/BottomBar/BottomBar';
import axios from 'axios';

export default function EntreposageScreen({ navigation }) {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [entreposages, setEntreposages] = useState([]);
  const [error, setError] = useState(null);
  const slideAnim = useRef(new Animated.Value(-250)).current;

  useEffect(() => {
    fetchEntreposages();
  }, []);

  const fetchEntreposages = async () => {
    try {
      const response = await axios.get('http://192.168.2.17:3000/entreposage');
      setEntreposages(response.data);
    } catch (error) {
      setError('Failed to fetch entreposages.');
      console.error('Failed to fetch entreposages:', error);
    }
  };

  const toggleSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: isSidebarVisible ? -250 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSidebarVisible(!isSidebarVisible);
    });
  };

  const handleOutsidePress = () => {
    if (isSidebarVisible) {
      toggleSidebar();
    }
  };

  const handleEdit = (entreposage) => {
    navigation.navigate('AddEntreposage', { entreposage, isEditing: true });
  };  

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://192.168.2.17:3000/entreposage/${id}`);
      Alert.alert('Succès', 'Entreposage supprimé avec succès');
      fetchEntreposages();
    } catch (error) {
      Alert.alert('Erreur', `Impossible de supprimer l'entreposage: ${error.response ? error.response.data.error : error.message}`);
    }
  };

  const renderItem = useCallback(({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>{item.nom}</Text>
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={() => handleEdit(item)}>
          <Image source={require('../assets/editer.png')} style={styles.actionIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Image source={require('../assets/supprimer.png')} style={styles.actionIcon} />
        </TouchableOpacity>
      </View>
    </View>
  ), []);

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
      <View style={[styles.mainContent, { opacity: isSidebarVisible ? 0.5 : 1 }]}>
        <Topbar onToggleSidebar={toggleSidebar} />
        <Text style={styles.title}>Entreposage</Text>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <FlatList
            data={entreposages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<Text style={styles.emptyText}>Aucun entreposage disponible.</Text>}
          />
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('AddEntreposage')}
        >
          <Text style={styles.buttonText}>Ajouter un entreposage</Text>
        </TouchableOpacity>
      </View>
      <BottomBar />
      <StatusBar style="auto" />
    </View>
  );
}

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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  title: {
    marginTop: 40,
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    color: '#474F44',
  },
  list: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F7E8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  itemText: {
    color: '#F3F7E8',
    fontWeight: 'bold',
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#474F44',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 300,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#F3F7E8',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#474F44',
  },
});
