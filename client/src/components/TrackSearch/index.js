import React, { useState } from 'react';

import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';

import './style.css';

// import { socket } from '../../utils/Socket';
import SpotifyAPI from '../../utils/SpotifyAPI';
import API from '../../utils/API';

const TrackSearch = props => {
	const [input, setInput] = useState('');
	const [tracks, setTracks] = useState([]);
	const [display, setDisplay] = useState(false);
	const [searchIcon, setSearchIcon] = useState(true);

	const handleTrackSelection = async track => {
		await API.addTrack(
			props.roomId,
			track.id,
			`${track.name} - ${track.artist}`
		);
		await SpotifyAPI.addTrackToQueue(props.token, track.id);
		props.setQueueTrigger(props.queueTrigger ? false : true);
		searchBtnHandler.close();
	};

	const searchBtnHandler = {
		search: async e => {
			e.preventDefault();

			try {
				if (input) {
					const { data } = await SpotifyAPI.trackSearch(props.token, input);
					const tracksArr = [...data.tracks.items].map(track => {
						return {
							artist: track.artists[0].name,
							id: track.id,
							name: track.name
						};
					});

					setTracks(tracksArr);
					setInput('');
					setDisplay(true);
					setSearchIcon(false);
				}
			} catch (err) {
				console.log(err);
			}
		},
		close: e => {
			if (e) e.preventDefault();
			setDisplay(false);
			setTracks([]);
			setSearchIcon(true);
		}
	};

	return (
		<div>
			<Form>
				<InputGroup>
					<button
						className="rounded-right track-search-btn"
						onClick={e =>
							searchIcon || input
								? searchBtnHandler.search(e)
								: searchBtnHandler.close(e)
						}>
						{searchIcon || input ? (
							<i className="fa fa-search" aria-hidden="true"></i>
						) : (
							<i className="fa fa-chevron-down" aria-hidden="true"></i>
						)}
					</button>

					<FormControl
						className="rounded-right track-input"
						onChange={e => setInput(e.target.value)}
						value={input}
						placeholder="Add a Track"
						aria-describedby="basic-addon1"
					/>
				</InputGroup>
			</Form>
			{display ? (
				<div>
					<ListGroup className="track-dropdown" variant="flush">
						{tracks[0]
							? tracks.map(track => (
									<ListGroup.Item
										className="track-dropdown-item"
										key={track.id}
										id={track.id}
										onClick={() => handleTrackSelection(track)}>
										{`${track.name} - ${track.artist}`}
									</ListGroup.Item>
							  ))
							: null}
					</ListGroup>
				</div>
			) : null}
		</div>
	);
};
// class TrackSearch extends Component {
// 	constructor(props) {
// 		super(props);

// 		this.state = {
// 			trackInput: '',
// 			filteredTracks: [],
// 			selectedTrack: '',
// 			trackListDisplay: 'd-none',
// 			searchBtnIcon: 'fa fa-search'
// 		};
// 	}

// 	// Takes in a track name and sets state of filteredTracks array
// 	querySpotifyTracks = (token, track) => {
// 		SpotifyAPI.trackSearch(token, track)
// 			.then(res => this.setState({ filteredTracks: res.data.tracks.items }))
// 			.catch(err => console.log(err));
// 	};

// 	emitNewTrackToRoom = (roomId, trackId, user) => {
// 		socket.emit('add track', { trackId, roomId, user });
// 	};

// 	handleOnChange = e => {
// 		this.setState({ trackInput: e.target.value });

// 		// Resets icon image if there is input to be searched
// 		if (this.state.trackInput) this.setState({ searchBtnIcon: 'fa fa-search' });
// 	};

// 	handleSubmitBtnClick = e => {
// 		e.preventDefault();

// 		// Conditionally handle submit button click if there is input to search. Else statement gives ability to collapse the dropdown.
// 		if (this.state.trackInput) {
// 			this.querySpotifyTracks(this.props.token, this.state.trackInput);
// 			this.setState({ trackInput: '', trackListDisplay: '', searchBtnIcon: 'fa fa-chevron-up' });
// 		} else {
// 			this.setState({ trackListDisplay: 'd-none', searchBtnIcon: 'fa fa-search' });
// 		}
// 	};

// 	handleTrackSelection = async e => {
// 		try {
// 			await e.persist(); // Removes synthetic event from the pool and allows references to the event
// 			await API.addTrack(this.props.roomId, e.target.id, e.target.innerText);
// 			await this.props.setRoomTracks(this.props.roomId);
// 			await this.emitNewTrackToRoom(this.props.roomId, e.target.id, this.props.user);
// 			await this.props.addTrackToPlaybackQueue(this.props.token, e.target.id);
// 			await this.props.getCurrentlyPlaying(this.props.token);
// 		} catch (err) {
// 			console.log(err);
// 		}

// 		// Reset trackInput, hides trackListDisplay
// 		this.setState({
// 			trackInput: '',
// 			trackListDisplay: 'd-none',
// 			searchBtnIcon: 'fa fa-search'
// 		});
// 	};

// 	render() {
// 		return (
// 			<div>
// 				<Form>
// 					<InputGroup>
// 						<button
// 							className="rounded-right track-search-btn"
// 							onClick={this.handleSubmitBtnClick}>
// 							<i className={this.state.searchBtnIcon} aria-hidden="true"></i>
// 						</button>

// 						<FormControl
// 							className="rounded-right track-input"
// 							onKeyDown={this.handleOnKeyPress}
// 							onChange={this.handleOnChange}
// 							value={this.state.trackInput}
// 							placeholder="Add a Track"
// 							aria-describedby="basic-addon1"
// 						/>
// 					</InputGroup>
// 				</Form>

// 				<div className={this.state.trackListDisplay}>
// 					<ListGroup className="track-dropdown" variant="flush">
// 						{this.state.filteredTracks.map(track => (
// 							<ListGroup.Item
// 								className="track-dropdown-item"
// 								key={track.id}
// 								id={track.id}
// 								onClick={this.handleTrackSelection}>
// 								{`${track.name} - ${track.artists[0].name}`}
// 							</ListGroup.Item>
// 						))}
// 					</ListGroup>
// 				</div>
// 			</div>
// 		);
// 	}
// }

export default TrackSearch;
