import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { WorkoutSession, HPSType } from '../types/workout';
import { getCalendarWeeks, formatDate } from '../utils/workoutStorage';

interface ContributionCalendarProps {
  year: number;
  month: number;
  workoutSessions: WorkoutSession[];
  onDatePress?: (date: Date) => void;
}

const hpsColors = {
  [HPSType.H]: '#4ade80', // 緑 - 筋肥大
  [HPSType.P]: '#f97316', // オレンジ - パワー
  [HPSType.S]: '#ef4444', // 赤 - 筋力
};

const hpsLabels = {
  [HPSType.H]: 'H',
  [HPSType.P]: 'P', 
  [HPSType.S]: 'S',
};

export const ContributionCalendar: React.FC<ContributionCalendarProps> = ({
  year,
  month,
  workoutSessions,
  onDatePress
}) => {
  const weeks = getCalendarWeeks(year, month);
  const dayLabels = ['日', '月', '火', '水', '木', '金', '土'];
  
  const getWorkoutForDate = (date: Date): WorkoutSession | undefined => {
    const dateString = formatDate(date);
    return workoutSessions.find(session => session.date === dateString && session.completed);
  };

  const renderDay = (date: Date | null, index: number) => {
    if (!date) {
      return <View key={index} style={styles.emptyDay} />;
    }

    const workout = getWorkoutForDate(date);
    const isToday = formatDate(date) === formatDate(new Date());
    const isCurrentMonth = date.getMonth() === month;

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.day,
          !isCurrentMonth && styles.otherMonthDay,
          isToday && styles.today,
          workout && styles.workoutDay,
          workout && { backgroundColor: hpsColors[workout.hpsType] }
        ]}
        onPress={() => onDatePress && onDatePress(date)}
      >
        <Text style={[
          styles.dayText,
          !isCurrentMonth && styles.otherMonthText,
          isToday && styles.todayText,
          workout && styles.workoutDayText
        ]}>
          {date.getDate()}
        </Text>
        {workout && (
          <View style={styles.workoutInfo}>
            <Text style={styles.hpsLabel}>
              {hpsLabels[workout.hpsType]}
            </Text>
            {workout.bodyParts && workout.bodyParts.length > 1 && (
              <Text style={styles.multiPartIndicator}>
                +{workout.bodyParts.length - 1}
              </Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderWeek = (week: (Date | null)[], weekIndex: number) => (
    <View key={weekIndex} style={styles.week}>
      {week.map(renderDay)}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.monthTitle}>
          {year}年 {month + 1}月
        </Text>
        <View style={styles.legend}>
          {Object.entries(hpsColors).map(([type, color]) => (
            <View key={type} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: color }]} />
              <Text style={styles.legendText}>{hpsLabels[type as HPSType]}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.dayHeaders}>
        {dayLabels.map((label, index) => (
          <Text key={index} style={styles.dayHeader}>
            {label}
          </Text>
        ))}
      </View>
      
      <View style={styles.calendar}>
        {weeks.map(renderWeek)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 16,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#333',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  dayHeaders: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    paddingVertical: 4,
  },
  calendar: {
    gap: 2,
  },
  week: {
    flexDirection: 'row',
    gap: 2,
  },
  day: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
    minHeight: 40,
  },
  emptyDay: {
    flex: 1,
    aspectRatio: 1,
  },
  workoutDay: {
    borderColor: 'transparent',
  },
  today: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  otherMonthDay: {
    backgroundColor: 'transparent',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  workoutDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  todayText: {
    fontWeight: 'bold',
  },
  otherMonthText: {
    color: '#ccc',
  },
  workoutInfo: {
    alignItems: 'center',
    marginTop: 2,
  },
  hpsLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  multiPartIndicator: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 6,
    paddingHorizontal: 3,
    paddingVertical: 1,
    marginTop: 1,
  },
});