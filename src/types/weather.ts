export interface WeatherCondition {
    text: string;
    icon: string;
}

export interface CurrentWeather {
    temp_c: number;
    last_updated: string;
    wind_degree: number;
    wind_kph: number;
    wind_mph: number;
    wind_dir: string;
    humidity: number;
    condition: WeatherCondition;
    feelslike_c: number;
    pressure_mb: number;
    cloud: number;
    uv: number;
}

export interface LocationData {
    name: string;
    country: string;
    region: string;
    lat: number;
    lon: number;
}

export interface WeatherData {
    location: LocationData;
    current: CurrentWeather;
}

export interface SearchSuggestion {
    id: number;
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    url: string;
}