import React from 'react';

import Carousel from 'react-bootstrap/Carousel';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

import Playlist from '../../components/Playlist';

const CarouselSlide = props => {
    return (
        <Carousel.Item>
            <Container>
                <Row>
                    <Col>
                        {/* {console.log('!!!!', props.playlists)} */}
                        {/* {props.playlists.map(playlist => (
                            <Playlist
                                key={playlist.id}
                                image={playlist.images[0].url}
                                link={playlist.owner.external_urls.spotify}
                                name={playlist.name}
                            />
                        ))} */}
                    </Col>
                </Row>
            </Container>
        </Carousel.Item>
    )
};

export default CarouselSlide;
