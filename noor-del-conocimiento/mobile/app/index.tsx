// Language Selection Screen — first screen the user sees
// Design: editorial luxury (high-end skill) + mobile-native first screen rules
// Clean, calm, focused — one primary focal point (bismillah + 3 language buttons)
// App-native feel: not a website-in-phone (mobile skill principle)
import React, { useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { router } from "expo-router";
import { Colors } from "../constants/colors";
import { NoorButton } from "../components/ui/NoorButton";
import { IslamicPatternBackground, MihrabArch } from "../components/patterns/IslamicPattern";
import { useLanguage } from "../context/LanguageContext";
import type { Language } from "../lib/types";

const { width } = Dimensions.get("window");

export default function LanguageScreen() {
  const { setLanguage } = useLanguage();

  // Staggered entrance — scale from 0.92+opacity (Emil Kowalski: never from 0)
  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(16);
  const arabicOpacity = useSharedValue(0);
  const arabicY = useSharedValue(12);
  const buttonsOpacity = useSharedValue(0);
  const buttonsY = useSharedValue(20);

  useEffect(() => {
    titleOpacity.value = withDelay(100, withTiming(1, { duration: 400 }));
    titleY.value = withDelay(100, withSpring(0, { stiffness: 120, damping: 18 }));

    arabicOpacity.value = withDelay(250, withTiming(1, { duration: 400 }));
    arabicY.value = withDelay(250, withSpring(0, { stiffness: 120, damping: 18 }));

    buttonsOpacity.value = withDelay(420, withTiming(1, { duration: 380 }));
    buttonsY.value = withDelay(420, withSpring(0, { stiffness: 120, damping: 18 }));
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));

  const arabicStyle = useAnimatedStyle(() => ({
    opacity: arabicOpacity.value,
    transform: [{ translateY: arabicY.value }],
  }));

  const buttonsStyle = useAnimatedStyle(() => ({
    opacity: buttonsOpacity.value,
    transform: [{ translateY: buttonsY.value }],
  }));

  const handleSelectLanguage = async (lang: Language) => {
    await setLanguage(lang);
    router.replace("/home");
  };

  return (
    <SafeAreaView style={styles.root}>
      {/* Subtle Islamic geometric pattern background */}
      <IslamicPatternBackground color={Colors.gold.primary} opacity={0.05} tileSize={48} />

      <View style={styles.content}>
        {/* Mihrab arch ornament */}
        <View style={styles.archContainer}>
          <MihrabArch color={Colors.gold.primary} width={width * 0.65} />
        </View>

        {/* Bismillah — Arabic calligraphy (Amiri font, RTL-correct) */}
        <Animated.View style={[styles.bismillahContainer, arabicStyle]}>
          <Text style={styles.bismillah} allowFontScaling={false}>
            بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </Text>
        </Animated.View>

        {/* App name */}
        <Animated.View style={[styles.titleContainer, titleStyle]}>
          <Text style={styles.arabicTitle}>نور المعرفة</Text>
          <Text style={styles.subtitle}>Noor del Conocimiento</Text>
        </Animated.View>

        {/* Gold divider */}
        <View style={styles.divider} />

        {/* Language buttons — staggered via parent animation */}
        <Animated.View style={[styles.buttons, buttonsStyle]}>
          <Text style={styles.chooseLabel}>Choose your language</Text>

          <NoorButton
            onPress={() => handleSelectLanguage("es")}
            label="Español"
            variant="secondary"
            size="lg"
            style={styles.langButton}
          />
          <NoorButton
            onPress={() => handleSelectLanguage("en")}
            label="English"
            variant="secondary"
            size="lg"
            style={styles.langButton}
          />
          {/* Arabic — Amiri font, RTL */}
          <NoorButton
            onPress={() => handleSelectLanguage("ma")}
            label="العربية (الدارجة)"
            variant="secondary"
            size="lg"
            isRTL={true}
            style={styles.langButton}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    gap: 8,
  },
  archContainer: {
    marginBottom: 8,
    opacity: 0.7,
  },
  bismillahContainer: {
    alignItems: "center",
  },
  bismillah: {
    fontFamily: "Amiri_400Regular",
    fontSize: 22,
    color: Colors.gold.primary,
    textAlign: "center",
    lineHeight: 38,
    letterSpacing: 1,
  },
  titleContainer: {
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  arabicTitle: {
    fontFamily: "Amiri_700Bold",
    fontSize: 40,
    color: Colors.parchment.primary,
    textAlign: "center",
    lineHeight: 56,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: "500",
  },
  divider: {
    width: 48,
    height: 1,
    backgroundColor: Colors.gold.primary,
    opacity: 0.4,
    marginVertical: 20,
  },
  buttons: {
    width: "100%",
    gap: 12,
    alignItems: "stretch",
  },
  chooseLabel: {
    fontSize: 13,
    color: Colors.text.muted,
    textAlign: "center",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  langButton: {
    width: "100%",
  },
});
