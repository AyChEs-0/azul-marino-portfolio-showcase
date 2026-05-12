// Play Screen — core game loop
// Migrated from Next.js /play page
// Features: timer, lives, lifelines (50/50, +15s, skip), AI feedback on wrong answers
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { Colors } from "../constants/colors";
import { AnswerOption } from "../components/ui/AnswerOption";
import { TimerBar } from "../components/ui/TimerBar";
import { NoorButton } from "../components/ui/NoorButton";
import { NoorCard } from "../components/ui/NoorCard";
import { IslamicPatternBackground } from "../components/patterns/IslamicPattern";
import { useLanguage } from "../context/LanguageContext";
import {
  selectGameQuestions,
  calculateQuestionScore,
  calculateFinalScore,
  getTimerDuration,
  applyFiftyFifty,
  INITIAL_LIVES,
  INITIAL_LIFELINES,
  EXTRA_TIME_BONUS,
  TOTAL_QUESTIONS_PER_GAME,
} from "../lib/gameLogic";
import { getPlayedQuestions, addPlayedQuestions, updateStats } from "../lib/storage";
import { getAIFeedback } from "../lib/ai";
import type { Question, Difficulty, GameMode } from "../lib/types";
import questions from "../data/questions.json";

type AnswerState = "idle" | "selected" | "correct" | "incorrect";

