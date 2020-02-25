/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { AppState } from '../../store';
import history from '../../modules/History/BrowserHistory';

import {
    WeekCalendar,
    DayCalendar,
    RemainderMap,
    RemainderInterface,
} from '../../store/Remainders/RemaindersInterfaces';

import styles from './Calendar.module.scss';

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

    const getWeatherForecast = async (): Promise<void> => {
        let todaysYearNumber = moment().year();
        let todaysMonthNumber = moment().month();
        let todaysDayNumber = moment().date();

        const next5DaysMappedRemainders: RemainderMap = [];

        let completed5Days = false;
        let dayCounter = 0;
        while (!completed5Days) {
            if (
                remaindersData.mappedRemainders[todaysYearNumber] &&
                remaindersData.mappedRemainders[todaysYearNumber][todaysMonthNumber] &&
                remaindersData.mappedRemainders[todaysYearNumber][todaysMonthNumber][todaysDayNumber]
            ) {
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
    };

    useEffect(() => {
        if (remaindersData.currentCalendar.length > 0) {
            setFullCalendar(remaindersData.currentCalendar);
            // getWeatherForecast();
        }
    }, [remaindersData]);

    return (
        <div>
            <Container className={styles.calendarContainer}>
                <h3>
                    {moment()
                        .year(yearToUse)
                        .month(monthToUse)
                        .format('MMMM YYYY')}
                </h3>
                <Row>
                    <Col>Sunday</Col>
                    <Col>Monday</Col>
                    <Col>Tuesday</Col>
                    <Col>Wednesday</Col>
                    <Col>Thursday</Col>
                    <Col>Friday</Col>
                    <Col>Saturday</Col>
                </Row>
                {fullCalendar.map((calendarWeek: WeekCalendar, index) => {
                    return (
                        <Row key={index} className={index === calendarWeek.length - 1 ? styles.lastRow : ''}>
                            {calendarWeek.map((calendarDay: DayCalendar, indexDay: number) => {
                                let remainderCounter = 1;
                                return (
                                    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                                    <Col
                                        key={indexDay}
                                        onClick={(): void => handleSelection(calendarDay)}
                                        className={`${styles.calendarColumn} ${
                                            indexDay === 6 ? styles.lastColumn : ''
                                        }`}
                                    >
                                        {index}
                                        &nbsp;
                                        {calendarDay.dayNumber}
                                        &nbsp;
                                        <ul>
                                            {calendarDay.remainders.map((remainderId: string, indexRemainder) => {
                                                if (remaindersData.remainders) {
                                                    const remainder = remaindersData.remainders[remainderId];
                                                    if (remainder) {
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
                                                    }
                                                    return <></>;
                                                }
                                                return <></>;
                                            })}
                                        </ul>
                                    </Col>
                                );
                            })}
                        </Row>
                    );
                })}
            </Container>
        </div>
    );
};

export default Calendar;
