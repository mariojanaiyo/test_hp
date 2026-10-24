import { useCallback, useEffect, useRef, useState } from 'react';

/** 時間(秒)を進める小さな再生エンジン。絵は t の関数なので、シーク・倍速・一時停止が自由。 */
export function usePlayer(duration: number) {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const tRef = useRef(0);

  const seek = useCallback(
    (to: number) => {
      tRef.current = Math.min(duration, Math.max(0, to));
      setT(tRef.current);
    },
    [duration],
  );

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const next = tRef.current + ((now - last) / 1000) * rate;
      last = now;
      if (next >= duration) {
        tRef.current = duration;
        setT(duration);
        setPlaying(false);
        return;
      }
      tRef.current = next;
      setT(next);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, rate, duration]);

  const play = useCallback(() => {
    if (tRef.current >= duration - 0.01) seek(0);
    setPlaying(true);
  }, [duration, seek]);
  const pause = useCallback(() => setPlaying(false), []);

  return { t, playing, rate, setRate, seek, play, pause };
}
