import { Exercise, BodyPart, WorkoutPlan } from '../types/workout';
import { exercises } from '../data/exercises';

export const generateWorkoutPlan = (bodyPart: BodyPart, difficulty: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'): WorkoutPlan => {
  const filteredExercises = exercises.filter(exercise => exercise.bodyPart === bodyPart);
  
  let selectedExercises: Exercise[];
  
  switch (difficulty) {
    case 'beginner':
      selectedExercises = filteredExercises.slice(0, 2);
      break;
    case 'intermediate':
      selectedExercises = filteredExercises.slice(0, 3);
      break;
    case 'advanced':
      selectedExercises = filteredExercises;
      break;
    default:
      selectedExercises = filteredExercises.slice(0, 3);
  }
  
  const totalTime = selectedExercises.reduce((total, exercise) => {
    const avgReps = typeof exercise.reps === 'string' && exercise.reps.includes('-') 
      ? parseInt(exercise.reps.split('-')[1]) 
      : 10;
    const exerciseTime = (avgReps * 3 + exercise.restTime * (exercise.sets - 1)) / 60;
    return total + exerciseTime;
  }, 0);

  return {
    id: `workout-${bodyPart}-${Date.now()}`,
    bodyPart,
    exercises: selectedExercises,
    totalTime: Math.round(totalTime),
    difficulty
  };
};

export const getRecommendedExercises = (bodyPart: BodyPart): Exercise[] => {
  const workoutPlan = generateWorkoutPlan(bodyPart);
  return workoutPlan.exercises;
};