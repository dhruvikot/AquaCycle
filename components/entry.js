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
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginTop: 20,
    marginHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputsContainer: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 12,
  },
  colorPickerContainer: {
    flex: 1.25,
    justifyContent: 'center',
    marginRight: 8,
  },
  countPickerContainer: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 8,
  },
  weightInputContainer: {
    flex: 1.25,
    justifyContent: 'center',
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },
  weightLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  weightInput: {
    fontSize: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    color: '#1A1A1A',
    marginTop: 6,
    backgroundColor: '#FAFBFC',
  },
  addButton: {
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0,
    elevation: 0,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  pickerInputAndroid: {
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: '#0038A8',
    borderRadius: 10,
    color: '#1A1A1A',
    paddingRight: 30,
    backgroundColor: '#FAFBFC',
  },
  pickerInputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: '#0038A8',
    borderRadius: 10,
    color: '#1A1A1A',
    paddingRight: 30,
    backgroundColor: '#FAFBFC',
  },
});

export default Entry;