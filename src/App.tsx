import { useEffect, useState } from 'react';
import { Home } from './components/Home';
import { LessonPage } from './components/LessonPage';
import { findLesson } from './lessons';

const readHash = () => window.location.hash.replace(/^#/, '') || '/';

export default function App() {
  const [route, setRoute] = useState(readHash);

  useEffect(() => {
    const onChange = () => {
      setRoute(readHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const m = route.match(/^\/lesson\/([\w-]+)/);
  const lesson = m ? findLesson(m[1]) : undefined;
  return lesson ? <LessonPage key={lesson.id} lesson={lesson} /> : <Home />;
}
