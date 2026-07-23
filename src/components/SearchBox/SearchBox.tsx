import React, { useState, useEffect, useRef } from 'react';
import magnifierIcon from '../../assets/Images/magnifier.svg';
import { fetchCitySuggestions } from '../../api/apiGetWeather';
import type { SearchSuggestion } from '../../types/weather';

interface SearchBoxProps {
  onSearch: (city: string) => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getSuggestions = async () => {
      if (query.trim().length >= 3) {
        const results = await fetchCitySuggestions(query);
        setSuggestions(results);
        setIsOpen(results.length > 0);
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    };

    const debounceTimer = setTimeout(getSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
      setIsOpen(false);
    }
  };

  const handleSelectSuggestion = (cityName: string) => {
    onSearch(cityName);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="search-section" ref={searchContainerRef}>
      <h2 className="search-section__title">Weather Dashboard</h2>
      <p className="search-section__manage-city">Manage your cities</p>
      <form id="search-form" className="search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          id="city-search"
          className="search-section__input-window"
          placeholder="Enter a city name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 3 && setIsOpen(true)}
        />
       <button type="submit" className="search-form__button" aria-label="Search City">
          <img src={magnifierIcon} alt="" />
          Search City
        </button>

        {isOpen && (
          <ul className="suggestions-box">
            {suggestions.map((item) => (
              <li
                key={item.id}
                className="suggestion-item"
                onClick={() => handleSelectSuggestion(`${item.lat},${item.lon}`)}
              >
                <span className="suggest-city">{item.name}</span>
                <span className="suggest-country">
                  {item.region ? `, ${item.region}, ` : ', '}{item.country}
                </span>
              </li>
            ))}
          </ul>
        )}
      </form>
    </div>
  );
};