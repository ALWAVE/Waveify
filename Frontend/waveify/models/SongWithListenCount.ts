// models/SongWithListenCount.ts
import { Song } from "./Song";

export interface SongWithListenCount extends Song {
  listenCount: number;
}
