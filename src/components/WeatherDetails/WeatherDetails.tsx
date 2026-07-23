import React from 'react';

interface WeatherDetailsProps {
  humidity: number;
  windSpeed: number;
  pressure?: number;
}

export const WeatherDetails: React.FC<WeatherDetailsProps> = ({
  humidity,
  windSpeed,
  pressure,
}) => {
  return (
    <div className="weather-details">
      <div className="weather-details__item">
        <span>Humidity:</span>
        <strong>{humidity}%</strong>
      </div>
      <div className="weather-details__item">
        <span>Wind Speed:</span>
        <strong>{windSpeed} м/с</strong>
      </div>
      {pressure && (
        <div className="weather-details__item">
          <span>Pressure:</span>
          <strong>{pressure} hPa</strong>
        </div>
      )}
    </div>
  );
};