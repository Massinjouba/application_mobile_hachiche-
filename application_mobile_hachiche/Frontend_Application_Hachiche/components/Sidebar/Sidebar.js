import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Sidebar = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigation = useNavigation(); // Obtenez l'objet de navigation

  const menuItems = [
    { id: '1', text: 'Notre Stock', screen: 'Graph'},
    { id: '2', text: 'Plantules', screen: 'Plant'  },
    { id: '3', text: 'Entreposage', screen: 'Entreposage'},
    { id: '4', text: 'Décontamination', screen: 'ResponsableDecontamination'}, 
    { id: '5', text: 'Importer', screen:'Import'},
  ];

  const logoutItem = { id: '7', icon: require('../../assets/logout.png') };

  const handleLogout = () => {
    navigation.navigate('Login'); // Naviguer vers l'écran Login
  };

  const handleLogoClick = () => {
    navigation.navigate('Home'); // Naviguer vers l'écran Home
  };

  const handleMenuItemClick = (item) => {
    if (item.screen) {
      navigation.navigate(item.screen); // Naviguer vers l'écran spécifié
    }
  };

  return (
    <View style={styles.sidebar}>
      <TouchableOpacity onPress={handleLogoClick}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
      </TouchableOpacity>
      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.menuItem,
            hoveredItem === item.id && styles.menuItemHovered,
          ]}
          onPressIn={() => setHoveredItem(item.id)}
          onPressOut={() => setHoveredItem(null)}
          onPress={() => handleMenuItemClick(item)} // Ajoutez la gestion de la navigation
        >
          {item.icon ? (
            <Image source={item.icon} style={styles.menuIcon} />
          ) : (
            <Text style={styles.menuText}>{item.text}</Text>
          )}
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={[
          styles.menuItem,
          styles.logoutItem,
          hoveredItem === logoutItem.id && styles.menuItemHovered,
        ]}
        onPressIn={() => setHoveredItem(logoutItem.id)}
        onPressOut={() => setHoveredItem(null)}
        onPress={handleLogout} // Appel de la fonction handleLogout
      >
        <Image source={logoutItem.icon} style={styles.menuIcon} />
        <Text style={styles.menuText}>{logoutItem.text}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    flex: 1,
    backgroundColor: '#474F44',
    paddingTop: 50,
    paddingHorizontal: 0,
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 30,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemHovered: {
    backgroundColor: '#8FD3AE',
  },
  menuText: {
    fontSize: 18,
    color: '#F3F7E8',
  },
  menuIcon: {
    width: 24,
    height: 24,
    tintColor: '#F3F7E8',
  },
  logoutItem: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});

export default Sidebar;
