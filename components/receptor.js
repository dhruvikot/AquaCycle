import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, Alert, View, ScrollView, Platform, SafeAreaView, Dimensions } from 'react-native';
import Header from './header';
import DropdownSection from './picker';
import Entry from './entry';
import Dashboard from './dashboard';
import calls from '../services/calls';
import VoiceAssistant from './voiceAssistant';

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
    const [voiceColor, setVoiceColor] = useState(null);
    const [voiceBags, setVoiceBags] = useState(null);
    const [voiceWeight, setVoiceWeight] = useState(null);

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
        if (selectedClient && clients.length > 0) {
            const client = clients.find(client => client.value === selectedClient);
            if (client && client.locations) {
                setLocations(client.locations.map(location => ({
                    label: location.name,
                    value: location.id,
                })));
            } else {
                setLocations([]);
            }
        } else if (!selectedClient) {
            setLocations([]);
            setSelectedLocation(null);
        }
    }, [selectedClient, clients]);

    const handleAddEntry = (color, bags, weight) => {
        const bagCount = parseInt(bags) || 0;
        const bagWeight = parseFloat(weight) || 0;
        
        if (!color || bagCount <= 0 || bagWeight <= 0) {
            Alert.alert("Error", "Please provide valid color, count, and weight.");
            return;
        }
        
        const newEntry = {
            id: null,
            color: color,
            bags: bagCount,
            weight: bagWeight
        };
        const updatedEntries = [...entries, newEntry];
        setEntries(updatedEntries);
        const updatedTotalBags = totalBags + bagCount;
        const updatedTotalWeight = totalWeight + bagWeight;
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
            const errorMsg = "Please select a client and location.";
            Alert.alert("Error", errorMsg);
            throw new Error(errorMsg);
        }

        // Get client and location names from the selected values
        const selectedClientObj = clients.find(c => c.value === selectedClient);
        const selectedLocationObj = locations.find(l => l.value === selectedLocation);
        const finalClientName = clientName || selectedClientObj?.label || '';
        const finalLocationName = locationName || selectedLocationObj?.label || '';

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
            console.log('Starting submit with payload:', JSON.stringify({ payload_post, payload_patch, entries, totalWeight, pickupId }, null, 2));
            
            let finalPickupId = pickupId;
            
            if (totalWeight === 0 && pickupId) {
                console.log('Deleting pickup because totalWeight is 0');
                await calls.deletePickup(pickupId);
                console.log('Pickup deleted, navigating...');
                navigation.navigate('PastCollections');
            } else if (pickupId) {
                console.log('Patching existing pickup:', pickupId);
                const response = await calls.patchPickup(pickupId, payload_patch);
                finalPickupId = pickupId;
                console.log('Pickup patched, navigating to classify...');
                // Navigate to classify page to classify the weight
                navigation.navigate('Classify', {
                    pickupId: finalPickupId,
                    clientName: finalClientName,
                    location: finalLocationName,
                    datetime: new Date().toISOString(),
                    totalWeight: totalWeight,
                });
            } else {
                console.log('Creating new pickup');
                const response = await calls.postPickups(payload_post);
                // Get the pickup ID from the response
                finalPickupId = response?.pickup?.id || response?.id;
                console.log('Pickup created with ID:', finalPickupId, ', navigating to classify...');
                // Navigate to classify page to classify the weight
                navigation.navigate('Classify', {
                    pickupId: finalPickupId,
                    clientName: finalClientName,
                    location: finalLocationName,
                    datetime: new Date().toISOString(),
                    totalWeight: totalWeight,
                });
            }
            console.log('Submit completed successfully');
        } catch (error) {
            console.error('Error submitting data:', error);
            const errorMsg = error.message || "Failed to submit data.";
            Alert.alert("Error", errorMsg);
            throw error; // Re-throw so voice assistant can catch it
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Header title="Collect" showBackButton={true} />
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
                bounces={false}
            >
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
                    voiceColor={voiceColor}
                    voiceBags={voiceBags}
                    voiceWeight={voiceWeight}
                    onVoiceValuesUsed={() => {
                        setVoiceColor(null);
                        setVoiceBags(null);
                        setVoiceWeight(null);
                    }}
                />
                <VoiceAssistant
                    clients={clients}
                    selectedClient={selectedClient}
                    selectedLocation={selectedLocation}
                    onClientSelect={setSelectedClient}
                    onLocationSelect={setSelectedLocation}
                    onAddEntry={handleAddEntry}
                    onSubmit={handleSubmit}
                    setNotes={setNotes}
                    setVoiceColor={setVoiceColor}
                    setVoiceBags={setVoiceBags}
                    setVoiceWeight={setVoiceWeight}
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
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'white',
        ...(Platform.OS === 'web' && {
            height: '100vh',
            maxHeight: '100vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
        }),
    },
    scrollView: {
        flex: 1,
        ...(Platform.OS === 'web' && {
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
            minHeight: 0,
        }),
    },
    scrollContent: {
        paddingBottom: 100,
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
