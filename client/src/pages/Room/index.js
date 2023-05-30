import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import { io } from 'socket.io-client';

import { apiURL } from '../../App.config';
import API from '../../utils/API';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Image from 'react-bootstrap/Image';
import Carousel from 'react-bootstrap/Carousel';

import TrackSearch from '../../components/TrackSearch';
import Player from '../../components/Player';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import RoomUser from '../../components/RoomUser';

import spotifyHelpers from '../../utils/spotifyHelpers';
// import configureSlides from '../../utils/configureSlides';
import globalUtils from '../../utils/globalUtils';
import utils from './utils';
import './style.css';

const socket = io(apiURL);

const Room = () => {
  const parsedUrl = queryString.parse(window.location.search);
  const token = parsedUrl.access_token;
  const roomId = parsedUrl.room_id;

  const [user, setUser] = useState(null);
  const [queueTracks, setQueueTracks] = useState(null);
  const [userTrack, setUserTrack] = useState(null);
  const [roomUsers, setRoomUsers] = useState([]);
  const [roomHost, setRoomHost] = useState(null);
  const [roomTrack, setRoomTrack] = useState(null);
  const [slides, setSlides] = useState([]);
  // const [alertShow, setAlertShow] = useState(false);
  const [leaveRoomAlert, setLeaveRoomAlert] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [trackPlaying, setTrackPlaying] = useState(true);
  const [queueTrigger, setQueueTrigger] = useState(false);

  const [track, setTrack] = useState({
    name: '',
    albumImages: [],
    artists: [],
    duration: 0,
    progress: 0
  });

  const handleUser = async token => {
    try {
      const currentUser = await spotifyHelpers.user(token);
      setUser(currentUser);
    } catch (err) {
      console.log(err);
    }
  };

  const handleStatusMsg = message => {
    setStatusMsg(message);

    setTimeout(() => setStatusMsg(''), 2000);
  };

  const handleSockets = () => {
    if (roomId && user) {
      socket.emit('join room', roomId, user);
      socket.on('user status', ({ text }) => handleStatusMsg(text));
      socket.on('current users', currentUsers => {
        if (currentUsers[0]) {
          setRoomHost(currentUsers[0]);
          setRoomUsers(currentUsers);
        }
      });
      socket.on('room song', track => {
        setTrack(track);
      });
    }

    socket.on('disconnect', () => socket.disconnect());
  };

  const handleCurrentRoomTrack = () => {
    if (user && roomHost && user.id === roomHost.id && track) {
      socket.emit('host song', { song: track, roomId: roomId });
    }
  };

  const handleCurrentlyPlaying = async token => {
    const { trackData, isPlaying, timeRemaining } = await utils.getCurrentTrack(token);

    if (trackData) {
      setTrack(trackData);
      setTrackPlaying(isPlaying);
      setUserTrack(trackData);

      setTimeout(() => {
        handleCurrentlyPlaying(token);
      }, timeRemaining);
    } else setTrackPlaying(false);
  };

  const handleRoomTracks = async id => {
    try {
      const { data } = await API.getTracks(id);

      if (data && data.addedTracks[0]) {
        setQueueTracks(data.addedTracks);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const renderAvatarSlides = () => {
    if (roomUsers[0]) setSlides(globalUtils.configureSlides(roomUsers, 3));
  };

  const updateTrackInDB = async () => {
    try {
      if (track && queueTracks) {
        const trackPlaying = queueTracks.filter(item => item.spotifyId == track.id)[0];

        if (trackPlaying && !trackPlaying.nowPlaying) {
          await API.updateTrack(roomId, trackPlaying.spotifyId, 'now_playing');
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (token && roomId) {
      handleUser(token);
      handleCurrentlyPlaying(token);
    }
  }, []);

  useEffect(() => {
    if (roomId) {
      handleRoomTracks(roomId);
    }
  }, [queueTrigger]);

  useEffect(() => {
    updateTrackInDB();
  }, [track, queueTracks]);

  useEffect(() => {
    handleSockets();
  }, [user]);

  useEffect(() => {
    handleCurrentRoomTrack();
  }, [user, roomHost]);

  useEffect(() => {
    renderAvatarSlides();
  }, [roomUsers]);

  return roomId && user && token ? (
    <div>
      <Container className='pt-5 pb-4'>
        <Row>
          {/* Logo */}
          <Col xs={12} md={2} className='text-center'>
            <Image className='brand-logo' src='./images/icons/playlistr-yellow-icon.png' />
          </Col>

          {/* Current Room */}
          <Col className='room-title' xs={12} md={4}>
            <h1>Current Room: {roomId} </h1>
          </Col>

          {/* Track Search */}
          <Col className='track-search-container' xs={12} md={6}>
            <TrackSearch
              token={token}
              roomId={roomId}
              user={user}
              handleRoomTracks={handleRoomTracks}
              queueTrigger={queueTrigger}
              setQueueTrigger={setQueueTrigger}
            />
            <button className='float-right' onClick={() => setLeaveRoomAlert(true)}>
              Leave Room
            </button>
          </Col>
        </Row>
      </Container>
      {/* Leave Room Alert */}
      <Row>
        <Col xs={12}>
          <div className='playlist-alert d-flex align-items-center'>
            <Alert
              variant='dark'
              show={leaveRoomAlert}
              onClose={() => setLeaveRoomAlert(false)}
              dismissible
            >
              <p>Are you sure?</p>
              <p>
                Leaving this Room and joining again will affect your shared listening experience.
              </p>
              <button
                onClick={() => {
                  window.location = `/home?access_token=${token}`;
                }}
              >
                Leave Room
              </button>
            </Alert>
          </div>
        </Col>
      </Row>
      <Container>
        <Row>
          {/* Album Image */}
          <Col xs={6} md={6} className='text-center'>
            <img
              className='now-playing-img'
              src={
                track && track.albumImages[0]
                  ? track.albumImages[0]
                  : '/images/playlistr-yellow-logo.png'
              }
              alt='Track album artwork'
            />
          </Col>

          {/* Play Queue */}
          <Col xs={6} md={6}>
            <div className='play-queue'>
              <h1>Play Queue</h1>

              <ListGroup className='play-queue-list'>
                {queueTracks ? (
                  queueTracks.map(obj => (
                    <ListGroup.Item
                      className='play-queue-item'
                      key={obj._id}
                      id={obj.spotifyId}
                      variant={obj.spotifyId === track.id ? 'warning' : 'dark'}
                    >
                      {obj.info}
                    </ListGroup.Item>
                  ))
                ) : (
                  <p className='queue-help'>Add a track to get started...</p>
                )}
              </ListGroup>
            </div>
          </Col>
        </Row>
      </Container>
      <Container>
        <Row>
          {/* Alert */}
          <Col xs={12} sm={6} md={6}>
            {!trackPlaying ? (
              <Alert variant='success'>
                <h5>To sync with the Room, open Spotify & play a track</h5>

                <div className='d-flex justify-content-end'>
                  <button
                    className='alert-button'
                    onClick={() => handleCurrentlyPlaying(token)}
                    variant='outline-success'
                  >
                    Ready
                  </button>
                </div>
              </Alert>
            ) : null}

            {/* Music Player */}
            {track.name && track.artists[0] && track.duration && track.progress ? (
              <Player
                token={token}
                track={track}
                trackPlaying={trackPlaying}
                setTrackPlaying={setTrackPlaying}
                handleCurrentlyPlaying={handleCurrentlyPlaying}
                user={user}
                roomId={roomId}
                queueTracks={queueTracks}
                queueTrigger={queueTrigger}
                setQueueTrigger={setQueueTrigger}
                // emitPlayerAction={this.emitPlayerAction}
                room={roomId}
              />
            ) : null}
          </Col>
          <Col xs={12} sm={6} md={6}>
            {/* User Avatars */}
            <Row>
              <Carousel className='room-carousel' interval={3500} indicators={false}>
                {slides[0]
                  ? slides.map(slide => (
                      <Carousel.Item key={`carousel-item-${slides.indexOf(slide)}`}>
                        <Container>
                          <Row>
                            {slide.map(user => (
                              <RoomUser
                                key={user.id}
                                user={user}
                                avatar={user.image}
                                name={user.name}
                              />
                            ))}
                          </Row>
                        </Container>
                      </Carousel.Item>
                    ))
                  : null}
              </Carousel>
            </Row>
            <Row>{statusMsg ? <p className='status-msg'>{statusMsg}</p> : null}</Row>
          </Col>
        </Row>
      </Container>
    </div>
  ) : null;
};

export default Room;
