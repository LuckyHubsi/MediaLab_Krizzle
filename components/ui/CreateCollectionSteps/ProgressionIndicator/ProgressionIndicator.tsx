import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";
import { Container, Step } from "./ProgressIndicator.styles";

/**
 * Component to display a progress indicator with a maximum of 5 steps.
 * It highlights the current step based on the `progressStep` prop.
 * @param progressStep (required) - The current step in the progress indicator, should be between 1 and 5.
 */

interface ProgressIndicatorProps {
  progressStep: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  progressStep,
}) => {
  const colorScheme = useColorScheme();

  return (
    <Container>
      {/* Ensure progressStep is between 1 and 5 */}
      {[1, 2, 3, 4, 5].map((step) => (
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
