import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, PanResponder, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LogOut, TrendingUp, AlertCircle, Building2, Truck as TruckIcon, Warehouse as WarehouseIcon, Tag } from 'lucide-react-native';
import { LogiPointColors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useState, useRef } from 'react';

type ActionItem = {
  id: string;
  icon?: any;
  iconUri?: string;
  color: string;
  label: string;
  route: string;
};

export default function HomeScreen() {
  const { logout } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [actions, setActions] = useState<ActionItem[]>([
    { id: 'po', iconUri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/47wr6l15ryvio7ew1kip2', color: '#87CEEB', label: 'PO', route: '/(tabs)/po' },
    { id: 'risks', icon: AlertCircle, color: LogiPointColors.accent, label: 'Risk Updates', route: '/(tabs)/risks' },
    { id: 'realestate', icon: Building2, color: LogiPointColors.warning, label: 'Real Estate', route: '/(tabs)/contracts' },
    { id: 'logistics', icon: TruckIcon, color: LogiPointColors.chart.blue, label: 'Transportation', route: '/(tabs)/logistics' },
    { id: 'warehouse', icon: WarehouseIcon, color: LogiPointColors.chart.green, label: 'Warehouse', route: '/(tabs)/warehouse' },
    { id: 'vas', icon: Tag, color: LogiPointColors.chart.purple, label: 'VAS', route: '/(tabs)/vas' },
    { id: 'sales', icon: TrendingUp, color: LogiPointColors.primary, label: 'Sales Report', route: '/(tabs)/sales' },
  ]);

  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const swapItems = (fromIndex: number, toIndex: number) => {
    const newActions = [...actions];
    const [removed] = newActions.splice(fromIndex, 1);
    newActions.splice(toIndex, 0, removed);
    setActions(newActions);
  };

  return (
    <View style={styles.container}>
        <View style={styles.backgroundLogo}>
          <Image 
            source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/4i9f5ip8s1j9hyoj71h9q' }}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <View style={[styles.topBar, { paddingTop: insets.top + 12 }]}>
          <View style={styles.topBarContent}>
            <View style={styles.spacer} />
            <Text style={styles.dashboardTitle}>Logipoint Management Reporting Dashboard</Text>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <LogOut size={20} color={LogiPointColors.white} />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <View style={styles.quickActions}>
            <View style={styles.actionGrid}>
              {actions.slice(0, -1).map((action, index) => (
                <DraggableActionCard
                  key={action.id}
                  action={action}
                  index={index}
                  onPress={() => router.push(action.route as any)}
                  onDragStart={() => setDraggingIndex(index)}
                  onDragEnd={() => setDraggingIndex(null)}
                  onSwap={swapItems}
                  isDragging={draggingIndex === index}
                />
              ))}
            </View>
          </View>
          <View style={styles.bigBottomBox}>
            <TouchableOpacity
              style={styles.bigActionCard}
              onPress={() => router.push(actions[actions.length - 1].route as any)}
              activeOpacity={0.7}
            >
              {actions[actions.length - 1].iconUri ? (
                <Image 
                  source={{ uri: actions[actions.length - 1].iconUri }}
                  style={{ width: 32, height: 32, tintColor: actions[actions.length - 1].color }}
                  resizeMode="contain"
                />
              ) : actions[actions.length - 1].icon ? (
                (() => {
                  const IconComponent = actions[actions.length - 1].icon;
                  return <IconComponent size={32} color={actions[actions.length - 1].color} />;
                })()
              ) : null}
              <Text style={styles.bigActionText}>{actions[actions.length - 1].label}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LogiPointColors.gray[50],
  },
  backgroundLogo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,
  },
  logoImage: {
    width: 500,
    height: 500,
    opacity: 0.06,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: LogiPointColors.midnight,
  },
  topBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  spacer: {
    width: 80,
  },
  dashboardTitle: {
    flex: 1,
    color: LogiPointColors.white,
    fontSize: 16,
    fontWeight: '700' as const,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  logoutButton: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoutText: {
    color: LogiPointColors.white,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  quickActions: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: LogiPointColors.midnight,
    marginBottom: 12,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: LogiPointColors.midnight,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: LogiPointColors.gray[600],
    marginBottom: 12,
    fontStyle: 'italic' as const,
  },
  draggingCard: {
    opacity: 0.7,
    transform: [{ scale: 1.05 }],
  },
  bigBottomBox: {
    marginTop: 24,
  },
  bigActionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  bigActionText: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: LogiPointColors.midnight,
    textAlign: 'center',
  },
});

type DraggableActionCardProps = {
  action: ActionItem;
  index: number;
  onPress: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onSwap: (fromIndex: number, toIndex: number) => void;
  isDragging: boolean;
};

function DraggableActionCard({ action, index, onPress, onDragStart, onDragEnd, onSwap, isDragging }: DraggableActionCardProps) {
  const pan = useRef(new Animated.ValueXY()).current;
  const [isLongPress, setIsLongPress] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cardLayout = useRef({ x: 0, y: 0, width: 0, height: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: () => isLongPress,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gestureState) => {
        pan.flattenOffset();
        const movedX = gestureState.dx;
        const movedY = gestureState.dy;
        
        const cardWidth = cardLayout.current.width + 12;
        const cardHeight = cardLayout.current.height + 12;
        
        let newIndex = index;
        const horizontalMove = Math.round(movedX / cardWidth);
        const verticalMove = Math.round(movedY / cardHeight);
        
        newIndex += horizontalMove + (verticalMove * 2);
        
        if (newIndex !== index && newIndex >= 0 && newIndex < 7) {
          onSwap(index, newIndex);
        }
        
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
        
        setIsLongPress(false);
        onDragEnd();
      },
    })
  ).current;

  const handlePressIn = () => {
    longPressTimer.current = setTimeout(() => {
      setIsLongPress(true);
      onDragStart();
    }, 500);
  };

  const handlePressOut = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    if (!isLongPress) {
      onPress();
    }
  };

  const Icon = action.icon;

  return (
    <Animated.View
      style={[
        styles.actionCard,
        isDragging && styles.draggingCard,
        {
          transform: pan.getTranslateTransform(),
        },
      ]}
      onLayout={(e) => {
        cardLayout.current = e.nativeEvent.layout;
      }}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity
        style={{ alignItems: 'center', gap: 8, width: '100%' }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.7}
      >
        {action.iconUri ? (
          <Image 
            source={{ uri: action.iconUri }}
            style={{ width: 24, height: 24, tintColor: action.color }}
            resizeMode="contain"
          />
        ) : Icon ? (
          <Icon size={24} color={action.color} />
        ) : null}
        <Text style={styles.actionText}>{action.label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}