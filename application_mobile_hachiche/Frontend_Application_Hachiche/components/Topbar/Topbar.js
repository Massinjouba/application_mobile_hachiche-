import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const Topbar = ({ onToggleSidebar }) => {
  return (
    <View style={styles.topbar}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.toggleButton} onPress={onToggleSidebar}>
          <Text style={styles.toggleButtonText}>☰</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topbar: {
    backgroundColor: "transparent",
    flexDirection: 'row',
    zIndex: 1,
    paddingLeft: 320,
  },
  buttonContainer: {
    paddingTop: 10,
  },
  toggleButton: {
    padding: 15, 
  },
  toggleButtonText: {
    color: '#F3F7E8',
    fontSize: 26,
    fontWeight: 'bold', 
  },
});

export default Topbar;
