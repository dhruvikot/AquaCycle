import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, Button, TextInput } from 'react-native';

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
      <Button title="Add Notes" onPress={toggleNotes} />
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
    padding: 10,
    backgroundColor: '#e3e3e3',
  },
  entryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 5,
  },
  headerText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  container: {
    flex: 1,
    marginTop: 60,
    backgroundColor: '#f7f7f7',
  },
  headerLine: {
    height: 10,
    backgroundColor: '#0038A8',
  },
  listContainer: {
    flex: 1,
  },
  entryText: {
    flex: 1,
    textAlign: 'center',
  },
  removeButton: {
    width: 30,
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center'
  },
  totalsContainer: {
    paddingVertical: 10,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notesInput: {
    fontSize: 16,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    margin: 10,
    borderRadius: 5,
    textAlignVertical: 'top',
    flexDirection: 'row',
  },
});

export default Dashboard;
