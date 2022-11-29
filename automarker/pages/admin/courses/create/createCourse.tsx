import { useState, useEffect } from "react";
import Router from "next/router";
import { useUser } from "../../../../lib/hooks";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";;

const CreateCourse = () => {
    const user = useUser({ redirectTo: "/", redirectFound: true });

    const [errorMessage, setErrorMessage] = useState("");
    const [professors, setProfessors] = useState(null);

    useEffect(() => {
        if (user) {
            //get the list of all professors
            fetch("../../../api/admin/professors/getAllProfessors", {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            })
                .then((res) => res.json())
                .then((profs) => {
                    let menu = [];
                    if (profs) {
                        for (let i = 0; i < profs.professors.length; i++) {
                            menu.push(<option value={profs.professors[i].id}>{profs.professors[i].name} {profs.professors[i].lastName}</option>);
                        }
                    }
                    setProfessors(menu);
                });

        }
    }, [user]);

    async function handleSubmit(e) {
        e.preventDefault();

        if (errorMessage) {
            setErrorMessage(errorMessage);
        }

        //da mettere che lo userid deve essere preso dal sito
        const body = {
            name: e.currentTarget.name.value,
            userId: e.currentTarget.userId.value,
            academicYear: e.currentTarget.academicYear.value,
        };

        try {
            const res = await fetch("/api/admin/courses/createCourse", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(body),
            });

            if (res.status === 200) {
                toast.success("Course create successfully", {
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
            console.error("An unexpected error happened occurred while creating a course:", error);
            setErrorMessage(error.message);
        }
    }

    return (
        <Container className="p-5 " style={{ color: "white" }}>

            <Row className="justify-content-center">
                <h1>Create Course</h1>
                <hr />
                <Col className="p-5">

                    <Card className="shadow-lg bg-dark text-white" style={{ borderRadius: "1rem" }}>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>

                                <Form.Label>Name</Form.Label>
                                <Form.Control className="mb-3" id="name" name="name" type="text" placeholder="Enter course name" required />

                                <Form.Label>Professor</Form.Label>
                                <Form.Select className="mb-3" id="userId" required>
                                    {professors && professors}
                                </Form.Select>

                                <Form.Label>Academic year</Form.Label>
                                <Form.Control className="mb-3" id="academicYear" name="academicYear" type="text" placeholder="Enter academic year" required />

                                <div className="mb-3"></div>

                                <div className="d-flex mb-3 justify-content-center">

                                    <Button variant="primary" type="submit">
                                        Create course
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

export default CreateCourse;
