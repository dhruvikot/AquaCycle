import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Button } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const Entry = ({ onAdd, selectedClient, selectedLocation }) => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedBags, setSelectedBags] = useState(null);
  const [weight, setWeight] = useState('');

  const isAddButtonDisabled = !selectedClient || !selectedLocation || !selectedColor || !selectedBags;

  const colorItems = [
    { label: 'Blue', value: 'Blue' },
    { label: 'Yellow', value: 'Yellow' },
    { label: 'Brown', value: 'Brown' },
    { label: 'Grey', value: 'Grey' },
  ];

  const getColorByValue = (value) => {
    switch (value) {
      case 'Blue':
        return '#5884E0';
      case 'Yellow':
        return '#F4C343';
      case 'Brown':
        return '#7A621D';
      case 'Grey':
        return '#999999';
      default:
        return '#999999';
    }
  };

  const bagsItems = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
  ];

  const handleAdd = () => {
    onAdd(selectedColor, selectedBags, weight);
    setSelectedColor(null);
    setSelectedBags(null);
    setWeight('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputsContainer}>
        <View style={styles.colorPickerContainer}>
          <Text style={styles.label}>Color</Text>
          <RNPickerSelect
            onValueChange={(value) => setSelectedColor(value)}
            items={colorItems}
            style={{
              inputAndroid: {
                ...styles.pickerInputAndroid,
                color: getColorByValue(selectedColor),
              },
              inputIOS: {
                ...styles.pickerInputIOS,
                color: getColorByValue(selectedColor),
              },
            }}
            value={selectedColor}
            placeholder={{ label: 'Select a color', value: null }}
            useNativeAndroidPickerStyle={false}
          />
        </View>
        <View style={styles.countPickerContainer}>
          <Text style={styles.label}>Count</Text>
          <RNPickerSelect
            onValueChange={(value) => setSelectedBags(value)}
            items={bagsItems}
            style={{
              inputAndroid: styles.pickerInputAndroid,
              inputIOS: styles.pickerInputIOS,
            }}
            value={selectedBags}
            placeholder={{ label: 'Select number of bags', value: null }}
            useNativeAndroidPickerStyle={false}
          />
        </View>
        <View style={styles.weightInputContainer}>
          <Text style={styles.weightLabel}>Weight (KG)</Text>
          <TextInput
            style={styles.weightInput}
            onChangeText={(text) => setWeight(text.replace(/[^0-9.]/g, ''))}
            value={weight}
            placeholder="Enter weight"
            keyboardType="numeric"
          />
        </View>
      </View>
      <TouchableOpacity
        onPress={handleAdd}
        style={[styles.addButton, isAddButtonDisabled && styles.disabledButton]}
        disabled={isAddButtonDisabled}
      >
        <Text style={styles.addButtonText}>ADD</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 6,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputsContainer: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 12,
  },
  colorPickerContainer: {
    flex: 1.25,
    justifyContent: 'center',
    marginRight: 5,
  },
  countPickerContainer: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 5,
  },
  weightInputContainer: {
    flex: 1.25,
    justifyContent: 'center',
    marginRight: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  weightLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  weightInput: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    color: 'black',
    marginTop: 6,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pickerInputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
  },
  pickerInputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
});

export default Entry;