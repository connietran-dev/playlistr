import React from 'react';

import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

const RoomUser = (props) => {
    return (
        <Col md={4} xs={4} className="text-center">
            <Image roundedCircle src={props.user.images[0].url} className="profile-pic" />
            <p>{props.user.display_name}</p>
        </Col>
    );
};

export default RoomUser;
