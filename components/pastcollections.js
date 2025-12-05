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
              <Text style={[styles.text, { 
                fontWeight: '600', 
                color: collection.status === 'C' ? '#059669' : '#2563EB',
                textTransform: 'uppercase',
                fontSize: 13,
                marginTop: 4
              }]}>
                Status: {collection.status === 'C' ? 'Completed' : 'Pending'}
              </Text>
            </View>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }]}
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
                <Text style={{ color: '#92400E', fontWeight: '600', fontSize: 14 }}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#E0E7FF', borderColor: '#6366F1' }]}
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
                <Text style={{ color: '#4338CA', fontWeight: '600', fontSize: 14 }}>Classify</Text>
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
    backgroundColor: '#F5F7FA',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  collectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  collectionInfo: {
    flex: 3,
  },
  text: {
    flex: 1,
    marginBottom: 6,
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  buttonsContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    minWidth: 120,
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  completed: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  pending: {
    backgroundColor: '#DBEAFE',
    borderColor: '#3B82F6',
  }
});

export default PastCollections;
