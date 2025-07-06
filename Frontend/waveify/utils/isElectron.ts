export const isElectron = (): boolean => {
    return typeof navigator !== 'undefined' && navigator.userAgent.includes('Electron');
  };