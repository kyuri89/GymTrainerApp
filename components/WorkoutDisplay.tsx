import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform, TextInput, TouchableWithoutFeedback } from 'react-native';
import { Exercise, BodyPart, UserWeights, HPSType } from '../types/workout';
import { WeightSettingsModal } from './WeightSettingsModal';
import { calculateHPSWeight, getTodaysHPSType, getHPSTypeLabel } from '../utils/hpsCalculator';
import { saveWorkoutSession, formatDate, getTodayDate } from '../utils/workoutStorage';

interface WorkoutDisplayProps {
  exercises: Exercise[];
  bodyPart: BodyPart;
  onBack: () => void;
  selectedDate?: Date;
  selectedHPSType?: HPSType;
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

export const WorkoutDisplay: React.FC<WorkoutDisplayProps> = ({ 
  exercises, 
  bodyPart, 
  onBack,
  selectedDate,
  selectedHPSType
}) => {
  const todayHPSType = selectedHPSType || getTodaysHPSType();
  const workoutDate = selectedDate || new Date();
  
  const [userWeights, setUserWeights] = useState<UserWeights>({});
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [hpsMode, setHpsMode] = useState(!!selectedHPSType || !!todayHPSType);
  const [selectedWorkoutType, setSelectedWorkoutType] = useState<HPSType>(todayHPSType || HPSType.H);
  const [selectedExercises, setSelectedExercises] = useState<string[]>(exercises.map(ex => ex.id));
  const [exerciseWeights, setExerciseWeights] = useState<{[key: string]: number}>({});
  const [exerciseSets, setExerciseSets] = useState<{[key: string]: number}>({});
  const [exerciseReps, setExerciseReps] = useState<{[key: string]: string}>({});

  const toggleExerciseSelection = (exerciseId: string) => {
    setSelectedExercises(prev => 
      prev.includes(exerciseId)
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const renderExercise = ({ item }: { item: Exercise }) => {
    const isSelected = selectedExercises.includes(item.id);
    let hpsCalculation = null;
    
    if (hpsMode && item.hasWeight && userWeights[item.name]) {
      hpsCalculation = calculateHPSWeight(
        item.name,
        userWeights[item.name],
        currentWeek,
        selectedWorkoutType
      );
    }

    return (
      <TouchableOpacity
        style={[
          styles.exerciseCard,
          !isSelected && styles.unselectedCard
        ]}
        onPress={() => toggleExerciseSelection(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.exerciseHeader}>
          <View style={styles.exerciseInfo}>
            <Text style={[
              styles.exerciseName,
              !isSelected && styles.unselectedText
            ]}>
              {item.name}
            </Text>
            <Text style={[
              styles.equipment,
              !isSelected && styles.unselectedText
            ]}>
              器具: {item.equipment}
            </Text>
          </View>
          <View style={[
            styles.selectionIndicator,
            isSelected && styles.selectedIndicator
          ]}>
            <Text style={[
              styles.selectionText,
              isSelected && styles.selectedText
            ]}>
              {isSelected ? '✓' : '○'}
            </Text>
          </View>
        </View>
        <Text style={[
          styles.description,
          !isSelected && styles.unselectedText
        ]}>
          {item.description}
        </Text>
        
        {hpsCalculation ? (
          <View style={styles.hpsSection}>
            <View style={styles.hpsHeader}>
              <Text style={styles.hpsTypeLabel}>
                HPS - {getHPSTypeLabel(hpsCalculation.hpsType)}
              </Text>
              <Text style={styles.weekLabel}>Week {currentWeek}</Text>
            </View>
            <View style={styles.hpsDetails}>
              <Text style={styles.recommendedWeight}>
                推奨重量: {hpsCalculation.recommendedWeight}kg
              </Text>
              <Text style={styles.maxWeight}>
                (最大重量: {hpsCalculation.currentMax}kg)
              </Text>
            </View>
            <View style={styles.exerciseDetails}>
              <Text style={styles.sets}>{hpsCalculation.sets}セット</Text>
              <Text style={styles.reps}>{hpsCalculation.reps}</Text>
              <Text style={styles.rest}>休憩 {item.restTime}秒</Text>
            </View>
          </View>
        ) : (
          <View style={styles.exerciseDetails}>
            <Text style={styles.sets}>{item.sets}セット</Text>
            <Text style={styles.reps}>{item.reps}回</Text>
            <Text style={styles.rest}>休憩 {item.restTime}秒</Text>
            {item.hasWeight && (!userWeights[item.name] || !hpsMode) && (
              <Text style={styles.weightNeeded}>
                {!userWeights[item.name] ? '重量設定が必要' : 'HPSモードをONにしてください'}
              </Text>
            )}
          </View>
        )}
        
        {/* 実際の重量・セット・回数入力 */}
        {isSelected && (
          <TouchableWithoutFeedback>
            <View style={styles.actualWorkoutSection}>
              <Text style={styles.actualWorkoutTitle}>実際の記録</Text>
              <View style={styles.actualInputsRow}>
                {item.hasWeight && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>重量 (kg)</Text>
                    <TextInput
                      style={styles.weightInput}
                      value={exerciseWeights[item.id]?.toString() || ''}
                      onChangeText={(text) => {
                        // 数字以外の文字を除去して数値として処理
                        const numericText = text.replace(/[^\d.]/g, '');
                        const weight = parseFloat(numericText) || 0;
                        setExerciseWeights(prev => ({...prev, [item.id]: weight}));
                      }}
                      placeholder={hpsCalculation ? hpsCalculation.recommendedWeight.toString() : '0'}
                      keyboardType="default"
                      autoComplete="off"
                      autoCorrect={false}
                    />
                  </View>
                )}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>セット数</Text>
                  <TextInput
                    style={styles.setInput}
                    value={exerciseSets[item.id]?.toString() || ''}
                    onChangeText={(text) => {
                      // 数字以外の文字を除去して整数として処理
                      const numericText = text.replace(/[^\d]/g, '');
                      const sets = parseInt(numericText) || 0;
                      setExerciseSets(prev => ({...prev, [item.id]: sets}));
                    }}
                    placeholder={item.sets.toString()}
                    keyboardType="default"
                    autoComplete="off"
                    autoCorrect={false}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>回数</Text>
                  <TextInput
                    style={styles.repsInput}
                    value={exerciseReps[item.id] || ''}
                    onChangeText={(text) => {
                      setExerciseReps(prev => ({...prev, [item.id]: text}));
                    }}
                    placeholder={item.reps}
                    autoComplete="off"
                    autoCorrect={false}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}
      </TouchableOpacity>
    );
  };

  const selectedExercisesList = exercises.filter(ex => selectedExercises.includes(ex.id));
  
  const totalTime = selectedExercisesList.reduce((total, exercise) => {
    const avgReps = typeof exercise.reps === 'string' && exercise.reps.includes('-') 
      ? parseInt(exercise.reps.split('-')[1]) 
      : 10;
    const exerciseTime = (avgReps * 3 + exercise.restTime * (exercise.sets - 1)) / 60;
    return total + exerciseTime;
  }, 0);

  const hasWeightExercises = exercises.some(ex => ex.hasWeight);

  const handleCompleteWorkout = () => {
    if (selectedExercises.length === 0) {
      if (Platform.OS === 'web') {
        window.alert('少なくとも1つのエクササイズを選択してください');
      } else {
        alert('少なくとも1つのエクササイズを選択してください');
      }
      return;
    }
    
    const exercisesWithActualData = selectedExercisesList.map(exercise => ({
      ...exercise,
      actualWeight: exercise.hasWeight ? exerciseWeights[exercise.id] : undefined,
      actualSets: exerciseSets[exercise.id] || exercise.sets,
      actualReps: exerciseReps[exercise.id] || exercise.reps,
    }));

    const session = {
      id: `${formatDate(workoutDate)}-${bodyPart}`,
      date: formatDate(workoutDate),
      bodyParts: [bodyPart],
      hpsType: selectedWorkoutType,
      exercises: exercisesWithActualData,
      completed: true,
      duration: Math.round(totalTime)
    };
    
    saveWorkoutSession(session);
    onBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← 戻る</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{bodyPartLabels[bodyPart]}のメニュー</Text>
        <View style={styles.hpsTypeSelector}>
          <Text style={styles.selectorLabel}>トレーニングタイプ:</Text>
          <View style={styles.hpsTypeButtons}>
            {Object.values(HPSType).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.hpsTypeButton,
                  selectedWorkoutType === type && styles.activeHpsTypeButton
                ]}
                onPress={() => setSelectedWorkoutType(type)}
              >
                <Text style={[
                  styles.hpsTypeButtonText,
                  selectedWorkoutType === type && styles.activeHpsTypeButtonText
                ]}>
                  {getHPSTypeLabel(type)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {todayHPSType && (
            <Text style={styles.recommendedType}>
              推奨: {getHPSTypeLabel(todayHPSType)}
            </Text>
          )}
        </View>
        <Text style={styles.totalTime}>
          選択済み: {selectedExercises.length}種目 | 予想時間: {Math.round(totalTime)}分
        </Text>
        
        {hasWeightExercises && (
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setShowWeightModal(true)}
            >
              <Text style={styles.controlButtonText}>⚙️ 重量設定</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.controlButton, hpsMode && styles.activeButton]}
              onPress={() => setHpsMode(!hpsMode)}
            >
              <Text style={[styles.controlButtonText, hpsMode && styles.activeButtonText]}>
                {hpsMode ? '🔥 HPS ON' : '💪 HPS OFF'}
              </Text>
            </TouchableOpacity>
            
            {hpsMode && (
              <View style={styles.weekSelector}>
                <Text style={styles.weekSelectorLabel}>Week:</Text>
                {[1, 2, 3, 4, 5, 6].map(week => (
                  <TouchableOpacity
                    key={week}
                    style={[styles.weekButton, currentWeek === week && styles.activeWeekButton]}
                    onPress={() => setCurrentWeek(week)}
                  >
                    <Text style={[styles.weekButtonText, currentWeek === week && styles.activeWeekButtonText]}>
                      {week}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
      
      <FlatList
        data={exercises}
        renderItem={renderExercise}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.exerciseList}
      />
      
      <WeightSettingsModal
        visible={showWeightModal}
        exercises={exercises}
        userWeights={userWeights}
        onSaveWeights={setUserWeights}
        onClose={() => setShowWeightModal(false)}
      />
      
      <View style={styles.completeButtonContainer}>
        <TouchableOpacity
          style={[styles.completeButton, styles.addMoreButton]}
          onPress={() => {
            const exercisesWithActualData = selectedExercisesList.map(exercise => ({
              ...exercise,
              actualWeight: exercise.hasWeight ? exerciseWeights[exercise.id] : undefined,
              actualSets: exerciseSets[exercise.id] || exercise.sets,
              actualReps: exerciseReps[exercise.id] || exercise.reps,
            }));

            saveWorkoutSession({
              id: `${formatDate(workoutDate)}-${bodyPart}`,
              date: formatDate(workoutDate),
              bodyParts: [bodyPart],
              hpsType: selectedWorkoutType,
              exercises: exercisesWithActualData,
              completed: false,
              duration: Math.round(totalTime)
            });
            onBack();
          }}
        >
          <Text style={styles.completeButtonText}>
            ➕ 別の部位も追加で鍛える
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleCompleteWorkout}
        >
          <Text style={styles.completeButtonText}>
            🎉 ワークアウト完了
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 24,
    paddingTop: 60,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#64748b',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 10,
  },
  totalTime: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  exerciseList: {
    padding: 20,
  },
  exerciseCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 4,
    shadowColor: '#64748b',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  equipment: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 15,
    lineHeight: 20,
  },
  exerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 8,
  },
  sets: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  reps: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  rest: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  controlsContainer: {
    marginTop: 15,
    gap: 10,
  },
  controlButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'center',
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: '#007AFF',
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  activeButtonText: {
    color: '#fff',
  },
  weekSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    gap: 8,
  },
  weekSelectorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 10,
  },
  weekButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  activeWeekButton: {
    backgroundColor: '#007AFF',
  },
  weekButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  activeWeekButtonText: {
    color: '#fff',
  },
  hpsSection: {
    backgroundColor: '#e8f4fd',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  hpsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  hpsTypeLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  weekLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  hpsDetails: {
    marginBottom: 8,
  },
  recommendedWeight: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  maxWeight: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  weightNeeded: {
    fontSize: 12,
    color: '#ff6b6b',
    fontStyle: 'italic',
  },
  hpsInfo: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#007AFF',
    marginBottom: 5,
  },
  completeButtonContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 12,
  },
  completeButton: {
    backgroundColor: '#10b981',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  addMoreButton: {
    backgroundColor: '#667eea',
  },
  completeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  disabledButtonText: {
    color: '#666',
  },
  nonHpsDayNote: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  hpsTypeSelector: {
    marginVertical: 10,
    alignItems: 'center',
  },
  selectorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  hpsTypeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  hpsTypeButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeHpsTypeButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  hpsTypeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  activeHpsTypeButtonText: {
    color: '#fff',
  },
  recommendedType: {
    fontSize: 11,
    color: '#007AFF',
    marginTop: 4,
    fontStyle: 'italic',
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  exerciseInfo: {
    flex: 1,
  },
  selectionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  selectedIndicator: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  selectionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ccc',
  },
  selectedText: {
    color: '#fff',
  },
  unselectedCard: {
    opacity: 0.6,
    backgroundColor: '#f8f8f8',
  },
  unselectedText: {
    color: '#999',
  },
  actualWorkoutSection: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  actualWorkoutTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  actualInputsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: '#333',
    marginBottom: 4,
    fontWeight: '600',
  },
  weightInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  setInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  repsInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
    textAlign: 'center',
  },
});