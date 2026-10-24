import { circleArea } from './circleArea';
import { piLesson } from './piLesson';
import { triangleArea } from './triangleArea';
import type { Lesson } from './types';

/** レッスンを増やすときは、ここに足すだけ */
export const lessons: Lesson[] = [piLesson, circleArea, triangleArea];

export const findLesson = (id: string) => lessons.find((l) => l.id === id);
