interface WeatherCondition {
    text: string;
    icon: string;
}

interface CurrentWeather {
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
}

interface LocationData {
    name: string;
    country: string;
    region: string;
    lat: number;
    lon: number;
}

interface WeatherData {
    location: LocationData;
    current: CurrentWeather;
}

interface SearchSuggestion {
    id: number;
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    url: string;
}

const API_KEY: string = import.meta.env.VITE_WEATHER_API_KEY || '';
const BASE_URL = "https://api.weatherapi.com/v1/current.json";

const searchForm = document.getElementById('search-form') as HTMLFormElement | null;
const searchInput = document.getElementById('city-search') as HTMLInputElement | null;
const forecastGrid = document.getElementById('forecast-grid') as HTMLElement | null;
const lastUpdatedText = document.getElementById('last-updated') as HTMLElement | null;
const savedCitiesList = document.getElementById('saved-cities-list') as HTMLUListElement | null;

const confirmModal = document.getElementById('confirm-modal') as HTMLElement | null;
const modalCityName = document.getElementById('modal-city-name') as HTMLElement | null;
const modalCancelBtn = document.getElementById('modal-cancel') as HTMLButtonElement | null;
const modalConfirmBtn = document.getElementById('modal-confirm') as HTMLButtonElement | null;

const detailModal = document.getElementById('detail-modal') as HTMLElement | null;
const detailModalClose = document.getElementById('detail-modal-close') as HTMLButtonElement | null;

let cardToDelete: HTMLElement | null = null;
let sidebarItemToDelete: HTMLElement | null = null;

