import React, { useMemo } from 'react';
import { Text, StyleSheet } from 'react-native';
import { useData } from '@/contexts/DataContext';
import { LogiPointColors } from '@/constants/colors';

interface LastUpdatedHeaderRightProps {
  lastUpdatedKey: string;
}

const LastUpdatedHeaderRight: React.FC<LastUpdatedHeaderRightProps> = React.memo(({ lastUpdatedKey }) => {
  const { getLastUpdated } = useData();
  
  const lastUpdated = useMemo(() => getLastUpdated(lastUpdatedKey), [getLastUpdated, lastUpdatedKey]);
  
  const formattedDate = useMemo(() => {
    if (!lastUpdated) return '—';
    
    try {
      const date = new Date(lastUpdated);
      if (isNaN(date.getTime())) return '—';
      
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return '—';
    }
  }, [lastUpdated]);

  return (
    <Text style={styles.lastUpdatedText}>
      Last Updated: {formattedDate}
    </Text>
  );
});

LastUpdatedHeaderRight.displayName = 'LastUpdatedHeaderRight';

const styles = StyleSheet.create({
  lastUpdatedText: {
    fontSize: 12,
    color: LogiPointColors.white,
    marginRight: 16,
    opacity: 0.9,
  },
});

export default LastUpdatedHeaderRight;
