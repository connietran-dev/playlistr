import React, { Component } from 'react';

function Login() {
    return (
        <div>
            <h1>Welcome to Playlistr</h1>
            <h3>To continue, log in to Spotify</h3>
            <button onClick={() => {
                window.location = window.location.href.includes('localhost')
                    ? 'http://localhost:8888/spotify/login'
                    : 'https://playlistr-io.herokuapp.com/spotify/login'
            }}>
                Login With Spotify
                </button>
        </div>
    )
}

export default Login;