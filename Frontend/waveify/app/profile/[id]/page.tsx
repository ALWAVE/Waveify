"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import ButtonLogin from "@/component/ButtonLogin";
import SongItem from "@/component/SongItem";
import { Song } from "@/models/Song";

interface UserProfile {
  id: string;
  userName: string;
  subTitle?: string;
  plays?: number;
  likes?: number;
  subscribers?: number;
  subscription?: {
    title: string;
    color: string;
  };
}

const Profile = () => {
  const { user: currentUser } = useAuth();
  const params = useParams();
  const router = useRouter();

  const [profileUser, setProfileUser] = useState<UserProfile | null>(null);
  const userId = params?.id as string | undefined;
  const [songs, setSongs] = useState<Song[]>([]);
  useEffect(() => {
    const loadUser = async () => {
      if (!userId || userId === currentUser?.id) {
        setProfileUser(currentUser);
        return;
      }

      try {
        const res = await fetch(`https://localhost:7040/api/User/${userId}`);
        if (!res.ok) throw new Error("User not found");
        const data = await res.json();
        setProfileUser(data);
      } catch (error) {
        console.error("❌ Ошибка загрузки пользователя:", error);
        router.push("/404");
      }
    };

    loadUser();
  }, [userId, currentUser, router]);
  useEffect(() => {
    const loadSongs = async () => {
      if (!profileUser?.id) return;

      try {
        const res = await fetch(`https://localhost:7040/Song/user/${profileUser.id}/published`);
        if (!res.ok) throw new Error("Failed to load songs");
        const data = await res.json();
        setSongs(data);
      } catch (error) {
        console.error("❌ Ошибка загрузки песен:", error);
      }
    };

    loadSongs();
  }, [profileUser?.id]);
  if (!profileUser) return <div>Загрузка...</div>;

  return (
    <div className="p-4 bg-[var(--bgPage)] rounded-lg w-full h-full overflow-y-auto">
      <div className="text-[var(--text)] mb-2 flex-col gap-y-6">
        <h1 className="p-6 mb-4 text-3xl font-semibold flex items-center gap-2">
          Profile, {profileUser.userName}
          {profileUser.subscription && (
            <span
              className="ml-2 px-2 py-1 rounded text-sm font-medium"
              style={{
                backgroundColor: profileUser.subscription.color,
                color: "#fff",
              }}
            >
              {profileUser.subscription.title}
            </span>
          )}
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8 gap-4 mt-4">
          {/* Аватар-заглушка */}
          <div className="relative aspect-square w-full h-full rounded-md overflow-hidden bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-5xl font-bold">
            {profileUser.userName[0]}
          </div>
{/* 
          <div>
            <h2 className="p-6 mb-4 text-2xl font-semibold">
              NickName: {profileUser.userName}
            </h2>
            <ButtonLogin className="w-44 ml-5 font-semibold">
              Subscribe
            </ButtonLogin>
            <ButtonLogin className="w-44 mt-5 ml-5 bg-purple-500 font-semibold">
              Donate
            </ButtonLogin>
          </div> */}

          {/* <div className="col-span-2 sm:col-span-1 md:col-span-1">
            <h3 className="p-6 text-base font-semibold">
              Plays: {profileUser.plays ?? 0}
              <br />
              Likes: {profileUser.likes ?? 0}
              <br />
              Subscribers: {profileUser.subscribers ?? 0}
            </h3>
          </div> */}
        </div>

        <h2 className="p-6 mb-4 text-3xl font-semibold">Tracks</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8 gap-4 mt-4">
          {songs.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">Песен нет</p>
          ) : (
            songs.map((song) => (
              <SongItem key={song.id} data={song} />
            ))
          )}
        </div>


      </div>
    </div>
  );
};

export default Profile;
