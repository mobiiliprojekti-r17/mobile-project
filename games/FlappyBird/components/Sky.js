import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('screen');

const cloudData = [
  { id: 'cloud1', top: 80,  duration: 30000, startDelay: 0 },
  { id: 'cloud2', top: 150, duration: 40000, startDelay: 5000 },
  { id: 'cloud3', top: 200, duration: 35000, startDelay: 3000 },
  { id: 'cloud4', top: 50,  duration: 28000, startDelay: 2000 },
  { id: 'cloud5', top: 120, duration: 42000, startDelay: 7000 },
];

const CloudShape = () => {
  return (
    <View style={cloudStyles.container}>
      <View style={cloudStyles.base} />
      <View style={cloudStyles.lump1} />
      <View style={cloudStyles.lump2} />
      <View style={cloudStyles.lump3} />
    </View>
  );
};

const cloudStyles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 80, 
    height: 40, 
  },
  base: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'white', 
    borderRadius: 20,
  },
  lump1: {
    position: 'absolute',
    width: 28,
    height: 28,
    backgroundColor: 'white', 
    borderRadius: 14,
    left: 5,
    top: -10,
  },
  lump2: {
    position: 'absolute',
    width: 35,
    height: 35,
    backgroundColor: 'white', 
    borderRadius: 17.5,
    left: 25,
    top: -15,
  },
  lump3: {
    position: 'absolute',
    width: 28,
    height: 28,
    backgroundColor: 'white', 
    borderRadius: 14,
    left: 55,
    top: -10,
  },
});

const Sky = () => {
  const cloudShapeWidth = 80;

  const cloudsAnimation = useRef(
    cloudData.map(() => new Animated.Value(width + Math.random() * 100))
  ).current;

  useEffect(() => {
    const animateCloud = (index) => {
      const cloud = cloudData[index];
      Animated.timing(cloudsAnimation[index], {
        toValue: -cloudShapeWidth,
        duration: cloud.duration,
        delay: cloud.startDelay,
        useNativeDriver: false,
      }).start(() => {
        const newStart = width + Math.random() * 100 + cloudShapeWidth;
        cloudsAnimation[index].setValue(newStart);
        animateCloud(index);
      });
    };

    cloudData.forEach((cloud, index) => {
      animateCloud(index);
    });

    return () => {
      cloudData.forEach((cloud, index) => {
        cloudsAnimation[index].stopAnimation();
      });
    };
  }, [cloudsAnimation]);

  return (
    <View style={styles.container}>
      <View style={styles.sun} />
      {cloudData.map((cloud, index) => (
        <Animated.View
          key={cloud.id}
          style={[
            styles.cloudContainer,
            { top: cloud.top, left: cloudsAnimation[index] },
          ]}
        >
          <CloudShape />
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#87CEEB',
    zIndex: -1,
  },
  sun: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'yellow',
    top: 50,
    right: 30,
    shadowColor: 'yellow',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  cloudContainer: {
    position: 'absolute',
  },
});

export default Sky;
