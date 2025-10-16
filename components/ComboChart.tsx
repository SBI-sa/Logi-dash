import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LogiPointColors } from '@/constants/colors';
import Svg, { Rect, Line, Circle, Text as SvgText } from 'react-native-svg';

interface ComboChartData {
  label: string;
  actual: number;
  budget: number;
  lastYear?: number;
  barColor?: string;
  lineColor?: string;
  lastYearColor?: string;
}

interface ComboChartProps {
  data: ComboChartData[];
  height?: number;
}

export function ComboChart({ data, height = 300 }: ComboChartProps) {
  const chartHeight = height - 60;
  const chartWidth = Math.max(data.length * 80, 300);
  const barWidth = 20;
  const spacing = 80;

  const rawMax = Math.max(
    ...data.map(d => Math.max(d.actual, d.budget, d.lastYear || 0))
  );
  const maxValue = rawMax > 0 ? rawMax * 1.15 : 1;

  const getBarHeight = (value: number) => {
    return (value / maxValue) * chartHeight;
  };

  const getYPosition = (value: number) => {
    return chartHeight - getBarHeight(value);
  };

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={height}>
          {data.map((item, index) => {
            const x = index * spacing + spacing / 2;
            const actualBarHeight = getBarHeight(item.actual);
            const actualBarY = getYPosition(item.actual);
            const lineY = getYPosition(item.budget);
            
            const hasLastYear = item.lastYear !== undefined && item.lastYear > 0;
            const lastYearBarHeight = hasLastYear ? getBarHeight(item.lastYear as number) : 0;
            const lastYearBarY = hasLastYear ? getYPosition(item.lastYear as number) : 0;
            
            const barOffset = hasLastYear ? barWidth + 2 : 0;

            return (
              <React.Fragment key={index}>
                {hasLastYear && (
                  <>
                    <Rect
                      x={x - barOffset}
                      y={lastYearBarY}
                      width={barWidth}
                      height={lastYearBarHeight}
                      fill={item.lastYearColor || LogiPointColors.beige}
                      rx={4}
                    />
                    <SvgText
                      x={x - barOffset + barWidth / 2}
                      y={lastYearBarY - 5}
                      fontSize="9"
                      fill={LogiPointColors.gray[700]}
                      textAnchor="middle"
                      fontWeight="600"
                    >
                      {formatValue(item.lastYear as number)}
                    </SvgText>
                  </>
                )}
                
                <Rect
                  x={x - (hasLastYear ? 0 : barWidth / 2)}
                  y={actualBarY}
                  width={barWidth}
                  height={actualBarHeight}
                  fill={item.barColor || LogiPointColors.primary}
                  rx={4}
                />
                
                <SvgText
                  x={x + (hasLastYear ? barWidth / 2 : 0)}
                  y={actualBarY - 5}
                  fontSize="9"
                  fill={LogiPointColors.gray[700]}
                  textAnchor="middle"
                  fontWeight="600"
                >
                  {formatValue(item.actual)}
                </SvgText>

                <Circle
                  cx={x + (hasLastYear ? barWidth / 2 : 0)}
                  cy={lineY}
                  r={4}
                  fill={item.lineColor || LogiPointColors.accent}
                  stroke={LogiPointColors.white}
                  strokeWidth={2}
                />

                {index < data.length - 1 && (
                  <Line
                    x1={x + (hasLastYear ? barWidth / 2 : 0)}
                    y1={lineY}
                    x2={(index + 1) * spacing + spacing / 2 + (data[index + 1].lastYear ? barWidth / 2 : 0)}
                    y2={getYPosition(data[index + 1].budget)}
                    stroke={item.lineColor || LogiPointColors.accent}
                    strokeWidth={2}
                  />
                )}

                <SvgText
                  x={x}
                  y={height - 35}
                  fontSize="11"
                  fill={LogiPointColors.gray[600]}
                  textAnchor="middle"
                  fontWeight="500"
                >
                  {item.label}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  chartContainer: {
    overflow: 'scroll',
  },
});
