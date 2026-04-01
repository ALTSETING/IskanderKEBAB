import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Animated,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Flame,
  ChevronRight,
  Star,
  Clock,
  MapPin,
  Truck,
  ChefHat,
  Award,
  Heart,
  ShoppingBag,
  ArrowRight,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

const { width, height } = Dimensions.get("window");

const POPULAR_DISHES = [
  {
    id: "1",
    name: "Донер Кебаб",
    description: "Соковите куряче філе з овочами в тонкому лаваші",
    price: 120,
    rating: 4.9,
    image: "https://rork.app/pa/13usywbclhzg74g6xldb8/hero_doner_kebab",
  },
  {
    id: "2",
    name: "Люля-Кебаб",
    description: "Соковитий фарш на мангалі з цибулею та зеленню",
    price: 165,
    rating: 4.8,
    image: "https://rork.app/pa/13usywbclhzg74g6xldb8/lyulya_kebab_hero",
  },
  {
    id: "3",
    name: "Плов Узбецький",
    description: "Ароматний рис з бараниною та спеціями",
    price: 180,
    rating: 4.9,
    image: "https://rork.app/pa/13usywbclhzg74g6xldb8/uzbek_plov",
  },
  {
    id: "4",
    name: "Самса",
    description: "Пухке тісто з соковитою начинкою",
    price: 85,
    rating: 4.7,
    image: "https://rork.app/pa/13usywbclhzg74g6xldb8/samosa_delicious",
  },
];