async function fetchWeather(city: string): Promise<WeatherData | null> {
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

async function fetchCitySuggestions(query: string): Promise<SearchSuggestion[]>{
    if (query.length < 3 ) return [];

    try {
        const response: Response = await fetch(`https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${query}`);
        if (!response.ok) return [];

        const data: SearchSuggestion[] = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching city suggestions:', error);
        return [];
    }
}

function setupSidebarDeleteButton(sidebarItem: HTMLElement): void {
    const btn = sidebarItem.querySelector('.list-item__close-btn') as HTMLButtonElement | null;
    if (!btn) return;

    btn.onclick = (e: MouseEvent): void => {
        e.preventDefault();
        e.stopPropagation();
        
        const cityAttr = sidebarItem.getAttribute('data-city');
        const cityName: string = sidebarItem.getAttribute('data-city-name') || "";
        
        sidebarItemToDelete = sidebarItem;
        
        if (cityAttr && forecastGrid) {
            cardToDelete = forecastGrid.querySelector(`.weather-card[data-city="${cityAttr}"]`) as HTMLElement | null;
        }

        if (modalCityName) {
            modalCityName.textContent = cityName;
        }
        if (confirmModal) {
            confirmModal.classList.add('active');
        }
    };
}

function addCityToSidebar(data: WeatherData): void {
    if (!savedCitiesList) return;

    const cityName: string = data.location.name;
    const countryName: string = data.location.country;
    const tempC: number = Math.round(data.current.temp_c);

    const currentActiveItems: NodeListOf<HTMLElement> = savedCitiesList.querySelectorAll('.list-item--active');
    currentActiveItems.forEach((item: HTMLElement): void => {
        item.className = 'list-item';
        const img = item.querySelector('.list-item__details img') as HTMLImageElement | null;
        if (img) {
            img.src = 'Images/Geo-icon-transparent.svg';
        }
    });

    const cityHTML: string = `
    <li class="list-item list-item--active" data-city="${cityName.toLowerCase()}" data-city-name="${cityName}">
        <div class="list-item__details">
            <span class="list-item__geo-icon">
                <img src="Images/Geo-icon-blue.svg" alt="Geo-icon-blue">
            </span>
            <span class="list-item__city-name">
                ${cityName}<span class="list-item__country-name">, ${countryName}</span>
            </span>
        </div>
        <div class="list-item__right-side">
            <span class="list-item__temp">${tempC}°C</span>
            <button type="button" class="list-item__close-btn" aria-label="Delete-city">x</button>
        </div>
    </li>`;

    savedCitiesList.insertAdjacentHTML('afterbegin', cityHTML);

    const newSidebarItem = savedCitiesList.firstElementChild as HTMLElement | null;
    if (newSidebarItem) {
        setupSidebarDeleteButton(newSidebarItem);
    }
}

function setupCardDeleteButton(card: HTMLElement): void {
    const btn = card.querySelector('.weather-card__close-btn') as HTMLButtonElement | null;
    if (!btn) return;

    btn.onclick = (e: MouseEvent): void => {
        e.preventDefault();
        e.stopPropagation();

        const cityNameEl = card.querySelector('.weather-card__city-name');
        const cityName: string = cityNameEl ? cityNameEl.textContent || "" : "";
        cardToDelete = card;

        if (modalCityName) {
            modalCityName.textContent = cityName;
        }
        if (confirmModal) {
            confirmModal.classList.add('active');
        }
    };
}

function createWeatherCard(data: WeatherData): void {
    if (!forecastGrid) return;

    const cityName: string = data.location.name;
    const tempC: number = data.current.temp_c;
    const countryName: string = data.location.country;
    const now = new Date();
    const localTimeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const cityLatitude: number = data.location.lat;
    const cityLongitude: number = data.location.lon;
    const windDegree: number = data.current.wind_degree;
    const wind_kph: number = data.current.wind_kph;
    const wind_mph: number = data.current.wind_mph;
    const humidity: number = data.current.humidity;
    
    const iconUrl: string = `https:${data.current.condition.icon}`;
    const iconAlt: string = data.current.condition.text;

    const cardHTML: string = `
<article class="weather-card" data-city="${cityName.toLowerCase()}" data-updated-time="${localTimeStr}">
    <button type="button" class="weather-card__close-btn" aria-label="Close-card">x</button>
    <div class="weather-card__header">
        <div class="weather-card__title-group">
            <h3 class="weather-card__city-name">${cityName}</h3>
            <h4 class="weather-card__country-name">${countryName}</h4>
        </div>
        <div class="weather-card__icon-box">
            <img src="${iconUrl}" alt="${iconAlt}" title="${iconAlt}" />
        </div>
    </div>
    
    <p class="weather-card__temp">${tempC}°C</p>
    <hr class="weather-card__separator"/>
    
    <div class="weather-card__coords">
        <img class="weather-card__coords-icon" src="./Images/area-map-marker-line.svg" alt="coordinates-icon" />
        <span class="weather-card__coords-lat">${cityLatitude}</span>
        <span class="weather-card__coords-lon">${cityLongitude}</span>
    </div>
    
    <div class="weather-card__details">
        <div class="wind-container">
            <span class="weather-card__details-wind-arrow">↑</span>
            <span class="weather-card__details-wind-speed"></span>
        </div>
        <div class="humidity-container">
            <img class="weather-card__details-humidity-icon" src="./Images/humidity-icon.svg" alt="humidity-icon" />
            <span class="weather-card__details-humidity-value">${humidity}%</span>
        </div>
    </div>
</article>`;

    forecastGrid.insertAdjacentHTML('afterbegin', cardHTML);

    const rotationAngle: number = windDegree + 180;
    const lastCard = forecastGrid.firstElementChild as HTMLElement | null;
    
    if (lastCard) {
        const arrow = lastCard.querySelector('.weather-card__details-wind-arrow') as HTMLElement | null;
        const windSpeed = lastCard.querySelector('.weather-card__details-wind-speed') as HTMLElement | null;

        if (arrow) {
            arrow.style.display = 'inline-block';
            arrow.style.transform = `rotate(${rotationAngle}deg)`;
        }
        if (windSpeed) {
            windSpeed.textContent = ` ${wind_kph} km/h (${wind_mph} mph)`;
        }

        lastCard.addEventListener('click', (e: MouseEvent): void => {
            const target = e.target as HTMLElement;
            if (target.closest('.weather-card__close-btn')) return;
            openDetailModal(data, localTimeStr);
        });
        setupCardDeleteButton(lastCard);
    }

    if (lastUpdatedText) {
        lastUpdatedText.textContent = `Last updated: ${localTimeStr}`;
    }
}

if (searchForm && searchInput) {
    searchForm.addEventListener('submit', async (event: SubmitEvent): Promise<void> => {
        event.preventDefault();
        event.stopPropagation();

        const cityQuery: string = searchInput.value.trim();
       
        if (cityQuery === "") {
            alert("Please enter a city name");
            return;
        }

        const submitBtn = searchForm.querySelector('button[type="submit"]') as HTMLButtonElement | null;
        if (submitBtn) submitBtn.disabled = true;

        const weatherData: WeatherData | null = await fetchWeather(cityQuery);

        if (weatherData) {
            const normalizedCityName = weatherData.location.name.toLowerCase();
            const existingCard = forecastGrid?.querySelector(`.weather-card[data-city="${normalizedCityName}"]`) as HTMLElement | null;

            if (existingCard) {
                updateExistingWeatherCard(existingCard, weatherData);
                updateExistingSidebarItem(normalizedCityName, weatherData);
            } else {
                createWeatherCard(weatherData);
                addCityToSidebar(weatherData);
            }
            searchInput.value = "";
        }

        if (submitBtn) submitBtn.disabled = false;
    });
}

if (modalCancelBtn) {
    modalCancelBtn.onclick = (e: MouseEvent): void => {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
    };
}

if (modalConfirmBtn) {
    modalConfirmBtn.onclick = (e: MouseEvent): void => {
        e.preventDefault();
        e.stopPropagation();

        if (cardToDelete && !sidebarItemToDelete && savedCitiesList) {
            const cityAttr = cardToDelete.getAttribute('data-city');
            if (cityAttr) {
                const sidebarItem = savedCitiesList.querySelector(`[data-city="${cityAttr}"]`) as HTMLElement | null;
                if (sidebarItem) sidebarItem.remove();
            }
        }
        if (cardToDelete) {
            cardToDelete.remove();
        }

        if (sidebarItemToDelete) {
            sidebarItemToDelete.remove();
        }

        updateGlobalTime();
        closeModal();
    };
}

function closeModal(): void {
    if (confirmModal) {
        confirmModal.classList.remove('active');
    }
    cardToDelete = null;
    sidebarItemToDelete = null;
}

function updateGlobalTime(): void {
    if (!lastUpdatedText || !forecastGrid) return;
    const remainingCards = forecastGrid.querySelectorAll('.weather-card');

    if (remainingCards.length > 0) {
        const activeCard = remainingCards[0] as HTMLElement;
        const activeCardTime = activeCard.getAttribute('data-updated-time');
        
        if (activeCardTime) {
            lastUpdatedText.textContent = `Last updated: ${activeCardTime}`;
        }
    } else {
        lastUpdatedText.textContent = 'Last updated: Never';
    }
}

const suggestionsBox = document.createElement('ul');
suggestionsBox.className = 'suggestions-box';
suggestionsBox.style.display = 'none';

if (searchInput) {
    searchInput.insertAdjacentElement('afterend', suggestionsBox);
}

if (searchInput) {
    searchInput.addEventListener('input', async (): Promise<void> => {
        const query: string = searchInput.value.trim();
        
        if (query.length < 3) {
            suggestionsBox.innerHTML = '';
            suggestionsBox.style.display = 'none';
            return;
        }

        const suggestions: SearchSuggestion[] = await fetchCitySuggestions(query);

        if (suggestions.length === 0) {
            suggestionsBox.innerHTML = '<li class="suggestion-item no-results">No cities found</li>';
            suggestionsBox.style.display = 'block';
            return;
        }

        suggestionsBox.innerHTML = suggestions.map((city: SearchSuggestion) => `
    <li class="suggestion-item" data-city-name="${city.name}, ${city.country}">
        <span class="suggest-city">${city.name}</span>, 
        <span class="suggest-country">${city.country}</span>
    </li>`).join('');

        suggestionsBox.style.display = 'block';
    });
}

suggestionsBox.addEventListener('click', async (e: MouseEvent): Promise<void> => {
    const target = e.target as HTMLElement;
    const item = target.closest('.suggestion-item') as HTMLElement | null;
    
    if (item && !item.classList.contains('no-results') && searchInput) {
        const cityName = item.getAttribute('data-city-name');
        
        if (cityName) {
            searchInput.value = cityName;
            suggestionsBox.innerHTML = '';
            suggestionsBox.style.display = 'none';
            if (searchForm) {
                searchForm.requestSubmit();
            }
        }
    }
});

document.addEventListener('click', (e: MouseEvent): void => {
    const target = e.target as HTMLElement;
    if (searchInput && !searchInput.contains(target) && !suggestionsBox.contains(target)) {
        suggestionsBox.style.display = 'none';
    }
});

function setElementText(id: string, text: string): void {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = text;
    }
}

