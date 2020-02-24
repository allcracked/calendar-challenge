import moment from 'moment';
import { OpenWeatherApiData, OpenWeatherList, ForecastByTime, ForecastForCity } from './OpenWeatherInterfaces';

class OpenWeatherApi {
    private baseUrl = 'https://api.openweathermap.org/data/2.5/forecast';

    private apiKey = process.env.OPEN_WEATHER_MAP_API;

    private tempUnits = 'metric';

    /**
     * Formats the output of OpenWeather API so that the app can read weather data.
     * @param forecastData The data previously obtained by the API.
     * @returns Data fortmatted and usable by the app.
     */
    private formatForecastForCity(forecastData: OpenWeatherApiData): ForecastForCity {
        const returningForecastForCity: ForecastForCity = {
            cityName: forecastData.city.name,
            weatherByTime: [],
        };

        forecastData.list.forEach((weatherInfo: OpenWeatherList) => {
            const hour = moment.unix(weatherInfo.dt).hour();
            const day = moment.unix(weatherInfo.dt).date();
            const month = moment.unix(weatherInfo.dt).month();
            const year = moment.unix(weatherInfo.dt).year();

            if (!returningForecastForCity.weatherByTime[year]) returningForecastForCity.weatherByTime[year] = [];
            if (!returningForecastForCity.weatherByTime[year][month])
                returningForecastForCity.weatherByTime[year][month] = [];
            if (!returningForecastForCity.weatherByTime[year][month][day])
                returningForecastForCity.weatherByTime[year][month][day] = [];

            returningForecastForCity.weatherByTime[year][month][day][hour] = {
                weatherCondition: weatherInfo.weather[0].main,
                weatherConditionDescription: weatherInfo.weather[0].description,
                temperature: Math.round(weatherInfo.main.temp),
                temperatureFeelsLike: Math.round(weatherInfo.main.feels_like),
                temperatureMax: Math.round(weatherInfo.main.temp_max),
                temperatureMin: Math.round(weatherInfo.main.temp_min),
                temperatureUnit: this.tempUnits,
                cityName: forecastData.city.name,
                dateText: `${month + 1}/${day}/${year} ${hour}:00`,
            };
        });
        return returningForecastForCity;
    }

    /**
     * Gets the last five days of forecast data from the Open Weather API, each result represents weather
     * data by every 3 hours starting at midnight and ending at 21.
     * @param cityName The name of the city being looked for.
     * @returns A data object containing each result from the API separated by year, month, day and hour.
     */
    async getForecastForCity(cityName: string): Promise<ForecastForCity> {
        const callURL = `${this.baseUrl}?q=${cityName}&units=${this.tempUnits}&APPID=${this.apiKey}`;
        const forecastDataFromApi = await fetch(callURL);
        const forecastData: OpenWeatherApiData = await forecastDataFromApi.json();
        const forecastFormattedData = this.formatForecastForCity(forecastData);
        return forecastFormattedData;
    }

    /**
     * Gets weather data for the specified date and time. This will return weather data if the specified
     * date and time do not go over 5 days, this is a restriction imposed by the API.
     * @param cityName The name of the city being looked for.
     * @param timestamp Timestamp of the moment being looked for.
     * @returns Single weather object containing the most aproximated weather information, null if not found.
     */
    async getForecastForCityByTimestamp(cityName: string, timestamp: number): Promise<ForecastByTime> {
        const timestampWithin5Days = moment()
            .date(moment().date() + 5)
            .unix();
        const timestampForNow = Math.round(moment.now() / 1000);

        let dayLookingFor = moment.unix(timestamp).date();
        let monthLookingFor = moment.unix(timestamp).month();
        let yearLookingFor = moment.unix(timestamp).year();
        let hourLookingFor = moment.unix(timestamp).hour();

        if (timestampForNow < timestamp && timestampWithin5Days > timestamp) {
            const fiveDaysForecast: ForecastForCity = await this.getForecastForCity(cityName);

            if (
                yearLookingFor === moment.unix(moment.now() / 1000).year() &&
                monthLookingFor === moment.unix(moment.now() / 1000).month() &&
                dayLookingFor === moment.unix(moment.now() / 1000).date() &&
                moment.unix(moment.now()).hour() / 1000 - hourLookingFor < 1
            ) {
                hourLookingFor += 2;
            }

            let lookForTime = Math.round(hourLookingFor / 3) * 3;

            if (lookForTime === 24) {
                if (
                    moment()
                        .endOf('month')
                        .date() === dayLookingFor
                ) {
                    if (
                        moment()
                            .endOf('month')
                            .month() === 11
                    ) {
                        yearLookingFor += 1;
                    }

                    monthLookingFor = 0;
                }
                dayLookingFor = 1;
                lookForTime = 0;
            }

            const foundWeather: ForecastByTime =
                fiveDaysForecast.weatherByTime[yearLookingFor][monthLookingFor][dayLookingFor][lookForTime] || null;
            return foundWeather;
        }
        return null;
    }
}

const OpenWeatherApiInstance = new OpenWeatherApi();
export default OpenWeatherApiInstance;
