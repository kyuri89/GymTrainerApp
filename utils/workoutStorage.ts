import { WorkoutSession, HPSSchedule, HPSType } from '../types/workout';

// デフォルトのHPSスケジュール
export const defaultHPSSchedule: HPSSchedule = {
  1: HPSType.H, // 月曜日 - 筋肥大
  3: HPSType.P, // 水曜日 - パワー  
  5: HPSType.S, // 金曜日 - 筋力
};

// ワークアウトセッションを保存する（実際のアプリではAsyncStorageやデータベースを使用）
let workoutSessions: WorkoutSession[] = [];

export const saveWorkoutSession = (session: WorkoutSession): void => {
  const existingIndex = workoutSessions.findIndex(s => s.date === session.date);
  if (existingIndex >= 0) {
    // 既存のセッションに新しい部位を追加
    const existingSession = workoutSessions[existingIndex];
    const newBodyParts = [...new Set([...existingSession.bodyParts, ...session.bodyParts])];
    const newExercises = [...existingSession.exercises, ...session.exercises];
    
    workoutSessions[existingIndex] = {
      ...existingSession,
      bodyParts: newBodyParts,
      exercises: newExercises,
      duration: (existingSession.duration || 0) + (session.duration || 0),
      completed: session.completed
    };
  } else {
    workoutSessions.push(session);
  }
};

export const getWorkoutSessions = (): WorkoutSession[] => {
  return workoutSessions;
};

export const getWorkoutSessionByDate = (date: string): WorkoutSession | undefined => {
  return workoutSessions.find(session => session.date === date);
};

export const completeWorkoutSession = (date: string): void => {
  const session = getWorkoutSessionByDate(date);
  if (session) {
    session.completed = true;
  }
};

export const deleteWorkoutSession = (date: string): void => {
  console.log('削除前のセッション数:', workoutSessions.length);
  console.log('削除対象の日付:', date);
  
  const beforeLength = workoutSessions.length;
  workoutSessions = workoutSessions.filter(session => session.date !== date);
  
  console.log('削除後のセッション数:', workoutSessions.length);
  console.log('削除された件数:', beforeLength - workoutSessions.length);
};

export const updateWorkoutSession = (updatedSession: WorkoutSession): void => {
  const index = workoutSessions.findIndex(session => session.date === updatedSession.date);
  if (index >= 0) {
    workoutSessions[index] = updatedSession;
  } else {
    workoutSessions.push(updatedSession);
  }
};

// 日付のフォーマット（YYYY-MM-DD）
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// 今日の日付を取得
export const getTodayDate = (): string => {
  return formatDate(new Date());
};

// 指定した日付の曜日からHPSタイプを取得
export const getHPSTypeForDate = (date: Date, schedule: HPSSchedule = defaultHPSSchedule): HPSType | null => {
  const dayOfWeek = date.getDay();
  return schedule[dayOfWeek] || null;
};

// 今日のHPSタイプを取得
export const getTodaysHPSType = (): HPSType | null => {
  return getHPSTypeForDate(new Date());
};

// 指定した月の日付配列を生成
export const getMonthDates = (year: number, month: number): Date[] => {
  const dates: Date[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    dates.push(new Date(year, month, day));
  }
  
  return dates;
};

// カレンダー表示用に月の週配列を生成（空の日も含む）
export const getCalendarWeeks = (year: number, month: number): (Date | null)[][] => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  
  // 月の最初の週の空白を埋める
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  const weeks: (Date | null)[][] = [];
  let currentWeek: (Date | null)[] = [];
  
  for (let i = 0; i < 42; i++) { // 6週間分
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    
    if (currentDate.getMonth() === month) {
      currentWeek.push(currentDate);
    } else {
      currentWeek.push(null);
    }
    
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  
  return weeks;
};