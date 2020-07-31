import React, { Component } from 'react';
import queryString from 'query-string';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TrackSearch from '../../components/TrackSearch';
import Queue from '../../components/Queue';
import Player from '../../components/Player';
import NowPlayingImg from '../../components/NowPlayingImg';
import ListGroup from 'react-bootstrap/esm/ListGroup';

import apiUrl from '../../apiConfig';

import socketIOClient from 'socket.io-client';

const ENDPOINT = apiUrl;
console.log('ENDPOINT: ', apiUrl);

class Room extends Component {
	constructor() {
		super();

		let parsedUrl = queryString.parse(window.location.search);
		let token = parsedUrl.access_token;
		let roomId = parsedUrl.room_id;

		this.state = {
			user: {},
			addedTracks: [],
			accessToken: token,
			roomId: roomId,
			item: {
				album: {
					images: [{ url: '' }]
				},
				name: '',
				artists: [{ name: '' }],
				duration_ms: 0
			},
			playbackQueueStatus: 'Paused',
			progress: 0,
			socketData: ''
		};
	}

	// When component mounts, user state will be set to response from API call. Then the playlist will be created.
	componentDidMount() {

		// Establish connection to socket
		this.connectToSocket();

		fetch('https://api.spotify.com/v1/me', {
			headers: {
				Authorization: 'Bearer ' + this.state.accessToken
			}
		})
			.then(res => res.json())
			.then(data => {
				this.setState({ user: data });
			});

		this.getCurrentlyPlaying(this.state.accessToken);
	}

	connectToSocket = () => {
		let socket = socketIOClient(ENDPOINT);
		socket.on('FromAPI', data => {
			this.setState({ socketData: data });
		});
		// Close connection when component unmounts
		return () => socket.disconnect();
	}

	addTrackToDisplayQueue = (roomId, trackId, trackInfo) => {
		let updatedTrackList = this.state.addedTracks;

		console.log(this.state.item.id);

		updatedTrackList.push({
			room: roomId,
			id: trackId,
			info: trackInfo
		});

		this.setState({ addedTracks: updatedTrackList }, () => {
			console.log('Added Tracks State:');
			console.log(this.state.addedTracks);
		});
	};

	// GETs track that is currently playing on the users playback queue (Spotify), sets the state with the returned data, and then updates the Play Queue to highlight the track currently playing on the queue
	getCurrentlyPlaying = token => {
		fetch('https://api.spotify.com/v1/me/player', {
			headers: {
				Authorization: 'Bearer ' + token
			}
		})
			.then(res => res.json())
			.then(data => {
				this.setState({
					item: data.item,
					playbackQueueStatus: data.is_playing,
					progress: data.progress_ms
				});
			})
			.then(() => this.handleQueueRender())
			.catch(err => console.log(err));
	};

	// Using the state of addedTracks to conditionally render the Play Queue.
	handleQueueRender = () => {
		let addedTracks = this.state.addedTracks;

		if (!addedTracks.length) {
			return <p>Add a track to get started...</p>;
		} else {
			return addedTracks.map(track => (
				<ListGroup.Item
					key={track.id}
					variant={this.setVariant(track.id, this.state.item.id, 'warning', 'dark')}>
					{track.info}
				</ListGroup.Item>
			));
		}
	};

	// Helper method that compares two id's and sets a variant based on result
	setVariant = (id, comparedId, variantA, variantB) => {
		if (id === comparedId) return variantA;
		return variantB;
	};

	render() {
		return (
			<div>
				<Container className="py-3">
					<Row>
						<Col xs={12} md={6}>
							<h1>Current Room: {this.state.roomId} </h1>
							<p>
								It's <time dateTime={this.state.socketData}>{this.state.socketData}</time>
							</p>
						</Col>
						<Col xs={12} md={6}>
							<TrackSearch
								token={this.state.accessToken}
								roomId={this.state.roomId}
								addTrackToDisplayQueue={this.addTrackToDisplayQueue}
								getCurrentlyPlaying={this.getCurrentlyPlaying}
								currentlyPlayingTrack={this.state.item}
							/>
						</Col>
					</Row>
				</Container>
				<Container>
					<Row>
						<Col xs={8} md={6}>
							<NowPlayingImg item={this.state.item} />
						</Col>
						<Col xs={4} md={6}>
							<Queue handleQueueRender={this.handleQueueRender} />
						</Col>
					</Row>
				</Container>
				<Container>
					<Row>
						<Col xs={12} sm={6} md={6}>
							<Player
								token={this.state.accessToken}
								item={this.state.item}
								isPlaying={this.state.isPlaying}
								progress={this.state.progress}
								getCurrentlyPlaying={this.getCurrentlyPlaying}
							/>
						</Col>
						<Col xs={12} sm={6} md={6}>
							<Row className="pt-5">
								<Col md={4} xs={4}>
									<div
										style={{
											height: '100px',
											border: '1px solid black'
										}}>
										Avatar
									</div>
									<h2>{this.state.user.display_name}</h2>
								</Col>
								<Col md={4} xs={4}>
									<div
										style={{
											height: '100px',
											border: '1px solid black'
										}}>
										Avatar
									</div>
									<h2>USER</h2>
								</Col>
								<Col md={4} xs={4}>
									<div
										style={{
											height: '100px',
											border: '1px solid black'
										}}>
										Avatar
									</div>
									<h2>USER</h2>
								</Col>
							</Row>
						</Col>
					</Row>
				</Container>
			</div>
		);
	}
}

export default Room;
