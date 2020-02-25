import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import { AppState } from '../../store/index';

import { ForecastByTime } from '../../modules/OpenWeather/OpenWeatherInterfaces';
import openWeatherApi from '../../modules/OpenWeather/OpenWeatherAPI';
import remaindersDAO from '../../modules/DAO/Remainders/Remainders';
import { RemainderInterface } from '../../store/Remainders/RemaindersInterfaces';
import history from '../../modules/History/BrowserHistory';
import thunkGetRemaindersData from '../../store/Remainders/RemaindersThunks';

import Loader from '../../components/Loader/Loader';
import RemainderView from '../../components/RemainderView/RemainderView';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

interface Props {
    day?: string;
}

const DayView: React.FC<Props> = (props: Props) => {
    const { day } = props;
    const remaindersData = useSelector((state: AppState) => state.remainders);
    const userData = useSelector((state: AppState) => state.loggedUser.userData);
    const dispatch = useDispatch();
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
        setShowRemainderModal(false);
    };

    const handleClearDay = async (): Promise<void> => {
        await remaindersDAO.removeRemainderByUserAndDay(userData.uid, dateToUse.timestamp);
        dispatch(thunkGetRemaindersData(userData.uid, remaindersData.usingMonth, remaindersData.usingYear));
    };

    useEffect(() => {
        setDateToUse(getTimeData(day));
    }, []);

    useEffect(() => {
        if (dateToUse) getThisDateRemainders();
    }, [dateToUse, remaindersData]);

    useEffect(() => {
        if (thisDayRemainders) {
            setIsLoading(false);
        }
    }, [thisDayRemainders]);

    if (isLoading) return <Loader />;

    return (
        <div>
            <Header />
            <Container>
                <h1>
                    {moment(dateToUse.fullDate, moment.localeData().longDateFormat('L')).format('dddd, MMMM Do, YYYY')}
                </h1>
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
                <Button onClick={handleClearDay}>Clear Day</Button>

                <Modal show={showRemainderModal} onHide={closeRemainderModal}>
                    <RemainderView remainder={activeRemainder} closeModalParentFunction={closeRemainderModal} />
                </Modal>
            </Container>
            <Footer />
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
