import React, { Component } from 'react';

import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';

import './style.css';

import { socket } from '../../utils/Socket';
import SpotifyAPI from '../../utils/SpotifyAPI';
import API from '../../utils/API';

class TrackSearch extends Component {
	constructor(props) {
		super(props);

		this.state = {
			trackInput: '',
			filteredTracks: [],
			selectedTrack: '',
			trackListDisplay: 'd-none',
			searchBtnIcon: 'fa fa-search'
		};
	}

	// Takes in a track name and sets state of filteredTracks array
	querySpotifyTracks = (token, track) => {
		SpotifyAPI.trackSearch(token, track)
			.then(res => this.setState({ filteredTracks: res.data.tracks.items }))
			.catch(err => console.log(err));
	};

	emitNewTrackToRoom = (roomId, trackId) => {
		socket.emit('add track', { trackId, roomId });
	};

	handleOnChange = e => {
		this.setState({ trackInput: e.target.value });

		// Resets icon image if there is input to be searched
		if (this.state.trackInput) this.setState({ searchBtnIcon: 'fa fa-search' });
	};

	handleSubmitBtnClick = e => {
		e.preventDefault();

		// Conditionally handle submit button click if there is input to search. Else statement gives ability to collapse the dropdown.
		if (this.state.trackInput) {
			this.querySpotifyTracks(this.props.token, this.state.trackInput);
			this.setState({ trackInput: '', trackListDisplay: '', searchBtnIcon: 'fa fa-chevron-up' });
		} else {
			this.setState({ trackListDisplay: 'd-none', searchBtnIcon: 'fa fa-search' });
		}
	};

	handleTrackSelection = e => {
		API.addTrack(this.props.roomId, e.target.id, e.target.innerText).catch(err => console.log(err));

		this.emitNewTrackToRoom(this.props.roomId, e.target.id);

		this.props.getRoomTracks(this.props.roomId);

		this.props.addTrackToPlaybackQueue(this.props.token, e.target.id);

		this.props.getCurrentlyPlaying(this.props.token);

		// Reset state of track input and hide the trackListDisplay
		this.setState({ trackInput: '', trackListDisplay: 'd-none', searchBtnIcon: 'fa fa-search' });
	};

	render() {
		return (
			<div>
				<Form>
					<InputGroup>
						<button
							className="rounded-right track-search-btn"
							onClick={this.handleSubmitBtnClick}>
							<i className={this.state.searchBtnIcon} aria-hidden="true"></i>
						</button>

						<FormControl
							className="rounded-right track-input"
							onKeyDown={this.handleOnKeyPress}
							onChange={this.handleOnChange}
							value={this.state.trackInput}
							placeholder="Add a Track"
							aria-describedby="basic-addon1"
						/>
					</InputGroup>
				</Form>

				<div className={this.state.trackListDisplay}>
					<ListGroup className="track-dropdown" variant="flush">
						{this.state.filteredTracks.map(track => (
							<ListGroup.Item
								className="track-dropdown-item"
								key={track.id}
								id={track.id}
								onClick={this.handleTrackSelection}>
								{`${track.name} - ${track.artists[0].name}`}
							</ListGroup.Item>
						))}
					</ListGroup>
				</div>
			</div>
		);
	}
}

export default TrackSearch;
