import React, { useState } from 'react';
import type { WeatherData } from '../../types/weather';
import areaMapIcon from '../../assets/Images/area-map-marker-line.svg';
import humidityIcon from '../../assets/Images/humidity-icon.svg';
import { WeatherDetailModal } from '../WeatherDetailModal/WeatherDetailModal';

interface WeatherCardProps {
  data: WeatherData;
  onDelete?: () => void;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ data, onDelete }) => {
  const { location, current } = data;
  const rotationAngle = current.wind_degree + 180;

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <article className="weather-card" data-city={location.name.toLowerCase()}
        onClick={() => setIsModalOpen(true)} 
      >
        {onDelete && (
          <button
            type="button"
            className="weather-card__close-btn"
            aria-label="Close-card"
            onClick={(e) => {
              e.stopPropagation();
              if (onDelete) onDelete();
            }}
          >
            x
          </button>
        )}

      <div className="weather-card__header">
        <div className="weather-card__title-group">
          <h3 className="weather-card__city-name">{location.name}</h3>
          <h4 className="weather-card__country-name">{location.country}</h4>
        </div>
        <div className="weather-card__icon-box">
          <img
            src={`https:${current.condition.icon}`}
            alt={current.condition.text}
            title={current.condition.text}
          />
        </div>
      </div>

      <p className="weather-card__temp">{Math.round(current.temp_c)}°C</p>
      <hr className="weather-card__separator" />

      <div className="weather-card__coords">
        <img
          className="weather-card__coords-icon"
          src={areaMapIcon}
          alt="coordinates-icon"
        />
        <span className="weather-card__coords-lat">{location.lat}</span>
        <span className="weather-card__coords-lon">{location.lon}</span>
      </div>

      <div className="weather-card__details">
        <div className="wind-container">
          <span
            className="weather-card__details-wind-arrow"
            style={{
              display: 'inline-block',
              transform: `rotate(${rotationAngle}deg)`,
            }}
          >
            ↑
          </span>
          <span className="weather-card__details-wind-speed">
            {current.wind_kph} km/h ({current.wind_mph} mph)
          </span>
        </div>
        <div className="humidity-container">
          <img
            className="weather-card__details-humidity-icon"
            src={humidityIcon}
            alt="humidity-icon"
          />
          <span className="weather-card__details-humidity-value">
            {current.humidity}%
          </span>
        </div>
      </div>
      </article>
      
      <WeatherDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        data={data} 
      />
    </>
  );
};