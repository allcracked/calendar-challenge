import React from 'react';
import { useSelector } from 'react-redux';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';

import { AppState } from '../../store/index';
import { firebaseAuth } from '../../modules/Firebase/FirebaseApp';
import history from '../../modules/History/BrowserHistory';

const Header: React.FC = () => {
    const userData = useSelector((state: AppState) => state.loggedUser);

    const handleLogout = (): void => {
        firebaseAuth.signOut();
    };
    const handleGoHome = (): void => {
        history.push('/home');
    };
    const handlerCreateNewRemainder = (): void => {
        history.push('/createRemainder/');
    };

    return (
        <>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand href="#" onClick={handleGoHome}>
                        Jobsity Calendar
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Button variant="outline-primary" onClick={handlerCreateNewRemainder}>
                                Add Remainder
                            </Button>
                        </Nav>
                        <Nav>
                            <Form inline>
                                <Navbar.Collapse className="justify-content-end">
                                    <Navbar.Text>
                                        Signed in as:&nbsp;
                                        {userData.userData.name}
                                    </Navbar.Text>
                                    &nbsp;&nbsp;
                                </Navbar.Collapse>
                                <Button variant="outline-secondary" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </Form>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <br />
        </>
    );
};

export default Header;
