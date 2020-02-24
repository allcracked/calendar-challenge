/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { AppState } from '../../store';
import history from '../../modules/History/BrowserHistory';

import { WeekCalendar, DayCalendar } from '../../store/Remainders/RemaindersInterfaces';

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

    const handleSelection = (selectedDay: DayCalendar) => {
        history.push(`/day/${selectedDay.fullDate}`);
    };

    useEffect(() => {
        if (remaindersData.currentCalendar.length > 0) setFullCalendar(remaindersData.currentCalendar);
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
