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

export interface RemaindersState {
    remainders: RemainderObject;
    mappedRemainders: Array<Array<string>>;
}
