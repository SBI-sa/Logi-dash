import { View, Text, StyleSheet } from 'react-native';
import { LogiPointColors } from '@/constants/colors';
import { useData } from '@/contexts/DataContext';

interface PageHeaderProps {
  title: string;
  lastUpdatedKey?: string;
}

export default function PageHeader({ title, lastUpdatedKey }: PageHeaderProps) {
  const { getLastUpdated } = useData();
  const lastUpdated = lastUpdatedKey ? getLastUpdated(lastUpdatedKey) : '';

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {lastUpdated && (
        <Text style={styles.lastUpdated}>Last Updated: {formatDate(lastUpdated)}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: LogiPointColors.midnight,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: LogiPointColors.primary,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: LogiPointColors.white,
  },
  lastUpdated: {
    fontSize: 14,
    color: LogiPointColors.white,
    opacity: 0.9,
  },
});
