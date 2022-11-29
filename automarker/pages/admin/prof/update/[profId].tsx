import { useState, useEffect } from 'react';
import Router from 'next/router';
import { useUser } from "../../../../lib/hooks";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const ModifyProfessor = () => {
    useUser({ redirectTo: "/", redirectFound: true });

    const [errorMessage, setErrorMessage] = useState("");
    const [professor, setProfessor] = useState(null);
    const [changeName, setChangeName] = useState("");
    const [changeLastName, setChangeLastName] = useState("");
    const [changeUsername, setChangeUsername] = useState("");
    //const [changePassword, setChangePassword] = useState("");

    const router = useRouter();
    const { profId } = router.query;

    const cambioNome = (e) => {
        setChangeName(e.target.value);
    }

    const cambioLastName = (e) => {
        setChangeLastName(e.target.value);
    }

    const cambioUsername = (e) => {
        setChangeUsername(e.target.value);
    }

    const body = {
        profId: profId,
    }

    useEffect(() => {
        if (profId) {
            fetch("../../../api/admin/professors/getSingleProfessor", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(body),
            })
                .then((res) => res.json())
                .then((c) => {
                    setProfessor(c);
                    setChangeName(c.name);
                    setChangeLastName(c.lastName);
                    setChangeUsername(c.username);
                });
        }
    }, [router.query]);

    async function handleSubmit(e) {
        e.preventDefault();


        const body = {
            profId: profId,
            name: e.currentTarget.name.value,
            lastName: e.currentTarget.lastName.value,
            username: e.currentTarget.username.value,
            password: e.currentTarget.password.value,
        }

        if (body.password !== e.currentTarget.repeatpassword.value) {
            setErrorMessage("The passwords don't match");
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
            const res = await fetch("../../../api/admin/professors/updateProfessor", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(body)
            });

            if (res.status === 200) {
                setProfessor(res);
                toast.success("Professor updated successfully", {
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
            console.log("An unexpected error occurred: " + error);
            setErrorMessage(error.message);
        }

    }

    return (
        <Container className="p-5" style={{ color: "white" }}>
            <Row className="justify-content-center">
                <Col className="p-5">
                    <Card className="shadow-lg bg-dark text-white my-5 mx-auto" style={{ borderRadius: "1rem" }}>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>

                                <Form.Label>Name</Form.Label>
                                <Form.Control className="mb-3" value={changeName} onChange={cambioNome} id="name" name="name" type="text" required />

                                <Form.Label>Last name</Form.Label>
                                <Form.Control className="mb-3" id="lastName" value={changeLastName} onChange={cambioLastName} name="lastName" type="text" required />

                                <Form.Label>Username</Form.Label>
                                <Form.Control className="mb-3" value={changeUsername} onChange={cambioUsername} id="username" name="username" type="text" required />

                                <Form.Label>Password</Form.Label>
                                <Form.Control className="mb-3" id="password" name="password" type="password" placeholder="Password" required />

                                <Form.Label className="mb-3" style={{ color: "white" }}>Repeat password</Form.Label>
                                <Form.Control id="repeatpassword" name="repeatpassword" type="password" placeholder="Password" required />

                                <div className="mb-3"></div>

                                <div className="d-flex mb-3 justify-content-center">

                                    <Button variant="primary" type="submit">
                                        Update professor
                                    </Button>

                                </div>

                                {errorMessage && <p className="error" style={{ color: "red" }}>{errorMessage}</p>}

                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default ModifyProfessor;