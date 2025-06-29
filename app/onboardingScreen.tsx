import {
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  AccessibilityInfo,
  findNodeHandle,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import Step1 from "@/components/ui/OnboardingSteps/OnboardingStep1";
import Step2 from "@/components/ui/OnboardingSteps/OnboardingStep2";
import Step3 from "@/components/ui/OnboardingSteps/OnboardingStep3";
import Step4 from "@/components/ui/OnboardingSteps/OnboardingStep4";
import Step5 from "@/components/ui/OnboardingSteps/OnboardingStep5";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomButtons from "@/components/ui/BottomButtons/BottomButtons";
import { ThemedText } from "@/components/ThemedText";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";

const { width } = Dimensions.get("window");
const steps = [Step1, Step2, Step3, Step4, Step5];

/**
 * OnboardingScreen that guides users through the onboarding process.
 */
export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const colorSceme = useActiveColorScheme() ?? "light";

  /**
   * Handles the next button click.
   * If the current step is less than the last step, it scrolls to the next step.
   */
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      flatListRef.current?.scrollToIndex({ index: nextStep });
    } else {
      AsyncStorage.setItem("hasOnboarded", "true");
      router.replace("/(tabs)");
    }
  };

  /**
   * Handles the back button click.
   * If the current step is greater than 0, it scrolls to the previous step.
   */
  const handleBack = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      flatListRef.current?.scrollToIndex({ index: prevStep });
    }
  };

  /**
   * Handles the skip button click.
   * It sets the onboarding status to true and navigates to the main app tabs.
   */
  const handleSkip = () => {
    AsyncStorage.setItem("hasOnboarded", "true");
    router.replace("/(tabs)");
  };

  useEffect(() => {
    AccessibilityInfo.announceForAccessibility(
      `Step ${currentStep + 1} of ${steps.length}`,
    );
  }, [currentStep]);

  /**
   * Components used:
   *
   * - StepComponents: A series of components that represent each step in the onboarding process.
   * - BottomButtons: A component that provides navigation buttons at the bottom of the screen.
   */
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {currentStep !== steps.length - 1 && (
          <TouchableOpacity
            onPress={handleSkip}
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              zIndex: 100,
              minHeight: 48,
              minWidth: 48,
              justifyContent: "center",
            }}
            accessibilityRole="button"
            accessibilityLabel="Skip onboarding"
            accessibilityHint="Skips onboarding and takes you to the main screen"
          >
            <ThemedText
              colorVariant="black"
              fontSize="s"
              style={{ textDecorationLine: "underline" }}
            >
              Skip
            </ThemedText>
          </TouchableOpacity>
        )}
        <FlatList
          ref={flatListRef}
          data={steps}
          horizontal
          pagingEnabled
          scrollEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ index }) => {
            const StepComponent = steps[index];
            return (
              <View style={{ width, flex: 1 }}>
                <StepComponent />
              </View>
            );
          }}
          onScroll={(e) => {
            const offsetX = e.nativeEvent.contentOffset.x;
            const newIndex = Math.round(offsetX / width);
            if (newIndex !== currentStep) {
              setCurrentStep(newIndex);
            }
          }}
          scrollEventThrottle={100}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          initialScrollIndex={0}
        />
      </View>
      <View
        style={{
          marginHorizontal: 20,
          backgroundColor: Colors[colorSceme].background,
        }}
      >
        <BottomButtons
          titleLeftButton="Back"
          // titleRightButton={`1
          titleRightButton="Next"
          onDiscard={handleBack}
          onNext={handleNext}
          variant="back"
          hasProgressIndicator={true}
          progressStep={currentStep + 1}
          enableAnimation={true}
        />
      </View>
    </SafeAreaView>
  );
}
