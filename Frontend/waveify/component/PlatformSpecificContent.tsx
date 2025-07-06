// "use client";

// import { usePlatform } from "@/providers/PlatformProvider";
// import Sidebar from "@/component/Sidebar";
// import TitleBar from "@/component/TitleBar";
// import MobileBar from "@/component/MobileBar";
// import Player from "@/component/Player";
// import PlayerWrapper from "@/component/PlayerWrapper";

// export default function PlatformSpecificContent({ children }: { children: React.ReactNode }) {
//   const platform = usePlatform();

//   return (
//     <>
//       {platform === "desktop" && <TitleBar />}
//       {platform === "desktop" && <Sidebar />}
//       {platform === "mobile" && <MobileBar />}
//       {platform === "electron" && <MobileBar />}
      
//       <PlayerWrapper>
//         <Player />
//       </PlayerWrapper>

//       <main className="flex-1 bg-[var(--bg)] h-[calc(100%-80px)] overflow-y-auto pr-2 pl-2 relative z-0">
//         {children}
//       </main>
//     </>
//   );
// }
