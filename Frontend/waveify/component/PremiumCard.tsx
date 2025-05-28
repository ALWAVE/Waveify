import React from "react";
import ButtonLogin from "./ButtonLogin";
import { getGradient, GradientKey  } from '@/libs/gradients';
interface PremiumCardProps {
  title: string;
  color: GradientKey;
  description: string;
  price: number;
  smallTitle: string;
  features?: string[];
  discount?: string;
  bestValue?: boolean;
}

const PremiumCard: React.FC<PremiumCardProps> = ({
  title,
  color,
  description,
  price,
  smallTitle,
  features = [],
  discount,
  bestValue = false,
}) => {
 

  return (
    <div className="relative overflow-hidden w-full max-w-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-0 rounded-xl flex flex-col">
      {/* Градиентный фон */}
      <div className={`absolute inset-0 ${getGradient(color)} opacity-95`}></div>

      {/* Декоративные элементы */}
      <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-white opacity-10"></div>
      <div className="absolute -left-12 -bottom-12 w-40 h-40 rounded-full bg-white opacity-5"></div>

      {/* Badge лучшего предложения */}
      {bestValue && (
        <div className="absolute -right-6 -top- bg-pink-200 text-black font-bold py-1 px-8 transform rotate-45 shadow-lg">
          Хит
        </div>
      )}

      {/* Основное содержимое */}
      <div className="relative p-6 text-white z-10 flex flex-col flex-grow">
        <h3 className="text-xl font-bold tracking-tight mb-1">{title}</h3>
        <p className="text-sm text-gray-200 opacity-80">{smallTitle}</p>

        {/* Скидка если есть */}
        {discount && (
          <div className="inline-block mt-2 bg-white/20 text-xs font-bold px-2 py-1 rounded">
            {discount}
          </div>
        )}

        <p className="mt-3 text-sm text-gray-100">{description}</p>

        {/* Цена */}
        <div className="mt-4">
          <span className="text-2xl font-bold">${price}</span>
          <span className="text-sm text-gray-200">/мес</span>
        </div>

        {/* Список фич */}
        {features.length > 0 && (
          <ul className="mt-4 space-y-2 flex-grow">
            {features.map((feature, idx) => (
              <li key={idx} className="text-sm text-gray-200 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        )}

        {/* Контейнер для кнопки, который прижимает её вниз */}
        <div className="mt-auto">
          <ButtonLogin className="mt-2 w-full bg-white hover:bg-white/90 text-black font-semibold border-0">
            Выбрать
          </ButtonLogin>
        </div>
      </div>
    </div>

  );
};

export default PremiumCard;