import { useEffect, useState } from 'react';
import { Home } from './components/Home';
import { LessonPage } from './components/LessonPage';
import { findLesson } from './lessons';

const readHash = () => window.location.hash.replace(/^#/, '') || '/';

export default function App() {
  const [route, setRoute] = useState(readHash);

  useEffect(() => {
    const go = (to: string) => {
      setRoute(to);
      window.scrollTo(0, 0);
    };
    const onHash = () => go(readHash());
    // 埋め込み表示などでURLのハッシュが使えなくても動くよう、ページ内リンクは自前で切り替える
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest('a[href^="#/"]');
      if (!a) return;
      e.preventDefault();
      go(a.getAttribute('href')!.slice(1));
    };
    window.addEventListener('hashchange', onHash);
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('hashchange', onHash);
      document.removeEventListener('click', onClick);
    };
  }, []);

  const m = route.match(/^\/lesson\/([\w-]+)/);
  const lesson = m ? findLesson(m[1]) : undefined;
  return lesson ? <LessonPage key={lesson.id} lesson={lesson} /> : <Home />;
}
