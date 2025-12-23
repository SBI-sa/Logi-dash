import React, { useMemo, useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import Alert from '@blazejkustra/react-native-alert';
import { Pencil, LogOut } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { LogiPointColors } from '@/constants/colors';
import { TimestampEditModal } from './TimestampEditModal';

const POHeaderRight: React.FC = React.memo(() => {
  const router = useRouter();
  const { getLastUpdated, updateCardTimestamp } = useData();
  const { isAdmin, logout, isLimitedViewer } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const lastUpdatedKey = 'po';
  
  const lastUpdated = useMemo(() => getLastUpdated(lastUpdatedKey), [getLastUpdated]);
  
  const formattedDate = useMemo(() => {
    if (!lastUpdated) return '—';
    
    try {
      const date = new Date(lastUpdated);
      if (isNaN(date.getTime())) return '—';
      
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric'
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

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
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
        {isLimitedViewer && (
          <TouchableOpacity
            onPress={handleLogout}
            style={styles.logoutButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <LogOut size={16} color={LogiPointColors.white} />
          </TouchableOpacity>
        )}
      </View>

      {isAdmin && (
        <TimestampEditModal
          visible={showEditModal}
          timestamp={lastUpdated}
          title="Edit PO Last Updated"
          onSave={handleSaveTimestamp}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
});

POHeaderRight.displayName = 'POHeaderRight';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    gap: 8,
  },
  lastUpdatedText: {
    fontSize: 12,
    color: LogiPointColors.white,
    opacity: 0.9,
  },
  editButton: {
    padding: 4,
    opacity: 0.8,
  },
  logoutButton: {
    padding: 4,
    opacity: 0.8,
  },
});

export default POHeaderRight;