function openDetailModal(data: WeatherData, requestTime: string): void {
    if (!detailModal) return;

    setElementText('det-city', data.location.name);
    setElementText('det-region-country', `${data.location.region}, ${data.location.country}`);
    setElementText('det-temp', `${Math.round(data.current.temp_c)}°C`);
    setElementText('det-feels', `FEELS LIKE ${Math.round(data.current.feelslike_c)}°C`);
    setElementText('det-status', data.current.condition.text);
    setElementText('det-time', `Last updated: ${requestTime}`);
    setElementText('det-lat', `Lat: ${data.location.lat}° N`);
    setElementText('det-lon', `Long: ${data.location.lon}° W`);
    
    setElementText('det-wind', `${data.current.wind_kph} km/h`);
    setElementText('det-wind-dir', `Direction: ${data.current.wind_dir}`);
    setElementText('det-humidity', `${data.current.humidity}%`);
    setElementText('det-pressure', `${data.current.pressure_mb} hPa`);

    const detIcon = document.getElementById('det-icon') as HTMLImageElement | null;
    if (detIcon) {
        detIcon.src = `https:${data.current.condition.icon}`;
        detIcon.alt = data.current.condition.text;
    }

    detailModal.classList.add('active');
}

if (detailModalClose) {
    detailModalClose.onclick = (e: MouseEvent): void => {
        e.preventDefault();
        e.stopPropagation();
        if (detailModal) detailModal.classList.remove('active');
    };
}

