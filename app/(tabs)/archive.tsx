import { StyleSheet, Image, Platform } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabTwoScreen() {
  return (
       <SafeAreaView>
               <ThemedText type="title">Archive</ThemedText>
               <ThemedText>Lorem ipsum</ThemedText>
       </SafeAreaView>
  );
}

