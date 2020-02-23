export interface RemainderLocation {
    city: string;
    region: string;
    country: string;
}

export interface RemainderInterface {
    color: string;
    content: string;
    startTime: number;
    endTime: number;
    durationMinutes: number;
    location: RemainderLocation;
}

export interface RemainderObject {
    [index: string]: RemainderInterface;
}

export interface RemainderMap extends Array<Array<string>> {
    [index: number]: Array<string>;
}

export interface RemaindersState {
    remainders: RemainderObject;
    mappedRemainders: RemainderMap;
}
