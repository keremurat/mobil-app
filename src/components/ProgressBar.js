import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';

export const ProgressBar = ({
  label,
  current,
  target,
  unit,
  color = COLORS.primary,
  gradient = false,
  gradientColors = COLORS.primaryGradient
}) => {
  const progress = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animatedWidth, {
      toValue: progress,
      useNativeDriver: false,
      friction: 8,
      tension: 40,
    }).start();
  }, [progress]);

  const widthInterpolated = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>
          {current} / {target} {unit}
        </Text>
      </View>
      <View style={styles.barBackground}>
        {gradient ? (
          <Animated.View style={{ width: widthInterpolated, height: '100%' }}>
            <LinearGradient
              colors={gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.barFillGradient}
            />
          </Animated.View>
        ) : (
          <Animated.View
            style={[
              styles.barFill,
              { width: widthInterpolated, backgroundColor: color }
            ]}
          />
        )}
      </View>
      <View style={styles.percentageContainer}>
        <Text style={[styles.percentage, { color }]}>{progress.toFixed(0)}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  barBackground: {
    height: 12,
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 10,
  },
  barFillGradient: {
    height: '100%',
    borderRadius: 10,
  },
  percentageContainer: {
    alignItems: 'flex-end',
    marginTop: 6,
  },
  percentage: {
    fontSize: 13,
    fontWeight: '700',
  },
});
