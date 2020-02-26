import React from 'react';
import firebase from 'firebase/app';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { firebaseAuth } from '../../modules/Firebase/FirebaseApp';

import Footer from '../../components/Footer/Footer';

import styles from './Login.module.scss';

const Login: React.FC = () => {
    const handleLogin = (): void => {
        const googleProvider = new firebase.auth.GoogleAuthProvider();
        firebaseAuth.signInWithPopup(googleProvider);
    };

    const handleAnonymousLogin = (): void => {
        firebaseAuth.signInAnonymously();
    };

    return (
        <>
            <Container className={styles.mainContainer}>
                <Row>
                    <Col md={{ span: 6, offset: 3 }} className="text-center">
                        <h1 className="text-center">Jobsity Calendar</h1>
                        <br />
                        <br />
                        <Button variant="primary" size="lg" onClick={handleLogin}>
                            Login with Google
                        </Button>
                        <br />
                        <Button variant="link" onClick={handleAnonymousLogin}>
                            Continue without Google
                        </Button>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>
    );
};

export default Login;
