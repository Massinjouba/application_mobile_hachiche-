import React, { useState, useRef, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const BottomBar = () => {
  const [showExtraContainers, setShowExtraContainers] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(60)).current;
  const buttonBackgroundColor = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: showExtraContainers ? 1 : 0,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: showExtraContainers ? 0 : 150,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(buttonBackgroundColor, {
        toValue: showExtraContainers ? 0.5 : 1,
        duration: 350,
        useNativeDriver: false,
      }),
    ]).start();
  }, [showExtraContainers]);

  const buttonScale = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const backgroundColor = buttonBackgroundColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(71, 79, 68, 0.1)', 'rgba(71, 79, 68, 1)'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.centerContainer}>
        <TouchableOpacity
          onPress={() => setShowExtraContainers(!showExtraContainers)}
          style={styles.iconBackground}
        >
          <Animated.View style={[styles.iconBackground, { backgroundColor }]}>
            <Image source={require('../../assets/plus.png')} style={styles.icon} />
          </Animated.View>
        </TouchableOpacity>
        <Animated.View style={[styles.extraContainerWrapper, {
          opacity: scaleAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          }),
          transform: [
            { scale: buttonScale },
            { translateY: translateYAnim },
          ],
        }]}>
          <TouchableOpacity onPress={() => navigation.navigate('PlantForm')}>
            <View style={styles.extraContainer}>
              <Image source={require('../../assets/plante.png')} style={styles.extraIcon} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('QRScanner')}>
            <View style={styles.extraContainer}>
              <Image source={require('../../assets/qr.png')} style={styles.extraIcon} />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  centerContainer: {
    backgroundColor: 'transparent',
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBackground: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    width: 40,
    height: 40,
  },
  extraContainerWrapper: {
    position: 'absolute',
    bottom: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 180,
    zIndex: -1,
    alignItems: 'center',
  },
  extraContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#474F44',
    justifyContent: 'center',
    alignItems: 'center',
  },
  extraIcon: {
    width: 30,
    height: 30,
  },
});

export default BottomBar;
