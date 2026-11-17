import type { VideoTutorial } from './types';
import scripts from './videos.json';
import durations from './videoDurations.json';

/**
 * Videotutoriales. El texto de cada escena aparece en pantalla (es el subtítulo)
 * y también se muestra como transcripción. Los mismos guiones se usan para
 * generar los videos (scripts/videos), así nunca se desincronizan.
 */
export const VIDEOS: VideoTutorial[] = (scripts as Omit<VideoTutorial, 'file' | 'poster' | 'seconds'>[]).map((v) => ({
  ...v,
  file: `media/videos/${v.id}.mp4`,
  poster: `media/videos/${v.id}.jpg`,
  seconds: (durations as Record<string, number>)[v.id] ?? 30,
}));
