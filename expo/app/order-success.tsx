import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Animated,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Check, Home, Clock, ChefHat } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OrderSuccessScreen() {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim, pulseAnim, rotateAnim, scaleAnim, slideAnim]);

  const checkRotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["-180deg", "0deg"],
  });

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.successIcon, { transform: [{ scale: scaleAnim }] }]}>
        <LinearGradient
          colors={["#22c55e", "#16a34a"]}
          style={styles.iconGradient}
        >
          <Animated.View style={{ transform: [{ rotate: checkRotation }] }}>
            <Check size={50} color="#fff" strokeWidth={4} />
          </Animated.View>
        </LinearGradient>
        <Animated.View
          style={[
            styles.pulseRing,
            {
              transform: [{ scale: pulseAnim }],
              opacity: pulseAnim.interpolate({
                inputRange: [1, 1.1],
                outputRange: [0.5, 0],
              }),
            },
          ]}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.title}>Замовлення прийнято!</Text>
        <Text style={styles.subtitle}>
          Дякуємо! Ваше замовлення передано на кухню
        </Text>

        <View style={styles.orderInfo}>
          <View style={styles.infoItem}>
            <Clock size={20} color="#f7931e" />
            <Text style={styles.infoText}>Час доставки: 35-45 хв</Text>
          </View>
          <View style={styles.infoItem}>
            <ChefHat size={20} color="#f7931e" />
            <Text style={styles.infoText}>Готується з любов'ю</Text>
          </View>
        </View>

        <View style={styles.orderNumber}>
          <Text style={styles.orderLabel}>Номер замовлення</Text>
          <Text style={styles.orderValue}>#KEB-2847</Text>
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.footer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity onPress={() => router.push("/")}>
          <LinearGradient
            colors={["#ff6b35", "#f7931e"]}
            style={styles.homeButton}
          >
            <Home size={20} color="#fff" />
            <Text style={styles.homeButtonText}>НА ГОЛОВНУ</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.decorativeDots}>
        <View style={styles.dot1} />
        <View style={styles.dot2} />
        <View style={styles.dot3} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  successIcon: {
    marginBottom: 40,
    position: "relative",
  },
  iconGradient: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#22c55e",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 10,
  },
  pulseRing: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: "#22c55e",
  },
  content: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  orderInfo: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 30,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  infoText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
  orderNumber: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(255, 107, 53, 0.15)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 53, 0.3)",
  },
  orderLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 4,
  },
  orderValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#ff6b35",
    letterSpacing: 2,
  },
  footer: {
    width: "100%",
    position: "absolute",
    bottom: 40,
    paddingHorizontal: 30,
  },
  homeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 30,
    gap: 10,
  },
  homeButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 2,
  },
  decorativeDots: {
    position: "absolute",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
  },
  dot1: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(34, 197, 94, 0.1)",
    top: "10%",
    left: "5%",
  },
  dot2: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255, 107, 53, 0.08)",
    bottom: "20%",
    right: "-5%",
  },
  dot3: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(247, 147, 30, 0.1)",
    top: "40%",
    right: "10%",
  },
});
