import React, { useState, useRef } from 'react';
import { View, Button, Text, StyleSheet, Alert, Animated, TouchableWithoutFeedback, Image } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import Topbar from '../components/Topbar/Topbar';
import BottomBar from '../components/BottomBar/BottomBar';
import Sidebar from '../components/Sidebar/Sidebar';
import importerImage from '../assets/importer.png'; // Assurez-vous que le chemin est correct

export default function ImportScreen() {
  const [fileName, setFileName] = useState('');
  const [fileUri, setFileUri] = useState('');
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-250)).current;

  console.log('FileSystem.documentDirectory:', FileSystem.documentDirectory);

  const handleFilePicker = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (res.type === 'cancel') {
        Alert.alert('Cancelled', 'File selection was cancelled');
        return;
      }

      const { name, uri } = res.assets ? res.assets[0] : res;

      console.log('File selected:', res);
      console.log('File name:', name);
      console.log('File URI:', uri);

      setFileName(name);
      setFileUri(uri);

      if (uri && uri.startsWith('file://')) {
        console.log('Valid URI:', uri);
      } else {
        console.error('Invalid URI:', uri);
        Alert.alert('Error', 'Invalid file URI');
        return;
      }

      const newUri = `${FileSystem.documentDirectory}${name}`;
      console.log('New URI:', newUri);

      await FileSystem.copyAsync({
        from: uri,
        to: newUri,
      })
        .then(() => {
          console.log('Finished copying to ', newUri);
          setFileUri(newUri);
        })
        .catch((error) => {
          console.error('Erreur lors de la copie du fichier:', error);
          Alert.alert('Error', 'Failed to copy file');
        });
    } catch (err) {
      console.error('Erreur lors de la sélection du fichier:', err);
      Alert.alert('Error', 'Failed to select file');
    }
  };

  const handleFileUpload = async () => {
    if (!fileUri) {
      Alert.alert('No file', 'Please select a file first');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', {
        uri: fileUri,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        name: fileName,
      });

      console.log('FormData:', formData);

      const response = await axios.post('http://192.168.2.17:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Response:', response.data);
      Alert.alert('Success', response.data);
    } catch (err) {
      console.error('Erreur lors du téléchargement du fichier:', err);
      Alert.alert('Error', 'Failed to upload file');
    }
  };

  const toggleSidebar = () => {
    if (isSidebarVisible) {
      // Hide sidebar
      Animated.timing(slideAnim, {
        toValue: -250,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setSidebarVisible(false);
      });
    } else {
      // Show sidebar
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
        <View style={styles.topbarContainer}>
          <Topbar onToggleSidebar={toggleSidebar} />
        </View>
        <View style={styles.filePickerContainer}>
          <View style={styles.dottedBorder}>
            <Image source={importerImage} style={styles.importerImage} />
            <Button title="Pick a File" onPress={handleFilePicker} color="#F3F7E8" />
            {fileName ? (
              <View>
                <Text style={styles.fileName}>Selected File: {fileName}</Text>
                <Button title="Upload File" onPress={handleFileUpload} color="#F3F7E8" />
              </View>
            ) : null}
          </View>
        </View>
      </View>
      <BottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column', // Ensure BottomBar is at the bottom
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
  topbarContainer: {
    position: 'absolute',
    marginTop: 20,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 3,
  },
  filePickerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100, // Adjust as necessary to position content below the Topbar
  },
  dottedBorder: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#333',
    borderStyle: 'dotted',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
  importerImage: {
    width: 40,
    height: 40,
    marginBottom: 20,
  },
  fileName: {
    marginTop: 20,
    fontSize: 16,
    color: '#F3F7E8', // Couleur du texte
  },
});
