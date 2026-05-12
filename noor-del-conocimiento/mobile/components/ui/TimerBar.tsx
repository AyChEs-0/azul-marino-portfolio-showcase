// Timer bar — animates with spring physics, color shifts green→amber→red
// Emil Kowalski: only animate transform + opacity (GPU-safe)
import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { timerColor } from "../../lib/utils";

interface TimerBarProps {
  timeLeft: number;
  totalTime: number;
}

export const TimerBar: React.FC<TimerBarProps> = ({ timeLeft, totalTime }) => {
  const fraction = Math.max(0, timeLeft / totalTime);
  const width = useSharedValue(fraction);

  useEffect(() => {
    // Smooth continuous shrink — linear makes sense here (progress bar)
    width.value = withTiming(fraction, {
      duration: 1000,
      easing: Easing.linear,
    });
  }, [fraction]);

  const animatedBar = useAnimatedStyle(() => ({
    width: `${width.value * 100}%` as any,
    backgroundColor: timerColor(width.value),
  }));

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <Animated.View style={[styles.bar, animatedBar]} />
      </View>
      <Text style={[styles.label, { color: timerColor(fraction) }]}>
        {Math.ceil(timeLeft)}s
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  track: {
    flex: 1,
    height: 6,
    backgroundColor: "rgba(253, 246, 227, 0.1)",
    borderRadius: 3,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    borderRadius: 3,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    minWidth: 28,
    textAlign: "right",
  },
});
