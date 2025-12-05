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
      backgroundColor: '#FFFFFF',
    },
    container: {
      backgroundColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
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
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    logo: {
      width: 166,
      height: 76,
      flexShrink: 0,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: '#1A1A1A',
      letterSpacing: -0.3,
    },
    userIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
    },
  });
  

export default Header;