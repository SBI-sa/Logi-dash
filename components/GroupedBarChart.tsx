import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LogiPointColors } from '@/constants/colors';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';

export interface GroupedBarData {
  label: string;
  values: {
    label: string;
    value: number;
    color: string;
  }[];
}

interface GroupedBarChartProps {
  data: GroupedBarData[];
  maxValue?: number;
  height?: number;
}

export const GroupedBarChart = React.memo(function GroupedBarChart({ data, maxValue, height = 300 }: GroupedBarChartProps) {
  const max = maxValue || Math.max(...data.flatMap(d => d.values.map(v => v.value)));
  const chartHeight = height - 60;
  const chartWidth = Math.max(data.length * 100, 300);
  const barWidth = 20;
  const spacing = 100;

  const getBarHeight = (value: number) => {
    return (value / (max * 1.15)) * chartHeight;
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
            const numBars = item.values.length;
            const totalBarsWidth = numBars * barWidth + (numBars - 1) * 2;
            const startX = x - totalBarsWidth / 2;

            return (
              <React.Fragment key={index}>
                {item.values.map((bar, barIndex) => {
                  const barX = startX + barIndex * (barWidth + 2);
                  const barHeight = getBarHeight(bar.value);
                  const barY = getYPosition(bar.value);

                  return (
                    <React.Fragment key={barIndex}>
                      <Rect
                        x={barX}
                        y={barY}
                        width={barWidth}
                        height={barHeight}
                        fill={bar.color}
                        rx={4}
                      />
                      <SvgText
                        x={barX + barWidth / 2}
                        y={barY - 5}
                        fontSize="7"
                        fill={LogiPointColors.gray[700]}
                        textAnchor="middle"
                        fontWeight="600"
                      >
                        {formatValue(bar.value)}
                      </SvgText>
                      <SvgText
                        x={barX + barWidth / 2}
                        y={height - 20}
                        fontSize="7"
                        fill={LogiPointColors.gray[500]}
                        textAnchor="middle"
                        fontWeight="500"
                      >
                        {bar.label}
                      </SvgText>
                    </React.Fragment>
                  );
                })}
                <SvgText
                  x={x}
                  y={height - 5}
                  fontSize="11"
                  fill={LogiPointColors.gray[600]}
                  textAnchor="middle"
                  fontWeight="600"
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
});

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  chartContainer: {
    overflow: 'scroll',
  },
});
