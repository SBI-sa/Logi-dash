import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Line, G } from 'react-native-svg';
import { LogiPointColors } from '@/constants/colors';

interface SpeedometerChartProps {
  current: number;
  target: number;
  label: string;
  color?: string;
}

export const SpeedometerChart = React.memo(function SpeedometerChart({ 
  current, 
  target, 
  label, 
  color = LogiPointColors.primary 
}: SpeedometerChartProps) {
  const percentage = Math.min((current / target) * 100, 100);
  
  const size = 160;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2 - 4;
  const centerX = size / 2;
  const centerY = size / 2 + 10;
  
  const startAngle = 180;
  const endAngle = 360;
  const totalAngle = endAngle - startAngle;
  
  const currentAngle = startAngle + (totalAngle * percentage) / 100;
  
  const polarToCartesian = (angle: number, r: number) => {
    const angleInRadians = (angle * Math.PI) / 180;
    return {
      x: centerX + r * Math.cos(angleInRadians),
      y: centerY + r * Math.sin(angleInRadians),
    };
  };
  
  const describeArc = (startAngle: number, endAngle: number, r: number) => {
    const start = polarToCartesian(startAngle, r);
    const end = polarToCartesian(endAngle, r);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    
    return [
      'M', start.x, start.y,
      'A', r, r, 0, largeArcFlag, 1, end.x, end.y,
    ].join(' ');
  };
  
  const backgroundPath = describeArc(startAngle, endAngle, radius);
  const progressPath = describeArc(startAngle, currentAngle, radius);
  
  const needleLength = radius - 8;
  const needleEnd = polarToCartesian(currentAngle, needleLength);
  
  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <Svg width={size} height={size * 0.65} viewBox={`0 0 ${size} ${size * 0.65}`}>
          <G>
            <Path
              d={backgroundPath}
              fill="none"
              stroke={LogiPointColors.gray[200]}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            
            <Path
              d={progressPath}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            
            <Line
              x1={centerX}
              y1={centerY}
              x2={needleEnd.x}
              y2={needleEnd.y}
              stroke={LogiPointColors.midnight}
              strokeWidth={2.5}
              strokeLinecap="round"
            />
            
            <Circle
              cx={centerX}
              cy={centerY}
              r={5}
              fill={LogiPointColors.midnight}
            />
          </G>
        </Svg>
        
        <View style={styles.labelsContainer}>
          <Text style={styles.minLabel}>0</Text>
          <Text style={styles.maxLabel}>${(target / 1000000).toFixed(2)}M</Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: -12,
    paddingHorizontal: 8,
  },
  minLabel: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: LogiPointColors.gray[500],
  },
  maxLabel: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: LogiPointColors.gray[500],
  },
});
