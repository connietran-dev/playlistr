import React, { useState, useEffect } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';

import SpotifyAPI from '../../utils/SpotifyAPI';
import API from '../../utils/API';
import roomUtils from '../../pages/Room/utils';
import './style.css';

const Player = props => {
  const [liked, setLiked] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(
    (props.track.progress / props.track.duration) * 100
  );

  const dbTrack = props.queueTracks?.[0]
    ? props.queueTracks.filter(track => track.spotifyId === props.track.id)[0]
    : null;

  const addToProgressBar = () => {
    if (props.trackPlaying) {
      let progress = props.track.progress;
      let duration = props.track.duration;
      const progressInterval = setInterval(() => {
        progress += 1000;
        const updatedProgress = (progress / duration) * 100;

        if (updatedProgress >= 99) {
          API.updateTrack(props.roomId, props.track.id, 'played', props.user.id);
          clearInterval(progressInterval);
        }
        setCurrentProgress(updatedProgress);
      }, 1000);
    }
  };

  const handlers = {
    next: async () => {
      try {
        await SpotifyAPI.nextPlaybackTrack(props.token);
        if (props.queueTracks?.filter(track => track.spotifyId === props.track.id)[0]) {
          await API.updateTrack(props.roomId, props.track.id, 'played');
        }
        setTimeout(() => window.location.reload(), 2000);
      } catch (err) {
        console.log(err);
      }
    },
    like: async () => {
      try {
        const type = liked ? 'unlike' : 'like';
        setLiked(liked ? false : true);
        await API.updateTrack(props.roomId, props.track.id, type, props.user.id);
        props.setQueueTrigger(props.queueTrigger ? false : true);
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    setLiked(dbTrack && !dbTrack.likes.filter(item => item === props.user.id)[0] ? false : true);

    addToProgressBar();
  }, [props.track, props.trackPlaying]);

  return (
    <div className='now-playing-container'>
      <div className='pt-2 mb-4 text-center'>
        <div className='now-playing-name'>{props.track.name}</div>
        <div className='now-playing-artist'>{props.track.artists[0]}</div>
      </div>
      {props.trackPlaying ? (
        <>
          <ProgressBar
            animated
            now={currentProgress}
            variant='success'
            className='mx-auto mb-2'
            style={{ height: '10px', width: '70%' }}
          />
          <div className='text-center player-buttons'>
            {/* {dbTrack ? (
              <>
                <button
                  type='button'
                  className='btn'
                  onClick={() => {
                    handlers.like();
                  }}
                >
                  <i className={liked ? `fa fa-heart fa-2x` : `fa fa-heart-o fa-2x`}></i>
                  {dbTrack && dbTrack.likes[0] ? dbTrack.likes.length : null}
                </button>
                <button
                  type='button'
                  className='btn'
                  onClick={() => {
                    console.log('comment!');
                  }}
                >
                  <i className='fa fa-comment fa-2x'></i>
                </button>
              </>
            ) : null} */}

            <button
              type='button'
              className='btn'
              onClick={() => {
                handlers.next();
              }}
            >
              <i className='fa fa-forward fa-2x'></i>
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Player;
