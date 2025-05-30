import { View, TouchableOpacity, FlatList, Dimensions } from "react-native";
import { useRef, useState } from "react";
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

const { width } = Dimensions.get("window");

const steps = [Step1, Step2, Step3, Step4, Step5];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentStep + 1 });
      setCurrentStep((prev) => prev + 1);
    } else {
      AsyncStorage.setItem("hasOnboarded", "true");
      router.replace("/(tabs)");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      flatListRef.current?.scrollToIndex({ index: currentStep - 1 });
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    AsyncStorage.setItem("hasOnboarded", "true");
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={handleSkip}
          style={{ position: "absolute", top: 20, right: 20, zIndex: 100 }}
        >
          <ThemedText
            colorVariant="black"
            fontSize="s"
            style={{ textDecorationLine: "underline" }}
          >
            Skip
          </ThemedText>
        </TouchableOpacity>
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
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setCurrentStep(index);
          }}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          initialScrollIndex={0}
        />
      </View>
      <View style={{ padding: 20 }}>
        <BottomButtons
          titleLeftButton="Back"
          titleRightButton="Next"
          onDiscard={handleBack}
          onNext={handleNext}
          variant="back"
          hasProgressIndicator={true}
          progressStep={currentStep + 1}
        />
      </View>
    </SafeAreaView>
  );
}