export default function PlayScreen() {
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const params = useLocalSearchParams<{
    mode: string;
    category: string;
    difficulty: string;
  }>();

  const difficulty = (params.difficulty ?? "easy") as Difficulty;
  const category = (params.category ?? "mix") as GameMode;

  const [gameQuestions, setGameQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(getTimerDuration(difficulty));
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [lifelines, setLifelines] = useState({ ...INITIAL_LIFELINES });
  const [visibleOptions, setVisibleOptions] = useState<string[]>([]);
  const [answerStates, setAnswerStates] = useState<Record<string, AnswerState>>({});
  const [isAnswered, setIsAnswered] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [maxPoints, setMaxPoints] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const goldFlash = useSharedValue(0);
  const scorePopScale = useSharedValue(0);
  const scorePopOpacity = useSharedValue(0);
  const [lastScore, setLastScore] = useState(0);

  const totalTime = getTimerDuration(difficulty);
  const currentQ = gameQuestions[currentIndex];

  // Load questions on mount
  useEffect(() => {
    const init = async () => {
      const played = await getPlayedQuestions();
      const selected = selectGameQuestions(
        questions as Question[],
        category,
        difficulty,
        language,
        played
      );
      setGameQuestions(selected);
      const mp = selected.reduce(
        (acc, q) => acc + (q.difficulty === difficulty ? 1 : 0),
        0
      );
      setMaxPoints(mp);
    };
    init();
  }, []);

  // Reset options when question changes
  useEffect(() => {
    if (!currentQ) return;
    const opts = currentQ.options[language] ?? [];
    setVisibleOptions(opts);
    setAnswerStates({});
    setIsAnswered(false);
    setAiFeedback(null);
    setTimeLeft(getTimerDuration(difficulty));
  }, [currentIndex, currentQ, language]);

  // Timer
  useEffect(() => {
    if (isAnswered || !currentQ) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [isAnswered, currentIndex, currentQ]);

  const handleTimeOut = useCallback(() => {
    if (isAnswered) return;
    const correct = currentQ?.correctAnswer[language] ?? "";
    const newStates: Record<string, AnswerState> = {};
    visibleOptions.forEach((opt) => {
      newStates[opt] = opt === correct ? "correct" : "idle";
    });
    setAnswerStates(newStates);
    setIsAnswered(true);
    loseLife();
  }, [isAnswered, currentQ, language, visibleOptions]);

  const loseLife = useCallback(() => {
    setLives((prev) => {
      const next = prev - 1;
      if (next <= 0) {
        setTimeout(endGame, 1200);
      }
      return next;
    });
  }, []);

  const handleAnswer = useCallback(
    async (option: string) => {
      if (isAnswered) return;
      clearInterval(timerRef.current!);
      setIsAnswered(true);

      const correct = currentQ.correctAnswer[language];
      const isCorrect = option === correct;

      const newStates: Record<string, AnswerState> = {};
      visibleOptions.forEach((opt) => {
        if (opt === option) newStates[opt] = isCorrect ? "correct" : "incorrect";
        else if (opt === correct) newStates[opt] = "correct";
        else newStates[opt] = "idle";
      });
      setAnswerStates(newStates);

      if (isCorrect) {
        const pts = calculateQuestionScore(difficulty, timeLeft, totalTime, category);
        setEarnedPoints((prev) => prev + pts);
        setCorrectCount((prev) => prev + 1);
        setLastScore(pts);
        // Gold flash: quick in → out
        goldFlash.value = withSequence(
          withTiming(0.18, { duration: 120 }),
          withDelay(180, withTiming(0, { duration: 250 }))
        );
        // Score pop: spring up then fade
        scorePopScale.value = withSpring(1, { stiffness: 420, damping: 18 });
        scorePopOpacity.value = withTiming(1, { duration: 120 });
        scorePopScale.value = withDelay(
          600,
          withSpring(0.7, { stiffness: 300, damping: 20 })
        );
        scorePopOpacity.value = withDelay(500, withTiming(0, { duration: 300 }));
      } else {
        loseLife();
        // Fetch AI feedback for wrong answer
        setIsLoadingFeedback(true);
        try {
          const feedback = await getAIFeedback({
            question: currentQ.question[language],
            correctAnswer: correct,
            userAnswer: option,
            language,
          });
          setAiFeedback(feedback);
        } catch {
          setAiFeedback(null);
        } finally {
          setIsLoadingFeedback(false);
        }
      }
    },
    [isAnswered, currentQ, language, visibleOptions, timeLeft, totalTime, difficulty, category]
  );

  const handleNext = useCallback(async () => {
    if (currentIndex >= gameQuestions.length - 1 || lives <= 0) {
      endGame();
      return;
    }
    setCurrentIndex((i) => i + 1);
  }, [currentIndex, gameQuestions.length, lives]);

  const endGame = useCallback(async () => {
    const playedIds = gameQuestions.map((q) => q.id);
    await addPlayedQuestions(playedIds);
    const finalScore = calculateFinalScore(earnedPoints, maxPoints);
    await updateStats(finalScore, correctCount);
    router.replace({
      pathname: "/game-over",
      params: {
        score: finalScore,
        correct: correctCount,
        total: gameQuestions.length,
        language,
        category,
        difficulty,
      },
    });
  }, [gameQuestions, earnedPoints, maxPoints, correctCount, language, category, difficulty]);

  // Lifelines
  const useFiftyFifty = () => {
    if (lifelines.fiftyFifty <= 0 || isAnswered) return;
    const correct = currentQ.correctAnswer[language];
    const reduced = applyFiftyFifty(visibleOptions, correct);
    setVisibleOptions(reduced);
    setLifelines((l) => ({ ...l, fiftyFifty: l.fiftyFifty - 1 }));
  };

  const useExtraTime = () => {
    if (lifelines.extraTime <= 0 || isAnswered) return;
    setTimeLeft((t) => t + EXTRA_TIME_BONUS);
    setLifelines((l) => ({ ...l, extraTime: l.extraTime - 1 }));
  };

  const useSkip = () => {
    if (lifelines.skip <= 0 || isAnswered || difficulty === "easy") return;
    clearInterval(timerRef.current!);
    setLifelines((l) => ({ ...l, skip: 0 }));
    handleNext();
  };

  const goldFlashStyle = useAnimatedStyle(() => ({
    opacity: goldFlash.value,
  }));
  const scorePopStyle = useAnimatedStyle(() => ({
    opacity: scorePopOpacity.value,
    transform: [{ scale: scorePopScale.value }],
  }));

  if (!currentQ) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: Colors.text.primary }}>{t("loading.game")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const progressText = `${currentIndex + 1} / ${gameQuestions.length}`;

  return (
    <SafeAreaView style={styles.root}>
      <IslamicPatternBackground color={Colors.gold.primary} opacity={0.04} tileSize={52} />

      {/* Gold flash overlay for correct answers */}
      <Animated.View style={[styles.flashOverlay, goldFlashStyle]} pointerEvents="none" />

      {/* Score pop indicator */}
      <Animated.View style={[styles.scorePop, scorePopStyle]} pointerEvents="none">
        <Text style={styles.scorePopText}>+{lastScore}</Text>
      </Animated.View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Top bar: lives + progress */}
        <View style={styles.topBar}>
          <View style={styles.lives}>
            {Array.from({ length: INITIAL_LIVES }).map((_, i) => (
              <Text key={i} style={[styles.heart, i >= lives && styles.heartLost]}>
                ♥
              </Text>
            ))}
          </View>
          <Text style={styles.progress}>{progressText}</Text>
        </View>

        {/* Timer */}
        <TimerBar timeLeft={timeLeft} totalTime={totalTime} />

        {/* Lifelines */}
        <View style={styles.lifelines}>
          <NoorButton
            onPress={useFiftyFifty}
            label={`50/50 (${lifelines.fiftyFifty})`}
            variant="ghost"
            size="sm"
            disabled={lifelines.fiftyFifty === 0 || isAnswered}
          />
          <NoorButton
            onPress={useExtraTime}
            label={`+${EXTRA_TIME_BONUS}s (${lifelines.extraTime})`}
            variant="ghost"
            size="sm"
            disabled={lifelines.extraTime === 0 || isAnswered}
          />
          {difficulty !== "easy" && (
            <NoorButton
              onPress={useSkip}
              label={`↷ (${lifelines.skip})`}
              variant="ghost"
              size="sm"
              disabled={lifelines.skip === 0 || isAnswered}
            />
          )}
        </View>

        {/* Arabic verse (if present) */}
        {currentQ.arabicVerse && (
          <NoorCard variant="gold" style={styles.verseCard}>
            <Text style={styles.arabicVerse}>{currentQ.arabicVerse}</Text>
          </NoorCard>
        )}

        {/* Question */}
        <NoorCard style={styles.questionCard}>
          <Text style={styles.diffBadge}>{difficulty.toUpperCase()}</Text>
          <Text
            style={[
              styles.question,
              isRTL && { textAlign: "right", fontFamily: "Amiri_400Regular", fontSize: 20 },
            ]}
          >
            {currentQ.question[language]}
          </Text>
        </NoorCard>

        {/* Options — staggered entrance (Emil Kowalski) */}
        <View style={styles.options}>
          {visibleOptions.map((opt, i) => (
            <AnswerOption
              key={opt}
              label={opt}
              index={i}
              state={answerStates[opt] ?? "idle"}
              onPress={() => handleAnswer(opt)}
              disabled={isAnswered}
              isRTL={isRTL}
            />
          ))}
        </View>

        {/* AI Feedback */}
        {isAnswered && (
          <Animated.View entering={FadeIn.duration(300)} style={styles.feedbackContainer}>
            {isLoadingFeedback ? (
              <NoorCard>
                <Text style={styles.feedbackLoading}>
                  {t("loading.default")}
                </Text>
              </NoorCard>
            ) : aiFeedback ? (
              <NoorCard variant="dark">
                <Text style={styles.feedbackLabel}>نور</Text>
                <Text
                  style={[styles.feedbackText, isRTL && { textAlign: "right" }]}
                >
                  {aiFeedback}
                </Text>
              </NoorCard>
            ) : null}

            <NoorButton
              onPress={handleNext}
              label={
                currentIndex >= gameQuestions.length - 1 || lives <= 0
                  ? t("game.seeResults") ?? "Ver resultados"
                  : t("game.nextQuestion") ?? "Siguiente"
              }
              variant="primary"
              size="lg"
              style={{ marginTop: 4 }}
            />
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg.primary },
  scroll: { flex: 1 },
  content: { padding: 20, gap: 14, paddingBottom: 40 },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  lives: { flexDirection: "row", gap: 4 },
  heart: { fontSize: 20, color: Colors.incorrect },
  heartLost: { color: Colors.border.subtle, opacity: 0.4 },
  progress: { fontSize: 13, color: Colors.text.muted, fontWeight: "600" },
  lifelines: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  verseCard: {},
  arabicVerse: {
    fontFamily: "Amiri_400Regular",
    fontSize: 20,
    color: Colors.gold.primary,
    textAlign: "right",
    lineHeight: 36,
    direction: "rtl",
  },
  questionCard: {},
  diffBadge: {
    fontSize: 10,
    color: Colors.text.muted,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  question: {
    fontSize: 17,
    color: Colors.parchment.primary,
    fontWeight: "600",
    lineHeight: 26,
  },
  options: { gap: 10 },
  feedbackContainer: { gap: 12 },
  feedbackLoading: { color: Colors.text.muted, textAlign: "center", fontStyle: "italic" },
  feedbackLabel: {
    fontFamily: "Amiri_700Bold",
    fontSize: 16,
    color: Colors.gold.primary,
    marginBottom: 8,
    textAlign: "right",
  },
  feedbackText: { fontSize: 15, color: Colors.text.primary, lineHeight: 24 },
  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.gold.primary,
    zIndex: 10,
  },
  scorePop: {
    position: "absolute",
    top: "40%",
    alignSelf: "center",
    zIndex: 20,
    backgroundColor: Colors.gold.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 40,
  },
  scorePopText: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.bg.primary,
  },
});
