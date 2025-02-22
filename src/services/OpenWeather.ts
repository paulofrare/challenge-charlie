import { api } from './api'


const API_KEY = process.env.OPEN_WEATHER_API_KEY

export const OpenWeather = (city: string) => {
    return api.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=pt_br`)

};

export const OpenWeatherForecast = (lat: number, long: number) => {
    return api.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric&lang=pt_br`);
};

export const OpenWeatherCoord = (lat: number, long: number) => {
    return api.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric&lang=pt_br`);
};

export const OpenWeatherGeo = (city: string) => {
    return api.get(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}&units=metric&lang=pt_br`);
};
