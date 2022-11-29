import React from 'react';
import { Container } from 'react-bootstrap';
import { useUser } from '../../lib/hooks';

const Profile = () => {
    const user = useUser({ redirectTo: "/login" });

    return (
        <Container className="p-5" style={{ color: "white" }}>
            <h1>Page Under Construction</h1>
        </Container>
    );

}

export default Profile
