import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,Button,TextInput } from 'react-native';
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

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    return (
        <View style={styles.container}>
            <Button title="Contact Info" onPress={toggleVisibility} />
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
        const selectedClient = clients.find(client => client.value === id);
        setSelectedClient(selectedClient);
        if (selectedClient) {
            const locationItems = selectedClient.locations.map(location => ({
                label: location.name,
                value: location.id,
            }));
            setLocations(locationItems);
        } else {
            setLocations([]);
        }
    };
    const toggleNotes = () => {
      setShowNotes(!showNotes);
  };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.dropdownSection}>
                <View style={styles.dropdownContainer}>
                    <Text style={styles.dropdownLabel}>Client:</Text>
                    <RNPickerSelect
                        onValueChange={(value) => {
                          onClientSelect(value);
                          onClientValueChange(value);
                        }}
                        items={clients}
                        style={pickerSelectStyles}
                        placeholder={{ label: "Select a client", value: null }}
                    />
                </View>
                <View style={styles.dropdownContainer}>
                    <Text style={styles.dropdownLabel}>Pickup Location:</Text>
                    <RNPickerSelect
                        onValueChange={(value) => {
                          onLocationSelect(value);
                        }}
                        items={locations}
                        style={pickerSelectStyles}
                        placeholder={{ label: "Select a location", value: null }}
                    />
                </View>
            </View>
           
            {selectedClient && <Contact style={styles.Contact}clientId={selectedClient.value} />}
           
            
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: 'column', 
       
    },

    Contact:{
      alignItems:'center',
    },

    
    dropdownSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
    dropdownContainer: {
        flexDirection: 'column',
        width: '45%',
    },
    dropdownLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'black',
        alignItems:'center'
    },
   

    
});


const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, 
  },
  inputAndroid: {
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, 
  },
});

export default DropdownSection;