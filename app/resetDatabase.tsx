import DeleteModal from "@/components/Modals/DeleteModal/DeleteModal";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/ui/Button/Button";
import { CustomStyledHeader } from "@/components/ui/CustomStyledHeader/CustomStyledHeader";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { resetDatabase } from "@/backend/service/DatabaseReset";
import { useState } from "react";
import { SafeAreaView, View, Platform, StatusBar } from "react-native";
import { ErrorPopup } from "@/components/Modals/ErrorModal/ErrorModal";
import { EnrichedError } from "@/shared/error/ServiceError";

/**
 * ResetDatabaseScreen that allows users to reset their database.
 */
export default function ResetDatabaseScreen() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errors, setErrors] = useState<EnrichedError[]>([]);
  const [showError, setShowError] = useState(false);

  /**
   * Components used:
   *
   * - CustomStyledHeader: A custom header component with a title.
   * - ThemedView: A themed view component that applies the current theme.
   * - ThemedText: A themed text component that applies the current theme.
   * - Button: A button component that triggers the reset action.
   * - DeleteModal: A modal that confirms the deletion of all data.
   * - ErrorPopup: A popup that displays errors that occurred during the reset process.
   */
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        <CustomStyledHeader title="Reset Data" />
      </View>
      <ThemedView>
        <ThemedText fontWeight="bold" colorVariant="red">
          Erase All Data and Start Fresh
        </ThemedText>
        <ThemedText>
          Selecting this option will delete all your existing notes and
          collections, giving you a completely clean slate. Your current data
          will be permanently lost, so make sure to save anything you want to
          keep somewhere else.
        </ThemedText>
        <ThemedText>
          By clicking the button below, you will agree to delete all data.
        </ThemedText>
        <Button
          onPress={() => {
            setShowDeleteModal(true);
          }}
          isRed={true}
        >
          Reset all Data
        </Button>
      </ThemedView>

      <DeleteModal
        visible={showDeleteModal}
        titleHasApostrophes={false}
        title={"all your Data"}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={async () => {
          const result = await resetDatabase();

          if (!result.success) {
            // set all errors to the previous errors plus add the new error
            // define the id and the source and set its read status to false
            setErrors((prev) => [
              ...prev,
              {
                ...result.error,
                hasBeenRead: false,
                id: `${Date.now()}-${Math.random()}`,
              },
            ]);
            setShowError(true);
          }

          setShowDeleteModal(false);
        }}
        onClose={() => setShowDeleteModal(false)}
      />

      <ErrorPopup
        visible={showError && errors.some((e) => !e.hasBeenRead)}
        errors={errors.filter((e) => !e.hasBeenRead) || []}
        onClose={(updatedErrors) => {
          const updatedIds = updatedErrors.map((e) => e.id);
          const newCombined = errors.map((e) =>
            updatedIds.includes(e.id) ? { ...e, hasBeenRead: true } : e,
          );
          setErrors(newCombined);
          setShowError(false);
        }}
      />
    </SafeAreaView>
  );
}
