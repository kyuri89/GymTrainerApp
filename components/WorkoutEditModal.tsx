import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import { WorkoutSession, HPSType, BodyPart } from '../types/workout';
import { updateWorkoutSession, deleteWorkoutSession } from '../utils/workoutStorage';
import { getHPSTypeLabel } from '../utils/hpsCalculator';

interface WorkoutEditModalProps {
  visible: boolean;
  session: WorkoutSession | null;
  onClose: () => void;
  onUpdate: () => void;
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

export const WorkoutEditModal: React.FC<WorkoutEditModalProps> = ({
  visible,
  session,
  onClose,
  onUpdate
}) => {
  const [selectedHPSType, setSelectedHPSType] = useState<HPSType>(HPSType.H);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);

  useEffect(() => {
    if (session) {
      setSelectedHPSType(session.hpsType);
      setSelectedExercises(session.exercises.map(ex => ex.id));
    }
  }, [session]);

  if (!session) {
    return null;
  }

  const toggleExercise = (exerciseId: string) => {
    setSelectedExercises(prev => 
      prev.includes(exerciseId)
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const handleSave = () => {
    if (selectedExercises.length === 0) {
      if (Platform.OS === 'web') {
        window.alert('少なくとも1つのエクササイズを選択してください');
      } else {
        Alert.alert('エラー', '少なくとも1つのエクササイズを選択してください');
      }
      return;
    }

    const updatedSession: WorkoutSession = {
      ...session,
      hpsType: selectedHPSType,
      exercises: session.exercises.filter(ex => selectedExercises.includes(ex.id))
    };

    updateWorkoutSession(updatedSession);
    onUpdate();
    onClose();
  };

  const handleDelete = () => {
    console.log('削除ボタンがクリックされました:', session?.date);
    
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('このワークアウト記録を削除しますか？');
      console.log('確認結果:', confirmed);
      
      if (confirmed && session) {
        console.log('削除実行:', session.date);
        deleteWorkoutSession(session.date);
        onUpdate();
        onClose();
      }
    } else {
      Alert.alert(
        '記録を削除',
        'このワークアウト記録を削除しますか？',
        [
          { text: 'キャンセル', style: 'cancel' },
          {
            text: '削除',
            style: 'destructive',
            onPress: () => {
              if (session) {
                deleteWorkoutSession(session.date);
                onUpdate();
                onClose();
              }
            }
          }
        ]
      );
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelButton}>キャンセル</Text>
          </TouchableOpacity>
          <Text style={styles.title}>記録編集</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveButton}>保存</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {session.date} - {bodyPartLabels[session.bodyPart]}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>トレーニングタイプ</Text>
            <View style={styles.hpsTypeButtons}>
              {Object.values(HPSType).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.hpsTypeButton,
                    selectedHPSType === type && styles.activeHpsTypeButton
                  ]}
                  onPress={() => setSelectedHPSType(type)}
                >
                  <Text style={[
                    styles.hpsTypeButtonText,
                    selectedHPSType === type && styles.activeHpsTypeButtonText
                  ]}>
                    {getHPSTypeLabel(type)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              エクササイズ選択 ({selectedExercises.length}/{session.exercises.length})
            </Text>
            {session.exercises.map((exercise) => (
              <TouchableOpacity
                key={exercise.id}
                style={[
                  styles.exerciseItem,
                  selectedExercises.includes(exercise.id) && styles.selectedExercise
                ]}
                onPress={() => toggleExercise(exercise.id)}
              >
                <View style={styles.exerciseInfo}>
                  <Text style={[
                    styles.exerciseName,
                    !selectedExercises.includes(exercise.id) && styles.unselectedText
                  ]}>
                    {exercise.name}
                  </Text>
                  <Text style={[
                    styles.exerciseDetails,
                    !selectedExercises.includes(exercise.id) && styles.unselectedText
                  ]}>
                    {exercise.sets}セット × {exercise.reps}回
                  </Text>
                </View>
                <View style={[
                  styles.checkbox,
                  selectedExercises.includes(exercise.id) && styles.checkedBox
                ]}>
                  {selectedExercises.includes(exercise.id) && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.section}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Text style={styles.deleteButtonText}>🗑️ 記録を削除</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
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
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  cancelButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  saveButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  hpsTypeButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  hpsTypeButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeHpsTypeButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  hpsTypeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  activeHpsTypeButtonText: {
    color: '#fff',
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedExercise: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  exerciseDetails: {
    fontSize: 14,
    color: '#666',
  },
  unselectedText: {
    color: '#999',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});