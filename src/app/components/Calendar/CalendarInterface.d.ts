export interface WeekCalendar extends Array<DayCalendar> {
    [index: number]: DayCalendar;
}

export interface DayCalendar {
    dayNumber: number;
    dayName: string;
    monthName: string;
    fullDate: string;
    remainders?: Array<string>;
}
