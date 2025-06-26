import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BodyPart } from '../types/workout';

interface BodyPartSelectorProps {
  onSelectBodyPart: (bodyPart: BodyPart) => void;
}

const bodyPartLabels = {
  [BodyPart.CHEST]: '胸筋',
  [BodyPart.BACK]: '背中',
  [BodyPart.SHOULDERS]: '肩',
  [BodyPart.ARMS]: '腕',
  [BodyPart.LEGS]: '脚',
  [BodyPart.ABS]: '腹筋',
  [BodyPart.CARDIO]: '有酸素運動'
};

const bodyPartIcons = {
  [BodyPart.CHEST]: '💪',
  [BodyPart.BACK]: '🔙',
  [BodyPart.SHOULDERS]: '🤷',
  [BodyPart.ARMS]: '💪',
  [BodyPart.LEGS]: '🦵',
  [BodyPart.ABS]: '🔥',
  [BodyPart.CARDIO]: '🏃'
};

export const BodyPartSelector: React.FC<BodyPartSelectorProps> = ({ onSelectBodyPart }) => {
  const bodyParts = Object.values(BodyPart);

  const renderBodyPart = ({ item }: { item: BodyPart }) => (
    <TouchableOpacity
      style={styles.bodyPartButton}
      onPress={() => onSelectBodyPart(item)}
      activeOpacity={0.8}
    >
      <Text style={styles.icon}>{bodyPartIcons[item]}</Text>
      <Text style={styles.label}>{bodyPartLabels[item]}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>今日はどこを鍛えますか？</Text>
        <FlatList
          data={bodyParts}
          renderItem={renderBodyPart}
          keyExtractor={(item) => item}
          numColumns={2}
          contentContainerStyle={styles.grid}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 40,
    color: '#ffffff',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  grid: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  bodyPartButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    margin: 8,
    width: 160,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    color: '#334155',
    letterSpacing: 0.2,
  },
});