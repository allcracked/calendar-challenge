import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { AppState } from '../../store/index';
import { RemainderInterface } from '../../store/Remainders/RemaindersInterfaces';
import openWeatherApi from '../../modules/OpenWeather/OpenWeatherAPI';
import remaindersDAO from '../../modules/DAO/Remainders/Remainders';
import { ForecastByTime } from '../../modules/OpenWeather/OpenWeatherInterfaces';
import history from '../../modules/History/BrowserHistory';

import Loader from '../Loader/Loader';
import thunkGetRemaindersData from '../../store/Remainders/RemaindersThunks';

interface Props {
    remainder: RemainderInterface;
    closeModalParentFunction: () => void;
}

const RemainderView: React.FC<Props> = (props: Props) => {
    const userData = useSelector((state: AppState) => state.loggedUser.userData);
    const usingYear = useSelector((state: AppState) => state.remainders.usingYear);
    const usingMonth = useSelector((state: AppState) => state.remainders.usingMonth);
    const dispatch = useDispatch();
    const { remainder, closeModalParentFunction } = props;
    const [weatherDetails, setWeatherDetails] = useState<ForecastByTime>();
    const [weatherMessage, setWeatherMessage] = useState('No weather available.');
    const [isLoading, setIsLoading] = useState(true);

    const getWeatherData = async (): Promise<void> => {
        const weatherFromAPI = await openWeatherApi.getForecastForCityByTimestamp(remainder.city, remainder.startTime);
        setWeatherDetails(weatherFromAPI);
    };

    const editRemainder = (remainderId: string): void => {
        history.push(`/edit/${remainderId}`);
    };

    const deleteRemainder = async (remainderId: string): Promise<void> => {
        await remaindersDAO.removeRemainderByUserAndRemainderId(userData.uid, remainderId);
        dispatch(thunkGetRemaindersData(userData.uid, usingMonth, usingYear));
        closeModalParentFunction();
    };

    useEffect(() => {
        getWeatherData();
    }, []);

    useEffect(() => {
        if (weatherDetails) {
            setWeatherMessage(
                `${weatherDetails.temperature}\u2103 ${weatherDetails.weatherCondition} in ${weatherDetails.cityName}`,
            );
        } else {
            setWeatherMessage(`No weather details available for ${remainder.city}`);
        }
        setIsLoading(false);
    }, [weatherDetails]);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div>
            <Modal.Header closeButton>
                <Modal.Title>
                    <h4>{weatherMessage}</h4>
                    Remainder for&nbsp;
                    {moment.unix(remainder.startTime).calendar()}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h3>{remainder.content}</h3>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={(): Promise<void> => deleteRemainder(remainder.remainderId)}>
                    Delete
                </Button>
                <Button variant="warning" onClick={(): void => editRemainder(remainder.remainderId)}>
                    Edit
                </Button>
                <Button variant="secondary" onClick={closeModalParentFunction}>
                    Close
                </Button>
            </Modal.Footer>
        </div>
    );
};

export default RemainderView;
