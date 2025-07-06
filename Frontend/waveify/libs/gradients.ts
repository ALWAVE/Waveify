export const gradientMap = {
  red: "bg-gradient-to-br from-red-600 to-rose-700",
  purple: "bg-gradient-to-br from-purple-600 to-indigo-700",
  blue: "bg-gradient-to-br from-blue-600 to-cyan-700",
  green: "bg-gradient-to-br from-green-600 to-emerald-700",
  artist: "bg-gradient-to-br from-fuchsia-500 to-indigo-500",
  beatmaker: "bg-gradient-to-br from-fuchsia-500 to-blue-500",
  black: "bg-gradient-to-br from-gray-800 to-gray-900",
  premium_card: "bg-gradient-to-r from-violet-500 to-pink-300",
  premium_duo_card: "bg-gradient-to-l from-violet-500 to-pink-300",
  Sponsor: "bg-gradient-to-r from-red-600 to-rose-700",
  premium: "bg-gradient-to-r from-pink-300 to-violet-500",
  premium_duo: "bg-gradient-to-l from-violet-500 to-pink-300",
} as const;

// Тип всех доступных ключей
export type GradientKey = keyof typeof gradientMap;

// Тип для удобства
export interface GradientProps {
  color: GradientKey;
}

// Функция для получения градиента по ключу
export const getGradient = (color: GradientKey): string => {
  return gradientMap[color];
};
