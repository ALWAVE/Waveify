// export const isElectron = (): boolean => {
//     return typeof navigator !== 'undefined' && navigator.userAgent.includes('Electron');
//   };
  
//   export const isStandalonePWA = (): boolean => {
//     return (
//       typeof window !== 'undefined' &&
//       (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true)
//     );
//   };
  
//   export const isMobile = (): boolean => {
//     return typeof navigator !== 'undefined' && /Mobi|Android|iPhone/i.test(navigator.userAgent);
//   };
  
//   export const getPlatform = (): 'electron' | 'pwa-mobile' | 'web-mobile' | 'web-desktop' => {
//     if (isElectron()) return 'electron';
//     if (isStandalonePWA() && isMobile()) return 'pwa-mobile';
//     if (isMobile()) return 'web-mobile';
//     return 'web-desktop';
//   };
  