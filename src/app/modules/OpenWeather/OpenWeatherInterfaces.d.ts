export interface OpenWeatherCity {
    id: number;
    name: string;
    coord: {
        lat: number;
        lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
}

export interface OpenWeatherListMain {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
}

export interface OpenWeatherListWeather {
    id: number;
    main: string;
    description: string;
    icon: string;
}

export interface OpenWeatherListClouds {
    all: number;
}

export interface OpenWeatherListWind {
    speed: number;
    deg: number;
}

export interface OpenWeatherListSys {
    pod: string;
}

export interface OpenWeatherList {
    dt: number;
    main: OpenWeatherListMain;
    weather: OpenWeatherListWeather[];
    clouds: OpenWeatherListClouds;
    wind: OpenWeatherListWind;
    sys: OpenWeatherListSys;
    dt_text: string;
}

export interface OpenWeatherApiData {
    cod: string;
    message: number;
    cnt: number;
    list: OpenWeatherList[];
    city: OpenWeatherCity;
}

export interface ForecastByTime {
    weatherCondition: string;
    weatherConditionDescription: string;
    temperature: number;
    temperatureUnit: string;
    temperatureFeelsLike: number;
    temperatureMax: number;
    temperatureMin: number;
    cityName: string;
    dateText: string;
}

export interface ForecastForCity {
    cityName: string;
    weatherByTime: Array<Array<Array<Array<ForecastByTime>>>>;
}