const FEATURES = [
  {
    icon: ChefHat,
    title: "Шеф-кухарі",
    description: "Автентичні рецепти від справжніх майстрів",
  },
  {
    icon: Clock,
    title: "Швидко",
    description: "Приготування за 15-20 хвилин",
  },
  {
    icon: MapPin,
    title: "Поруч",
    description: "Доставка по всьому місту",
  },
  {
    icon: Award,
    title: "Якість",
    description: "Тільки свіжі інгредієнти",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [activeDishIndex, setActiveDishIndex] = useState(0);

  // Animation refs
  const heroFadeAnim = useRef(new Animated.Value(0)).current;
  const heroScaleAnim = useRef(new Animated.Value(0.9)).current;
  const heroSlideAnim = useRef(new Animated.Value(50)).current;
  const flameAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Section animations
  const section1Anim = useRef(new Animated.Value(0)).current;
  const section2Anim = useRef(new Animated.Value(0)).current;
  const section3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Hero entrance animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(heroFadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(heroScaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(heroSlideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Flame pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(flameAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(flameAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Float animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -15,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 15,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse animation for CTA
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
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

    // Sections stagger animation
    Animated.stagger(200, [
      Animated.timing(section1Anim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(section2Anim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(section3Anim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flameScale = flameAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  });

  const flameOpacity = flameAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1],
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const scrollToMenu = useCallback(() => {
    router.push("/menu");
  }, [router]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Sticky Header */}
      <Animated.View style={[styles.stickyHeader, { opacity: headerOpacity }]}>
        <LinearGradient
          colors={["rgba(26, 15, 10, 0.95)", "rgba(26, 15, 10, 0.9)"]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.headerContent}>
          <View style={styles.headerLogo}>
            <Flame size={24} color="#ff6b35" />
            <Text style={styles.headerTitle}>ISKANDER</Text>
          </View>
          <TouchableOpacity onPress={scrollToMenu} style={styles.headerButton}>
            <ShoppingBag size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* HERO SECTION */}
        <View style={styles.heroSection}>
          {/* Background gradient */}
          <LinearGradient
            colors={["#ff6b35", "#f7931e", "#d4a574"]}
            style={styles.heroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />

          {/* Animated circles */}
          <View style={styles.circlesContainer}>
            <Animated.View
              style={[
                styles.circle,
                styles.circle1,
                {
                  transform: [{ translateY: floatAnim }],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.circle,
                styles.circle2,
                {
                  transform: [
                    {
                      translateY: floatAnim.interpolate({
                        inputRange: [-15, 15],
                        outputRange: [15, -15],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.circle,
                styles.circle3,
                {
                  transform: [{ translateY: floatAnim }],
                },
              ]}
            />
          </View>

          {/* Hero Content */}
          <View style={styles.heroContent}>
            {/* Logo */}
            <Animated.View
              style={[
                styles.logoContainer,
                {
                  opacity: heroFadeAnim,
                  transform: [{ scale: heroScaleAnim }],
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.flameWrapper,
                  {
                    transform: [{ scale: flameScale }],
                    opacity: flameOpacity,
                  },
                ]}
              >
                <Flame size={100} color="#fff" fill="#fff" />
              </Animated.View>
              <Text style={styles.brandName}>ISKANDER</Text>
              <Text style={styles.brandSubName}>KEBAB</Text>
            </Animated.View>

            {/* Tagline */}
            <Animated.View
              style={[
                styles.taglineContainer,
                {
                  opacity: heroFadeAnim,
                  transform: [{ translateY: heroSlideAnim }],
                },
              ]}
            >
              <Text style={styles.tagline}>Справжній смак Сходу</Text>
              <Text style={styles.subtagline}>
                Найсоковитіші кебаби з доставкою до ваших дверей
              </Text>
            </Animated.View>

            {/* CTA Button */}
            <Animated.View
              style={{
                transform: [{ scale: pulseAnim }],
              }}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={scrollToMenu}
                style={styles.ctaButton}
              >
                <LinearGradient
                  colors={["#1a0f0a", "#2d1f14"]}
                  style={styles.ctaGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.ctaText}>ПЕРЕГЛЯНУТИ МЕНЮ</Text>
                  <ArrowRight size={20} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Stats */}
            <Animated.View
              style={[
                styles.statsContainer,
                {
                  opacity: heroFadeAnim,
                  transform: [{ translateY: heroSlideAnim }],
                },
              ]}
            >
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>15</Text>
                <Text style={styles.statLabel}>хв доставка</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>4.9</Text>
                <Text style={styles.statLabel}>рейтинг</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>10K+</Text>
                <Text style={styles.statLabel}>замовлень</Text>
              </View>
            </Animated.View>
          </View>

          {/* Scroll indicator */}
          <Animated.View
            style={[
              styles.scrollIndicator,
              {
                opacity: heroFadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.6],
                }),
                transform: [
                  {
                    translateY: floatAnim.interpolate({
                      inputRange: [-15, 15],
                      outputRange: [0, 10],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.scrollLine} />
          </Animated.View>
        </View>

        {/* POPULAR DISHES SECTION */}
        <Animated.View
          style={[
            styles.popularSection,
            {
              opacity: section1Anim,
              transform: [
                {
                  translateY: section1Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Популярні страви</Text>
            <TouchableOpacity onPress={scrollToMenu} style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>Всі страви</Text>
              <ChevronRight size={16} color="#ff6b35" />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dishesScrollContent}
            snapToInterval={width * 0.7 + 16}
            decelerationRate="fast"
            onScroll={(e) => {
              const x = e.nativeEvent.contentOffset.x;
              const index = Math.round(x / (width * 0.7 + 16));
              setActiveDishIndex(index);
            }}
            scrollEventThrottle={16}
          >
            {POPULAR_DISHES.map((dish, index) => (
              <DishCard key={dish.id} dish={dish} index={index} />
            ))}
          </ScrollView>

          {/* Pagination dots */}
          <View style={styles.paginationContainer}>
            {POPULAR_DISHES.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  activeDishIndex === index && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        </Animated.View>

        {/* WHY US SECTION */}
        <Animated.View
          style={[
            styles.whyUsSection,
            {
              opacity: section2Anim,
              transform: [
                {
                  translateY: section2Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Чому обирають нас</Text>
          <View style={styles.featuresGrid}>
            {FEATURES.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </View>
        </Animated.View>

        {/* ABOUT SECTION */}
        <Animated.View
          style={[
            styles.aboutSection,
            {
              opacity: section3Anim,
              transform: [
                {
                  translateY: section3Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={["rgba(255, 107, 53, 0.1)", "rgba(247, 147, 30, 0.05)"]}
            style={styles.aboutGradient}
          />
          <View style={styles.aboutContent}>
            <View style={styles.aboutIconContainer}>
              <Heart size={32} color="#ff6b35" fill="#ff6b35" />
            </View>
            <Text style={styles.aboutTitle}>Готуємо з любов'ю</Text>
            <Text style={styles.aboutText}>
              Iskander Kebab — це не просто їжа, це справжня подорож у світ
              східних смаків. Ми використовуємо тільки найсвіжіші інгредієнти та
              автентичні рецепти, які передаються з покоління в покоління.
            </Text>
            <View style={styles.aboutStats}>
              <View style={styles.aboutStat}>
                <Text style={styles.aboutStatNumber}>5</Text>
                <Text style={styles.aboutStatLabel}>років досвіду</Text>
              </View>
              <View style={styles.aboutStat}>
                <Text style={styles.aboutStatNumber}>50+</Text>
                <Text style={styles.aboutStatLabel}>позицій в меню</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* FINAL CTA SECTION */}
        <View style={styles.finalCtaSection}>
          <LinearGradient
            colors={["#ff6b35", "#f7931e"]}
            style={styles.finalCtaGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <View style={styles.finalCtaContent}>
            <Text style={styles.finalCtaTitle}>Голодні?</Text>
            <Text style={styles.finalCtaSubtitle}>
              Замовляйте зараз та отримайте знижку 10% на перше замовлення
            </Text>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={scrollToMenu}
              style={styles.finalCtaButton}
            >
              <Text style={styles.finalCtaButtonText}>ЗАМОВИТИ ЗАРАЗ</Text>
              <Truck size={20} color="#ff6b35" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLogo}>
            <Flame size={24} color="#ff6b35" />
            <Text style={styles.footerLogoText}>ISKANDER KEBAB</Text>
          </View>
          <Text style={styles.footerText}>© 2025 Iskander Kebab. Всі права захищені.</Text>
          <Text style={styles.footerText}>Справжній смак Сходу</Text>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

interface DishCardProps {
  dish: (typeof POPULAR_DISHES)[0];
  index: number;
}

function DishCard({ dish }: DishCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={styles.dishCardContainer}
    >
      <Animated.View
        style={[
          styles.dishCard,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.dishImageContainer}>
          <Image source={{ uri: dish.image }} style={styles.dishImage} />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            style={styles.dishImageOverlay}
          />
          <View style={styles.ratingBadge}>
            <Star size={12} color="#FFD700" fill="#FFD700" />
            <Text style={styles.ratingText}>{dish.rating}</Text>
          </View>
        </View>
        <View style={styles.dishInfo}>
          <Text style={styles.dishName}>{dish.name}</Text>
          <Text style={styles.dishDescription} numberOfLines={2}>
            {dish.description}
          </Text>
          <View style={styles.dishFooter}>
            <Text style={styles.dishPrice}>{dish.price} ₴</Text>
            <View style={styles.addButton}>
              <Plus size={16} color="#fff" />
            </View>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

interface FeatureCardProps {
  feature: (typeof FEATURES)[0];
  index: number;
}

function FeatureCard({ feature, index }: FeatureCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Icon = feature.icon;

  return (
    <Animated.View
      style={[
        styles.featureCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.featureIconContainer}>
        <Icon size={28} color="#ff6b35" />
      </View>
      <Text style={styles.featureTitle}>{feature.title}</Text>
      <Text style={styles.featureDescription}>{feature.description}</Text>
    </Animated.View>
  );
}

import { Plus } from "lucide-react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a0f0a",
  },

  // Sticky Header
  stickyHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === "ios" ? 100 : 80,
    zIndex: 100,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLogo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 3,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 107, 53, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Hero Section
  heroSection: {
    height: height * 0.9,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  circlesContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  circle: {
    position: "absolute",
    borderRadius: 1000,
  },
  circle1: {
    width: 400,
    height: 400,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    top: -100,
    right: -100,
  },
  circle2: {
    width: 300,
    height: 300,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    bottom: 100,
    left: -80,
  },
  circle3: {
    width: 200,
    height: 200,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    bottom: 200,
    right: 50,
  },
  heroContent: {
    alignItems: "center",
    paddingHorizontal: 24,
    zIndex: 10,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  flameWrapper: {
    marginBottom: 20,
  },
  brandName: {
    fontSize: 52,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 10,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  brandSubName: {
    fontSize: 36,
    fontWeight: "800",
    color: "#1a0f0a",
    letterSpacing: 14,
    marginTop: -5,
  },
  taglineContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  tagline: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtagline: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    maxWidth: 300,
    lineHeight: 22,
  },
  ctaButton: {
    borderRadius: 30,
    overflow: "hidden",
    marginBottom: 40,
    shadowColor: "#1a0f0a",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  ctaGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 18,
    paddingHorizontal: 36,
  },
  ctaText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 2,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  scrollIndicator: {
    position: "absolute",
    bottom: 40,
    alignItems: "center",
  },
  scrollLine: {
    width: 2,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 1,
  },

  // Popular Section
  popularSection: {
    paddingVertical: 40,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ff6b35",
  },
  dishesScrollContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  dishCardContainer: {
    width: width * 0.7,
  },
  dishCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  dishImageContainer: {
    height: 180,
    position: "relative",
  },
  dishImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  dishImageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  ratingBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
  },
  dishInfo: {
    padding: 16,
  },
  dishName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 6,
  },
  dishDescription: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 12,
    lineHeight: 18,
  },
  dishFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dishPrice: {
    fontSize: 20,
    fontWeight: "800",
    color: "#ff6b35",
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ff6b35",
    justifyContent: "center",
    alignItems: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  paginationDotActive: {
    backgroundColor: "#ff6b35",
    width: 24,
  },

  // Why Us Section
  whyUsSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginTop: 24,
  },
  featureCard: {
    width: (width - 56) / 2,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: "rgba(255, 107, 53, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    lineHeight: 18,
  },

  // About Section
  aboutSection: {
    marginHorizontal: 20,
    borderRadius: 24,
    overflow: "hidden",
    marginVertical: 20,
  },
  aboutGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  aboutContent: {
    padding: 24,
    alignItems: "center",
  },
  aboutIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 107, 53, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  aboutTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  aboutStats: {
    flexDirection: "row",
    gap: 40,
  },
  aboutStat: {
    alignItems: "center",
  },
  aboutStatNumber: {
    fontSize: 32,
    fontWeight: "800",
    color: "#ff6b35",
  },
  aboutStatLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    marginTop: 4,
  },

  // Final CTA Section
  finalCtaSection: {
    marginHorizontal: 20,
    borderRadius: 24,
    overflow: "hidden",
    marginVertical: 20,
    position: "relative",
  },
  finalCtaGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  finalCtaContent: {
    padding: 32,
    alignItems: "center",
  },
  finalCtaTitle: {
    fontSize: 36,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 12,
  },
  finalCtaSubtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  finalCtaButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  finalCtaButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#ff6b35",
    letterSpacing: 1,
  },

  // Footer
  footer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    marginTop: 20,
  },
  footerLogo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  footerLogoText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 2,
  },
  footerText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
    marginBottom: 4,
  },
});
