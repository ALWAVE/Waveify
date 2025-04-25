import { motion, AnimatePresence } from "framer-motion";
import "../app/globals.css";

export default function LoadingScreen() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-900">
      {/* Header */}
      {/* <header className="bg-black text-white p-4 flex items-center justify-center">
      <div className="flex space-x-4 animate-pulse">
          <div className="bg-gray-500 text-white px-4 py-4 rounded-full"></div>
          <div className="bg-gray-500 text-white px-25 py-4 rounded-full"></div>
        </div>
      
      </header> */}

      {/* Main content with loader */}
      <main className="flex-grow flex items-center justify-center rounded-lg">
        <AnimatePresence>
          <motion.div className="flex flex-col items-center">
            <motion.div className="w-28 h-28 border-8 text-rose-500 text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-rose-500 rounded-full" />
          </motion.div>
        </AnimatePresence>
      </main>
    
    </div>
  );
}
