import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart as RNLineChart } from 'react-native-chart-kit';
import { COLORS } from '../constants/colors';

const screenWidth = Dimensions.get('window').width;

export const LineChart = ({
  data,
  labels,
  gradient = true,
  bezier = true,
  height = 220,
}) => {
  const chartData = {
    labels: labels || [],
    datasets: [
      {
        data: data || [0],
        color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: COLORS.card,
    backgroundGradientFrom: gradient ? COLORS.cardSecondary : COLORS.card,
    backgroundGradientTo: gradient ? COLORS.card : COLORS.card,
    backgroundGradientFromOpacity: gradient ? 0.3 : 0,
    backgroundGradientToOpacity: gradient ? 0 : 0,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(99, 110, 114, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '3',
      stroke: COLORS.primary,
      fill: COLORS.card,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: COLORS.lightGray,
      strokeWidth: 1,
    },
    propsForLabels: {
      fontSize: 12,
      fontWeight: '600',
    },
  };

  return (
    <View style={styles.container}>
      <RNLineChart
        data={chartData}
        width={screenWidth - 60}
        height={height}
        chartConfig={chartConfig}
        bezier={bezier}
        style={styles.chart}
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLines={true}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        withDots={true}
        withShadow={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  chart: {
    borderRadius: 16,
  },
});
