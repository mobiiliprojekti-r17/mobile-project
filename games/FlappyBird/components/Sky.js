import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Image } from 'react-native';

const { width } = Dimensions.get('screen');

const CLOUD_1 = require('../../../assets/Cloud1.png');
const CLOUD_2 = require('../../../assets/Cloud2.png');
const BASE_W  = 80;   
const BASE_H  = 40;   

const cloudData = [
  { id:'cloud1', top:  80, duration:30000, startDelay:0    },
  { id:'cloud2', top: 150, duration:40000, startDelay:5000 },
  { id:'cloud3', top: 200, duration:35000, startDelay:3000 },
  { id:'cloud4', top:  50, duration:28000, startDelay:2000 },
  { id:'cloud5', top: 120, duration:42000, startDelay:7000 },
];

cloudData.forEach((c, i) => {
  c.img   = i % 2 === 0 ? CLOUD_1 : CLOUD_2;          
  c.scale = 0.8 + Math.random() * 1.2;                
});

const CloudSprite = ({ source, scale }) => (
  <Image
    source={source}
    style={{ width: BASE_W * scale, height: BASE_H * scale }}
    resizeMode="contain"
  />
);

export default function Sky() {
  const cloudsAnim = useRef(
    cloudData.map(() => new Animated.Value(width + Math.random() * 100))
  ).current;

  useEffect(() => {
    const animate = (idx) => {
      const { duration, startDelay } = cloudData[idx];
      Animated.timing(cloudsAnim[idx], {
        toValue: -BASE_W,             
        duration, delay: startDelay,
        useNativeDriver: false,
      }).start(() => {
        const resetX = width + Math.random() * 100 + BASE_W;
        cloudsAnim[idx].setValue(resetX);
        animate(idx);                
      });
    };
    cloudData.forEach((_, i) => animate(i));
    return () => cloudsAnim.forEach(a => a.stopAnimation());
  }, [cloudsAnim]);

  return (
    <View style={styles.container}>
      <View style={styles.sun} />
      {cloudData.map((c, i) => (
        <Animated.View
          key={c.id}
          style={[
            styles.cloudContainer,
            { top: c.top, left: cloudsAnim[i] },
          ]}
        >
          <CloudSprite source={c.img} scale={c.scale} />
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    position:'absolute', top:0, left:0, right:0, bottom:0,
    backgroundColor:'#87CEEB', zIndex:-1,
  },
  sun:{
    position:'absolute', top:50, right:30,
    width:100, height:100, borderRadius:50, backgroundColor:'yellow',
    shadowColor:'yellow', shadowOffset:{width:0,height:0},
    shadowOpacity:0.8, shadowRadius:10,
  },
  cloudContainer:{ position:'absolute' },
});
