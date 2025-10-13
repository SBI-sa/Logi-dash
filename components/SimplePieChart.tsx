import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { LogiPointColors } from '@/constants/colors';

export interface PieChartData {
  label: string;
  value: number;
  color: string;
}

interface SimplePieChartProps {
  data: PieChartData[];
  size?: number;
  centerLabel?: string;
  centerValue?: string;
}

export const SimplePieChart = React.memo(function SimplePieChart({ 
  data, 
  size = 160,
  centerLabel,
  centerValue 
}: SimplePieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  
  let currentAngle = -90;
  
  const segments = data.map((item) => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;
    
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
    const rotation = startAngle + 90;
    
    return {
      ...item,
      percentage,
      strokeDasharray,
      rotation,
    };
  });

  return (
    <View style={styles.container}>
      <View style={[styles.chartContainer, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          <G>
            {segments.map((segment, index) => (
              <Circle
                key={index}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={segment.color}
                strokeWidth={20}
                fill="none"
                strokeDasharray={segment.strokeDasharray}
                strokeDashoffset={0}
                transform={`rotate(${segment.rotation} ${size / 2} ${size / 2})`}
                strokeLinecap="round"
              />
            ))}
          </G>
        </Svg>
        {(centerLabel || centerValue) && (
          <View style={styles.centerLabel}>
            {centerValue && <Text style={styles.centerValue}>{centerValue}</Text>}
            {centerLabel && <Text style={styles.centerText}>{centerLabel}</Text>}
          </View>
        )}
      </View>
      
      <View style={styles.legend}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={styles.legendLabel}>{item.label}</Text>
            <Text style={styles.legendValue}>{item.value.toLocaleString()}</Text>
          </View>
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 20,
  },
  chartContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerLabel: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: LogiPointColors.midnight,
  },
  centerText: {
    fontSize: 12,
    color: LogiPointColors.gray[600],
    marginTop: 4,
  },
  legend: {
    width: '100%',
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  legendLabel: {
    flex: 1,
    fontSize: 13,
    color: LogiPointColors.gray[700],
    fontWeight: '500' as const,
  },
  legendValue: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: LogiPointColors.midnight,
  },
});
