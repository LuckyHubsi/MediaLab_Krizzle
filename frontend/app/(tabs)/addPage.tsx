import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabFourScreen() {
  return (
    <SafeAreaView>
            <ThemedText type="title">Add Page</ThemedText>
            <ThemedText>Lorem ipsum</ThemedText>
    </SafeAreaView>
  );
}
