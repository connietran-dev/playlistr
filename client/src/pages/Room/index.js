import React, { Component } from 'react';
import queryString from 'query-string';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import TrackSearch from '../../components/TrackSearch';
import Queue from '../../components/Queue';
import Player from '../../components/Player';
import NowPlayingImg from '../../components/NowPlayingImg';
import ListGroup from 'react-bootstrap/esm/ListGroup';

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
			is_playing: 'Paused',
			progress_ms: 0
		};
	}

	// When component mounts, user state will be set to response from API call. Then the playlist will be created.
	componentDidMount() {
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

	addTrackToDisplayQueue = (roomId, trackId, trackInfo) => {
		let updatedTrackList = this.state.addedTracks;

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

	getCurrentlyPlaying = token => {
		fetch('https://api.spotify.com/v1/me/player', {
			headers: {
				Authorization: 'Bearer ' + token
			}
		})
			.then(res => res.json())
			.then(data => {
				this.setState(
					{
						item: data.item,
						isPlaying: data.is_playing,
						progress: data.progress_ms
					},
					() => {
						console.log('Now Playing State:');
						console.log(this.state.item);
					}
				);
			});
	};

	// Using the state of addedTracks to conditionally render the Play Queue.
	handleQueueRender = () => {
		let addedTracks = this.state.addedTracks;

		if (!addedTracks.length) {
			return <p>Add a track to get started...</p>;
		} else {
			return addedTracks.map(track => (
				<ListGroup.Item key={track.id} variant="dark">
					{track.info}
				</ListGroup.Item>
			));
		}
	};

	render() {
		return (
			<div>
				<Container>
					<Row>
						<Col xs={5} md={6}>
							<h1>Current Room: {this.state.roomId} </h1>
						</Col>
						<Col xs={4} md={3}>
							<TrackSearch
								token={this.state.accessToken}
								roomId={this.state.roomId}
								addTrackToDisplayQueue={this.addTrackToDisplayQueue}
								// getPlaylistData={this.getPlaylistData}
							/>
						</Col>
						<Col xs={3} md={3}>
							<Link to="/">
								<Button className="float-right">Home</Button>
							</Link>
						</Col>
					</Row>
					<Row>
						<Col xs={8} md={6}>
							<NowPlayingImg item={this.state.item} />
						</Col>
						<Col xs={4} md={6}>
							<Queue handleQueueRender={this.handleQueueRender} />
						</Col>
					</Row>
					<Row>
						<Col xs={12} sm={6} md={6}>
							<Player
								token={this.state.accessToken}
								item={this.state.item}
								isPlaying={this.state.isPlaying}
								progress={this.state.progress}
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
