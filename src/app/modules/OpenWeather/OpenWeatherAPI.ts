import { OpenWeatherApiData } from './OpenWeatherInterfaces';

class OpenWeatherApi {
    private baseUrl = 'http://api.openweathermap.org/data/2.5/forecast';

    private apiKey = process.env.OPEN_WEATHER_MAP_API;

    private tempUnits = 'metric';

    async getForecastForCity(cityName: string): Promise<OpenWeatherApiData> {
        const callURL = `${this.baseUrl}?q=${cityName}&units=${this.tempUnits}&APPID=${this.apiKey}`;
        const forecastDataFromApi = await fetch(callURL);
        const forecastData: OpenWeatherApiData = await forecastDataFromApi.json();
        return forecastData;
    }
}

const OpenWeatherApiInstance = new OpenWeatherApi();
export default OpenWeatherApiInstance;
