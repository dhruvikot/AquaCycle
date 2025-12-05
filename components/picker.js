import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import calls from '../services/calls';

const Contact = ({ clientId }) => {
  const [clientContactInfo, setClientContactInfo] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const fetchClientContactInfo = () => {
    if (clientId) {
      calls.fetchClients((clients) => {
        const client = clients.find(c => c.id === clientId);
        if (client) {
          setClientContactInfo({
            name: `${client.first_name} ${client.last_name}`,
            email: client.contact_email,
            phone: client.contact_phone,
          });
        }
      });
    }
  };

  useEffect(() => {
    fetchClientContactInfo();
  }, [clientId]);

  return (
    <View style={styles.contactWrapper}>
      <TouchableOpacity 
        onPress={() => setIsVisible(!isVisible)}
        style={{
          backgroundColor: '#FFFFFF',
          padding: 12,
          borderRadius: 10,
          borderWidth: 1.5,
          borderColor: '#E5E7EB',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#0038A8', fontWeight: '600', fontSize: 15 }}>
          {isVisible ? 'Hide Contact Info' : 'Show Contact Info'}
        </Text>
      </TouchableOpacity>

      {isVisible && clientContactInfo && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>Name: {clientContactInfo.name}</Text>
          <Text style={styles.detailText}>Email: {clientContactInfo.email}</Text>
          <Text style={styles.detailText}>Phone: {clientContactInfo.phone}</Text>
        </View>
      )}
    </View>
  );
};

const DropdownSection = ({ onClientSelect, onLocationSelect }) => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [clients, setClients] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    calls.fetchClients((clientData) => {
      const formattedClients = clientData.map(client => ({
        label: client.client_name,
        value: client.id,
        locations: client.locations
      }));
      setClients(formattedClients);
    });
  }, []);

  const onClientValueChange = (clientId) => {
    const id = parseInt(clientId);
    const selected = clients.find(c => c.value === id);

    setSelectedClient(selected);

    if (selected) {
      const locationItems = selected.locations.map(location => ({
        label: location.name,
        value: location.id,
      }));
      setLocations(locationItems);
    } else {
      setLocations([]);
    }
  };

  return (
    <View style={styles.mainContainer}>

      {/* CLIENT DROPDOWN */}
      <View style={styles.dropdownContainer}>
        <Text style={styles.dropdownLabel}>Client</Text>
        <RNPickerSelect
          onValueChange={(value) => {
            onClientSelect(value);
            onClientValueChange(value);
          }}
          items={clients}
          style={pickerSelectStyles}
          placeholder={{ label: "Select a client", value: null }}
          useNativeAndroidPickerStyle={false}
        />
      </View>

      {/* LOCATION DROPDOWN */}
      <View style={styles.dropdownContainer}>
        <Text style={styles.dropdownLabel}>Pickup Location</Text>
        <RNPickerSelect
          onValueChange={onLocationSelect}
          items={locations}
          style={pickerSelectStyles}
          placeholder={{ label: "Select a location", value: null }}
          useNativeAndroidPickerStyle={false}
        />
      </View>

      {/* CONTACT INFO */}
      {selectedClient && (
        <Contact clientId={selectedClient.value} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    padding: 16,
    backgroundColor: "#F5F7FA",
  },

  dropdownContainer: {
    marginBottom: 20,
  },

  dropdownLabel: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    color: "#0038A8",
    letterSpacing: 0.2,
  },

  contactWrapper: {
    marginTop: 12,
  },

  detailsContainer: {
    marginTop: 12,
    padding: 16,
    backgroundColor: "#E0F2FE",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#0EA5E9",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  detailText: {
    fontSize: 15,
    marginBottom: 6,
    color: "#1A1A1A",
    fontWeight: '500',
  },
});

// ★★★ Modern Beautiful Dropdown Styles ★★★
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: "#0038A8",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    color: "#1A1A1A",
    paddingRight: 30,
    marginTop: 4,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: "#0038A8",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    color: "#1A1A1A",
    paddingRight: 30,
    marginTop: 4,
    elevation: 3,
  },

  placeholder: {
    color: "#9CA3AF",
    fontSize: 15,
  },
});

export default DropdownSection;
