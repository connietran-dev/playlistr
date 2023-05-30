import React from 'react';
import { Link } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';

import style from './utils/style';
import './style.css';

function About() {
	return (
		<Container fluid style={style.background}>
			<Container className="about-card">
				<h1 className="about-brand text-white text-center">About Playlistr</h1>
				<Image
					roundedCircle
					className="brand-logo about-brand mx-auto d-block"
					src="./images/icons/playlistr-icon.png"
				/>
				<div className="about-text">
					<p>
						Playlistr was created by{' '}
						<a
							href="https://github.com/hermanjohn2"
							target="_blank"
							rel="noreferrer noopener"
							className="about-link">
							John Herman
						</a>{' '}
						and{' '}
						<a
							href="https://github.com/connietran-dev"
							target="_blank"
							rel="noreferrer noopener"
							className="about-link">
							Connie Tran
						</a>{' '}
						using React, socket.io, Node, Express, and MongoDB.
					</p>
					<p>
						John and Connie were driven by a love for music and an admiration
						for companies like Spotify. They were inspired to create a queue
						building app that uses Spotify so friends can share one queue, add
						songs to it, and have a chance to control the music together in
						real-time.
					</p>
					<p>
						John and Connie are full-stack developers from the Georgia Institute
						of Technology. You can check out the GitHub repo for Playlistr{' '}
						<a
							href="https://github.com/connietran-dev/gtech-capstone-playlistr"
							target="_blank"
							rel="noreferrer noopener"
							className="about-link">
							here
						</a>
						.
					</p>
				</div>
				<div className="text-center">
					<Link to="/" className="about-link">
						Back Home
					</Link>
					<p className="about copyright-text">
						Copyright © 2020 All Rights Reserved by{' '}
						<Link to="/" className="about-link">
							Playlistr
						</Link>
					</p>
				</div>
			</Container>
		</Container>
	);
}

export default About;
