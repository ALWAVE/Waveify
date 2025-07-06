// "use client"
// import React, { useState } from "react";
// import { Download, Share2, Heart } from "lucide-react";
// import PlayButton from "@/component/PlayButton";
// import { Badge } from "@/component/Badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/component/Tabs";
// import ButtonLogin from "@/component/ButtonLogin";


// const Beat = () => {
//   const [isLiked, setIsLiked] = useState(false);
  
//   // Sample beat data
//   const currentBeat = {
//     title: "Night Vibes",
//     artist: "Producer X",
//     price: "$29.99",
//     image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80",
//     bpm: 140,
//     key: "C min",
//     description: "Deep atmospheric beat with heavy 808s and ambient melodies. Perfect for modern rap and R&B tracks.",
//     tags: ["Trap", "Dark", "Ambient", "808"]
//   };
  
//   // Sample related beats
//   const relatedBeats = [
//     {
//       title: "Urban Dreams",
//       artist: "Producer X",
//       price: "$24.99",
//       image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
//       bpm: 145,
//       key: "G min",
//       tags: ["Trap", "Dark"]
//     },
//     {
//       title: "Midnight Run",
//       artist: "Beat Master",
//       price: "$19.99",
//       image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=600&q=80",
//       bpm: 130,
//       key: "F min",
//       tags: ["Hip Hop", "Chill"]
//     },
//     {
//       title: "Electric Flow",
//       artist: "SoundWave",
//       price: "$34.99",
//       image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
//       bpm: 150,
//       key: "D min",
//       tags: ["Electronic", "Dance"]
//     }
//   ];

//   const licenseOptions = [
//     { name: "Basic License", price: "$29.99", features: ["MP3 File", "Non-Profit Use", "500 Streams"] },
//     { name: "Premium License", price: "$79.99", features: ["WAV + MP3 Files", "Commercial Use", "10,000 Streams", "Trackout Files"] },
//     { name: "Unlimited License", price: "$199.99", features: ["WAV + MP3 Files", "Unlimited Commercial Use", "Unlimited Streams", "Full Trackout Files", "Exclusive Rights"] }
//   ];
  
//   return (
//     <div className="bg-[var(--bgPage)] text-white ">
//       {/* Main content */}
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex flex-col sm:flex-row gap-6">
//           {/* Left side - Beat image and details */}
//           <div className="w-full sm:w-1/3">
//             <div className="sticky top-4">
//               <div className="bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800">
//                 <div className="relative aspect-square w-full">
//                   <img 
//                     src={currentBeat.image} 
//                     alt={currentBeat.title} 
//                     className="w-full h-full object-cover"
//                   />
//                   <div className="absolute bottom-4 right-4">
//                     <PlayButton size={40} />
//                   </div>
                  
//                   <div className="absolute top-4 right-4 flex gap-2">
//                     <Badge className="bg-rose-500 hover:bg-rose-600">
//                       {currentBeat.price}
//                     </Badge>
//                   </div>
//                 </div>
                
//                 <div className="p-4">
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <h2 className="text-xl font-bold">{currentBeat.title}</h2>
//                       <p className="text-neutral-400 text-sm">by {currentBeat.artist}</p>
//                     </div>
                    
//                     <button 
//                       onClick={() => setIsLiked(!isLiked)}
//                       className="text-neutral-400 hover:text-rose-500 transition"
//                     >
//                       <Heart fill={isLiked ? "#f43f5e" : "none"} color={isLiked ? "#f43f5e" : "currentColor"} />
//                     </button>
//                   </div>
                  
//                   <div className="flex items-center gap-2 mt-4">
//                     <Badge variant="outline" className="border-neutral-700">
//                       {currentBeat.bpm} BPM
//                     </Badge>
//                     <Badge variant="outline" className="border-neutral-700">
//                       {currentBeat.key}
//                     </Badge>
//                   </div>
                  
//                   <div className="flex flex-wrap gap-1 mt-3">
//                     {currentBeat.tags.map((tag, i) => (
//                       <Badge key={i} variant="secondary" className="bg-neutral-800 hover:bg-neutral-700">
//                         {tag}
//                       </Badge>
//                     ))}
//                   </div>
                  
//                   <div className="mt-6">
//                     <h3 className="text-sm font-medium text-neutral-300 mb-2">Description:</h3>
//                     <p className="text-neutral-400 text-sm">{currentBeat.description}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           {/* Right side - Audio player, licenses, etc. */}
//           <div className="w-full sm:w-2/3">
//             {/* Audio waveform player */}
//             {/* <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800 mb-6">
//               <div className="flex items-center gap-4 mb-4">
//                 <PlayButton />
//                 <div className="text-sm">
//                   <p className="text-white font-medium">{currentBeat.title}</p>
//                   <p className="text-neutral-400">{currentBeat.artist}</p>
//                 </div>
//               </div>
              

              
//               <div className="flex justify-between mt-4 text-neutral-400 text-xs">
//                 <span>0:00</span>
//                 <span>2:34</span>
//               </div>
//             </div> */}
            
//             {/* License Options */}
//             <div className="bg-neutral-900 rounded-lg border border-neutral-800 mb-6">
//               <div className="p-4 border-b border-neutral-800">
//                 <h2 className="text-xl font-bold">License Options</h2>
//               </div>
              
//               <div className="p-4">
//                 <Tabs defaultValue="basic">
//                   <TabsList className="grid grid-cols-3 mb-4">
//                     <TabsTrigger value="basic">Basic</TabsTrigger>
//                     <TabsTrigger value="premium">Premium</TabsTrigger>
//                     <TabsTrigger value="unlimited">Unlimited</TabsTrigger>
//                   </TabsList>
                  
//                   {licenseOptions.map((license, index) => (
//                     <TabsContent key={index} value={license.name.toLowerCase().split(' ')[0]}>
//                       <div className="bg-neutral-800 rounded-lg p-4">
//                         <div className="flex justify-between items-center mb-4">
//                           <h3 className="text-lg font-bold">{license.name}</h3>
//                           <span className="text-rose-500 font-bold">{license.price}</span>
//                         </div>
                        
//                         <ul className="space-y-2 mb-4">
//                           {license.features.map((feature, i) => (
//                             <li key={i} className="text-neutral-300 text-sm flex items-center gap-2">
//                               <div className="w-1 h-1 bg-rose-500 rounded-full"></div>
//                               {feature}
//                             </li>
//                           ))}
//                         </ul>
                        
//                         <ButtonLogin className="w-full bg-rose-500 hover:bg-rose-600 text-white">
//                           <Download className="mr-2 h-4 w-4" /> Purchase License
//                         </ButtonLogin>
//                       </div>
//                     </TabsContent>
//                   ))}
//                 </Tabs>
//               </div>
//             </div>
            
//             {/* Related beats */}
//             <div className="bg-neutral-900 rounded-lg border border-neutral-800">
//               <div className="p-4 border-b border-neutral-800">
//                 <h2 className="text-xl font-bold">More beats from {currentBeat.artist}</h2>
//               </div>
              
//               <div className="p-4">
//                 {/* <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
//                   {relatedBeats.map((beat, index) => (
//                     // <BeatCard 
//                     //   key={index} 
//                     //   title={beat.title} 
//                     //   artist={beat.artist} 
//                     //   price={beat.price} 
//                     //   image={beat.image}
//                     //   bpm={beat.bpm}
//                     //   key={beat.key}
//                     //   tags={beat.tags}
//                     // />
//                   ))} */}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
    
//   );
// };

// export default Beat;

const BeatPage = () => {
    return (
        <div>
            Hello, page
        </div>
    );
};

export default BeatPage;