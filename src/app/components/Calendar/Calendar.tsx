/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import Table from 'react-bootstrap/Table';

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
