import { Tabs, Redirect } from "expo-router";
import { Home, DollarSign, AlertTriangle, Building2, Truck, Warehouse, Tag } from "lucide-react-native";
import React from "react";
import { LogiPointColors } from "@/constants/colors";
import { useAuth } from "@/contexts/AuthContext";
import { ActivityIndicator, View, Image } from "react-native";

export default function TabLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={LogiPointColors.primary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: LogiPointColors.primary,
        tabBarInactiveTintColor: LogiPointColors.beige,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: LogiPointColors.midnight,
          borderTopColor: LogiPointColors.primary,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600' as const,
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="sales"
        options={{
          title: "Sales",
          tabBarIcon: ({ color }) => <DollarSign size={22} color={color} />,
          headerShown: true,
          headerStyle: {
            backgroundColor: LogiPointColors.midnight,
          },
          headerTintColor: LogiPointColors.white,
          headerTitleStyle: {
            fontWeight: '700' as const,
          },
          headerTitle: 'Sales Revenue',
        }}
      />
      <Tabs.Screen
        name="risks"
        options={{
          title: "Risk Updates",
          tabBarIcon: ({ color }) => <AlertTriangle size={22} color={color} />,
          headerShown: true,
          headerStyle: {
            backgroundColor: LogiPointColors.midnight,
          },
          headerTintColor: LogiPointColors.white,
          headerTitleStyle: {
            fontWeight: '700' as const,
          },
        }}
      />
      <Tabs.Screen
        name="logistics"
        options={{
          title: "Transportation",
          tabBarIcon: ({ color }) => <Truck size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="warehouse"
        options={{
          title: "Warehouse",
          tabBarIcon: ({ color }) => <Warehouse size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="vas"
        options={{
          title: "VAS",
          tabBarIcon: ({ color }) => <Tag size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="po"
        options={{
          title: "PO",
          tabBarIcon: ({ color }) => (
            <Image 
              source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/47wr6l15ryvio7ew1kip2' }}
              style={{ width: 22, height: 22, tintColor: color }}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tabs>
  );
}
