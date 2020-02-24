/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { AppState } from '../../store';
import history from '../../modules/History/BrowserHistory';

import { WeekCalendar, DayCalendar } from './CalendarInterface';

interface Props {
    month?: number;
}

const Calendar: React.FC<Props> = (props: Props) => {
    const remaindersData = useSelector((state: AppState) => state.remainders);
    const { month } = props;
    const monthToUse = month || moment().month();

    const [fullCalendar, setFullCalendar] = useState<Array<WeekCalendar>>([]);

    const buildFullCalendar = (): void => {
        const calendarView: Array<WeekCalendar> = [];
        let weekCounter = 0;
        let dayNumberInWeek = 0;

        for (let j = 1; j < remaindersData.mappedRemainders.length; j += 1) {
            dayNumberInWeek = Number(
                moment()
                    .month(monthToUse)
                    .date(j)
                    .format('d'),
            );

            const dayRemainders: DayCalendar = {
                remainders: remaindersData.mappedRemainders[j],
                dayNumber: j,
                dayName: moment()
                    .month(monthToUse)
                    .date(j)
                    .format('dddd'),
                monthName: moment()
                    .month(monthToUse)
                    .date(j)
                    .format('MMMM'),
                fullDate: moment()
                    .month(monthToUse)
                    .date(j)
                    .format('MM-DD-YYYY'),
            };

            if (!calendarView[weekCounter]) calendarView[weekCounter] = [];
            calendarView[weekCounter][dayNumberInWeek] = dayRemainders;
            if (dayNumberInWeek + 1 > 6) weekCounter += 1;
        }

        const startDate = Number(
            moment()
                .month(monthToUse)
                .date(1)
                .format('d'),
        );
        let backCounter = 0;

        for (let k = startDate - 1; k >= 0; k -= 1) {
            const dayRemainders: DayCalendar = {
                dayNumber: Number(
                    moment()
                        .month(monthToUse)
                        .date(backCounter)
                        .format('D'),
                ),
                dayName: moment()
                    .month(monthToUse)
                    .date(backCounter)
                    .format('dddd'),
                monthName: moment()
                    .month(monthToUse)
                    .date(backCounter)
                    .format('MMMM'),
                fullDate: moment()
                    .month(monthToUse)
                    .date(backCounter)
                    .format('MM-DD-YYYY'),
            };
            calendarView[0][k] = dayRemainders;
            backCounter -= 1;
        }

        const endMonthDay = Number(
            moment()
                .month(monthToUse)
                .endOf('month')
                .format('D'),
        );
        const endDate = Number(
            moment()
                .month(monthToUse)
                .date(endMonthDay)
                .format('d'),
        );
        let forwardCounter = endMonthDay;

        for (let m = endDate; m < 7; m += 1) {
            const dayRemainders: DayCalendar = {
                dayNumber: Number(
                    moment()
                        .month(monthToUse)
                        .date(forwardCounter)
                        .format('D'),
                ),
                dayName: moment()
                    .month(monthToUse)
                    .date(forwardCounter)
                    .format('dddd'),
                monthName: moment()
                    .month(monthToUse)
                    .date(forwardCounter)
                    .format('MMMM'),
                fullDate: moment()
                    .month(monthToUse)
                    .date(forwardCounter)
                    .format('MM-DD-YYYY'),
            };

            if (!calendarView[calendarView.length - 1][m]) calendarView[calendarView.length - 1][m] = dayRemainders;
            forwardCounter += 1;
        }

        setFullCalendar(calendarView);
    };

    const handleSelection = (selectedDay: DayCalendar) => {
        history.push(`/day/${selectedDay.fullDate}`);
    };

    useEffect(() => {
        if (remaindersData.mappedRemainders.length > 0) buildFullCalendar();
    }, [remaindersData]);

    return (
        <div>
            <h2>Calendar</h2>
            <h4>
                {moment()
                    .month(monthToUse)
                    .format('MMMM YYYY')}
            </h4>
            <div>
                {fullCalendar.map((calendarWeek: WeekCalendar, index) => {
                    return (
                        <p key={index}>
                            {calendarWeek.map((calendarDay: DayCalendar, indexDay: number) => {
                                return (
                                    <button
                                        type="button"
                                        key={indexDay}
                                        value={calendarDay.dayNumber}
                                        onClick={() => handleSelection(calendarDay)}
                                    >
                                        {calendarDay.dayNumber}
                                        &nbsp;
                                    </button>
                                );
                            })}
                        </p>
                    );
                })}
            </div>
        </div>
    );
};

export default Calendar;
