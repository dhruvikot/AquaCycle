import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, SafeAreaView, Platform } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
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
      const { pickupId, clientName, location, datetime, totalWeight } = route.params;
      setSelectedPickupId(pickupId ? parseInt(pickupId) : null);
      setSelectedClientName(clientName || '');
      setSelectedLocation(location || '');
      setSelectedDatetime(datetime || '');
      // Use totalWeight from route params if available
      if (totalWeight !== undefined) {
        setTotalWeightFromSelectedPickup(parseFloat(totalWeight) || 0);
      }
    }
  }, [route.params]);

  // Fetch pickups when component loads or comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const loadPickups = () => {
        calls.fetchPickup((fetchedPickups) => {
          const sortedPickups = fetchedPickups.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
          setPickups(sortedPickups);
        });
      };
      loadPickups();
    }, [])
  );

  useEffect(() => {
    console.log('Pickups:', pickups);
    console.log('Selected Pickup ID:', selectedPickupId);
    console.log('Type of selectedPickupId:', typeof selectedPickupId);

    if (!selectedPickupId || pickups.length === 0) {
      return;
    }

    // Compare both as numbers to handle string/number mismatches
    const selectedPickup = pickups.find(p => parseInt(p.id) === parseInt(selectedPickupId));
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
      
      // Calculate initial total weight
      const initialTotal = updatedMaterials.reduce((sum, material) => sum + parseFloat(material.weight || 0), 0);
      setTotalWeight(initialTotal);
    } else {
      console.log('Pickup not found, pickups available:', pickups.map(p => ({ id: p.id, type: typeof p.id })));
    }
  }, [selectedPickupId, pickups]);

  const addWeight = (materialId, weightToAdd) => {
    // Allow empty string for clearing, but filter out invalid characters
    const cleanedWeight = weightToAdd.replace(/[^0-9.]/g, '');
    
    const newMaterials = materials.map(material => {
      if (material.id === materialId) {
        return { ...material, weight: cleanedWeight };
      }
      return material;
    });
    setMaterials(newMaterials);

    // Calculate the total weight based on the updated materials
    const newTotalWeight = newMaterials.reduce((sum, material) => {
      const weight = material.weight === '' ? 0 : parseFloat(material.weight || 0);
      return sum + (isNaN(weight) ? 0 : weight);
    }, 0);
    setTotalWeight(newTotalWeight);

    // Check if total exceeds pickup weight and show warning
    if (totalWeightFromSelectedPickup > 0 && newTotalWeight > totalWeightFromSelectedPickup) {
      const excess = newTotalWeight - totalWeightFromSelectedPickup;
      Alert.alert(
        "Warning",
        `Total classified weight (${newTotalWeight.toFixed(2)} kg) exceeds pickup weight (${totalWeightFromSelectedPickup} kg) by ${excess.toFixed(2)} kg. Please adjust your entries.`,
        [{ text: "OK" }]
      );
    }
  };

  const submitMaterials = async () => {
    if (!selectedPickupId) {
      Alert.alert("Error", "Please select a pickup before submitting.");
      return;
    }

    // Validate total weight doesn't exceed pickup weight
    if (totalWeightFromSelectedPickup > 0 && totalWeight > totalWeightFromSelectedPickup) {
      const excess = totalWeight - totalWeightFromSelectedPickup;
      Alert.alert(
        "Error",
        `Cannot submit: Total classified weight (${totalWeight.toFixed(2)} kg) exceeds pickup weight (${totalWeightFromSelectedPickup} kg) by ${excess.toFixed(2)} kg. Please adjust your entries.`,
        [{ text: "OK" }]
      );
      return;
    }

    // Compare both as numbers to handle string/number mismatches
    const selectedPickup = pickups.find(p => parseInt(p.id) === parseInt(selectedPickupId));

    if (!selectedPickup) {
      Alert.alert("Error", "Selected pickup not found. Please try refreshing.");
      console.error('Pickup not found. ID:', selectedPickupId, 'Available IDs:', pickups.map(p => p.id));
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
      console.log("Server Response:", response);
      // Navigate directly to Past Collections after successful submission
      navigation.navigate('PastCollections');
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

  const weightExceedsPickup = totalWeightFromSelectedPickup > 0 && totalWeight > totalWeightFromSelectedPickup;
  const weightDifference = totalWeight - totalWeightFromSelectedPickup;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Classify" />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
        bounces={false}
      >
        <View style={styles.pickersContainer}>
          <Text>
            {selectedClientName} - {selectedLocation} - {selectedDatetime}
          </Text>
        </View>
        <Text style={styles.name}>Weight from selected pickup: {totalWeightFromSelectedPickup} kg</Text>
        <View style={styles.materialContainer}>
          {materials.map(material => (
            <View key={material.id} style={[styles.material, { backgroundColor: material.color }]}>
              <View style={[styles.colorRectangle, { backgroundColor: material.color }]} />
              <Text style={styles.materialName}>{material.name}</Text>
              <View style={styles.weightContainer}>
                {parseFloat(material.weight || 0) > 0 ? (
                  <Text style={styles.weightText}>{material.weight} kg</Text>
                ) : (
                  <Text style={styles.weightText}>0</Text>
                )}
                <View 
                  style={styles.weightInputContainer}
                  onStartShouldSetResponder={() => true}
                  onResponderTerminationRequest={() => false}
                >
                  {editingMaterialId === material.id ? (
                    <TextInput
                      style={styles.weightInput}
                      keyboardType="decimal-pad"
                      placeholder="0"
                      placeholderTextColor="#999"
                      value={material.weight === 0 ? '' : material.weight.toString()}
                      onChangeText={(text) => addWeight(material.id, text)}
                      onBlur={() => {
                        setEditingMaterialId(null);
                      }}
                      autoFocus={true}
                      selectTextOnFocus={true}
                    />
                  ) : (
                    <TouchableOpacity 
                      onPress={() => {
                        setEditingMaterialId(material.id);
                      }} 
                      style={styles.editButton}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.editButtonText}>+</Text>
                    </TouchableOpacity>
                  )}
                  <Text style={styles.kgText}>kg</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.summaryContainer}>
          <Text style={[styles.totalWeightText, weightExceedsPickup && styles.totalWeightError]}>
            Total classified weight: {totalWeight.toFixed(2)} kg
          </Text>
          {weightExceedsPickup && (
            <Text style={styles.errorText}>
              ⚠️ Exceeds pickup weight by {weightDifference.toFixed(2)} kg
            </Text>
          )}
        </View>
        <TextInput
          style={styles.commentInput}
          multiline
          numberOfLines={4}
          onChangeText={(text) => setComment(text)}
          placeholder="Enter comments (optional)"
          value={comment}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.cancelButton, { backgroundColor: 'grey', borderRadius: 10 }]} 
            onPress={goBack}
          >
            <Text style={[styles.buttonText, { color: 'white', fontWeight: 'bold' }]}>CANCEL</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.submitButton, 
              { 
                backgroundColor: weightExceedsPickup ? '#ff6b6b' : 'green', 
                borderRadius: 10,
                opacity: weightExceedsPickup ? 0.7 : 1
              }
            ]}
            onPress={submitMaterials}
            disabled={weightExceedsPickup}
          >
            <Text style={[styles.buttonText, { color: 'white', fontWeight: 'bold' }]}>
              {weightExceedsPickup ? 'CANNOT SUBMIT' : 'SUBMIT'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Classify;