import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G, Defs, RadialGradient, Stop } from 'react-native-svg';
import { LogiPointColors } from '@/constants/colors';

export interface DonutPieChartData {
  label: string;
  value: number;
  color: string;
}

interface DonutPieChartProps {
  data: DonutPieChartData[];
  size?: number;
  centerValue?: string;
  showLegend?: boolean;
}

export const DonutPieChart = React.memo(function DonutPieChart({ 
  data, 
  size = 200,
  centerValue,
  showLegend = true
}: DonutPieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = size / 2 - 20;
  const innerRadius = radius * 0.5;
  const circumference = 2 * Math.PI * radius;
  
  let currentAngle = -90;
  
  const segments = data.map((item) => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;
    
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
    const rotation = startAngle + 90;
    
    const labelAngle = (startAngle + angle / 2) * (Math.PI / 180);
    const labelRadius = radius + 30;
    const labelX = size / 2 + labelRadius * Math.cos(labelAngle);
    const labelY = size / 2 + labelRadius * Math.sin(labelAngle);
    
    return {
      ...item,
      percentage,
      strokeDasharray,
      rotation,
      labelX,
      labelY,
    };
  });

  return (
    <View style={styles.container}>
      <View style={[styles.chartContainer, { width: size + 100, height: size + 100 }]}>
        <Svg width={size + 100} height={size + 100}>
          <Defs>
            {segments.map((segment, index) => (
              <RadialGradient
                key={`gradient-${index}`}
                id={`gradient-${index}`}
                cx="50%"
                cy="50%"
              >
                <Stop offset="0%" stopColor={segment.color} stopOpacity="1" />
                <Stop offset="100%" stopColor={segment.color} stopOpacity="0.7" />
              </RadialGradient>
            ))}
          </Defs>
          <G>
            {segments.map((segment, index) => (
              <Circle
                key={index}
                cx={(size + 100) / 2}
                cy={(size + 100) / 2}
                r={radius}
                stroke={`url(#gradient-${index})`}
                strokeWidth={innerRadius}
                fill="none"
                strokeDasharray={segment.strokeDasharray}
                strokeDashoffset={0}
                transform={`rotate(${segment.rotation} ${(size + 100) / 2} ${(size + 100) / 2})`}
              />
            ))}
          </G>
        </Svg>
        {centerValue && (
          <View style={styles.centerLabel}>
            <Text style={styles.centerValue}>{centerValue}</Text>
          </View>
        )}
        {segments.map((segment, index) => (
          <View
            key={`label-${index}`}
            style={[
              styles.labelContainer,
              {
                position: 'absolute',
                left: segment.labelX - 30,
                top: segment.labelY - 20,
              },
            ]}
          >
            <View style={styles.labelBadge}>
              <View style={[styles.labelDot, { backgroundColor: segment.color }]} />
              <Text style={styles.labelPercentage}>{segment.percentage.toFixed(0)}%</Text>
            </View>
            <Text style={styles.labelText} numberOfLines={2}>
              {segment.label}
            </Text>
          </View>
        ))}
      </View>
      
      {showLegend && (
        <View style={styles.legend}>
          {data.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <Text style={styles.legendLabel}>{item.label}</Text>
              <Text style={styles.legendValue}>{item.value.toLocaleString()}</Text>
            </View>
          ))}
        </View>
      )}
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
    fontSize: 28,
    fontWeight: '700' as const,
    color: LogiPointColors.midnight,
  },
  labelContainer: {
    alignItems: 'center',
    gap: 4,
    width: 60,
  },
  labelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: LogiPointColors.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  labelDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  labelPercentage: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: LogiPointColors.midnight,
  },
  labelText: {
    fontSize: 10,
    color: LogiPointColors.gray[600],
    textAlign: 'center',
    fontWeight: '500' as const,
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
