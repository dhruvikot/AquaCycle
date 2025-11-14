import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image } from 'react-native';

const Header = ({ client, location, title="Default" }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerLine} />
        <View style={styles.headerContent}>
          <Image
            source={require('./logo.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>{title}</Text>
          <Image
            source={require('./Group 3.png')}
            style={styles.userIcon}
          />
        </View>
        <View style={styles.headerLine} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    safeArea: {
      backgroundColor: 'white', 
    },
    container: {
      backgroundColor: '#FFF',
    },
    headerLine: {
      height: 10, 
      backgroundColor: '#0038A8', 
      width: '100%', 
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 10,
    },
    logo: {
      width: 166, 
      height: 76, 
      flexShrink: 0,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    userIcon: {
      width: 30,
      height: 30, 
    },
  });
  

export default Header;