declare namespace CalendarModuleScssModule {
    export interface ICalendarModuleScss {
        calendarColumn: string;
        calendarContainer: string;
        dayNotForMonth: string;
        lastColumn: string;
        lastRow: string;
        remainderContainer: string;
        todayColumn: string;
        weekendColumn: string;
    }
}

declare const CalendarModuleScssModule: CalendarModuleScssModule.ICalendarModuleScss & {
    /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
    locals: CalendarModuleScssModule.ICalendarModuleScss;
};

export = CalendarModuleScssModule;
