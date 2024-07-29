import React from 'react';
import { View, StyleSheet } from 'react-native';
import PlantForm from '../components/BottomBar/PlantForm/PlantForm';

const FormScreen = ({ navigation }) => {
  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <PlantForm onClose={handleClose} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default FormScreen;
