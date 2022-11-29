import { useUser } from "../lib/hooks";
import React, { useEffect } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import styles from "../styles/Home.module.css";
import Router from 'next/router'


const Home = () => {
    const user = useUser();

    useEffect(() => {
        if (user) {
            if (user.role === "USER") {
                Router.push("/user/profile");
            } else if (user.role === "PROF") {
                Router.push("/prof/profile");
            } else if (user.role === "ADMIN") {
                Router.push("/admin/profile");
            }
        }

    }, [user]);


    return (
        <>
            <Container className="p-5">
                <div className="d-flex mb-3 justify-content-center">
                    <img src="/people2.png" width="400" height="283" />
                </div>
                <Card className="shadow-lg bg-dark text-white my-5 mx-auto" style={{ opacity: 0.8 }}>
                    <Card.Body>
                        <Card.Title className="d-flex mb-3 justify-content-center"><h2>Welcome to <img src="/automarker_logo_white.png" height={45} /></h2></Card.Title>
                        <hr />
                        <Card.Text>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                Interdum varius sit amet mattis. Vitae et leo duis ut diam quam nulla porttitor. Fermentum iaculis eu non diam phasellus vestibulum.
                                Fermentum posuere urna nec tincidunt praesent semper feugiat. Nec dui nunc mattis enim ut tellus. Amet cursus sit amet dictum.</p>
                        </Card.Text>
                    </Card.Body>
                </Card>

                <Row>
                    <Col>

                        <Card className="shadow-lg bg-dark text-white my-5 mx-auto" style={{ opacity: 0.9 }}>
                            <Card.Body>
                                <Card.Title>
                                    <div className="d-flex mb-3 justify-content-center">
                                        <h2>Sign Up</h2>
                                    </div>
                                </Card.Title>
                                <Card.Text>
                                    <div className="d-flex mb-3 justify-content-center">
                                        <a href="/signup">
                                            <Button className={styles.btnhover1}>Sign Up</Button>
                                        </a>
                                    </div>
                                </Card.Text>
                            </Card.Body>
                        </Card>


                    </Col>


                    <Col>

                        <Card className="shadow-lg bg-dark text-white my-5 mx-auto" style={{ opacity: 0.9 }}>
                            <Card.Body>
                                <Card.Title>
                                    <div className="d-flex mb-3 justify-content-center">
                                        <h2>Log In</h2>
                                    </div>
                                </Card.Title>
                                <Card.Text>
                                    <div className="d-flex mb-3 justify-content-center">
                                        <a href="/login">
                                            <Button className={styles.btnhover2}>Log In</Button>
                                        </a>
                                    </div>
                                </Card.Text>
                            </Card.Body>
                        </Card>

                    </Col>
                </Row>


            </Container>

            <footer className="mt-auto text-center text-white">

                <p>Made with ❤️ by AutoMarker Team</p>


            </footer>
        </>


    )
}

export default Home
