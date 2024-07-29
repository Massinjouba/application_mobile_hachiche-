import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const { width } = Dimensions.get('window');

const PlantForm = ({ plantule = {}, isEdit = false, onClose }) => {
  const [identification, setIdentification] = useState('');
  const [etatSante, setEtatSante] = useState('rouge');
  const [dateArrivee, setDateArrivee] = useState(new Date());
  const [provenance, setProvenance] = useState('');
  const [description, setDescription] = useState(null);
  const [stade, setStade] = useState('Initiation');
  const [entreposageId, setEntreposageId] = useState('');
  const [responsableDecontaminationId, setResponsableDecontaminationId] = useState('');
  const [actif, setActif] = useState(true);
  const [dateRetrait, setDateRetrait] = useState(null);
  const [itemRetire, setItemRetire] = useState(null);
  const [note, setNote] = useState(null);
  const [isDateArriveePickerVisible, setDateArriveePickerVisibility] = useState(false);
  const [isDateRetraitPickerVisible, setDateRetraitPickerVisibility] = useState(false);
  const [entreposages, setEntreposages] = useState([]);
  const [responsables, setResponsables] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [entreposageResponse, responsableResponse] = await Promise.all([
          axios.get('http://192.168.2.17:3000/entreposage'),
          axios.get('http://192.168.2.17:3000/responsabledecontamination'),
        ]);
        setEntreposages(entreposageResponse.data);
        setResponsables(responsableResponse.data);

        if (entreposageResponse.data.length > 0) {
          setEntreposageId(entreposageResponse.data[0].id);
        }
        if (responsableResponse.data.length > 0) {
          setResponsableDecontaminationId(responsableResponse.data[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch options:', error);
        alert('Erreur lors de la récupération des options');
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    if (actif) {
      setDateRetrait(null);
      setItemRetire(null);
    }
  }, [actif]);

  useEffect(() => {
    if (isEdit && plantule) {
      setIdentification(plantule.identification);
      setEtatSante(plantule.etat_sante);
      setDateArrivee(new Date(plantule.date_arrivee));
      setProvenance(plantule.provenance);
      setDescription(plantule.description);
      setStade(plantule.stade);
      setActif(plantule.actif);
      setDateRetrait(plantule.date_retrait ? new Date(plantule.date_retrait) : null);
      setItemRetire(plantule.item_retire);
      setNote(plantule.note);
      setEntreposageId(plantule.entreposage_id);
      setResponsableDecontaminationId(plantule.responsable_decontamination_id);
    }
  }, [isEdit, plantule]);

  const handleSubmit = async () => {
    const data = {
      identification,
      etat_sante: etatSante,
      date_arrivee: dateArrivee.toISOString().split('T')[0],
      provenance,
      description,
      stade,
      entreposage_id: entreposageId,
      responsable_decontamination_id: responsableDecontaminationId,
      actif,
      date_retrait: actif ? null : dateRetrait ? dateRetrait.toISOString().split('T')[0] : null,
      item_retire: actif ? null : itemRetire,
      note,
    };

    console.log('Sending data:', data);

    try {
      if (isEdit) {
        const response = await axios.put(`http://192.168.2.17:3000/plantules/${plantule.id}`, data);
        console.log('Update response:', response.data);
        alert('Plante mise à jour avec succès!');
      } else {
        const response = await axios.post('http://192.168.2.17:3000/plantules', data);
        console.log('Create response:', response.data);
        alert('Plante ajoutée avec succès!');
      }
      if (!isEdit) {
        onClose();
      }
    } catch (error) {
      console.error('Failed to submit plantule:', error.response ? error.response.data : error.message);
      alert(`Échec de l'opération: ${error.response ? error.response.data.error : error.message}`);
    }
  };

  const handleDateArriveeConfirm = (date) => {
    setDateArrivee(date);
    setDateArriveePickerVisibility(false);
  };

  const handleDateRetraitConfirm = (date) => {
    setDateRetrait(date);
    setDateRetraitPickerVisibility(false);
  };

  const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      color: '#F3F7E8',
      paddingRight: 30,
      backgroundColor: 'rgba(155, 167, 143, 0.4)',
      marginBottom: 20,
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: 'purple',
      borderRadius: 8,
      color: '#F3F7E8',
      paddingRight: 30,
      backgroundColor: 'rgba(155, 167, 143, 0.4)',
      marginBottom: 20,
    },
  });

  return (
    <View style={styles.modalContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Image source={require('../../../assets/retour.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>{isEdit ? 'Modifier une Plante' : 'Ajouter une Plante'}</Text>
        <Text style={styles.label}>Identification</Text>
        <TextInput
          style={styles.input}
          placeholder="Identification"
          value={identification}
          onChangeText={setIdentification}
        />
        <Text style={styles.label}>Etat de santé</Text>
        <RNPickerSelect
          onValueChange={(value) => setEtatSante(value)}
          items={[
            { label: 'Rouge', value: 'rouge' },
            { label: 'Orange', value: 'orange' },
            { label: 'Jaune', value: 'jaune' },
            { label: 'Vert', value: 'vert' },
          ]}
          style={pickerSelectStyles}
          value={etatSante}
        />
        <Text style={styles.label}>Date d'arrivée</Text>
        <TouchableOpacity onPress={() => setDateArriveePickerVisibility(true)} style={styles.dateButton}>
          <Text style={styles.dateText}>{dateArrivee.toLocaleDateString()}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDateArriveePickerVisible}
          mode="date"
          onConfirm={handleDateArriveeConfirm}
          onCancel={() => setDateArriveePickerVisibility(false)}
          textColor="black"
        />
        <Text style={styles.label}>Provenance</Text>
        <TextInput
          style={styles.input}
          placeholder="Provenance"
          value={provenance}
          onChangeText={setProvenance}
        />
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <Text style={styles.label}>Stade</Text>
        <RNPickerSelect
          onValueChange={(value) => setStade(value)}
          items={[
            { label: 'Initiation', value: 'Initiation' },
            { label: 'Microdissection', value: 'Microdissection' },
            { label: 'Magenta', value: 'Magenta' },
            { label: 'Double magenta', value: 'Double magenta' },
            { label: 'Hydroponie', value: 'Hydroponie' },
          ]}
          style={pickerSelectStyles}
          value={stade}
        />
        <Text style={styles.label}>Entreposage</Text>
        <RNPickerSelect
          onValueChange={(value) => setEntreposageId(value)}
          items={entreposages.map(e => ({ label: e.nom, value: e.id }))}
          style={pickerSelectStyles}
          value={entreposageId}
        />
        <Text style={styles.label}>Responsable de décontamination</Text>
        <RNPickerSelect
          onValueChange={(value) => setResponsableDecontaminationId(value)}
          items={responsables.map(r => ({ label: r.nom, value: r.id }))}
          style={pickerSelectStyles}
          value={responsableDecontaminationId}
        />
        <View style={styles.checkboxContainer}>
          <Text style={styles.label}>Actif</Text>
          <TouchableOpacity onPress={() => setActif(!actif)} style={styles.checkbox}>
            <Text style={styles.checkboxLabel}>{actif ? 'Oui' : 'Non'}</Text>
          </TouchableOpacity>
        </View>
        {!actif && (
          <>
            <Text style={styles.label}>Date de retrait</Text>
            <TouchableOpacity onPress={() => setDateRetraitPickerVisibility(true)} style={styles.dateButton}>
              <Text style={styles.dateText}>{dateRetrait ? dateRetrait.toLocaleDateString() : 'Sélectionner une date'}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDateRetraitPickerVisible}
              mode="date"
              onConfirm={handleDateRetraitConfirm}
              onCancel={() => setDateRetraitPickerVisibility(false)}
            />
            <Text style={styles.label}>Item de retrait</Text>
            <TextInput
              style={styles.input}
              placeholder="Item retiré"
              value={itemRetire}
              onChangeText={setItemRetire}
            />
          </>
        )}
        <Text style={styles.label}>Note</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Note"
          value={note}
          onChangeText={setNote}
          multiline
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>{isEdit ? 'Modifier' : 'Soumettre'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    width: width,
  },
  container: {
    backgroundColor: '#474F44',
    padding: Platform.select({
      ios: 20,
      android: 10,
    }),
    width: '100%',
  },
  backButton: {
    position: 'relative',
    top: Platform.select({
      ios: 5,
      android: 2,
    }),
    left: 2,
    marginTop: Platform.select({
      ios: 20,
      android: 10,
    }),
    zIndex: 1,
    padding: 1,
  },
  backIcon: {
    width: 32,
    height: 32,
  },
  title: {
    marginTop: Platform.select({
      ios: 10,
      android: 5,
    }),
    fontSize: 24,
    marginBottom: 20,
    color: '#F3F7E8',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#F3F7E8',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: 'rgba(155, 167, 143, 0.4)',
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: '#F3F7E8',
    fontSize: 16,
  },
  textArea: {
    backgroundColor: 'rgba(155, 167, 143, 0.4)',
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: '#F3F7E8',
    height: 100,
    fontSize: 16,
    width: '100%',
  },
  dateButton: {
    width: '100%',
    height: 40,
    backgroundColor: 'rgba(155, 167, 143, 0.4)',
    marginBottom: 20,
    paddingRight: 240,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  dateText: {
    color: '#F3F7E8',
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    marginLeft: 20,
    height: 40,
    width: 40,
    backgroundColor: 'rgba(155, 167, 143, 0.4)',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#F3F7E8',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 100,
    marginTop: 20,
  },
  button: {
    backgroundColor: 'rgba(155, 167, 143, 1)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    width: '48%',
  },
  buttonText: {
    color: '#F3F7E8',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pickerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(155, 167, 143, 0.4)',
  },
  datePickerWrapper: {
    backgroundColor: 'rgba(155, 167, 143, 0.4)',
    width: '80%',
    borderRadius: 10,
    overflow: 'hidden',
    margin: 'auto',
  },
});

export default PlantForm;
