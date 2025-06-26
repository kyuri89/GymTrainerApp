import { HPSType, HPSCalculation } from '../types/workout';

// HPSトレーニングの重量計算ロジック
export const calculateHPSWeight = (
  exerciseName: string,
  currentMax: number,
  week: number,
  hpsType: HPSType
): HPSCalculation => {
  let recommendedWeight: number;
  let sets: number;
  let reps: string;

  switch (hpsType) {
    case HPSType.H: // 筋肥大の日
      // MAXの75%固定で6週間
      recommendedWeight = Math.ceil(currentMax * 0.75 / 2.5) * 2.5; // 2.5kg単位で切り上げ
      sets = 5;
      reps = '8';
      break;

    case HPSType.P: // パワーの日
      // 週ごとに重量を上げていく（80%から90%）
      const powerPercentages = [0.80, 0.82, 0.84, 0.86, 0.88, 0.90];
      const powerPercentage = powerPercentages[Math.min(week - 1, 5)];
      recommendedWeight = Math.ceil(currentMax * powerPercentage / 2.5) * 2.5;
      sets = 5;
      reps = '1（爆発的挙上）';
      break;

    case HPSType.S: // 筋力の日
      // 週ごとに重量を上げていく（85%から95%）
      const strengthPercentages = [0.85, 0.87, 0.89, 0.91, 0.93, 0.95];
      const strengthPercentage = strengthPercentages[Math.min(week - 1, 5)];
      recommendedWeight = Math.ceil(currentMax * strengthPercentage / 2.5) * 2.5;
      sets = 3;
      reps = '限界まで';
      break;
  }

  return {
    exerciseName,
    currentMax,
    week,
    hpsType,
    recommendedWeight,
    sets,
    reps
  };
};

// 6週間のHPSプログラムを生成
export const generateHPSProgram = (
  exerciseName: string,
  currentMax: number
): HPSCalculation[] => {
  const program: HPSCalculation[] = [];
  
  for (let week = 1; week <= 6; week++) {
    // 各週にH、P、Sの3つのトレーニングを追加
    Object.values(HPSType).forEach(hpsType => {
      program.push(calculateHPSWeight(exerciseName, currentMax, week, hpsType));
    });
  }
  
  return program;
};

// 今日のトレーニングタイプを決定（簡単な例：日付ベース）
export const getTodaysHPSType = (): HPSType | null => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  
  // 月曜日: H, 水曜日: P, 金曜日: S のサイクル
  if (dayOfWeek === 1) return HPSType.H;
  if (dayOfWeek === 3) return HPSType.P;
  if (dayOfWeek === 5) return HPSType.S;
  
  // トレーニング日でない場合はnull
  return null;
};

// HPSタイプの日本語ラベル
export const getHPSTypeLabel = (hpsType: HPSType): string => {
  switch (hpsType) {
    case HPSType.H:
      return '筋肥大の日';
    case HPSType.P:
      return 'パワーの日';
    case HPSType.S:
      return '筋力の日';
  }
};