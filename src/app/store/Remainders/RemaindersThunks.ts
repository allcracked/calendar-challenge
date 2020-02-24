import { Dispatch } from 'redux';
import moment from 'moment';

import { RemaindersState, RemainderObject, RemainderMap, DayCalendar, WeekCalendar } from './RemaindersInterfaces';
import { saveRemaindersData } from './RemaindersActions';
import RemaindersDAO from '../../modules/DAO/Remainders/Remainders';

function mapRemaindersByDay(rawRemainders: RemainderObject): RemainderMap {
    const mappedRemainders: RemainderMap = [];
    if (!rawRemainders) return mappedRemainders;
    const remaindersArray = Object.entries(rawRemainders);

    remaindersArray.forEach(remainder => {
        const remainderYear = moment.unix(remainder[1].startTime).year();
        const remainderMonth = moment.unix(remainder[1].startTime).month();
        const remainderDay = moment.unix(remainder[1].startTime).date();

        if (!mappedRemainders[remainderYear]) mappedRemainders[remainderYear] = [];
        if (!mappedRemainders[remainderYear][remainderMonth]) mappedRemainders[remainderYear][remainderMonth] = [];
        if (!mappedRemainders[remainderYear][remainderMonth][remainderDay])
            mappedRemainders[remainderYear][remainderMonth][remainderDay] = [];
        mappedRemainders[remainderYear][remainderMonth][remainderDay].push(remainder[0]);
    });

    return mappedRemainders;
}

function buildCalendar(month: number, year: number): WeekCalendar[] {
    const monthStarts = moment()
        .year(year)
        .month(month)
        .startOf('month')
        .date();
    const monthEnds = moment()
        .year(year)
        .month(month)
        .endOf('month')
        .date();

    const thisMonthCalendar: WeekCalendar[] = [];
    let weekCounter = 0;

    for (let i = monthStarts; i <= monthEnds; i += 1) {
        const dayNumberInWeek = Number(
            moment()
                .year(year)
                .month(month)
                .date(i)
                .format('d'),
        );

        const dayData: DayCalendar = {
            dayNumber: i,
            dayName: moment()
                .year(year)
                .month(month)
                .date(i)
                .format('dddd'),
            monthName: moment()
                .year(year)
                .month(month)
                .date(i)
                .format('MMMM'),
            fullDate: moment()
                .year(year)
                .month(month)
                .date(i)
                .format('MM-DD-YYYY'),
            timestamp: moment()
                .year(year)
                .month(month)
                .date(i)
                .unix(),
        };

        if (!thisMonthCalendar[weekCounter]) thisMonthCalendar[weekCounter] = [];
        thisMonthCalendar[weekCounter][dayNumberInWeek] = dayData;
        if (dayNumberInWeek + 1 > 6) weekCounter += 1;
    }

    const startDate = Number(
        moment()
            .year(year)
            .month(month)
            .date(1)
            .format('d'),
    );
    let backCounter = 0;

    for (let k = startDate - 1; k >= 0; k -= 1) {
        const dayRemainders: DayCalendar = {
            dayNumber: Number(
                moment()
                    .year(year)
                    .month(month)
                    .date(backCounter)
                    .format('D'),
            ),
            dayName: moment()
                .year(year)
                .month(month)
                .date(backCounter)
                .format('dddd'),
            monthName: moment()
                .year(year)
                .month(month)
                .date(backCounter)
                .format('MMMM'),
            fullDate: moment()
                .year(year)
                .month(month)
                .date(backCounter)
                .format('MM-DD-YYYY'),
            timestamp: moment()
                .year(year)
                .month(month)
                .date(backCounter)
                .unix(),
        };
        thisMonthCalendar[0][k] = dayRemainders;
        backCounter -= 1;
    }

    const endMonthDay = Number(
        moment()
            .year(year)
            .month(month)
            .endOf('month')
            .format('D'),
    );
    const endDate = Number(
        moment()
            .year(year)
            .month(month)
            .date(endMonthDay)
            .format('d'),
    );
    let forwardCounter = endMonthDay;

    for (let m = endDate; m < 7; m += 1) {
        const dayRemainders: DayCalendar = {
            dayNumber: Number(
                moment()
                    .year(year)
                    .month(month)
                    .date(forwardCounter)
                    .format('D'),
            ),
            dayName: moment()
                .year(year)
                .month(month)
                .date(forwardCounter)
                .format('dddd'),
            monthName: moment()
                .year(year)
                .month(month)
                .date(forwardCounter)
                .format('MMMM'),
            fullDate: moment()
                .year(year)
                .month(month)
                .date(forwardCounter)
                .format('MM-DD-YYYY'),
            timestamp: moment()
                .year(year)
                .month(month)
                .date(forwardCounter)
                .unix(),
        };

        if (!thisMonthCalendar[thisMonthCalendar.length - 1][m])
            thisMonthCalendar[thisMonthCalendar.length - 1][m] = dayRemainders;
        forwardCounter += 1;
    }

    return thisMonthCalendar;
}

function fillCalendar(remaindersMap: RemainderMap, calendarView: WeekCalendar[]): WeekCalendar[] {
    const flattenedCalendar: DayCalendar[] = [];

    calendarView.forEach(week => {
        week.forEach(day => {
            const returningDay = day;
            const year = moment.unix(day.timestamp).year();
            const month = moment.unix(day.timestamp).month();
            returningDay.remainders = [];
            if (remaindersMap[year] && remaindersMap[year][month] && remaindersMap[year][month][day.dayNumber]) {
                remaindersMap[year][month][day.dayNumber].forEach(remainder => {
                    returningDay.remainders.push(remainder);
                });
            }
            flattenedCalendar.push(returningDay);
        });
    });

    const returningCalendar: WeekCalendar[] = [];
    let currentWeek = 0;
    for (let i = 0; i < flattenedCalendar.length; i += 1) {
        const dayOfTheWeek = Number(moment.unix(flattenedCalendar[i].timestamp).format('d'));
        if (!returningCalendar[currentWeek]) returningCalendar[currentWeek] = [];
        returningCalendar[currentWeek][dayOfTheWeek] = flattenedCalendar[i];
        if (dayOfTheWeek + 1 > 6) currentWeek += 1;
    }

    return returningCalendar;
}

const thunkGetRemaindersData = (userId: string, month: number, year: number) => async (
    dispatch: Dispatch,
): Promise<void> => {
    const currentCalendar: WeekCalendar[] = buildCalendar(month, year);
    const firstCalendarDayTS = currentCalendar[0][0].timestamp;
    const lastCalendarDayTS =
        currentCalendar[currentCalendar.length - 1][currentCalendar[currentCalendar.length - 1].length - 1].timestamp;
    const remaindersData: RemainderObject = await RemaindersDAO.getRemaindersByUserAndTimeRange(
        userId,
        firstCalendarDayTS,
        lastCalendarDayTS,
    );
    const mappedRemainders: RemainderMap = mapRemaindersByDay(remaindersData);

    const completeCalendar: WeekCalendar[] = fillCalendar(mappedRemainders, currentCalendar);

    const remaindersSavingData: RemaindersState = {
        remainders: remaindersData,
        mappedRemainders,
        currentCalendar: completeCalendar,
        usingMonth: month,
    };
    dispatch(saveRemaindersData(remaindersSavingData));
};

export default thunkGetRemaindersData;
