import React, { useState, useEffect } from 'react';
import logoIcon from '../../assets/Images/Logo.svg';
import moonIcon from '../../assets/Images/moon_button_dark-mode.svg';

export const Header: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo">
          <a href="/" className="header__logo-link">
            <img src={logoIcon} alt="Weather Forecast Logo" />
          </a>
        </div>
        <div className="header__right">
          <div className="header__theme-switcher">
            <button
              type="button"
              className="header__theme-switcher-link"
              onClick={toggleTheme}
              aria-label="Toggle theme">
              <img src={moonIcon} alt="Theme switcher" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};