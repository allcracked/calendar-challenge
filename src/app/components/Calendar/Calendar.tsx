/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import Table from 'react-bootstrap/Table';

import { AppState } from '../../store';
import history from '../../modules/History/BrowserHistory';
import openWeatherAPI from '../../modules/OpenWeather/OpenWeatherAPI';

import {
    WeekCalendar,
    DayCalendar,
    RemainderMap,
    RemainderInterface,
} from '../../store/Remainders/RemaindersInterfaces';
import { OpenWeatherApiData } from '../../modules/OpenWeather/OpenWeatherInterfaces';

interface Props {
    month?: number;
    year?: number;
}

const Calendar: React.FC<Props> = (props: Props) => {
    const remaindersData = useSelector((state: AppState) => state.remainders);
    const { month, year } = props;
    const monthToUse = month || moment().month();
    const yearToUse = year || moment().year();

    const [fullCalendar, setFullCalendar] = useState<Array<WeekCalendar>>([]);

    const handleSelection = (selectedDay: DayCalendar): void => {
        history.push(`/day/${selectedDay.fullDate}`);
    };

    const getWeatherForecast = async () => {
        let todaysYearNumber = moment().year();
        let todaysMonthNumber = moment().month();
        let todaysDayNumber = moment().date();

        const next5DaysMappedRemainders: RemainderMap = [];

        let completed5Days = false;
        let dayCounter = 0;
        while (!completed5Days) {
            console.log({ todaysDayNumber, todaysMonthNumber, todaysYearNumber });
            if (
                remaindersData.mappedRemainders[todaysYearNumber] &&
                remaindersData.mappedRemainders[todaysYearNumber][todaysMonthNumber] &&
                remaindersData.mappedRemainders[todaysYearNumber][todaysMonthNumber][todaysDayNumber]
            ) {
                console.log('got into if');
                next5DaysMappedRemainders[todaysYearNumber] = next5DaysMappedRemainders[todaysYearNumber] || [];
                next5DaysMappedRemainders[todaysYearNumber][todaysMonthNumber] =
                    next5DaysMappedRemainders[todaysYearNumber][todaysMonthNumber] || [];
                next5DaysMappedRemainders[todaysYearNumber][todaysMonthNumber][todaysDayNumber] = [];
                next5DaysMappedRemainders[todaysYearNumber][todaysMonthNumber][todaysDayNumber][0] =
                    remaindersData.mappedRemainders[todaysYearNumber][todaysMonthNumber][todaysDayNumber][0][0];
                const remainder: RemainderInterface =
                    remaindersData.remainders[
                        remaindersData.mappedRemainders[todaysYearNumber][todaysMonthNumber][todaysDayNumber][0][0]
                    ];
                // openWeatherAPI.getForecastForCityByTimestamp(remainder.city, remainder.startTime).then(data => {});
            }

            if (
                todaysDayNumber ===
                moment()
                    .endOf('month')
                    .date()
            ) {
                todaysDayNumber = 1;
                if (
                    todaysMonthNumber ===
                    moment()
                        .endOf('year')
                        .month()
                ) {
                    todaysMonthNumber = 1;
                    todaysYearNumber += 1;
                }
            } else {
                todaysDayNumber += 1;
            }

            if (dayCounter === 5) completed5Days = true;
            dayCounter += 1;
        }

        console.log({ next5DaysMappedRemainders });
    };

    useEffect(() => {
        if (remaindersData.currentCalendar.length > 0) {
            setFullCalendar(remaindersData.currentCalendar);
            // getWeatherForecast();
        }
    }, [remaindersData]);

    return (
        <div>
            <h2>Calendar</h2>
            <h4>
                {moment()
                    .year(yearToUse)
                    .month(monthToUse)
                    .format('MMMM YYYY')}
            </h4>

            <div>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Sunday</th>
                            <th>Monday</th>
                            <th>Tuesday</th>
                            <th>Wednesday</th>
                            <th>Thursday</th>
                            <th>Friday</th>
                            <th>Saturday</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fullCalendar.map((calendarWeek: WeekCalendar, index) => {
                            return (
                                <tr key={index}>
                                    {calendarWeek.map((calendarDay: DayCalendar, indexDay: number) => {
                                        let remainderCounter = 1;
                                        return (
                                            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                                            <td key={indexDay} onClick={() => handleSelection(calendarDay)}>
                                                {calendarDay.dayNumber}
                                                &nbsp;
                                                <ul>
                                                    {calendarDay.remainders.map(
                                                        (remainderId: string, indexRemainder) => {
                                                            const remainder = remaindersData.remainders[remainderId];
                                                            if (remainderCounter === 3) {
                                                                return (
                                                                    <li key={indexRemainder}>
                                                                        ...&nbsp;
                                                                        {calendarDay.remainders.length - 2}
                                                                        &nbsp;more
                                                                    </li>
                                                                );
                                                            }
                                                            remainderCounter += 1;
                                                            return (
                                                                <li key={indexRemainder}>
                                                                    {moment.unix(remainder.startTime).format('HH:mm')}
                                                                    &nbsp;
                                                                    {remainder.city}
                                                                </li>
                                                            );
                                                        },
                                                    )}
                                                </ul>
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default Calendar;
