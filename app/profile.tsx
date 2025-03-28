import { StyleSheet, Image, Platform } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabFiveScreen() {
  return (
        <SafeAreaView>
                   <ThemedText type="title">Profile</ThemedText>
                   <ThemedText>Lorem ipsum</ThemedText>
        </SafeAreaView>
  );
}

