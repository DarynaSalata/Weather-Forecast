import type { WeatherData, SearchSuggestion } from '../types/weather';

const API_KEY: string = import.meta.env.VITE_WEATHER_API_KEY || '';
const BASE_URL = "https://api.weatherapi.com/v1/current.json";

export async function fetchWeather(city: string): Promise<WeatherData | null> {
    try {
        const response: Response = await fetch(`${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=no`);
        if (!response.ok) {
            console.warn(`City not found or invalid query: ${city} (Status: ${response.status})`);
            return null;
        }
        const data: WeatherData = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

export async function fetchCitySuggestions(query: string): Promise<SearchSuggestion[]> {
    if (query.length < 3) return [];

    try {
        const response: Response = await fetch(`https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${encodeURIComponent(query)}`);
        if (!response.ok) return [];

        const data: SearchSuggestion[] = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching city suggestions:', error);
        return [];
    }
}
