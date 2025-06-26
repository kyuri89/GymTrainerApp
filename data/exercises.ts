import { Exercise, BodyPart } from '../types/workout';

export const exercises: Exercise[] = [
  // 胸筋
  {
    id: '1',
    name: 'ベンチプレス',
    bodyPart: BodyPart.CHEST,
    equipment: 'バーベル',
    description: '胸筋全体を鍛える基本的なエクササイズ',
    sets: 3,
    reps: '8-12',
    restTime: 90,
    hasWeight: true
  },
  {
    id: '2',
    name: 'プッシュアップ',
    bodyPart: BodyPart.CHEST,
    equipment: '自重',
    description: '胸筋と三頭筋を鍛える基本動作',
    sets: 3,
    reps: '10-15',
    restTime: 60,
    hasWeight: false
  },
  {
    id: '3',
    name: 'ダンベルフライ',
    bodyPart: BodyPart.CHEST,
    equipment: 'ダンベル',
    description: '胸筋の外側を集中的に鍛える',
    sets: 3,
    reps: '10-12',
    restTime: 75,
    hasWeight: true
  },

  // 背中
  {
    id: '4',
    name: 'デッドリフト',
    bodyPart: BodyPart.BACK,
    equipment: 'バーベル',
    description: '背中全体と下半身を鍛える複合運動',
    sets: 3,
    reps: '5-8',
    restTime: 120,
    hasWeight: true
  },
  {
    id: '5',
    name: 'プルアップ',
    bodyPart: BodyPart.BACK,
    equipment: '懸垂バー',
    description: '広背筋と上腕二頭筋を鍛える',
    sets: 3,
    reps: '5-10',
    restTime: 90,
    hasWeight: false
  },
  {
    id: '6',
    name: 'ラットプルダウン',
    bodyPart: BodyPart.BACK,
    equipment: 'ケーブルマシン',
    description: '広背筋を集中的に鍛える',
    sets: 3,
    reps: '8-12',
    restTime: 75,
    hasWeight: true
  },

  // 肩
  {
    id: '7',
    name: 'ショルダープレス',
    bodyPart: BodyPart.SHOULDERS,
    equipment: 'ダンベル',
    description: '肩の前部と中部を鍛える',
    sets: 3,
    reps: '8-12',
    restTime: 75,
    hasWeight: true
  },
  {
    id: '8',
    name: 'サイドレイズ',
    bodyPart: BodyPart.SHOULDERS,
    equipment: 'ダンベル',
    description: '肩の中部を集中的に鍛える',
    sets: 3,
    reps: '12-15',
    restTime: 60,
    hasWeight: true
  },

  // 腕
  {
    id: '9',
    name: 'バイセップカール',
    bodyPart: BodyPart.ARMS,
    equipment: 'ダンベル',
    description: '上腕二頭筋を鍛える',
    sets: 3,
    reps: '10-12',
    restTime: 60,
    hasWeight: true
  },
  {
    id: '10',
    name: 'トライセップエクステンション',
    bodyPart: BodyPart.ARMS,
    equipment: 'ダンベル',
    description: '上腕三頭筋を鍛える',
    sets: 3,
    reps: '10-12',
    restTime: 60,
    hasWeight: true
  },

  // 脚
  {
    id: '11',
    name: 'スクワット',
    bodyPart: BodyPart.LEGS,
    equipment: 'バーベル',
    description: '下半身全体を鍛える基本運動',
    sets: 3,
    reps: '8-12',
    restTime: 90,
    hasWeight: true
  },
  {
    id: '12',
    name: 'レッグプレス',
    bodyPart: BodyPart.LEGS,
    equipment: 'レッグプレスマシン',
    description: '太ももとお尻を安全に鍛える',
    sets: 3,
    reps: '10-15',
    restTime: 75,
    hasWeight: true
  },
  {
    id: '13',
    name: 'カーフレイズ',
    bodyPart: BodyPart.LEGS,
    equipment: 'ダンベル',
    description: 'ふくらはぎを鍛える',
    sets: 3,
    reps: '15-20',
    restTime: 45,
    hasWeight: true
  },

  // 腹筋
  {
    id: '14',
    name: 'プランク',
    bodyPart: BodyPart.ABS,
    equipment: '自重',
    description: 'コア全体を安定させる',
    sets: 3,
    reps: '30-60秒',
    restTime: 60,
    hasWeight: false
  },
  {
    id: '15',
    name: 'クランチ',
    bodyPart: BodyPart.ABS,
    equipment: '自重',
    description: '腹直筋を集中的に鍛える',
    sets: 3,
    reps: '15-20',
    restTime: 45,
    hasWeight: false
  },

  // 有酸素
  {
    id: '16',
    name: 'ランニング',
    bodyPart: BodyPart.CARDIO,
    equipment: 'ランニングマシン',
    description: '心肺機能を向上させる',
    sets: 1,
    reps: '20-30分',
    restTime: 0,
    hasWeight: false
  },
  {
    id: '17',
    name: 'バイク',
    bodyPart: BodyPart.CARDIO,
    equipment: 'エアロバイク',
    description: '下半身の持久力を向上',
    sets: 1,
    reps: '15-25分',
    restTime: 0,
    hasWeight: false
  }
];