import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput } from 'react-native';
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
      <Button title="Contact Info" onPress={() => setIsVisible(!isVisible)} />

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
    backgroundColor: "#F8FBFF",
  },

  dropdownContainer: {
    marginBottom: 20,
  },

  dropdownLabel: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
    color: "#0D47A1",
  },

  contactWrapper: {
    marginTop: 10,
  },

  detailsContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
  },

  detailText: {
    fontSize: 15,
    marginBottom: 5,
    color: "#000",
  },
});

// ★★★ Modern Beautiful Dropdown Styles ★★★
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1.2,
    borderColor: "#1976D2",
    borderRadius: 10,
    backgroundColor: "#F5F9FF",
    color: "black",
    paddingRight: 30,
    marginTop: 3,

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },

  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1.2,
    borderColor: "#1976D2",
    borderRadius: 10,
    backgroundColor: "#F5F9FF",
    color: "black",
    paddingRight: 30,
    marginTop: 3,
    elevation: 2,
  },

  placeholder: {
    color: "#78849E",
    fontSize: 15,
  },
});

export default DropdownSection;
