import React from 'react';

import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';

const Playlist = (props) => {
    return (
        <Col xs={6} md={3}>
            <a href={props.link} target="_blank" rel="noopener noreferer" style={{ textDecoration: 'none', color: '#121111' }}>
                <Image rounded
                    src={props.image}
                    width={171}
                    height={180}
                    alt={props.name}
                />
                <p>{props.name}</p>
            </a>
        </Col>
    );
};

export default Playlist;
