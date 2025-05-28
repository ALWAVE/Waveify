import { useEffect, useRef } from "react";

const useHQAudio = (url: string, isHQ: boolean) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(url);
      audioRef.current.crossOrigin = "anonymous";
    }

    if (isHQ && !contextRef.current) {
      contextRef.current = new AudioContext();

      const source = contextRef.current.createMediaElementSource(audioRef.current);
      const filter = contextRef.current.createBiquadFilter();
      filter.type = "highshelf";  // Усиливаем высокие частоты
      filter.frequency.setValueAtTime(3000, contextRef.current.currentTime);  // Частота для высоких
      filter.gain.setValueAtTime(5, contextRef.current.currentTime);  // Усиление на 5 дБ

      source.connect(filter);
      filter.connect(contextRef.current.destination);

      sourceRef.current = source;
      filterRef.current = filter;
    } else if (!isHQ && contextRef.current) {
      // Отключаем фильтры, если HQ выключен
      contextRef.current.close();
      contextRef.current = null;
    }

    return () => {
      if (contextRef.current) {
        contextRef.current.close(); // Закрытие контекста аудио при размонтировании
      }
    };
  }, [url, isHQ]);

  const play = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const getCurrentTime = () => audioRef.current?.currentTime || 0;
  const getDuration = () => audioRef.current?.duration || 0;
  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  return { play, pause, getCurrentTime, getDuration, seek, audio: audioRef.current };
};

export default useHQAudio;
