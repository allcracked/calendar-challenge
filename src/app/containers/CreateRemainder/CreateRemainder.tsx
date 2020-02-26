import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Toast from 'react-bootstrap/Toast';

import { AppState } from '../../store';
import { RemainderInterface } from '../../store/Remainders/RemaindersInterfaces';
import remaindersDAO from '../../modules/DAO/Remainders/Remainders';
import history from '../../modules/History/BrowserHistory';

import Loader from '../../components/Loader/Loader';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

interface Props {
    remainderId?: string;
}

const CreateRemainder: React.FC<Props> = (props: Props) => {
    const { remainderId } = props;
    const remainders = useSelector((state: AppState) => state.remainders.remainders);
    const userData = useSelector((state: AppState) => state.loggedUser.userData);

    const [isLoading, setIsLoading] = useState(true);
    const [remainderEdit, setRemainderEdit] = useState<RemainderInterface>();
    const [colorRemainder, setColorRemainder] = useState('FF6666');
    const [contentRemainder, setContentRemainder] = useState('');
    const [cityRemainder, setCityRemainder] = useState('');
    const [idRemainder, setIdRemainder] = useState('');
    const [dateRemainder, setDateRemainder] = useState(moment.unix(moment.now() / 1000).format('YYYY-MM-DD'));
    const [timeRemainder, setTimeRemainder] = useState(moment.unix(moment.now() / 1000).format('HH:mm'));
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (remainderId) {
            setRemainderEdit(remainders[remainderId]);

            setColorRemainder(remainders[remainderId].color);
            setContentRemainder(remainders[remainderId].content);
            setCityRemainder(remainders[remainderId].city);
            setIdRemainder(remainders[remainderId].remainderId);
            setDateRemainder(moment.unix(remainders[remainderId].startTime).format('YYYY-MM-DD'));
            setTimeRemainder(moment.unix(remainders[remainderId].startTime).format('HH:mm'));
        } else {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (remainderEdit) setIsLoading(false);
    }, [remainderEdit]);

    const checkEditedRemainderStructure = (): void => {
        const remainderTimestamp = moment(`${dateRemainder}:${timeRemainder}`, 'YYYY-MM-DD:HH:mm').unix();
        const nowTimestamp = Math.round(moment.now() / 1000);
        const hexColorRegex = /^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

        if (remainderTimestamp <= nowTimestamp) {
            throw new Error('Date and Time should be above current date.');
        }

        if (contentRemainder.length < 1) {
            throw new Error('Remainder content is empty.');
        }

        if (contentRemainder.length > 30) {
            throw new Error('Remainder content exceeds 30 characters.');
        }

        if (cityRemainder.length < 2) {
            throw new Error('City name is too short.');
        }

        if (!hexColorRegex.exec(colorRemainder)) {
            throw new Error('Color code is no hexadecimal.');
        }
    };

    const handleRemainderChanges = async (event: any): Promise<void> => {
        event.preventDefault();
        try {
            checkEditedRemainderStructure();
        } catch (error) {
            setErrorMessage(error.message);
            setShowErrorAlert(true);
            return;
        }

        const savingRemainder: RemainderInterface = {
            color: colorRemainder,
            content: contentRemainder,
            startTime: moment(`${dateRemainder}:${timeRemainder}`, 'YYYY-MM-DD:HH:mm').unix(),
            city: cityRemainder,
            remainderId: idRemainder || '',
        };

        if (remainderEdit) {
            await remaindersDAO.setRemainderByUserAndRemainderId(
                userData.uid,
                savingRemainder.remainderId,
                savingRemainder,
            );
        } else {
            await remaindersDAO.setRemainderByUser(userData.uid, savingRemainder);
        }

        history.push('/home');
    };

    const handleContentChange = (event: any): void => {
        setContentRemainder(event.target.value);
    };
    const handleColorChange = (event: any): void => {
        setColorRemainder(event.target.value);
    };
    const handleDateChange = (event: any): void => {
        setDateRemainder(event.target.value);
    };
    const handleTimeChange = (event: any): void => {
        setTimeRemainder(event.target.value);
    };
    const handleCityChange = (event: any): void => {
        setCityRemainder(event.target.value);
    };

    if (isLoading) return <Loader />;

    return (
        <div>
            <Header />
            <Container>
                <h1>{remainderEdit ? 'Edit Remainder' : 'Create a New Remainder'}</h1>
                <br />
                <Row>
                    <Col md={{ span: 6, offset: 3 }}>
                        <Form onSubmit={handleRemainderChanges}>
                            <Form.Group controlId="formContent">
                                <Form.Label>Remainder</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Remainder content"
                                    maxLength={30}
                                    required
                                    value={contentRemainder}
                                    onChange={handleContentChange}
                                />
                                <Form.Text className="text-muted">Remainder can have up to 30 characters.</Form.Text>
                                <Form.Group controlId="fromColor">
                                    <Form.Label>Select a Color</Form.Label>
                                    <Form.Control as="select" value={colorRemainder} onChange={handleColorChange}>
                                        <option value="FF6666">Red</option>
                                        <option value="43A3EC">Blue</option>
                                        <option value="95E1AD">Green</option>
                                        <option value="FFFF99">Yellow</option>
                                    </Form.Control>
                                </Form.Group>
                            </Form.Group>

                            <Form.Group controlId="startDate">
                                <Form.Label>Remainder Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    placeholder="Date"
                                    required
                                    value={dateRemainder}
                                    onChange={handleDateChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="startTime">
                                <Form.Label>Remainder Time</Form.Label>
                                <Form.Control
                                    type="time"
                                    placeholder="Time"
                                    required
                                    value={timeRemainder}
                                    onChange={handleTimeChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="city">
                                <Form.Label>City</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Add a City"
                                    minLength={2}
                                    required
                                    value={cityRemainder}
                                    onChange={handleCityChange}
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                {remainderEdit ? 'Save Changes' : 'Create Remainder'}
                            </Button>
                        </Form>
                    </Col>
                </Row>
                <Toast
                    show={showErrorAlert}
                    onClose={(): void => setShowErrorAlert(false)}
                    style={{
                        position: 'absolute',
                        bottom: 20,
                        right: 20,
                    }}
                >
                    <Toast.Header>
                        <strong className="mr-auto">Error</strong>
                    </Toast.Header>
                    <Toast.Body>{errorMessage}</Toast.Body>
                </Toast>
            </Container>
            <Footer />
        </div>
    );
};

export default CreateRemainder;
