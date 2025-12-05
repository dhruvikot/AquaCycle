import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, TextInput } from 'react-native';

const Dashboard = ({ entries, totalBags, totalWeight, onRemove, navigation, handleSubmit, notes, setNotes }) => {
  const [showNotes, setShowNotes] = useState(false);

  const DashboardHeader = () => (
    <View style={styles.headerRow}>
      <Text style={styles.headerText}>Color</Text>
      <Text style={styles.headerText}>Count</Text>
      <Text style={styles.headerText}>Weight</Text>
      <View style={{ width: 30, }}></View>
    </View>
  );

  const DashboardEntry = ({ item, index, onRemove }) => (
    <View style={styles.entryRow}>
      <Text style={styles.entryText}>{item.color}</Text>
      <Text style={styles.entryText}>{item.bags}</Text>
      <Text style={styles.entryText}>{`${item.weight} KG`}</Text>
      <TouchableOpacity onPress={() => onRemove(index)} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  );

  const handleCancel = () => {
    Alert.alert(
      "Cancel",
      "Are you sure you want to cancel?",
      [
        {
          text: "No",
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => {
            console.log("Canceled");
            navigation.navigate('Home');
          },
        }
      ]
    );
  };

  const toggleNotes = () => {
    setShowNotes(!showNotes);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerLine} />
      <View style={styles.listContainer}>
        <DashboardHeader />
        <FlatList
          data={entries}
          keyExtractor={(item, index) => 'entry-' + index}
          renderItem={({ item, index }) => (
            <DashboardEntry item={item} index={index} onRemove={onRemove} />
          )}
        />
      </View>
      <View style={styles.totalsContainer}>
        <Text style={styles.total}>Total Bags: {totalBags}</Text>
        <Text style={styles.total}>Total Weight: {totalWeight} KG</Text>
      </View>
      <TouchableOpacity 
        onPress={toggleNotes} 
        style={{
          backgroundColor: '#F3F4F6',
          padding: 12,
          marginHorizontal: 12,
          borderRadius: 10,
          alignItems: 'center',
          borderWidth: 1.5,
          borderColor: '#E5E7EB',
        }}
      >
        <Text style={{ color: '#374151', fontWeight: '600', fontSize: 15 }}>
          {showNotes ? 'Hide Notes' : 'Add Notes'}
        </Text>
      </TouchableOpacity>
      {showNotes && (
        <TextInput
          style={styles.notesInput}
          onChangeText={setNotes}
          value={notes}
          placeholder="Type your notes here"
          multiline
          numberOfLines={4}  // Adjust as needed
        />
      )}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={handleSubmit} style={styles.addButton}>
          <Text style={styles.buttonText}>SUBMIT</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
          <Text style={styles.buttonText}>CANCEL</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#0038A8',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  entryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    marginBottom: 6,
    marginHorizontal: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerText: {
    flex: 1,
    fontWeight: '600',
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 15,
    letterSpacing: 0.3,
  },
  container: {
    flex: 1,
    marginTop: 60,
    backgroundColor: '#F5F7FA',
  },
  headerLine: {
    height: 10,
    backgroundColor: '#0038A8',
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  entryText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  removeButton: {
    width: 36,
    height: 36,
    backgroundColor: '#EF4444',
    padding: 0,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  totalsContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  total: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    marginHorizontal: 12,
    marginBottom: 16,
    gap: 12,
  },
  cancelButton: {
    backgroundColor: '#EF4444',
    padding: 14,
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    flex: 1,
  },
  addButton: {
    backgroundColor: '#10B981',
    padding: 14,
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    flex: 1,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  notesInput: {
    fontSize: 16,
    borderColor: '#E5E7EB',
    borderWidth: 1.5,
    padding: 14,
    margin: 12,
    borderRadius: 12,
    textAlignVertical: 'top',
    backgroundColor: '#FFFFFF',
    color: '#1A1A1A',
    minHeight: 100,
  },
});

export default Dashboard;
