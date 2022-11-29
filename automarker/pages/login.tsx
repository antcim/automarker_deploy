import { useEffect, useState } from "react";
import React from "react";

import { useUser } from "../lib/hooks";

import { Row, Button, Form, Col, Card, Container } from "react-bootstrap";;
import { toast } from "react-toastify";
import Link from "next/link";

import Image from 'next/image'
import styles from '../styles/Login.module.css'
import Router from "next/router";



const Login = () => {
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

    const [errorMsg, setErrorMsg] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        if (errorMsg) setErrorMsg("");

        const body = {
            username: e.currentTarget.username.value,
            password: e.currentTarget.password.value,
        };

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });



            if (res.status === 200) {
                const resJson = await res.json();

                toast.success("Welcome!", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });



                if (resJson.role === "USER") {
                    Router.push("/user/profile");
                } else if (resJson.role === "ADMIN") {
                    Router.push("/admin/profile");
                } else if (resJson.role === "PROF") {
                    Router.push("/prof/profile");
                }


            } else {
                toast.error("Wrong credential", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                throw new Error(await res.text());
            }
        } catch (error) {
            console.error("An unexpected error happened occurred:", error);
            setErrorMsg(error.message);
        }
    }

    return (
        <>
            <Container fluid>

                <Row className="justify-content-center">
                    <Col col="10" md="6">
                        <span className="pc-filter"><img src="image.png" className="img-fluid" alt="Sample image" /></span>
                    </Col>
                    <Col className="p-5" col="4" md="auto">
                        <Card className="shadow-lg bg-dark text-white my-5 mx-auto" style={{ borderRadius: "1rem", opacity: 0.9 }}>
                            <Card.Body>
                                <div className={styles.calogo}>
                                    <h3><img src="/automarker_logo_white.png" height={40} /></h3>
                                    <Image
                                        src="/cafoscari_logo.svg"
                                        alt="Ca'Foscari Logo"
                                        width={180}
                                        height={180} />
                                </div>
                                <Form onSubmit={handleSubmit}>

                                    <Form.Label>Email</Form.Label>
                                    <Form.Control className="mb-3" id="username" name="username" type="email" placeholder="Enter email" required />

                                    <Form.Label style={{ color: "white" }}>Password</Form.Label>
                                    <Form.Control id="password" name="password" type="password" placeholder="Password" required />
                                    <Form.Text>
                                        We'll never share your password with anyone else.
                                    </Form.Text>
                                    <div className="mb-3"></div>

                                    <div className="mb-3">
                                        <Link href="/signup">
                                            <a className="red-link">I don't have an account</a>
                                        </Link>
                                    </div>

                                    <div className="d-grid gap-2 d-md-flex justify-content-center">
                                        <Button variant="danger" type="submit">
                                            Login
                                        </Button>
                                    </div>

                                    {errorMsg && <p className="error" style={{ color: "#FF4500" }}>{errorMsg}</p>}

                                </Form>
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

export default Login;
