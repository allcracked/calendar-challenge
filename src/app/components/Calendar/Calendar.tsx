import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Navbar from 'react-bootstrap/Navbar';

import { AppState } from '../../store';
import history from '../../modules/History/BrowserHistory';
import thunkGetRemaindersData from '../../store/Remainders/RemaindersThunks';
import IPInfoAPI from '../../modules/IPInfo/IPInfoAPI';
import OpenWeatherApiInstance from '../../modules/OpenWeather/OpenWeatherAPI';
import { ForecastByTime } from '../../modules/OpenWeather/OpenWeatherInterfaces';

import {
    WeekCalendar,
    DayCalendar,
    RemainderMap,
    RemainderInterface,
} from '../../store/Remainders/RemaindersInterfaces';

import Loader from '../Loader/Loader';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import RemainderView from '../RemainderView/RemainderView';

import styles from './Calendar.module.scss';

const Calendar: React.FC = () => {
    const remaindersData = useSelector((state: AppState) => state.remainders);
    const userData = useSelector((state: AppState) => state.loggedUser.userData);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [showRemainderModal, setShowRemainderModal] = useState(false);
    const [activeRemainder, setActiveRemainder] = useState<RemainderInterface>();
    const [fullCalendar, setFullCalendar] = useState<Array<WeekCalendar>>([]);
    const [todayWeatherData, setTodayWeatherData] = useState<ForecastByTime>();

    const getTodaysWeather = async (): Promise<void> => {
        const locationData = await IPInfoAPI.getLocationData();
        const todaysWeather = await OpenWeatherApiInstance.getForecastForCityByTimestamp(
            locationData.city,
            moment.now() / 1000 + 3000,
        );
        setTodayWeatherData(todaysWeather);
    };

    useEffect(() => {
        if (remaindersData.currentCalendar.length > 0) {
            setFullCalendar(remaindersData.currentCalendar);
            getTodaysWeather();
        }
    }, [remaindersData]);

    useEffect(() => {
        if (todayWeatherData !== undefined) {
            setIsLoading(false);
        }
    }, [todayWeatherData]);

    useEffect(() => {
        if (remaindersData && remaindersData.usingYear) {
            dispatch(thunkGetRemaindersData(userData.uid, remaindersData.usingMonth, remaindersData.usingYear));
        } else {
            dispatch(thunkGetRemaindersData(userData.uid, moment().month(), moment().year()));
        }
    }, []);

    const handleSelection = (selectedDay: DayCalendar): void => {
        history.push(`/day/${selectedDay.fullDate}`);
    };

    const handleOneMonthForward = (): void => {
        let newMonth = remaindersData.usingMonth + 1;
        let newYear = remaindersData.usingYear;

        if (remaindersData.usingMonth === 11) {
            newMonth = 0;
            newYear += 1;
        }

        dispatch(thunkGetRemaindersData(userData.uid, newMonth, newYear));
    };

    const handleOneMonthBackward = (): void => {
        let newMonth = remaindersData.usingMonth - 1;
        let newYear = remaindersData.usingYear;

        if (remaindersData.usingMonth === 0) {
            newMonth = 11;
            newYear -= 1;
        }

        dispatch(thunkGetRemaindersData(userData.uid, newMonth, newYear));
    };

    const openRemainderModal = (selectedRemainder: RemainderInterface): void => {
        setActiveRemainder(selectedRemainder);
        setShowRemainderModal(true);
    };
    const closeRemainderModal = (): void => {
        setShowRemainderModal(false);
    };

    if (isLoading) return <Loader />;

    return (
        <div>
            <Header />
            <Container className={styles.calendarContainer}>
                <Row>
                    <Button variant="link" onClick={handleOneMonthBackward}>
                        &lt;
                    </Button>
                    &nbsp;&nbsp;
                    <h2>
                        {moment()
                            .year(remaindersData.usingYear)
                            .month(remaindersData.usingMonth)
                            .format('MMMM YYYY')}
                    </h2>
                    &nbsp;&nbsp;
                    <Button variant="link" onClick={handleOneMonthForward}>
                        &gt;
                    </Button>
                    &nbsp;&nbsp;&nbsp;
                    <h6>
                        Today: &nbsp;
                        {todayWeatherData
                            ? `${todayWeatherData.temperature}\u2103 ${todayWeatherData.weatherCondition} in ${todayWeatherData.cityName}`
                            : ''}
                    </h6>
                </Row>
                <br />
                <Row className="text-center">
                    <Col>
                        <h5>Sunday</h5>
                    </Col>
                    <Col>
                        <h5>Monday</h5>
                    </Col>
                    <Col>
                        <h5>Tuesday</h5>
                    </Col>
                    <Col>
                        <h5>Wednesday</h5>
                    </Col>
                    <Col>
                        <h5>Thursday</h5>
                    </Col>
                    <Col>
                        <h5>Friday</h5>
                    </Col>
                    <Col>
                        <h5>Saturday</h5>
                    </Col>
                </Row>
                {fullCalendar.map((calendarWeek: WeekCalendar, index) => {
                    return (
                        <Row key={index} className={index === calendarWeek.length - 1 ? styles.lastRow : ''}>
                            {calendarWeek.map((calendarDay: DayCalendar, indexDay: number) => {
                                let remainderCounter = 1;
                                return (
                                    <Col
                                        key={calendarDay.timestamp}
                                        className={`${styles.calendarColumn} ${
                                            indexDay === 6 ? styles.lastColumn : ''
                                        } ${indexDay === 6 || indexDay === 0 ? styles.weekendColumn : ''} ${
                                            moment
                                                .unix(calendarDay.timestamp)
                                                .startOf('day')
                                                .unix() ===
                                            moment()
                                                .startOf('day')
                                                .unix()
                                                ? styles.todayColumn
                                                : ''
                                        }`}
                                    >
                                        <h6
                                            className={
                                                moment.unix(calendarDay.timestamp).month() !== remaindersData.usingMonth
                                                    ? styles.dayNotForMonth
                                                    : ''
                                            }
                                            onClick={(): void => handleSelection(calendarDay)}
                                        >
                                            {calendarDay.dayNumber}
                                            &nbsp;&nbsp;
                                            <span>View Day</span>
                                        </h6>
                                        {calendarDay.remainders.map((remainderId: string, indexRemainder) => {
                                            if (remaindersData.remainders) {
                                                const remainder = remaindersData.remainders[remainderId];
                                                if (remainder) {
                                                    if (remainderCounter === 3) {
                                                        remainderCounter += 1;
                                                        return (
                                                            <div
                                                                key={index}
                                                                className={styles.remainderContainer}
                                                                onClick={(): void => handleSelection(calendarDay)}
                                                            >
                                                                ...&nbsp;
                                                                {calendarDay.remainders.length - 2}
                                                                &nbsp;more
                                                            </div>
                                                        );
                                                    }
                                                    if (remainderCounter < 3) {
                                                        remainderCounter += 1;
                                                        return (
                                                            <div
                                                                key={indexRemainder}
                                                                className={`${styles.remainderContainer} _${remainder.color}`}
                                                                onClick={(): void => openRemainderModal(remainder)}
                                                            >
                                                                {moment.unix(remainder.startTime).format('HH:mm')}
                                                            </div>
                                                        );
                                                    }

                                                    return <span key={indexRemainder} />;
                                                }
                                                return <span key={indexRemainder} />;
                                            }
                                            return <span key={indexRemainder} />;
                                        })}
                                    </Col>
                                );
                            })}
                        </Row>
                    );
                })}
            </Container>
            <Modal centered show={showRemainderModal} onHide={closeRemainderModal}>
                <RemainderView remainder={activeRemainder} closeModalParentFunction={closeRemainderModal} />
            </Modal>
            <br />
            <br />
            <Navbar sticky="bottom">
                <Container>
                    <Navbar.Toggle />
                    <Navbar.Collapse>
                        <Navbar.Text>Developed by Jose Avilez for Jobsity</Navbar.Text>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
};

export default Calendar;
