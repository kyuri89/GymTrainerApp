import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert
} from 'react-native';
import { Exercise, UserWeights } from '../types/workout';

interface WeightSettingsModalProps {
  visible: boolean;
  exercises: Exercise[];
  userWeights: UserWeights;
  onSaveWeights: (weights: UserWeights) => void;
  onClose: () => void;
}

export const WeightSettingsModal: React.FC<WeightSettingsModalProps> = ({
  visible,
  exercises,
  userWeights,
  onSaveWeights,
  onClose
}) => {
  const [weights, setWeights] = useState<UserWeights>(userWeights);

  // モーダルが開いた時に最新の重量を設定
  useEffect(() => {
    if (visible) {
      setWeights(userWeights);
    }
  }, [visible, userWeights]);

  const weightExercises = exercises.filter(ex => ex.hasWeight);

  const handleWeightChange = (exerciseName: string, weight: string) => {
    // 数字以外の文字を除去して数値として処理
    const numericText = weight.replace(/[^\d.]/g, '');
    const numWeight = parseFloat(numericText);
    if (!isNaN(numWeight) && numWeight > 0) {
      setWeights(prev => ({
        ...prev,
        [exerciseName]: numWeight
      }));
    } else if (numericText === '') {
      setWeights(prev => {
        const newWeights = { ...prev };
        delete newWeights[exerciseName];
        return newWeights;
      });
    }
  };

  const handleSave = () => {
    onSaveWeights(weights);
    onClose();
  };

  const renderWeightInput = ({ item }: { item: Exercise }) => (
    <View style={styles.inputRow}>
      <Text style={styles.exerciseName}>{item.name}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.weightInput}
          value={weights[item.name]?.toString() || ''}
          onChangeText={(text) => handleWeightChange(item.name, text)}
          placeholder="0"
          keyboardType="default"
          placeholderTextColor="#999"
          autoComplete="off"
          autoCorrect={false}
        />
        <Text style={styles.kgLabel}>kg</Text>
      </View>
    </View>
  );

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
          <Text style={styles.title}>重量設定</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveButton}>保存</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.subtitle}>
            各エクササイズの現在の最大重量（1RM）を設定してください
          </Text>
          
          <FlatList
            data={weightExercises}
            renderItem={renderWeightInput}
            keyExtractor={(item) => item.id}
            style={styles.list}
            showsVerticalScrollIndicator={false}
          />
        </View>
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
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  list: {
    flex: 1,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  exerciseName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weightInput: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    textAlign: 'right',
    width: 80,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  kgLabel: {
    fontSize: 16,
    color: '#666',
  },
});