function updateExistingWeatherCard(card: HTMLElement, data: WeatherData): void {
    const now = new Date();
    const localTimeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    if (forecastGrid) {
        forecastGrid.insertAdjacentElement('afterbegin', card);
    }
    
    card.setAttribute('data-updated-time', localTimeStr);
    
    const tempEl = card.querySelector('.weather-card__temp');
    if (tempEl) tempEl.textContent = `${Math.round(data.current.temp_c)}°C`;

    const humidityEl = card.querySelector('.weather-card__details-humidity-value');
    if (humidityEl) humidityEl.textContent = `${data.current.humidity}%`;
   
    const img = card.querySelector('.weather-card__icon-box img') as HTMLImageElement | null;
    if (img) {
        img.src = `https:${data.current.condition.icon}`;
        img.alt = data.current.condition.text;
        img.title = data.current.condition.text;
    }

    const arrow = card.querySelector('.weather-card__details-wind-arrow') as HTMLElement | null;
    const windSpeed = card.querySelector('.weather-card__details-wind-speed') as HTMLElement | null;
    if (arrow) {
        const rotationAngle: number = data.current.wind_degree + 180;
        arrow.style.transform = `rotate(${rotationAngle}deg)`;
    }
    if (windSpeed) {
        windSpeed.textContent = ` ${data.current.wind_kph} km/h (${data.current.wind_mph} mph)`;
    }

    if (lastUpdatedText) {
        lastUpdatedText.textContent = `Last updated: ${localTimeStr}`;
    }
}

function updateExistingSidebarItem(cityAttr: string, data: WeatherData): void {
    if (!savedCitiesList) return;

    const currentActiveItems: NodeListOf<HTMLElement> = savedCitiesList.querySelectorAll('.list-item--active');
    currentActiveItems.forEach((item: HTMLElement): void => {
        item.className = 'list-item';

       const img = item.querySelector('.list-item__details img') as HTMLImageElement | null;
        if (img) img.src = 'Images/Geo-icon-transparent.svg';
    });

    const existingSidebarItem = savedCitiesList.querySelector(`[data-city="${cityAttr}"]`) as HTMLElement | null;
    if (existingSidebarItem) {
        existingSidebarItem.className = 'list-item list-item--active';
        
        const tempEl = existingSidebarItem.querySelector('.list-item__temp');
        if (tempEl) tempEl.textContent = `${Math.round(data.current.temp_c)}°C`;
        
        const img = existingSidebarItem.querySelector('.list-item__details img') as HTMLImageElement | null;
        if (img) img.src = 'Images/Geo-icon-blue.svg';

       savedCitiesList.insertAdjacentElement('afterbegin', existingSidebarItem);
    }
}