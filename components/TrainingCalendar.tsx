import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ContributionCalendar } from './ContributionCalendar';
import { WorkoutEditModal } from './WorkoutEditModal';
import { WorkoutSession, HPSType, BodyPart } from '../types/workout';
import { getWorkoutSessions, getTodaysHPSType, formatDate, getWorkoutSessionByDate } from '../utils/workoutStorage';

interface TrainingCalendarProps {
  onDateSelect?: (date: Date, hpsType: HPSType | null) => void;
}

export const TrainingCalendar: React.FC<TrainingCalendarProps> = ({ onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workoutSessions, setWorkoutSessions] = useState(getWorkoutSessions());
  const [editingSession, setEditingSession] = useState<WorkoutSession | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(month + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const handleDatePress = (date: Date) => {
    const dateString = formatDate(date);
    const existingSession = getWorkoutSessionByDate(dateString);
    
    if (existingSession) {
      // 既存の記録がある場合は編集モーダルを開く
      setEditingSession(existingSession);
      setShowEditModal(true);
    } else {
      // 新規トレーニングの場合
      const hpsType = getTodaysHPSType();
      if (onDateSelect) {
        onDateSelect(date, hpsType);
      }
    }
  };

  const handleUpdateSessions = () => {
    setWorkoutSessions(getWorkoutSessions());
  };

  const getMonthStats = () => {
    const monthSessions = workoutSessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate.getFullYear() === year && 
             sessionDate.getMonth() === month && 
             session.completed;
    });

    const hpsCount = {
      [HPSType.H]: monthSessions.filter(s => s.hpsType === HPSType.H).length,
      [HPSType.P]: monthSessions.filter(s => s.hpsType === HPSType.P).length,
      [HPSType.S]: monthSessions.filter(s => s.hpsType === HPSType.S).length,
    };

    // 重量記録のある種目数を計算
    const weightExercisesCount = monthSessions.reduce((count, session) => {
      return count + session.exercises.filter(ex => ex.hasWeight && ex.actualWeight).length;
    }, 0);

    return {
      total: monthSessions.length,
      hpsCount,
      weightExercisesCount
    };
  };

  const stats = getMonthStats();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigateMonth('prev')}>
          <Text style={styles.navButton}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>トレーニングカレンダー</Text>
        <TouchableOpacity onPress={() => navigateMonth('next')}>
          <Text style={styles.navButton}>›</Text>
        </TouchableOpacity>
      </View>

      <ContributionCalendar
        year={year}
        month={month}
        workoutSessions={workoutSessions}
        onDatePress={handleDatePress}
      />

      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>今月の統計</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>総トレーニング日数</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#4ade80' }]}>{stats.hpsCount[HPSType.H]}</Text>
            <Text style={styles.statLabel}>筋肥大 (H)</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#f97316' }]}>{stats.hpsCount[HPSType.P]}</Text>
            <Text style={styles.statLabel}>パワー (P)</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#ef4444' }]}>{stats.hpsCount[HPSType.S]}</Text>
            <Text style={styles.statLabel}>筋力 (S)</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#8b5cf6' }]}>{stats.weightExercisesCount}</Text>
            <Text style={styles.statLabel}>重量記録</Text>
          </View>
        </View>
      </View>

      <View style={styles.scheduleContainer}>
        <Text style={styles.scheduleTitle}>週間スケジュール</Text>
        <View style={styles.scheduleList}>
          <View style={styles.scheduleItem}>
            <Text style={styles.dayLabel}>月曜日</Text>
            <View style={[styles.hpsTag, { backgroundColor: '#4ade80' }]}>
              <Text style={styles.hpsTagText}>H - 筋肥大 (75%)</Text>
            </View>
          </View>
          <View style={styles.scheduleItem}>
            <Text style={styles.dayLabel}>水曜日</Text>
            <View style={[styles.hpsTag, { backgroundColor: '#f97316' }]}>
              <Text style={styles.hpsTagText}>P - パワー (80-90%)</Text>
            </View>
          </View>
          <View style={styles.scheduleItem}>
            <Text style={styles.dayLabel}>金曜日</Text>
            <View style={[styles.hpsTag, { backgroundColor: '#ef4444' }]}>
              <Text style={styles.hpsTagText}>S - 筋力 (85-95%)</Text>
            </View>
          </View>
        </View>
      </View>
      
      <WorkoutEditModal
        visible={showEditModal}
        session={editingSession}
        onClose={() => {
          setShowEditModal(false);
          setEditingSession(null);
        }}
        onUpdate={handleUpdateSessions}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  navButton: {
    fontSize: 24,
    color: '#007AFF',
    paddingHorizontal: 10,
  },
  statsContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    width: '50%',
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  scheduleContainer: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  scheduleList: {
    gap: 8,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  hpsTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  hpsTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
});