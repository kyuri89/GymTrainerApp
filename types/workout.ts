export interface Exercise {
  id: string;
  name: string;
  bodyPart: BodyPart;
  equipment: string;
  description: string;
  sets: number;
  reps: string;
  restTime: number; // seconds
  hasWeight: boolean; // 重量を扱うエクササイズかどうか
  hpsType?: HPSType; // HPSトレーニングのタイプ
  actualWeight?: number; // 実際に使用した重量（記録用）
  actualSets?: number; // 実際に行ったセット数
  actualReps?: string; // 実際に行った回数
}

export enum BodyPart {
  CHEST = 'chest',
  BACK = 'back',
  SHOULDERS = 'shoulders',
  ARMS = 'arms',
  LEGS = 'legs',
  ABS = 'abs',
  CARDIO = 'cardio'
}

export enum HPSType {
  H = 'hypertrophy', // 筋肥大
  P = 'power',       // パワー
  S = 'strength'     // 筋力
}

export interface WorkoutPlan {
  id: string;
  bodyPart: BodyPart;
  exercises: Exercise[];
  totalTime: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface UserWeights {
  [exerciseName: string]: number; // 1RM (最大重量)
}

export interface HPSCalculation {
  exerciseName: string;
  currentMax: number;
  week: number;
  hpsType: HPSType;
  recommendedWeight: number;
  sets: number;
  reps: string;
}

export interface WorkoutSession {
  id: string;
  date: string; // YYYY-MM-DD format
  bodyParts: BodyPart[]; // 複数部位対応
  hpsType: HPSType;
  exercises: Exercise[];
  completed: boolean;
  duration?: number; // minutes
}

export interface HPSSchedule {
  [dayOfWeek: number]: HPSType; // 0=Sunday, 1=Monday, etc.
}