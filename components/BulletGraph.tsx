import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LogiPointColors } from '@/constants/colors';

interface BulletGraphProps {
  actual: number;
  target: number;
  color?: string;
  maxValue?: number;
}

export const BulletGraph = React.memo(function BulletGraph({ 
  actual, 
  target, 
  color = LogiPointColors.primary,
  maxValue
}: BulletGraphProps) {
  const calculatedMax = Math.max(actual, target) * 1.2;
  const max = maxValue || (calculatedMax > 0 ? calculatedMax : 1);
  const actualPercentage = Math.min((actual / max) * 100, 100);
  const targetPercentage = Math.min((target / max) * 100, 100);
  const isOverTarget = actual >= target;

  return (
    <View style={styles.container}>
      <View style={styles.graphContainer}>
        <View style={[styles.targetBar, { width: `${targetPercentage}%` }]} />
        <View 
          style={[
            styles.actualBar, 
            { 
              width: `${actualPercentage}%`,
              backgroundColor: isOverTarget ? LogiPointColors.chart.green : LogiPointColors.accent
            }
          ]} 
        />
        <View 
          style={[
            styles.targetMarker, 
            { left: `${targetPercentage}%` }
          ]} 
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 12,
  },
  graphContainer: {
    height: 16,
    position: 'relative',
    backgroundColor: LogiPointColors.gray[100],
    borderRadius: 8,
    overflow: 'hidden',
  },
  targetBar: {
    position: 'absolute',
    height: '100%',
    backgroundColor: LogiPointColors.gray[200],
    borderRadius: 8,
  },
  actualBar: {
    position: 'absolute',
    height: '100%',
    borderRadius: 8,
  },
  targetMarker: {
    position: 'absolute',
    width: 3,
    height: '100%',
    backgroundColor: LogiPointColors.midnight,
    zIndex: 10,
  },
});
