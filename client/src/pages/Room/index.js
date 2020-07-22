import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

const Room = () => {
	return (
		<div>
			<Container>
				<Row>
					<Col xs={5} md={6}>
						<h1>Current Room: 123456789 </h1>
					</Col>
					<Col xs={4} md={4}>
						<Button>Add</Button>
						<input placeholder="Add a Track" />
					</Col>
					<Col xs={3} md={2}>
						<Link to="/">
							<Button className="float-right">Home</Button>
						</Link>
					</Col>
				</Row>
				<Row>
					<Col xs={8} md={6}>
						<div
							style={{
								height: '100%',
								border: '1px solid black'
							}}>
							Artwork of Track Currently Playing
						</div>
					</Col>
					<Col xs={4} md={6}>
						<div
							style={{
								height: '100%',
								border: '1px solid black'
							}}>
							<h1>Play Queue</h1>
							<ol>
								<li>Track</li>
								<li>Track</li>
								<li>Track</li>
								<li>Track</li>
								<li>Track</li>
								<li>Track</li>
								<li>Track</li>
								<li>Track</li>
							</ol>
						</div>
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={6} md={6}>
						<div>
							<h1>Now Playing</h1>
							<div
								style={{
									height: '200px',
									border: '1px solid black'
								}}>
								Music Player
							</div>
						</div>
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
};

export default Room;
