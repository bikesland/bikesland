import { Stack } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslate = useRef(new Animated.Value(12)).current;

  const logoGlow = useRef(new Animated.Value(0)).current;

  const lineWidth = useRef(new Animated.Value(0)).current;

  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineTranslate = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    Animated.sequence([
      // Logo appears
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),

        Animated.timing(logoTranslate, {
          toValue: 0,
          duration: 900,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),

      Animated.delay(200),

      // Subtle logo glow
      Animated.timing(logoGlow, {
        toValue: 1,
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),

      // Red line
      Animated.timing(lineWidth, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),

      // Tagline
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),

        Animated.timing(taglineTranslate, {
          toValue: 0,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Always leave splash after 5 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <View style={styles.splash}>
        <View style={styles.brandContainer}>

          {/* BIKESLAND */}
          <Animated.View
            style={{
              opacity: logoOpacity,
              transform: [
                {
                  translateY: logoTranslate,
                },
                {
                  scale: logoGlow.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.025],
                  }),
                },
              ],
            }}
          >
            <Text style={styles.logo}>
              <Text style={styles.bikes}>BIKES</Text>
              <Text style={styles.land}>LAND</Text>
            </Text>
          </Animated.View>

          {/* RED LINE */}
          <View style={styles.lineContainer}>
            <Animated.View
              style={[
                styles.redLine,
                {
                  width: lineWidth.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>

          {/* TAGLINE */}
          <Animated.View
            style={{
              opacity: taglineOpacity,
              transform: [
                {
                  translateY: taglineTranslate,
                },
              ],
            }}
          >
            <Text style={styles.tagline}>
              EVERY BIKE HAS A STORY
            </Text>
          </Animated.View>

        </View>
      </View>
    );
  }

  return (
    <View style={styles.app}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "#000000",
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },

  app: {
    flex: 1,
    backgroundColor: "#000000",
  },

  brandContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    fontSize: 42,
    fontWeight: "800",
    letterSpacing: 1.5,
    textAlign: "center",
  },

  bikes: {
    color: "#FFFFFF",
  },

  land: {
    color: "#E50920",
  },

  lineContainer: {
    width: 235,
    height: 2,
    marginTop: 6  ,
    overflow: "hidden",
    alignItems: "center",
  },

  redLine: {
    height: 2,
    backgroundColor: "#E50920",
  },

  tagline: {
    marginTop: 11,
    fontSize: 11,
    fontWeight: "500",
    color: "#A8A8A8",
    letterSpacing: 2.2,
    textAlign: "center",
  },
});