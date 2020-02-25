import React from 'react';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';

import styles from './Loader.module.scss';

interface Props {
    waitingMessage?: string;
}

const Loader: React.FC<Props> = (props: Props) => {
    const { waitingMessage } = props;
    return (
        <Container className={`text-center ${styles.loaderContainer}`}>
            <Spinner animation="grow" />
            <h5>
                {waitingMessage && waitingMessage.length > 0 ? waitingMessage : 'Please wait while the logic is ready'}
            </h5>
        </Container>
    );
};

export default Loader;
