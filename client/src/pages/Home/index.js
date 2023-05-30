import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import hexGen from 'hex-generator';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Carousel from 'react-bootstrap/Carousel';

import Playlist from '../../components/Playlist';
import RoomButtons from '../../components/RoomButtons';

import './style.css';

import config from './config';
import utils from './utils';
import API from '../../utils/API';
import SpotifyAPI from '../../utils/SpotifyAPI';
import spotifyHelpers from '../../utils/spotifyHelpers';
import globalUtils from '../../utils/globalUtils';

const Home = () => {
  const [user, setUser] = useState(null);
  // const [playlists, setPlaylists] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [spotifyAlert, setSpotifyAlert] = useState(false);
  const [playlistAlert, setPlaylistAlert] = useState(false);
  const [joinAlert, setJoinAlert] = useState(false);
  const [spinnerDisplay, setSpinnerDisplay] = useState(false);
  const [slides, setSlides] = useState(null);
  const [centerAlert, setCenterAlert] = useState(config.centerAlert.clear);
  const parsedURL = queryString.parse(window.location.search);
  const token = parsedURL.access_token;

  const handleUser = async () => {
    const currentUser = await spotifyHelpers.user(token);
    if (currentUser) setUser(currentUser);
  };

  const handlePlaylists = async token => {
    const playlists = await utils.getPlaylists(token);

    if (playlists[0]) {
      // setPlaylists(playlists);
      setSlides(globalUtils.configureSlides(playlists, 8));
    }
  };

  const verifyTrackPlaying = async token => {
    const isCurrentlyPlaying = await utils.verifySpotifyActive(token);

    !isCurrentlyPlaying ? setSpotifyAlert(true) : setSpotifyAlert(false);
  };

  const handlePlaylistClick = e => {
    setPlaylistAlert(true);
    setSelectedPlaylist(e.target.id);
  };

  // Creates room containing user's playlist
  const createPlaylistRoom = async () => {
    try {
      const roomHex = hexGen(16);
      const { data } = await SpotifyAPI.getPlaylistTracks(token, selectedPlaylist);

      await API.createRoom(roomHex);

      for await (const trackObj of data.items) {
        let trackInfo = `${trackObj.track.name} - ${trackObj.track.artists[0].name}`;

        await API.addTrack(roomHex, trackObj.track.id, trackInfo);
        await SpotifyAPI.addTrackToQueue(token, trackObj.track.id);
      }

      return roomHex;
    } catch (err) {
      console.log('Error:', err);
    }
  };

  const playlistRoomHandler = async () => {
    setPlaylistAlert(false);
    renderCenterAlert(config.centerAlert.playlistRoom);
    // Returns roomHex after room is created
    await createPlaylistRoom().then(roomHex => {
      renderCenterAlert(config.centerAlert.clear);
      globalConfigs.addRoomToURL(window.location.href, token, roomHex);
    });
  };

  const renderCenterAlert = errorObj => {
    setCenterAlert(errorObj);

    if (errorObj.disappear) {
      setTimeout(() => setCenterAlert(config.centerAlert.clear), 3000);
    }
  };

  useEffect(() => {
    if (token && !user) {
      if (spinnerDisplay) setSpinnerDisplay(false);

      // if (parsedURL.error === 'join_room') {
      // 	renderCenterAlert(config.centerAlert.urlErr);
      // }
      handleUser(token);
      handlePlaylists(token);
      verifyTrackPlaying(token);
    }
  });

  return user && token ? (
    <div>
      <Container>
        <Row className='top-banner'>
          {/* Profile Image */}
          <Col xs={12} sm={12} md={3} lg={2} className='text-center'>
            <Image roundedCircle src={user.image} className='home profile-pic' />
            <p className='user-name'>{user.name}</p>
          </Col>

          {/* Welcome to Playlistr Banner */}
          <Col
            xs={12}
            sm={12}
            md={6}
            lg={7}
            className='d-flex justify-content-center align-items-center'
          >
            <h1 className='home-banner'>
              Welcome to <span className='welcome-brand'>Playlistr</span>
            </h1>
          </Col>

          {/* Inactive Spotify Alert */}
          <Col xs={12} md={3} lg={3}>
            <div className='d-flex align-items-center'>
              <Alert variant='dark' show={spotifyAlert}>
                <p>To queue up songs when joining a Room, open Spotify & play a track</p>
                <button className='alert-button' onClick={() => verifyTrackPlaying(token)}>
                  Ready
                </button>
              </Alert>
            </div>
          </Col>
        </Row>
        <Row>
          {/* Create Room with Playlist Alert */}
          <Col>
            <div className='playlist-alert d-flex align-items-center'>
              <Alert
                variant='dark'
                show={playlistAlert}
                onClose={() => setPlaylistAlert(false)}
                dismissible
              >
                <p>Are you sure you want to start a room with this playlist?</p>

                <button onClick={() => playlistRoomHandler()}>
                  <span>Create Room</span>
                </button>
              </Alert>
            </div>

            {/* Center Alert */}
            <div className='playlist-alert d-flex align-items-center text-center'>
              <Alert variant='dark' show={centerAlert.show} className='shadow-lg'>
                <h4>{centerAlert.title}</h4>
                {centerAlert.text ? <h5>{centerAlert.text}</h5> : null}

                {centerAlert.spinner ? (
                  <Spinner
                    className='text-center'
                    as='span'
                    animation='border'
                    size='lg'
                    role='status'
                    aria-hidden='true'
                  />
                ) : null}
              </Alert>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Playlist Carousel */}
      <Container>
        <Row>
          <Carousel className='mb-2 home-carousel' controls interval={5000} indicators={false}>
            {slides
              ? slides.map(slide => (
                  <Carousel.Item key={slides.indexOf(slide)}>
                    <Container>
                      <Row>
                        {slide.map(playlist => (
                          <Playlist
                            key={`playlist-${playlist.id}`}
                            playlistId={playlist.id}
                            image={playlist.images[0].url}
                            name={playlist.name}
                            handlePlaylistClick={handlePlaylistClick}
                          />
                        ))}
                      </Row>
                    </Container>
                  </Carousel.Item>
                ))
              : null}
          </Carousel>
        </Row>
      </Container>

      {/* Room Buttons */}
      <Container>
        <RoomButtons
          token={token}
          // setUrl={this.setUrl}
          // setJoinRoomAlert={setJoinAlert}
          renderCenterAlert={renderCenterAlert}
          centerAlertConfig={config.centerAlert}
          // setState={this.setState}
        />
      </Container>
    </div>
  ) : null;
};

export default Home;
