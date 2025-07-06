"use client"

import React, { useEffect, useState } from 'react';

const COOKIE_NAME = 'cookieConsent';

function setCookie(name: string, value: string, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name: string) {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=');
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, '');
}

const CookieConsent: React.FC = () => {
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    const consentCookie = getCookie(COOKIE_NAME);
    if (consentCookie === 'true') {
      setConsent(true);
    }
  }, []);

  const acceptCookies = () => {
    setCookie(COOKIE_NAME, 'true');
    setConsent(true);
  };

  if (consent) return null;

  return (
    <div style={styles.banner}>
      <div style={styles.content}>
        <div style={styles.text}>
          <strong>Мы используем cookie</strong> для улучшения работы сайта и персонализации контента. Подробнее в{' '}
          <a href="/policy/cookies" target="_blank" rel="noopener noreferrer" style={styles.link}>
            политике конфиденциальности
          </a>.
        </div>
        <div style={styles.buttons}>
          <button className= "hover:scale-97 active:scale-110" onClick={acceptCookies} style={styles.acceptBtn}>
            Принять
          </button>
          <button className= "hover:scale-97 active:scale-110" onClick={() => alert('Настройки пока не реализованы')} style={styles.settingsBtn}>
            Настроить
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  banner: {
    position: 'fixed',
    bottom: 20,
    left: '50%',
    transform: 'translateX(-50%)',
    maxWidth: 480,
    width: '90%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    borderRadius: 12,
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    zIndex: 1000,
    padding: '1.2rem 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: '100%',
  },
  text: {
    flex: '1 1 60%',
    fontSize: 14,
    lineHeight: 1.4,
  },
  link: {
    color: '#dab2ff',
    textDecoration: 'underline',
  },
  buttons: {
    flex: '1 1 35%',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12,
  },
  acceptBtn: {
    backgroundColor: '#c980e3',
    border: 'none',
    borderRadius: 8,
    padding: '0.5rem 1.2rem',
    fontWeight: '600',
    cursor: 'pointer',
    color: 'white',
    boxShadow: '0 4px 10px #c980e3',
    transition: 'background-color 0.3s ease',
  },
  settingsBtn: {
    backgroundColor: 'transparent',
    border: '2px solid #fff',
    borderRadius: 8,
    padding: '0.5rem 1.2rem',
    fontWeight: '600',
    cursor: 'pointer',
    color: '#fff',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  },
};

export default CookieConsent;
