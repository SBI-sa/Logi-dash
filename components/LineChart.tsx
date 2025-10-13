import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { LogiPointColors } from '@/constants/colors';

interface LineChartProps {
  data: {
    label: string;
    value: number;
    color: string;
  }[];
  maxValue?: number;
  thresholds?: {
    green: number;
    yellow: number;
  };
}

export function LineChart({ data, maxValue, thresholds }: LineChartProps) {
  console.log('LineChart data:', data);
  
  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>No data available</Text>
      </View>
    );
  }
  
  const max = maxValue || Math.max(...data.map(d => d.value));
  const chartHeight = 200;
  const chartWidth = 600;
  const padding = 40;
  
  const points = data.map((item, index) => {
    const x = padding + (index * (chartWidth - padding * 2)) / (data.length - 1);
    const y = chartHeight - padding - ((item.value / max) * (chartHeight - padding * 2));
    return { x, y, ...item };
  });

  const pathData = points.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ');

  const renderChart = () => {

    return (
      <View style={styles.chartContainer}>
        <View style={{ width: chartWidth, height: chartHeight }}>
          {[0, 25, 50, 75, 100].map((tick) => {
            const y = chartHeight - padding - ((tick / 100) * (chartHeight - padding * 2));
            return (
              <View key={tick} style={{ position: 'absolute', left: 0, top: y, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[styles.yAxisLabel, { width: padding - 10 }]}>{tick}%</Text>
                <View style={{ width: chartWidth - padding, height: 1, backgroundColor: LogiPointColors.gray[200] }} />
              </View>
            );
          })}
          
          <Svg width={chartWidth} height={chartHeight} style={{ position: 'absolute' }}>
            <Defs>
              <LinearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor={LogiPointColors.primary} stopOpacity={0.3} />
                <Stop offset="100%" stopColor={LogiPointColors.primary} stopOpacity={0} />
              </LinearGradient>
            </Defs>

            <Path
              d={`${pathData} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`}
              fill="url(#lineGradient)"
            />

            <Path
              d={pathData}
              fill="none"
              stroke={LogiPointColors.primary}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {points.map((point, index) => (
              <Circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="5"
                fill={point.color}
                stroke={LogiPointColors.white}
                strokeWidth="2"
              />
            ))}
          </Svg>

          {points.map((point, index) => (
            <Text
              key={index}
              style={[
                styles.xAxisLabel,
                {
                  position: 'absolute',
                  left: point.x - 15,
                  top: chartHeight - padding + 5,
                  width: 30,
                }
              ]}
            >
              {point.label}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderChart()}

      {thresholds && (
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: LogiPointColors.success }]} />
            <Text style={styles.legendText}>≥{thresholds.green}% (On Target)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: LogiPointColors.warning }]} />
            <Text style={styles.legendText}>≥{thresholds.yellow}% (Warning)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: LogiPointColors.error }]} />
            <Text style={styles.legendText}>&lt;{thresholds.yellow}% (Critical)</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  chartContainer: {
    marginVertical: 8,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: LogiPointColors.gray[600],
    fontWeight: '500' as const,
  },
  yAxisLabel: {
    fontSize: 10,
    color: LogiPointColors.gray[500],
    textAlign: 'right' as const,
  },
  xAxisLabel: {
    fontSize: 10,
    color: LogiPointColors.gray[600],
    textAlign: 'center' as const,
  },
  noDataText: {
    fontSize: 14,
    color: LogiPointColors.gray[500],
    textAlign: 'center' as const,
    padding: 20,
  },
});
