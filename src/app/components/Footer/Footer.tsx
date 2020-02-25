import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

const Footer: React.FC = () => {
    return (
        <Navbar sticky="bottom">
            <Container>
                <Navbar.Toggle />
                <Navbar.Collapse>
                    <Navbar.Text>Developed by Jose Avilez for Jobsity</Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Footer;
