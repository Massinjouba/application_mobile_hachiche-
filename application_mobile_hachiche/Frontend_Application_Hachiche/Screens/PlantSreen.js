import React, { useState, useRef, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Animated, TouchableWithoutFeedback } from 'react-native';
import Sidebar from '../components/Sidebar/Sidebar';
import Topbar from '../components/Topbar/Topbar';
import BottomBar from '../components/BottomBar/BottomBar';
import PlantList from '../components/Plant/PlantList/PlantList';
import axios from 'axios';

export default function PlantScreen() {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [plantules, setPlantules] = useState([]);
  const slideAnim = useRef(new Animated.Value(-250)).current;

  useEffect(() => {
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

  const fetchPlantules = async () => {
    try {
      const response = await axios.get('http://192.168.2.17:3000/plantules');
      setPlantules(response.data);
    } catch (error) {
      console.error('Failed to fetch plant list:', error);
    }
  };

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
        <PlantList plantules={plantules} setPlantules={setPlantules} />
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
});
