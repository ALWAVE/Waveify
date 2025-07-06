import { useEffect, useState } from 'react';

export const useIsModerator = () => {
  const [isModerator, setIsModerator] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkModerator = async () => {
      try {
        const res = await fetch('http://77.94.203.78:5000/api/User/is-moderator', {
          method: 'GET',
          credentials: 'include', // важно: включаем куки
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error('Ошибка при получении данных');
        }

        const data = await res.json();
        setIsModerator(data.isModerator);
      } catch (err) {
        console.error('Ошибка при проверке роли модератора:', err);
        setIsModerator(false);
      } finally {
        setLoading(false);
      }
    };

    checkModerator();
  }, []);

  return { isModerator, loading };
};
