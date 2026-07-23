import React from 'react';
import { SearchBox } from '../SearchBox/SearchBox';
import type { WeatherData } from '../../types/weather';
import logoIcon from '../../assets/Images/Logo.svg';
import helpIcon from '../../assets/Images/help-icon.svg';
import logOutIcon from '../../assets/Images/log-out.svg';

interface SidebarProps {
  weatherList: WeatherData[];
  activeCity: string | null;
  onSelectCity: (cityName: string, countryName: string) => void;
  onSearch: (city: string) => void;
  onDeleteCity?: (cityName: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  weatherList, 
  activeCity, 
  onSelectCity, 
  onSearch,
  onDeleteCity
}) => {
  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <a href="/" className="sidebar__logo-link">
          <img src={logoIcon} alt="SkyCast Pro Logo" />
        </a>
      </div>

      <SearchBox onSearch={onSearch} />

      <hr className="sidebar__separator" />
      
      <section className="sidebar__saved-cities-section saved-cities-section">
        <h2 className="saved-cities-section__title">SAVED CITIES</h2>
        <ul className="saved-cities-section__list" id="saved-cities-list">
          {weatherList.map((item) => {
            const itemKey = `${item.location.name}-${item.location.country}`;
            const isActive = activeCity?.toLowerCase() === itemKey.toLowerCase();
            return (
              <li 
                key={`${item.location.name}-${item.location.country}`} 
                className={`list-item ${isActive ? 'list-item--active' : ''}`}
                onClick={() => {
                  onSelectCity(item.location.name, item.location.country);
                  onSearch(`${item.location.lat},${item.location.lon}`);
                }}
              >
                <div className="list-item__details">
                  <span className="list-item__city-name">{item.location.name}</span>
                  <span className="list-item__country-name">({item.location.country})</span>
                </div>
                <div className="list-item__right-side">
                  <span className="list-item__temp">{Math.round(item.current.temp_c)}°C</span>
                  {onDeleteCity && (
                    <button
                      type="button"
                      className="list-item__close-btn"
                      aria-label="Delete city"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCity(item.location.name);
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              </li>
            );
          })}    
        </ul>
      </section>

      <footer className="sidebar__footer">
        <div className="sidebar__footer-item">
          <button type="button" className="sidebar__footer-btn" aria-label="Help Information">
            <img src={helpIcon} alt="Help" className="sidebar__footer-icon" />
          </button>
          <span className="sidebar__footer-text">Help</span>
        </div>
        
        <div className="sidebar__footer-item">
          <button type="button" className="sidebar__footer-btn" aria-label="Log Out">
            <img src={logOutIcon} alt="Log Out" className="sidebar__footer-icon" />
          </button>
          <span className="sidebar__footer-text">Log Out</span>
        </div>
      </footer>
    </aside>
  );
};