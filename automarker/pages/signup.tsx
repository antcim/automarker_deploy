import { useState } from "react"
import Router from "next/router"
import { useUser } from "../lib/hooks"
import { Button, Card, Col, Form, Row } from "react-bootstrap"
import { toast } from "react-toastify";



const Signup = () => {
    useUser({ redirectTo: "/", redirectIfFound: true });

    const [errorMsg, setErrorMsg] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        if (errorMsg) setErrorMsg("");

        const body = {
            username: e.currentTarget.username.value,
            name: e.currentTarget.name.value,
            lastName: e.currentTarget.lastName.value,
            password: e.currentTarget.password.value,
        };

        if (body.password !== e.currentTarget.repeatpassword.value) {
            setErrorMsg("The passwords don't match");
            toast.error("The passwords don't match", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            return;
        }

        try {
            const res = await fetch("/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (res.status === 200) {
                toast.success("Successful registration", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                Router.push("/login");
            } else {
                throw new Error(await res.text());
            }
        } catch (error) {
            console.error("An unexpected error happened occurred:", error);
            setErrorMsg(error.message);
        }
    }

    return (
        <>
            <Row className="justify-content-center">
                <Col className="p-5" col="4" md="auto">
                    <Card className="shadow-lg bg-dark text-white my-5 mx-auto" style={{ borderRadius: "1rem", opacity: 0.9 }}>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>

                                <Form.Label>Email</Form.Label>
                                <Form.Control className="mb-3" id="username" name="username" type="email" placeholder="Enter email" required />

                                <Form.Label>Name</Form.Label>
                                <Form.Control className="mb-3" id="name" name="name" type="etxt" placeholder="Enter your name" required />

                                <Form.Label>Last name</Form.Label>
                                <Form.Control className="mb-3" id="lastName" name="lastName" type="text" placeholder="Enter your last name" required />

                                <Form.Label className="mb-3" style={{ color: "white" }}>Password</Form.Label>
                                <Form.Control className="mb-3" id="password" name="password" type="password" placeholder="Password" required />

                                <Form.Label className="mb-3" style={{ color: "white" }}>Repeat password</Form.Label>
                                <Form.Control id="repeatpassword" name="repeatpassword" type="password" placeholder="Password" required />
                                <Form.Text>
                                    We'll never share your password with anyone else.
                                </Form.Text>
                                <div className="mb-3"></div>

                                <div className="d-flex mb-3 justify-content-center">

                                    <Button variant="primary" type="submit">
                                        Sign Up
                                    </Button>

                                </div>

                                {errorMsg && <p className="error" style={{ color: "red" }}>{errorMsg}</p>}

                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <footer className="mt-auto text-center text-white">

                <p>Made with ❤️ by AutoMarker Team</p>


            </footer>
        </>




    )
}

export default Signup
