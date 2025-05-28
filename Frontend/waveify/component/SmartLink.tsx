import { useRef } from "react";
import Link from "next/link";

interface SmartLinkProps {
  href: string;
  children: React.ReactNode;
  [key: string]: any; // Для дополнительных пропсов
}

export const SmartLink = ({ href, children, ...props }: SmartLinkProps) => {
  const clickedRef = useRef(false);

  const handleClick = (e: React.MouseEvent) => {
    if (clickedRef.current) {
      e.preventDefault(); // Блокируем повторный клик
      return;
    }

    clickedRef.current = true;

    // Диспатчим событие для обработки прогрузки
    window.dispatchEvent(new Event("routeChangeTriggered"));

    // Сбросим состояние через 1 секунду
    setTimeout(() => {
      clickedRef.current = false;
    }, 1000);
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
};

export default SmartLink;
