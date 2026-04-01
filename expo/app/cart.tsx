import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Animated,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Trash2, Plus, Minus, MapPin } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const INITIAL_CART: CartItem[] = [
  { id: "1", name: "Донер Кебаб", price: 120, quantity: 2 },
  { id: "2", name: "Люля-Кебаб", price: 165, quantity: 1 },
];

export default function CartScreen() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>(INITIAL_CART);
  const slideAnim = useRef(new Animated.Value(100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 300 ? 0 : 50;
  const total = subtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.navHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>КОШИК</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.emptyContainer}>
          <Animated.View style={{ transform: [{ scale: fadeAnim }] }}>
            <Text style={styles.emptyEmoji}>🛒</Text>
          </Animated.View>
          <Text style={styles.emptyTitle}>Кошик порожній</Text>
          <Text style={styles.emptyText}>Додайте смачні страви з меню</Text>
          <TouchableOpacity onPress={() => router.push("/menu")}>
            <LinearGradient
              colors={["#ff6b35", "#f7931e"]}
              style={styles.emptyButton}
            >
              <Text style={styles.emptyButtonText}>ДО МЕНЮ</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>КОШИК</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View style={[styles.addressCard, { opacity: fadeAnim }]}>
          <View style={[StyleSheet.absoluteFill, { borderRadius: 16, overflow: "hidden" }]}>
            <LinearGradient
              colors={["rgba(255, 107, 53, 0.2)", "rgba(247, 147, 30, 0.1)"]}
              style={StyleSheet.absoluteFill}
            />
          </View>
          <View style={styles.addressIcon}>
            <MapPin size={20} color="#ff6b35" />
          </View>
          <View style={styles.addressInfo}>
            <Text style={styles.addressLabel}>Адреса доставки</Text>
            <Text style={styles.addressText}>вул. Хрещатик, 15, Київ</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.changeText}>Змінити</Text>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.sectionTitle}>Ваше замовлення</Text>

        {cart.map((item, index) => (
          <CartItemCard
            key={item.id}
            item={item}
            index={index}
            onUpdateQuantity={(delta) => updateQuantity(item.id, delta)}
            onRemove={() => removeItem(item.id)}
          />
        ))}

        <Animated.View style={[styles.summaryCard, { opacity: fadeAnim }]}>
          <View style={[StyleSheet.absoluteFill, { borderRadius: 16, overflow: "hidden" }]}>
            <LinearGradient
              colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.03)"]}
              style={StyleSheet.absoluteFill}
            />
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Сума</Text>
            <Text style={styles.summaryValue}>{subtotal} ₴</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Доставка</Text>
            <Text style={[styles.summaryValue, deliveryFee === 0 && styles.freeDelivery]}>
              {deliveryFee === 0 ? "Безкоштовно" : `${deliveryFee} ₴`}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Всього</Text>
            <Text style={styles.totalValue}>{total} ₴</Text>
          </View>
        </Animated.View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <Animated.View
        style={[
          styles.bottomBar,
          {
            transform: [{ translateY: slideAnim }],
            opacity: fadeAnim,
          },
        ]}
      >
        <View style={styles.bottomTotal}>
          <Text style={styles.bottomTotalLabel}>Всього:</Text>
          <Text style={styles.bottomTotalValue}>{total} ₴</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/order-success")}>
          <LinearGradient
            colors={["#ff6b35", "#f7931e"]}
            style={styles.orderButton}
          >
            <Text style={styles.orderButtonText}>ОФОРМИТИ ЗАМОВЛЕННЯ</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

interface CartItemCardProps {
  item: CartItem;
  index: number;
  onUpdateQuantity: (delta: number) => void;
  onRemove: () => void;
}

function CartItemCard({ item, index, onUpdateQuantity, onRemove }: CartItemCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, index]);

  return (
    <Animated.View
      style={[
        styles.itemCard,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      <View style={[StyleSheet.absoluteFill, { borderRadius: 16, overflow: "hidden" }]}>
        <LinearGradient
          colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
          style={StyleSheet.absoluteFill}
        />
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>{item.price} ₴</Text>
      </View>
      <View style={styles.itemActions}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => onUpdateQuantity(-1)} style={styles.quantityButton}>
            <Minus size={16} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => onUpdateQuantity(1)} style={styles.quantityButton}>
            <Plus size={16} color="#fff" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
          <Trash2 size={18} color="#ff6b35" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 4,
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  addressCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 53, 0.3)",
  },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 107, 53, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  addressInfo: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 2,
  },
  addressText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  changeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ff6b35",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 16,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: "#f7931e",
  },
  itemActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: 4,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ff6b35",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    minWidth: 24,
    textAlign: "center",
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 107, 53, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  summaryCard: {
    padding: 20,
    borderRadius: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: "rgba(255,255,255,0.7)",
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  freeDelivery: {
    color: "#4ade80",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  totalValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#ff6b35",
  },
  bottomSpacer: {
    height: 140,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(26, 15, 10, 0.98)",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  bottomTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  bottomTotalLabel: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
  },
  bottomTotalValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
  },
  orderButton: {
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
  },
  orderButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 32,
    textAlign: "center",
  },
  emptyButton: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 2,
  },
});
