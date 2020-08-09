import React from 'react';

import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

const RoomUser = (props) => {
    return (
        <Col xs={4} className="text-center">
            <div className="room-avatar">
                <a href={props.user.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                    <Image roundedCircle src={props.user.images[0].url} className="profile-pic" />
                </a>
                <p>{props.user.display_name}</p>
            </div>
        </Col>
    );
};

export default RoomUser;
