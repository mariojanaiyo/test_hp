import type { ComponentType, ReactNode } from 'react';

/** 動画の1場面。at 秒から次の場面が始まるまで表示される。 */
export interface Scene {
  at: number;
  /** 画面上部のテロップ */
  caption: ReactNode;
  /** 画面下部に積み上がっていく式（前の場面から続く行は再アニメーションしない） */
  formula?: ReactNode[];
  /** テロップを大きくする（タイトル・導入用） */
  big?: boolean;
}

export type Question =
  | {
      kind: 'choice';
      q: ReactNode;
      choices: string[];
      answer: number;
      explain: ReactNode;
      /** 間違えたときに「動画で確かめる」で戻る場面の番号 */
      hintScene?: number;
    }
  | {
      kind: 'number';
      q: ReactNode;
      answer: number;
      tolerance?: number;
      unit?: string;
      explain: ReactNode;
      hintScene?: number;
    };

export interface Lesson {
  id: string;
  no: number;
  emoji: string;
  title: string;
  /** 「なんで？」の問い。カードとページの見出しに使う */
  why: string;
  /** 動画ステージの配色。レッスンごとに雰囲気を変えられる */
  theme?: { bg: string; a: string; b: string; band: string };
  duration: number;
  scenes: Scene[];
  /** 時刻 t(秒) の絵を描く純粋関数。シークが自由にできる */
  Stage: ComponentType<{ t: number }>;
  steps: { title: string; body: ReactNode }[];
  /** 最後にまとめて見せる「Point」 */
  point: ReactNode;
  Playground?: ComponentType;
  quiz: Question[];
}
