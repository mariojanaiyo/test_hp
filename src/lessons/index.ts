import { circleArea } from './circleArea';
import { piLesson } from './piLesson';
import { inscribedAngle } from './inscribedAngle';
import { pythagoras } from './pythagoras';
import { triangleArea } from './triangleArea';
import type { Lesson } from './types';

/** レッスンを増やすときは、ここに足すだけ */
export const lessons: Lesson[] = [piLesson, circleArea, triangleArea, pythagoras, inscribedAngle];

export const findLesson = (id: string) => lessons.find((l) => l.id === id);
