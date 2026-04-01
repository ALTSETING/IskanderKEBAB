import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Animated,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, ShoppingCart, Plus, Minus } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: _width } = Dimensions.get("window");

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

const MENU_ITEMS: MenuItem[] = [
  { id: "1", name: "Донер Кебаб", description: "Соковите куряче філе з овочами в тонкому лаваші", price: 120, category: "Кебаби" },
  { id: "2", name: "Шаурма По-Іскандерськи", description: "Фірмовий соус, маринована курка, свіжі овочі", price: 145, category: "Кебаби" },
  { id: "3", name: "Люля-Кебаб", description: "Соковитий фарш на мангалі з цибулею та зеленню", price: 165, category: "Кебаби" },
  { id: "4", name: "Плов Узбецький", description: "Ароматний рис з бараниною, морквою та спеціями", price: 180, category: "Гарячі страви" },
  { id: "5", name: "Самса з бараниною", description: "Пухкі тісто з соковитою начинкою", price: 85, category: "Випічка" },
  { id: "6", name: "Чай Мате", description: "Традиційний східний чай з м'ятою", price: 45, category: "Напої" },
];

interface CartItem extends MenuItem {
  quantity: number;
}

export default function MenuScreen() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Всі");
  const scrollY = useRef(new Animated.Value(0)).current;
  
  const categories = ["Всі", "Кебаби", "Гарячі страви", "Випічка", "Напої"];

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing && existing.quantity > 1) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      return prev.filter((i) => i.id !== item.id);
    });
  };

  const getItemQuantity = (id: string) => {
    const item = cart.find((i) => i.id === id);
    return item?.quantity || 0;
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const filteredItems = selectedCategory === "Всі"
    ? MENU_ITEMS
    : MENU_ITEMS.filter((item) => item.category === selectedCategory);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <LinearGradient
          colors={["rgba(26, 15, 10, 0.95)", "rgba(26, 15, 10, 0.8)"]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <View style={styles.navHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>МЕНЮ</Text>
        <TouchableOpacity onPress={() => router.push("/cart")} style={styles.cartButton}>
          <ShoppingCart size={24} color="#fff" />
          {totalItems > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{totalItems}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.menuContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {filteredItems.map((item, index) => (
          <MenuCard
            key={item.id}
            item={item}
            index={index}
            quantity={getItemQuantity(item.id)}
            onAdd={() => addToCart(item)}
            onRemove={() => removeFromCart(item)}
          />
        ))}
        <View style={styles.bottomSpacer} />
      </Animated.ScrollView>

      {totalItems > 0 && (
        <Animated.View style={styles.bottomBar}>
          <View style={styles.bottomInfo}>
            <Text style={styles.bottomCount}>{totalItems} товарів</Text>
            <Text style={styles.bottomPrice}>{totalPrice} ₴</Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/cart")}>
            <LinearGradient
              colors={["#ff6b35", "#f7931e"]}
              style={styles.checkoutButton}
            >
              <Text style={styles.checkoutText}>КОШИК</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

interface MenuCardProps {
  item: MenuItem;
  index: number;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

function MenuCard({ item, index, quantity, onAdd, onRemove }: MenuCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

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
        styles.card,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={[StyleSheet.absoluteFill, { borderRadius: 16, overflow: "hidden" }]}>
        <LinearGradient
          colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
          style={StyleSheet.absoluteFill}
        />
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardInfo}>
          <Text style={styles.cardCategory}>{item.category}</Text>
          <Text style={styles.cardName}>{item.name}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
          <Text style={styles.cardPrice}>{item.price} ₴</Text>
        </View>
        <View style={styles.cardActions}>
          {quantity > 0 ? (
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={onRemove} style={styles.quantityButton}>
                <Minus size={16} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity onPress={onAdd} style={styles.quantityButton}>
                <Plus size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={onAdd} style={styles.addButton}>
              <Plus size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 10,
  },
  navHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    zIndex: 20,
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
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#ff6b35",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },
  categoryContainer: {
    maxHeight: 60,
    marginBottom: 10,
  },
  categoryContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  categoryButtonActive: {
    backgroundColor: "#ff6b35",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.7)",
  },
  categoryTextActive: {
    color: "#fff",
  },
  menuContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  cardContent: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardInfo: {
    flex: 1,
    marginRight: 12,
  },
  cardCategory: {
    fontSize: 11,
    fontWeight: "600",
    color: "#f7931e",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  cardName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 8,
    lineHeight: 18,
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: "800",
    color: "#ff6b35",
  },
  cardActions: {
    justifyContent: "flex-end",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ff6b35",
    justifyContent: "center",
    alignItems: "center",
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
  bottomSpacer: {
    height: 100,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 30,
    backgroundColor: "rgba(26, 15, 10, 0.95)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  bottomInfo: {
    flex: 1,
  },
  bottomCount: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 2,
  },
  bottomPrice: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
  },
  checkoutButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
  },
  checkoutText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 1,
  },
});
