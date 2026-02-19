import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const CircularProgress = ({
  size = 120,
  strokeWidth = 12,
  progress = 0,
  max = 100,
  color = COLORS.primary,
  backgroundColor = COLORS.lightGray,
  gradient = false,
  gradientColors = COLORS.primaryGradient,
  label,
  value,
  unit,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progressValue = Math.min(Math.max(progress / max, 0), 1);

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: progressValue,
      useNativeDriver: true,
      friction: 7,
      tension: 40,
    }).start();
  }, [progressValue]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          {/* Background Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress Circle */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={gradient ? 'url(#grad)' : color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
        {gradient && (
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradientColors[0]} stopOpacity="1" />
              <stop offset="100%" stopColor={gradientColors[1]} stopOpacity="1" />
            </linearGradient>
          </defs>
        )}
      </Svg>
      <View style={styles.textContainer}>
        {value !== undefined && (
          <Text style={styles.value}>{value}</Text>
        )}
        {unit && <Text style={styles.unit}>{unit}</Text>}
        {label && <Text style={styles.label}>{label}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  unit: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  label: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
  },
});
