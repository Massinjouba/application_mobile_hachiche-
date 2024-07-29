import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import axios from 'axios';
import QRCode from 'react-native-qrcode-svg';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import PlantInfo from '../PlantInfo/PlantInfo';
import PlantForm from '../../BottomBar/PlantForm/PlantForm';
import RNPickerSelect from 'react-native-picker-select'; // Import de RNPickerSelect
// Import des icônes
import infoIcon from '../../../assets/info.png';
import archiverIcon from '../../../assets/archiver.png';
import receptionIcon from '../../../assets/reception.png';
import editIcon from '../../../assets/editer.png';
import historiqueIcon from '../../../assets/historique-des-commandes.png';

const PlantList = () => {
  const [plantules, setPlantules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlantId, setSelectedPlantId] = useState(null);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [modalPlantule, setModalPlantule] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://192.168.2.17:3000/plantules');
        setPlantules(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching plantules:', error);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (plantule) => {
    const ancienneValeur = plantule.actif ? 'Actif' : 'Inactif';
    const nouvelleValeur = !plantule.actif ? 'Actif' : 'Inactif';

    const updatedPlantule = { 
      ...plantule, 
      actif: !plantule.actif,
      date_retrait: plantule.actif ? new Date().toISOString().split('T')[0] : null,
      nouvelle_valeur: nouvelleValeur,
      ancienne_valeur: ancienneValeur
    };

    try {
      await axios.put(`http://192.168.2.17:3000/plantules/${plantule.id}`, updatedPlantule);
      setPlantules((prevPlantules) =>
        prevPlantules.map((p) =>
          p.id === updatedPlantule.id ? updatedPlantule : p
        )
      );
    } catch (error) {
      if (error.response) {
        console.error('Error updating plantule:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
    }
  };

  const handlePress = (id) => {
    setSelectedPlantId(selectedPlantId === id ? null : id);
  };

  const handleInfoPress = (plantule) => {
    setModalPlantule(plantule);
    setIsInfoModalVisible(true);
  };

  const handleEditPress = (plantule) => {
    setModalPlantule(plantule);
    setIsEdit(true);
    setIsFormModalVisible(true);
  };

  const handleHistoriquePress = (plantule) => {
    navigation.navigate('Historique', { plantuleId: plantule.id });
  };

  const handleCloseInfoModal = () => {
    setIsInfoModalVisible(false);
  };

  const handleCloseFormModal = () => {
    setIsFormModalVisible(false);
    setIsEdit(false);
  };

  // Fonction pour filtrer les plantules selon le filtre et la recherche
  const filteredPlantules = plantules.filter(plantule => {
    const matchFilter = filter === 'all' || (filter === 'active' && plantule.actif) || (filter === 'inactive' && !plantule.actif);
    const matchSearch = plantule.identification.toLowerCase().includes(searchText.toLowerCase());
    return matchFilter && matchSearch;
  });

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.filterContainer}>
        <RNPickerSelect
          onValueChange={(value) => setFilter(value)}
          items={[
            { label: 'Tous', value: 'all' },
            { label: 'Actifs', value: 'active' },
            { label: 'Inactifs', value: 'inactive' },
          ]}
          placeholder={{ label: 'Choisir un filtre...', value: null }}
          style={pickerSelectStyles}
          value={filter}
          useNativeAndroidPickerStyle={false}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher par identification"
          placeholderTextColor="#ccc"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      {filteredPlantules.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>Aucune plante n'est disponible avec ces critères.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredPlantules}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handlePress(item.id)}>
              <View style={[styles.card, { backgroundColor: item.actif ? 'lightgreen' : 'lightcoral' }]}>
                <View style={styles.infoContainer}>
                  <Text style={styles.identification}>{item.identification}</Text>
                  <Text style={styles.status}>{item.actif ? 'Actif' : 'Inactif'}</Text>
                </View>
                <QRCode
                  value={JSON.stringify({
                    id: item.id,
                    identification: item.identification,
                    etat_sante: item.etat_sante,
                    date_arrivee: item.date_arrivee,
                    provenance: item.provenance,
                    description: item.description,
                    stade: item.stade,
                    actif: item.actif,
                    date_retrait: item.date_retrait,
                    item_retire: item.item_retire,
                    note: item.note,
                  })}
                  size={150}
                  style={styles.qrCode}
                />
                {selectedPlantId === item.id && (
                  <>
                    <View style={styles.overlayRectangle} />
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity style={styles.button} onPress={() => handleInfoPress(item)}>
                        <Image source={infoIcon} style={styles.buttonIcon} />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.button} onPress={() => handleEditPress(item)}>
                        <Image source={editIcon} style={styles.buttonIcon} />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.button} onPress={() => handleStatusChange(item)}>
                        <Image source={item.actif ? archiverIcon : receptionIcon} style={styles.buttonIcon} />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.button} onPress={() => handleHistoriquePress(item)}>
                        <Image source={historiqueIcon} style={styles.buttonIcon} />
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.list}
        />
      )}
      {modalPlantule && (
        <>
          <Modal
            isVisible={isInfoModalVisible}
            onBackdropPress={handleCloseInfoModal}
            onSwipeComplete={handleCloseInfoModal}
            swipeDirection="down"
            style={styles.modal}
          >
            <PlantInfo plantule={modalPlantule} isVisible={isInfoModalVisible} onClose={handleCloseInfoModal} />
          </Modal>
          <Modal
            isVisible={isFormModalVisible}
            onBackdropPress={handleCloseFormModal}
            onSwipeComplete={handleCloseFormModal}
            swipeDirection="down"
            style={styles.modal}
          >
            <PlantForm plantule={modalPlantule} isEdit={isEdit} onClose={handleCloseFormModal} />
          </Modal>
        </>
      )}
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'white', // Texte en blanc
    paddingRight: 30, // to ensure the text is never behind the icon
    width: 150,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'white', // Texte en blanc
    paddingRight: 30, // to ensure the text is never behind the icon
    width: 150,
  },
});

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 10,
  },
  separator: {
    height: 10,
  },
  card: {
    height: 150,
    width: 350,
    padding: 0,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: 'lightgreen',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 20,
  },
  identification: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  overlayRectangle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    backgroundColor: 'rgba(155, 167, 143, 0.6)',
    borderRadius: 5,
    zIndex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 300,
    top: 50,
    left: '50%',
    transform: [{ translateX: -150 }],
    zIndex: 2,
  },
  button: {
    width: 60,
    height: 60,
    backgroundColor: '#474F44',
    borderRadius: 30,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIcon: {
    width: 30,
    height: 30,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: 'white', // Texte en blanc
    width: 200, // Taille fixe pour la recherche
    marginLeft: 10, // Espace entre les éléments
  },
  status: {
    fontSize: 16,
    color: '#333',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 18,
    color: '#333',
  },
  pickerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(155, 167, 143, 0.4)',
  },
});

export default PlantList;
