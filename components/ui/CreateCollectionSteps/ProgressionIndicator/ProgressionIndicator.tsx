import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";
import { Container, Step } from "./ProgressIndicator.styles";

interface ProgressIndicatorProps {
  progressStep: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  progressStep,
}) => {
  const colorScheme = useColorScheme();

  return (
    <Container>
      {[1, 2, 3].map((step) => (
        <Step
          key={step}
          isActive={progressStep === step}
          colorScheme={colorScheme}
        />
      ))}
    </Container>
  );
};

export default ProgressIndicator;
