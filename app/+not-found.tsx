import React, { useMemo } from "react";
import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { LogiPointColors } from "@/constants/colors";

export default function NotFoundScreen() {
  const screenOptions = useMemo(() => ({ title: "Page Not Found" }), []);

  return (
    <>
      <Stack.Screen options={screenOptions} />
      <View style={styles.container}>
        <Text style={styles.title}>This page doesn&apos;t exist.</Text>

        <Link href="/(tabs)" style={styles.link}>
          <Text style={styles.linkText}>Go to Dashboard</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: LogiPointColors.gray[50],
  },
  title: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: LogiPointColors.midnight,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: LogiPointColors.primary,
    fontWeight: "600" as const,
  },
});
