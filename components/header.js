import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Header = ({ client, location, title="Default", showBackButton = false }) => {
  const navigation = useNavigation();
  
  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerLine} />
      <View style={styles.headerContent}>
        <Image
          source={require('./logo.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.titleContainer}>
          {showBackButton && (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
        <Image
          source={require('./Group 3.png')}
          style={styles.userIcon}
        />
      </View>
      <View style={styles.headerLine} />
    </View>
  );
};

const styles = StyleSheet.create({
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
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
    },
    backButton: {
      marginRight: 10,
      padding: 5,
    },
    backButtonText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#000',
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