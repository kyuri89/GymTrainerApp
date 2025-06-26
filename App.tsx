import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BodyPartSelector } from './components/BodyPartSelector';
import { WorkoutDisplay } from './components/WorkoutDisplay';
import { TrainingCalendar } from './components/TrainingCalendar';
import { BodyPart, Exercise, HPSType } from './types/workout';
import { getRecommendedExercises } from './utils/workoutGenerator';

type Screen = 'home' | 'workout' | 'calendar';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPart | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedHPSType, setSelectedHPSType] = useState<HPSType | undefined>();

  const handleBodyPartSelect = (bodyPart: BodyPart) => {
    const recommendedExercises = getRecommendedExercises(bodyPart);
    setExercises(recommendedExercises);
    setSelectedBodyPart(bodyPart);
    setCurrentScreen('workout');
  };

  const handleCalendarDateSelect = (date: Date, hpsType: HPSType | null) => {
    setSelectedDate(date);
    setSelectedHPSType(hpsType || undefined);
    setCurrentScreen('home');
  };

  const handleBack = () => {
    setSelectedBodyPart(null);
    setExercises([]);
    setSelectedDate(undefined);
    setSelectedHPSType(undefined);
    setCurrentScreen('home');
  };

  const renderTabBar = () => (
    <LinearGradient
      colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.9)']}
      style={styles.tabBar}
    >
      <TouchableOpacity
        style={[styles.tab, currentScreen === 'home' && styles.activeTab]}
        onPress={() => setCurrentScreen('home')}
      >
        <Text style={[styles.tabText, currentScreen === 'home' && styles.activeTabText]}>
          🏋️ トレーニング
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, currentScreen === 'calendar' && styles.activeTab]}
        onPress={() => setCurrentScreen('calendar')}
      >
        <Text style={[styles.tabText, currentScreen === 'calendar' && styles.activeTabText]}>
          📅 カレンダー
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );

  const renderContent = () => {
    if (currentScreen === 'workout' && selectedBodyPart) {
      return (
        <WorkoutDisplay 
          exercises={exercises}
          bodyPart={selectedBodyPart}
          onBack={handleBack}
          selectedDate={selectedDate}
          selectedHPSType={selectedHPSType}
        />
      );
    }
    
    if (currentScreen === 'calendar') {
      return (
        <TrainingCalendar 
          onDateSelect={handleCalendarDateSelect}
          key={currentScreen} // 画面切り替え時に再レンダリング
        />
      );
    }
    
    return <BodyPartSelector onSelectBodyPart={handleBodyPartSelect} />;
  };

  return (
    <View style={styles.container}>
      {renderContent()}
      {currentScreen !== 'workout' && renderTabBar()}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 0,
    paddingBottom: 30,
    paddingTop: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  activeTab: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    marginHorizontal: 4,
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
    letterSpacing: 0.3,
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
