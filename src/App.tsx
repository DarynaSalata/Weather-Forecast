import { useState, useEffect } from 'react';
import { Header } from './components/Header/Header';
import { Sidebar } from './components/Sidebar/Sidebar';
import { WeatherCard } from './components/WeatherCard/WeatherCard';
import { Loader } from './components/Loader/Loader';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { ConfirmModal } from './components/ConfirmModal/ConfirmModal';
import { fetchWeather } from './api/apiGetWeather';
import { SearchBox } from './components/SearchBox/SearchBox';
import type { WeatherData } from './types/weather';
import './scss/main.scss';

const LOCAL_STORAGE_KEY = 'weather_forecast_cities';

export function App() {
  const [weatherList, setWeatherList] = useState<WeatherData[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse localStorage:', e);
      }
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Modal window state
  const [cityToDelete, setCityToDelete] = useState<string | null>(null);

  const [activeCity, setActiveCity] = useState<string | null>(
    weatherList.length > 0 ? weatherList[0].location.name : null
  );

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(weatherList));
  }, [weatherList]);

  const handleSearch = async (city: string) => {
    setIsLoading(true);
    setError(null);

    const data = await fetchWeather(city);

    if (data) {
      setWeatherList((prev) => {
        const filtered = prev.filter(
          (item) => 
            !(
              item.location.name.toLowerCase() === data.location.name.toLowerCase() &&
              item.location.country.toLowerCase() === data.location.country.toLowerCase()
            )
        );
        return [data, ...filtered];
      });
      setActiveCity(`${data.location.name}-${data.location.country}`);
    } else {
      setError('City not found or network error occurred.');
    }

    setIsLoading(false);
  };

  // open modal window on click "x"
  const handleOpenDeleteModal = (cityName: string) => {
    console.log('Клік спрацював для міста:', cityName); // <--- ДЛЯ ПЕРЕВІРКИ
    setCityToDelete(cityName);
  };

  // Acception deleting
  const handleConfirmDelete = () => {
    if (cityToDelete) {
      setWeatherList((prev) => {
        const updated = prev.filter((item) => item.location.name.toLowerCase() !== cityToDelete.toLowerCase());
        if (activeCity?.toLowerCase() === cityToDelete.toLowerCase()) {
          setActiveCity(updated.length > 0 ? updated[0].location.name : null);
        }
        return updated;
      });
      setCityToDelete(null);
    }
  };

  // Canceling
  const handleCancelDelete = () => {
    setCityToDelete(null);
  };

  const lastUpdatedText = weatherList.length > 0 
    ? weatherList[0].current.last_updated 
    : 'Never';

  return (
    <div className="app-container">
      <Header />
    
      <main className="main">
        <Sidebar 
          weatherList={weatherList} 
          activeCity={activeCity} 
          onSelectCity={(cityName, countryName) => setActiveCity(`${cityName}-${countryName}`)}
          onSearch={handleSearch}
          onDeleteCity={handleOpenDeleteModal}
        />
        <div className="main-content">

          <div className="mobile-search-wrapper">
            <SearchBox onSearch={handleSearch} />
          </div>
          
          <section className="forecast">
            <h2 className="forecast__title">Today's Forecast</h2>
            <span className="forecast__last-updated">Last updated: {lastUpdatedText}</span>
        
            {isLoading && <Loader />}
            {error && <ErrorMessage message={error} />}
            
            {!isLoading && weatherList.length === 0 && !error && (
              <div className="empty-state">
                <p>No cities added yet. Start by typing a city name in the search box!</p>
              </div>
            )}

       <div id="forecast-grid" className="forecast-grid">
            {weatherList.map((weatherItem) => (
              <WeatherCard
                key={`${weatherItem.location.name}-${weatherItem.location.country}`}
                data={weatherItem}
                onDelete={() => handleOpenDeleteModal(weatherItem.location.name)}
              />
            ))}
          </div>
        </section>
        </div>
      </main>

      <ConfirmModal
        isOpen={Boolean(cityToDelete)}
        cityName={cityToDelete || ''}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}

export default App;
