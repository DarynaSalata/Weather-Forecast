import React from 'react';
import type { WeatherData } from '../../types/weather';

interface WeatherDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: WeatherData;
}

export const WeatherDetailModal: React.FC<WeatherDetailModalProps> = ({
    isOpen,
    onClose,
    data
}) => {

  const { location, current } = data;

    return (
        <div className={`modal ${isOpen ? 'active' : ''}`} onClick={onClose}>
            <div className="modal__box modal__box--detail" onClick={(e) => e.stopPropagation()}>
                <div className="modal__header">
                    <div className="modal__header-content">
                        <h2 className="modal__city">{location.name}</h2>
                        <p className="modal__region">{location.region}, {location.country}</p>
                    </div>
                </div>

        <div className="modal__main-info">
          <div className="modal__temp-block">
            <span className="modal__temp">{Math.round(current.temp_c)}°C</span>
            <span className="modal__feels">FEELS LIKE {Math.round(current.feelslike_c)}°C</span>
          </div>
          
          <div className="modal__status-block">
            <div className="modal__status-row">
              <img src={`https:${current.condition.icon}`} alt={current.condition.text} />
              <span className="modal__status">{current.condition.text}</span>
            </div>
            <p className="modal__update-time">Updated: {current.last_updated}</p>
          </div>

          <div className="modal__coords-block">
            <span className="modal__coords-header">COORDINATES</span>
            <p className="modal__coords-item">Lat: {location.lat}</p>
            <p className="modal__coords-item">Lon: {location.lon}</p>
          </div>
        </div>

        <div className="modal__grid">
          <div className="modal__grid-card">
            <span className="modal__grid-label">WIND</span>
            <h4 className="modal__grid-value">{current.wind_kph} km/h</h4>
            <p className="modal__grid-sub">Dir: {current.wind_dir}</p>
          </div>
          <div className="modal__grid-card">
            <span className="modal__grid-label">HUMIDITY</span>
            <h4 className="modal__grid-value">{current.humidity}%</h4>
            <p className="modal__grid-sub">Cloud: {current.cloud}%</p>
          </div>
          <div className="modal__grid-card">
            <span className="modal__grid-label">PRESSURE</span>
            <h4 className="modal__grid-value">{current.pressure_mb} hPa</h4>
            <p className="modal__grid-sub">UV Index: {current.uv}</p>
          </div>
        </div>

        <div className="modal__footer">
          <a 
            href={`https://www.google.com/search?q=weather+${location.name}`} 
            target="_blank" 
            rel="noreferrer" 
            className="modal__link"
          >
            More details online
          </a>
          <button type="button" className="modal__btn modal__btn--dismiss" onClick={onClose}>
            Close
          </button>
        </div>

      </div>
    </div>
  );
};