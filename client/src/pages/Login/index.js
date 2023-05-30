import React from 'react';
import { Link } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

import { apiURL } from '../../App.config';
import style from './utils/style';
import './style.css';

function Login() {
  return (
    <Container fluid>
      <Row>
        <Col>
          <div className='backdrop login text-center' style={style.background}>
            <h1 className='brand-name'>Playlistr</h1>
            <Image className='login brand-logo' src='./images/icons/playlistr-black-icon.png' />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className='login-div text-center'>
            <h5>To continue, log in to your Spotify account</h5>
            <button
              onClick={() => {
                window.location = `${apiURL}/api/spotify/login`;
              }}
            >
              Sign in with Spotify
            </button>
          </div>
        </Col>
      </Row>
      <Row>
        <p className='copyright-text'>
          Copyright © 2020 All Rights Reserved by{' '}
          <Link to='/about' className='about-link'>
            Playlistr
          </Link>
        </p>
      </Row>
    </Container>
  );
}

export default Login;
