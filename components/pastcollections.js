import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import Header from './header';
import { useNavigation } from '@react-navigation/native';
import calls from '../services/calls';

const PastCollections = () => {
  const navigation = useNavigation();
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    calls.fetchPickups()
      .then(data => {
        const sortedData = data.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
        setCollections(sortedData);
      })
      .catch(error => {
        console.error('Failed to fetch collections:', error);
        Alert.alert('Error', 'Failed to fetch collections');
      });
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Past Collections" />
      <ScrollView style={styles.container}>
        {collections.map((collection) => (
          <View
            key={collection.id}
            style={[
              styles.collectionRow,
              collection.status === 'C' ? styles.completed : styles.pending
            ]}
          >
            <View style={styles.collectionInfo}>
              <Text style={styles.text}>Client: {collection.client_data.client_name}</Text>
              <Text style={styles.text}>Location: {collection.location}</Text>
              <Text style={styles.text}>Weight: {collection.total_weight} kg</Text>
              <Text style={styles.text}>Status: {collection.status}</Text>
            </View>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate('Collect', {
                    pickupId: collection.id,
                    clientId: collection.client_data.id,
                    locationId: collection.location_id,
                    clientName: collection.client_data.client_name,
                    locationName: collection.location,
                  })
                }
              >
                <Text>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate('Classify', {
                    pickupId: collection.id,
                    clientName: collection.client_data.client_name,
                    location: collection.location,
                    datetime: collection.datetime,
                    totalWeight: collection.total_weight,
                  })
                }
              >
                <Text>Classify</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    padding: 10,
  },
  collectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  collectionInfo: {
    flex: 3,
  },
  text: {
    flex: 1,
    marginBottom: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    minWidth: 100,
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#e7e7e7',
    borderRadius: 5,
  },
  completed: {
    backgroundColor: '#A3C77B',
  },
  pending: {
    backgroundColor: '#ADD8E6',
  }
});

export default PastCollections;
