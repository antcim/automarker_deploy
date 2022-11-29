import { useState } from "react";
import Router from "next/router";
import { useUser } from "../../../../lib/hooks";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";

const CreateProf = () => {
    useUser({ redirectTo: "/", redirectFound: true });

    const [errorMes, setErrorMes] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        if (errorMes) {
            setErrorMes(errorMes);
        }

        const body = {
            username: e.currentTarget.username.value,
            name: e.currentTarget.name.value,
            lastName: e.currentTarget.lastName.value,
            password: e.currentTarget.password.value,
        }

        if (body.password !== e.currentTarget.repeatpassword.value) {
            setErrorMes("The passwords don't match");
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
            const res = await fetch("/api/admin/professors/createProfessor", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(body)
            });

            if (res.status === 200) {
                toast.success("Successful creation of professor", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                Router.push("/admin/profile");
            }
            else {
                throw new Error(await res.text());
            }
        } catch (error) {
            console.error("An unexpected error happened occurred while creating a professor:", error);
            setErrorMes(error.message);
        }
    }

    return (
        <Container className="p-5 " style={{ color: "white" }}>
            <Row className="justify-content-center">
                <Col className="p-5">
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
                                <div className="mb-3"></div>

                                <div className="d-flex mb-3 justify-content-center">

                                    <Button variant="primary" type="submit">
                                        Create professor
                                    </Button>

                                </div>

                                {errorMes && <p className="error" style={{ color: "red" }}>{errorMes}</p>}

                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default CreateProf;