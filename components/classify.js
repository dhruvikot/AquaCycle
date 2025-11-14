import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from './header';
import RNPickerSelect from 'react-native-picker-select';
import calls from '../services/calls';
import styles from './styles';

const Classify = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [materials, setMaterials] = useState([
    { id: 1, name: 'PET Cristal', weight: 0, color: '#ffc000' },
    { id: 2, name: 'PET Verde', weight: 0, color: '#ffc000' },
    { id: 3, name: 'PET Bandejas', weight: 0, color: '#ffc000' },
    { id: 4, name: 'Polietileno Botella', weight: 0, color: '#7f6000' },
    { id: 5, name: 'Nylon Transparente', weight: 0, color: '#4a86e8' },
    { id: 6, name: 'Nylon Color', weight: 0, color: '#4a86e8' },
    { id: 7, name: 'Papel Blanco', weight: 0, color: '#4a86e8' },
    { id: 8, name: 'Revista/Diario', weight: 0, color: '#7f6000' },
    { id: 9, name: 'Cartón Corrugado', weight: 0, color: '#4a86e8' },
    { id: 10, name: 'Aluminio', weight: 0, color: '#ffc000' },
    { id: 11, name: 'Chatarra', weight: 0, color: '#7f6000' },
    { id: 12, name: 'Electrónicos', weight: 0, color: 'grey' },
    { id: 13, name: 'Vidrio', weight: 0, color: '#7f6000' },
    { id: 14, name: 'Tetrabrik', weight: 0, color: '#7f6000' },
    { id: 15, name: 'Poliestireno Expandido', weight: 0, color: '#7f6000' },
    { id: 16, name: 'PP (5)', weight: 0, color: '#ffc000' },
    { id: 17, name: 'Poliestireno PS (6)', weight: 0, color: '#ffc000' },
    { id: 18, name: 'Descarte', weight: 0, color: 'grey' },
  ]);
  const [totalWeight, setTotalWeight] = useState(0);
  const [totalWeightFromSelectedPickup, setTotalWeightFromSelectedPickup] = useState(0);
  const [comment, setComment] = useState('');
  const [editingMaterialId, setEditingMaterialId] = useState(null);
  const [pickups, setPickups] = useState([]);
  const [selectedPickupId, setSelectedPickupId] = useState(null);
  const [selectedClientName, setSelectedClientName] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDatetime, setSelectedDatetime] = useState('');

  useEffect(() => {
    if (route.params) {
      const { pickupId, clientName, location, datetime } = route.params;
      setSelectedPickupId(pickupId);
      setSelectedClientName(clientName);
      setSelectedLocation(location);
      setSelectedDatetime(datetime);
    }
  }, [route.params]);

  useEffect(() => {
    calls.fetchPickup((fetchedPickups) => {
      const sortedPickups = fetchedPickups.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
      setPickups(sortedPickups);
    });
  }, []);

  useEffect(() => {
    console.log('Pickups:', pickups);
    console.log('Selected Pickup ID:', selectedPickupId);
    console.log('Type of selectedPickupId:', typeof selectedPickupId);

    const selectedPickup = pickups.find(p => p.id === selectedPickupId);
    console.log('Selected Pickup:', selectedPickup);

    if (selectedPickup) {
      setTotalWeightFromSelectedPickup(selectedPickup.total_weight || 0);

      // Update the materials state with the collected weights from the selected pickup
      const updatedMaterials = materials.map(material => {
        const category = selectedPickup.categories?.find(
          category => category.material.name === material.name
        );
        return {
          ...material,
          weight: category ? parseFloat(category.weight) : 0,
        };
      });
      setMaterials(updatedMaterials);
    }
  }, [selectedPickupId, pickups]);

  const addWeight = (materialId, weightToAdd) => {
    const newMaterials = materials.map(material => {
      if (material.id === materialId) {
        return { ...material, weight: weightToAdd };
      }
      return material;
    });
    setMaterials(newMaterials);

    // Calculate the total weight based on the updated materials
    const totalWeight = newMaterials.reduce((sum, material) => sum + parseFloat(material.weight || 0), 0);
    setTotalWeight(totalWeight);
  };

  const submitMaterials = async () => {
    if (!selectedPickupId) {
      Alert.alert("Error", "Please select a pickup before submitting.");
      return;
    }

    const selectedPickup = pickups.find(p => p.id === selectedPickupId);

    if (!selectedPickup) {
      Alert.alert("Error", "Selected pickup not found.");
      return;
    }

    const { client, location } = selectedPickup;

    // Get the existing categories from the selected pickup
    const existingCategories = selectedPickup.categories || [];

    // Determine the updated and deleted categories
    const updatedCategories = materials
      .filter(material => parseFloat(material.weight) > 0)
      .map(material => ({
        id: null,
        material: material.name,
        weight: material.weight.toString()
      }));

    const deletedCategories = existingCategories
      .filter(category => !updatedCategories.some(updatedCategory => updatedCategory.material === category.material.name))
      .map(category => category.id);

    const payload = {
      pickup: {
        status: "C",
        client: client,
        location: location,
        bags: [],
        deletedBags: [],
        categories: updatedCategories,
        deletedCategories: deletedCategories,
      }
    };

    console.log("Sending Payload:", JSON.stringify(payload, null, 2));

    try {
      const response = await calls.patchPickup(selectedPickupId, payload);
      Alert.alert("Success", "Categories have been successfully submitted!", [
        { text: "OK", onPress: () => navigation.navigate('PastCollections') }
      ]);
      console.log("Server Response:", response);
    } catch (error) {
      console.error("Failed to submit categories:", error);
      Alert.alert("Error", "Failed to submit categories.");
    }
  };

  const goBack = () => {
    Alert.alert(
      "Warning",
      "Your data will not be saved. Are you sure you want to go back?",
      [
        { text: "Yes, go back", onPress: () => navigation.goBack(), style: "destructive" },
        { text: "No stay", onPress: () => {}, style: "cancel" }
      ],
      { cancelable: false }
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Header title="Classify" />
        <View style={styles.pickersContainer}>
          <Text>
            {selectedClientName} - {selectedLocation} - {selectedDatetime}
          </Text>
        </View>
        <Text style={styles.name}>Weight from selected pickup: {totalWeightFromSelectedPickup} kg</Text>
        <ScrollView style={styles.materialContainer} contentContainerStyle={styles.materialContent}>
          {materials.map(material => (
            <View key={material.id} style={[styles.material, { backgroundColor: material.color }]}>
              <View style={[styles.colorRectangle, { backgroundColor: material.color }]} />
              <Text>{material.name}</Text>
              <View style={styles.weightContainer}>
                {material.weight > 0 ? (
                  <Text style={styles.weightText}>{material.weight} kg</Text>
                ) : (
                  <Text style={styles.weightText}>0</Text>
                )}
                <View style={styles.weightInputContainer}>
                  {editingMaterialId === material.id ? (
                    <TextInput
                      style={styles.weightInput}
                      keyboardType="numeric"
                      placeholder="Enter weight"
                      value={material.weight.toString()}
                      onChangeText={(text) => addWeight(material.id, text)}
                    />
                  ) : (
                    <TouchableOpacity onPress={() => setEditingMaterialId(material.id)} style={styles.editButton}>
                      <Text style={styles.editButtonText}>+</Text>
                    </TouchableOpacity>
                  )}
                  <Text style={styles.kgText}>kg</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
        <Text>Total weight: {totalWeight} kg</Text>
        <TextInput
          style={styles.commentInput}
          multiline
          numberOfLines={4}
          onChangeText={(text) => setComment(text)}
          placeholder="Enter comments"
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.cancelButton, { backgroundColor: 'grey', borderRadius: 10 }]} onPress={goBack}>
            <Text style={[styles.buttonText, { color: 'white', fontWeight: 'bold' }]}>CANCEL</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: 'green', borderRadius: 10 }]}
            onPress={submitMaterials}
          >
            <Text style={[styles.buttonText, { color: 'white', fontWeight: 'bold' }]}>SUBMIT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Classify;