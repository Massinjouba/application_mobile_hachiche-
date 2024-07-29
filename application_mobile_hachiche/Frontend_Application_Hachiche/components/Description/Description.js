import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const Description = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <View style={styles.description}>
        <Text style={styles.subtitle}>Fonctionnement de l'application</Text>
        <Text style={styles.paragraph}>Cette application vous permet de gérer le stock de cannabis de manière efficace et organisée. Voici une description des différentes sections de l'application :</Text>
        <Text style={styles.subtitle}>Notre Stock</Text>
        <Text style={styles.paragraph}>Cette section vous offre une vue d'ensemble de notre stock actuel, incluant les quantités disponibles et les informations essentielles à connaître.</Text>
        <Text style={styles.subtitle}>Responsable Décontamination</Text>
        <Text style={styles.paragraph}>Ici, vous pouvez gérer les responsables de décontamination, assigner des tâches et suivre les progrès.</Text>
        <Text style={styles.subtitle}>Entreposage</Text>
        <Text style={styles.paragraph}>Cette section vous permet de gérer l'entreposage des plants, y compris l'ajout, le suivi et l'organisation des stocks.</Text>
        <Text style={styles.subtitle}>Plantules</Text>
        <Text style={styles.paragraph}>Dans cette section, vous pouvez gérer les plantules, y compris leur ajout, modification, et suppression.</Text>
        <Text style={styles.subtitle}>Modifications</Text>
        <Text style={styles.paragraph}>Cette section permet de modifier les informations existantes sur les plants et autres éléments de l'inventaire.</Text>
        <Text style={styles.subtitle}>Upload</Text>
        <Text style={styles.paragraph}>Cette section vous permet de télécharger des fichiers pour mettre à jour l'inventaire en masse.</Text>
        <Text style={styles.subtitle}>Déconnexion</Text>
        <Text style={styles.paragraph}>Utilisez ce lien pour vous déconnecter de l'application de manière sécurisée.</Text>
        <Text style={styles.vide}>Cette section permet de modifier les informations existantes sur les plants et autres éléments de l'inventaire.Cette section permet de modifier les informations existantes sur les plants et autres éléments de l'inventaire.</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#9BA78F', // Couleur de fond
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    color: '#474F44', // Couleur du texte en blanc
  },
  description: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#474F44', // Couleur du texte en blanc
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    marginTop: 10,
    backgroundColor: 'rgba(71, 79, 68, 0.3)',
    padding: 10, // Ajouter du padding pour améliorer la lisibilité
    borderRadius: 10, // Ajouter un borderRadius pour arrondir les coins
    color: '#F3F7E8', // Couleur du texte
  },
  vide: {
    color: '#9BA78F',
  }
});

export default Description;
