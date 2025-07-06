// models/Favorite.ts
import { Song } from './Song';

export interface Favorite {
  song: Song;
  userId: string;
}
