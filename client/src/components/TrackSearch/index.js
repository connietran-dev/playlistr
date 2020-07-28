import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import ListGroup from 'react-bootstrap/ListGroup';

class TrackSearch extends Component {
	constructor(props) {
		super(props);

		this.state = {
			trackInput: '',
			filteredTracks: [],
			trackListDisplay: '',
			selectedTrack: ''
		};
	}

	// Takes in a track name and sets state of filteredTracks array
	querySpotifyTracks = track => {
		fetch(`https://api.spotify.com/v1/search?q=${track}&type=track&limit=20`, {
			headers: {
				Authorization: 'Bearer ' + this.props.token
			}
		})
			.then(res => res.json())
			.then(data => this.setState({ filteredTracks: data.tracks.items }))
			.catch(err => console.log(err));
	};

	addTrackToPlaybackQueue = (token, trackId) => {
		fetch(`https://api.spotify.com/v1/me/player/queue?uri=spotify:track:${trackId}`, {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + token
			}
		}).catch(err => console.log(err));
	};

	handleOnChange = e => {
		this.setState({ trackInput: e.target.value });
	};

	handleOnSubmit = e => {
		e.preventDefault();

		if (this.state.trackInput) {
			this.querySpotifyTracks(this.state.trackInput);
			this.setState({ trackListDisplay: '' });
		}
	};

	handleTrackSelection = e => {
		// Takes in Room, Track Id and Track Info
		this.props.addTrackToDisplayQueue(this.props.roomId, e.target.id, e.target.innerText);

		this.addTrackToPlaybackQueue(this.props.token, e.target.id);

		// Reset state of track input and hide the trackListDisplay
		this.setState({ trackInput: '', trackListDisplay: 'd-none' });
	};

	render() {
		return (
			<div>
				<InputGroup className="mb-3">
					<InputGroup.Prepend>
						<Button onClick={this.handleOnSubmit}>
							<i className="fa fa-search" aria-hidden="true"></i>
						</Button>
					</InputGroup.Prepend>
					<FormControl
						onKeyDown={this.handleOnKeyPress}
						onChange={this.handleOnChange}
						value={this.state.trackInput}
						placeholder="Add a Track"
						aria-describedby="basic-addon1"
					/>
				</InputGroup>
				<div className={this.state.trackListDisplay}>
					<ListGroup
						variant="flush"
						className="text-dark"
						style={{ maxHeight: '100px', overflowY: 'scroll' }}>
						{this.state.filteredTracks.map(track => (
							<ListGroup.Item
								key={track.id}
								id={track.id}
								onClick={this.handleTrackSelection}
								style={{ cursor: 'pointer' }}>
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
