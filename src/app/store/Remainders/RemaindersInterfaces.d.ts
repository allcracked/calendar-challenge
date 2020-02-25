export interface RemainderLocation {
    city: string;
    region: string;
    country: string;
}

export interface RemainderInterface {
    color: string;
    content: string;
    startTime: number;
    city: string;
    remainderId: string;
}

export interface RemainderObject {
    [index: string]: RemainderInterface;
}

export interface RemainderMap extends Array<Array<Array<Array<string>>>> {
    [index: number]: Array<Array<Array<string>>>;
}

export interface RemaindersState {
    remainders: RemainderObject;
    mappedRemainders: RemainderMap;
    currentCalendar: WeekCalendar[];
    usingMonth: number;
    usingYear: number;
}

export interface WeekCalendar extends Array<DayCalendar> {
    [index: number]: DayCalendar;
}

export interface DayCalendar {
    dayNumber: number;
    dayName: string;
    monthName: string;
    fullDate: string;
    timestamp: number;
    remainders?: Array<string>;
}
