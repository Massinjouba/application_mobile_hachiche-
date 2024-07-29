import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const PlantInfo = ({ plantule, isVisible, onClose }) => {
  if (!isVisible || !plantule) {
    return null;
  }

  return (
    <View style={styles.modalContent}>
      <Text style={styles.title}>Informations sur la Plante</Text>
      {plantule.identification && (
        <Text style={styles.label}>Identification: {plantule.identification}</Text>
      )}
      {plantule.etat_sante && (
        <Text style={styles.label}>État de santé: {plantule.etat_sante}</Text>
      )}
      {plantule.date_arrivee && (
        <Text style={styles.label}>Date d'arrivée: {plantule.date_arrivee}</Text>
      )}
      {plantule.provenance && (
        <Text style={styles.label}>Provenance: {plantule.provenance}</Text>
      )}
      {plantule.description && (
        <Text style={styles.label}>Description: {plantule.description}</Text>
      )}
      {plantule.stade && (
        <Text style={styles.label}>Stade: {plantule.stade}</Text>
      )}
      {plantule.actif !== undefined && (
        <Text style={styles.label}>Actif: {plantule.actif ? 'Oui' : 'Non'}</Text>
      )}
      {plantule.date_retrait && (
        <Text style={styles.label}>Date de retrait: {plantule.date_retrait}</Text>
      )}
      {plantule.item_retire && (
        <Text style={styles.label}>Item retiré: {plantule.item_retire}</Text>
      )}
      {plantule.note && (
        <Text style={styles.label}>Note: {plantule.note}</Text>
      )}
      {plantule.entreposage && (
        <Text style={styles.label}>Entreposage: {plantule.entreposage.nom}</Text>
      )}
      {plantule.responsable_decontamination && (
        <Text style={styles.label}>Responsable de décontamination: {plantule.responsable_decontamination.nom}</Text>
      )}

      <QRCode
        value={JSON.stringify({
          id: plantule.id,
          identification: plantule.identification,
          etat_sante: plantule.etat_sante,
          date_arrivee: plantule.date_arrivee,
          provenance: plantule.provenance,
          description: plantule.description,
          stade: plantule.stade,
          actif: plantule.actif,
          date_retrait: plantule.date_retrait,
          item_retire: plantule.item_retire,
          note: plantule.note,
        })}
        size={150}
        style={styles.qrCode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    justifyContent: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  qrCode: {
    marginTop: 20,
  },
});

export default PlantInfo;
