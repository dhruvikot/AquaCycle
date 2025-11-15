import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, Text, Alert, View } from 'react-native';
import Header from './header';
import DropdownSection from './picker';
import Entry from './entry';
import Dashboard from './dashboard';
import calls from '../services/calls';

const Receptor = ({ route, navigation }) => {
    const [entries, setEntries] = useState([]);
    const [totalBags, setTotalBags] = useState(0);
    const [totalWeight, setTotalWeight] = useState(0);
    const [clients, setClients] = useState([]);
    const [locations, setLocations] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [pickupId, setPickupId] = useState(null);
    const [clientName, setClientName] = useState('');
    const [locationName, setLocationName] = useState('');
    const [deletedBags, setDeletedBags] = useState([]);
    const [notes, setNotes] = useState('');

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

    useEffect(() => {
        const { pickupId, clientId, locationId, clientName, locationName } = route.params || {};
        if (pickupId) {
            setPickupId(pickupId);
            setClientName(clientName);
            setLocationName(locationName);
            calls.fetchPickupDetails(pickupId)
                .then(data => {
                    if (data.pickup) {
                        const { pickup } = data;
                        setSelectedClient(pickup.client);
                        const client = clients.find(client => client.value === pickup.client);
                        if (client) {
                            setLocations(client.locations.map(location => ({
                                label: location.name,
                                value: location.id,
                            })));
                            setSelectedLocation(pickup.location);
                        }
                        setEntries(pickup.bags.map(bag => ({
                            id: bag.id,
                            color: bag.color,
                            bags: parseInt(bag.weight),
                            weight: parseInt(bag.weight)
                        })));
                        setTotalWeight(parseFloat(pickup.total_weight));
                        setTotalBags(pickup.bags.reduce((sum, bag) => sum + parseInt(bag.weight), 0));
                        setNotes(pickup.notes || ''); // Load notes from pickup details
                    }
                })
                .catch(error => {
                    console.error('Failed to fetch pickup details:', error);
                    Alert.alert("Error", "Failed to load pickup details.");
                });
        } else if (clientId && locationId) {
            setSelectedClient(clientId);
            setClientName(clientName);
            setLocationName(locationName);
            const client = clients.find(client => client.value === clientId);
            if (client) {
                setLocations(client.locations.map(location => ({
                    label: location.name,
                    value: location.id,
                })));
                setSelectedLocation(locationId);
            }
            setPickupId(null);
            setEntries([]);
            setTotalBags(0);
            setTotalWeight(0);
            setNotes('');
        } else {
            // Reset state if no pickupId
            setPickupId(null);
            setSelectedClient(null);
            setSelectedLocation(null);
            setClientName('');
            setLocationName('');
            setEntries([]);
            setTotalBags(0);
            setTotalWeight(0);
            setLocations([]);
            setNotes('');
        }
    }, [route.params, clients]);

    useEffect(() => {
        if (selectedClient) {
            const client = clients.find(client => client.value === selectedClient);
            if (client) {
                setLocations(client.locations.map(location => ({
                    label: location.name,
                    value: location.id,
                })));
            } else {
                setLocations([]);
            }
        }
    }, [selectedClient]);

    const handleAddEntry = (color, bags, weight) => {
        const newEntry = {
            id: null,
            color: color,
            bags: parseInt(bags),
            weight: parseInt(weight)
        };
        const updatedEntries = [...entries, newEntry];
        setEntries(updatedEntries);
        const updatedTotalBags = totalBags + parseInt(bags);
        const updatedTotalWeight = totalWeight + parseInt(weight);
        setTotalBags(updatedTotalBags);
        setTotalWeight(updatedTotalWeight);
    };

    const handleRemoveEntry = (index) => {
        const entryToRemove = entries[index];
        if (!entryToRemove) return;

        const updatedEntries = entries.filter((_, i) => i !== index);
        setEntries(updatedEntries);
        const updatedTotalBags = totalBags - entryToRemove.bags;
        const updatedTotalWeight = totalWeight - entryToRemove.weight;
        setTotalBags(updatedTotalBags);
        setTotalWeight(updatedTotalWeight);

        if (entryToRemove.id) {
            setDeletedBags([...deletedBags, entryToRemove]);
        }
    };

    const handleSubmit = async () => {
        if (!selectedClient || !selectedLocation) {
            Alert.alert("Error", "Please select a client and location.");
            return;
        }

        const payload_post = {
            pickup: {
                client: selectedClient.toString(),
                location: selectedLocation.toString(),
                status: 'P',
                total_weight: totalWeight.toString(),
                bags: entries.map(entry => ({
                    color: entry.color,
                    weight: entry.weight.toString(),
                })),
                categories: [],
                notes: notes
            }
        };

        const payload_patch = {
            pickup: {
                client: selectedClient.toString(),
                location: selectedLocation.toString(),
                total_weight: totalWeight.toString(),
                status: 'P',
                bags: entries.map(entry => ({
                    id: entry.id ? entry.id.toString() : null,
                    color: entry.color,
                    weight: entry.weight.toString(),
                })),
                categories: [],
                deletedBags: deletedBags.map(bag => ({
                    id: bag.id.toString(),
                    color: bag.color,
                    weight: bag.weight.toString(),
                })),
                deletedCategories: [],
                notes: notes
            }
        };

        try {
            if (totalWeight === 0 && pickupId) {
                await calls.deletePickup(pickupId);
                navigation.navigate('PastCollections');
            } else if (pickupId) {
                await calls.patchPickup(pickupId, payload_patch);
                navigation.navigate('PastCollections');
            } else {
                await calls.postPickups(payload_post);
                navigation.navigate('PastCollections');
            }
        } catch (error) {
            console.error('Error submitting data:', error);
            Alert.alert("Error", "Failed to submit data.");
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Header title="Collect" />
            {pickupId ? (
                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>Client: {clientName}</Text>
                    <Text style={styles.infoText}>Location: {locationName}</Text>
                </View>
            ) : (
                <DropdownSection
                    clients={clients}
                    locations={locations}
                    selectedClient={selectedClient}
                    selectedLocation={selectedLocation}
                    onClientSelect={setSelectedClient}
                    onLocationSelect={setSelectedLocation}
                />
            )}
            <Entry
                onAdd={handleAddEntry}
                selectedClient={selectedClient}
                selectedLocation={selectedLocation}
            />
            <Dashboard
                entries={entries}
                totalBags={totalBags}
                totalWeight={totalWeight}
                onRemove={handleRemoveEntry}
                navigation={navigation}
                handleSubmit={handleSubmit}
                notes={notes}
                setNotes={setNotes}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'white',
    },
    infoContainer: {
        padding: 10,
        backgroundColor: 'lightgrey',
        marginBottom: 10,
    },
    infoText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Receptor;