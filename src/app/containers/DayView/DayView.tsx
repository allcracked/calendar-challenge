import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';

import { AppState } from '../../store/index';

import { OpenWeatherApiData } from '../../modules/OpenWeather/OpenWeatherInterfaces';
import openWeatherApi from '../../modules/OpenWeather/OpenWeatherAPI';

interface Props {
    day: string;
}

const DayView: React.FC<Props> = (props: Props) => {
    const { day } = props;
    const remaindersData = useSelector((state: AppState) => state.remainders);
    const [dateToUse, setDateToUse] = useState<FormattedTime>();

    const getWeatherData = async (): Promise<void> => {
        let weatherData: OpenWeatherApiData;
        if (remaindersData.mappedRemainders[dateToUse.dayMonthNumber].length > 0) {
            weatherData = await openWeatherApi.getForecastForCity(
                remaindersData.remainders[remaindersData.mappedRemainders[dateToUse.dayMonthNumber][0]].location.city,
            );
        }
        console.log({ weatherData });
    };

    const getTimeData = (date: string): FormattedTime => {
        const slashFormatTime = date.replace(/-/g, '/');
        const returningTime: FormattedTime = {
            year: moment(slashFormatTime, moment.localeData().longDateFormat('L')).year(),
            monthNumber: moment(slashFormatTime, moment.localeData().longDateFormat('L')).month(),
            dayMonthNumber: moment(slashFormatTime, moment.localeData().longDateFormat('L')).date(),
            dayWeekNumber: Number(moment(slashFormatTime, moment.localeData().longDateFormat('L')).format('d')),
            fullDate: slashFormatTime,
        };
        return returningTime;
    };

    useEffect(() => {
        const formattedDay = getTimeData(day);
        setDateToUse(formattedDay);
    }, []);

    useEffect(() => {
        if (!dateToUse) return;
        getWeatherData();
    }, [dateToUse]);

    return (
        <div>
            <p>Hey</p>
        </div>
    );
};

export default DayView;

interface FormattedTime {
    year: number;
    monthNumber: number;
    dayMonthNumber: number;
    dayWeekNumber: number;
    fullDate: string;
}
