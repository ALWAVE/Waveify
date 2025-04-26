// 'use client';

// import React from "react";
// import { usePlatform } from "@/providers/PlatformProvider";
// import Sidebar from "@/component/Sidebar";
// import Header from "@/component/Header";
// import TitleBar from "@/component/TitleBar";
// import MobileBar from "@/component/MobileBar";
// import PlayerWrapper from "@/component/PlayerWrapper";
// import Player from "@/component/Player";

// export default function LayoutContent({ children }: { children: React.ReactNode }) {
//   const platform = usePlatform();

//   // Лог для отладки
//   console.log("Rendering LayoutContent with children:", children);

//   return (
//     <div className="flex flex-col h-screen bg-[var(--bg)]">
//       <Header />
//       {platform === "web-desktop" && <TitleBar />}
      
//       <div className="flex flex-1 overflow-hidden">
//         {platform === "web-desktop" && <Sidebar />}
//         <main className="flex-1 bg-[var(--bg)] h-[calc(100%-80px)] overflow-y-auto px-2 relative z-0">
//           {children}
//         </main>
//       </div>
      
//       {platform.includes("mobile") && <MobileBar />}
      
//       <PlayerWrapper>
//         <Player />
//       </PlayerWrapper>
//     </div>
//   );
// }
