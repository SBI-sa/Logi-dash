import React, { useMemo, useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { Pencil } from 'lucide-react-native';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { LogiPointColors } from '@/constants/colors';
import { TimestampEditModal } from './TimestampEditModal';

interface LastUpdatedHeaderRightProps {
  lastUpdatedKey: string;
}

const LastUpdatedHeaderRight: React.FC<LastUpdatedHeaderRightProps> = React.memo(({ lastUpdatedKey }) => {
  const { getLastUpdated, updateCardTimestamp } = useData();
  const { isAdmin } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  
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

  const handleSaveTimestamp = async (newTimestamp: string) => {
    try {
      await updateCardTimestamp(lastUpdatedKey, newTimestamp);
      setShowEditModal(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert(
        'Update Failed',
        `Could not update timestamp: ${errorMessage}. The previous value has been restored.`
      );
    }
  };

  const getModalTitle = () => {
    const titleMap: Record<string, string> = {
      sales: 'Edit Sales Last Updated',
      risks: 'Edit Risks Last Updated',
      real_estate: 'Edit Real Estate Last Updated',
      logistics: 'Edit Logistics Last Updated',
      warehouse: 'Edit Warehouse Last Updated',
      vas: 'Edit VAS Last Updated',
      po: 'Edit PO Last Updated',
    };
    return titleMap[lastUpdatedKey] || 'Edit Last Updated';
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.lastUpdatedText}>
          Last Updated: {formattedDate}
        </Text>
        {isAdmin && (
          <TouchableOpacity
            onPress={() => setShowEditModal(true)}
            style={styles.editButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Pencil size={14} color={LogiPointColors.white} />
          </TouchableOpacity>
        )}
      </View>

      {isAdmin && (
        <TimestampEditModal
          visible={showEditModal}
          timestamp={lastUpdated}
          title={getModalTitle()}
          onSave={handleSaveTimestamp}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
});

LastUpdatedHeaderRight.displayName = 'LastUpdatedHeaderRight';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  lastUpdatedText: {
    fontSize: 12,
    color: LogiPointColors.white,
    opacity: 0.9,
  },
  editButton: {
    marginLeft: 8,
    padding: 4,
    opacity: 0.8,
  },
});

export default LastUpdatedHeaderRight;
