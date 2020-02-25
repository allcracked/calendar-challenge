import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { AppState } from '../../store/index';

import { ForecastByTime } from '../../modules/OpenWeather/OpenWeatherInterfaces';
import openWeatherApi from '../../modules/OpenWeather/OpenWeatherAPI';
import remaindersDAO from '../../modules/DAO/Remainders/Remainders';
import { RemainderInterface } from '../../store/Remainders/RemaindersInterfaces';
import history from '../../modules/History/BrowserHistory';

import Loader from '../../components/Loader/Loader';
import RemainderView from '../../components/RemainderView/RemainderView';
import Home from '../Home/Home';

interface Props {
    day?: string;
}

const DayView: React.FC<Props> = (props: Props) => {
    const { day } = props;
    const remaindersData = useSelector((state: AppState) => state.remainders);
    const userData = useSelector((state: AppState) => state.loggedUser.userData);
    const [dateToUse, setDateToUse] = useState<FormattedTime>();
    const [todaysWeather, setTodaysWeather] = useState('No weather data available.');
    const [thisDayRemainders, setThisDayRemainders] = useState<RemainderInterface[]>();
    const [isLoading, setIsLoading] = useState(true);
    const [showRemainderModal, setShowRemainderModal] = useState(false);
    const [activeRemainder, setActiveRemainder] = useState<RemainderInterface>();

    const getTodaysWeatherFromAPI = async (): Promise<void> => {
        // const weatherData: ForecastByTime = await openWeatherApi.getForecastForCityByTimestamp(moment.now() / 1000);
    };

    const getTimeData = (date: string): FormattedTime => {
        // @TODO Menthod to get weather for current user's city.
        const slashFormatTime = date.replace(/-/g, '/');
        const returningTime: FormattedTime = {
            year: moment(slashFormatTime, moment.localeData().longDateFormat('L')).year(),
            monthNumber: moment(slashFormatTime, moment.localeData().longDateFormat('L')).month(),
            dayMonthNumber: moment(slashFormatTime, moment.localeData().longDateFormat('L')).date(),
            dayWeekNumber: Number(moment(slashFormatTime, moment.localeData().longDateFormat('L')).format('d')),
            fullDate: slashFormatTime,
            timestamp: moment(slashFormatTime, moment.localeData().longDateFormat('L')).unix(),
        };
        return returningTime;
    };

    const getThisDateRemainders = (): void => {
        const returningRemainders: RemainderInterface[] = [];
        if (
            remaindersData.mappedRemainders[dateToUse.year] &&
            remaindersData.mappedRemainders[dateToUse.year][dateToUse.monthNumber] &&
            remaindersData.mappedRemainders[dateToUse.year][dateToUse.monthNumber][dateToUse.dayMonthNumber]
        ) {
            remaindersData.mappedRemainders[dateToUse.year][dateToUse.monthNumber][dateToUse.dayMonthNumber].forEach(
                (remainderId: string) => {
                    returningRemainders.push(remaindersData.remainders[remainderId]);
                },
            );
        }
        returningRemainders.sort((a, b) => a.startTime - b.startTime);
        setThisDayRemainders(returningRemainders);
    };

    const openRemainderModal = (selectedRemainder: RemainderInterface): void => {
        setActiveRemainder(selectedRemainder);
        setShowRemainderModal(true);
    };
    const closeRemainderModal = (): void => {
        console.log('called close function@');
        setShowRemainderModal(false);
    };

    const clearDay = async (): Promise<void> => {
        await remaindersDAO.removeRemainderByUserAndDay(userData.uid, dateToUse.timestamp);
        history.push('/home');
    };

    useEffect(() => {
        setDateToUse(getTimeData(day));
    }, []);

    useEffect(() => {
        if (dateToUse) getThisDateRemainders();
    }, [dateToUse]);

    useEffect(() => {
        if (thisDayRemainders) {
            setIsLoading(false);
        }
    }, [thisDayRemainders]);

    if (!day) return <Home />;
    if (isLoading) return <Loader />;

    return (
        <div>
            <h1>{moment(dateToUse.fullDate, moment.localeData().longDateFormat('L')).format('dddd, MMMM Do, YYYY')}</h1>
            <ul>
                {thisDayRemainders.length > 0 ? (
                    thisDayRemainders.map(remainder => {
                        return (
                            <li key={remainder.startTime}>
                                Time:&nbsp;
                                {moment.unix(remainder.startTime).format('HH:mm')}
                                &nbsp;Remainder:&nbsp;
                                {remainder.content}
                                <button type="button" onClick={(): void => openRemainderModal(remainder)}>
                                    See
                                </button>
                            </li>
                        );
                    })
                ) : (
                    <li>No reaminders for this day.</li>
                )}
            </ul>
            <Button onClick={clearDay}>Clear Day</Button>

            <Modal show={showRemainderModal} onHide={closeRemainderModal}>
                <RemainderView remainder={activeRemainder} closeModalParentFunction={closeRemainderModal} />
            </Modal>
        </div>
    );
};

export default DayView;

interface FormattedTime {
    year: number;
    monthNumber: number;
    dayMonthNumber: number;
    dayWeekNumber: number;
    fullDate: string;
    timestamp: number;
}
