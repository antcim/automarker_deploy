import { useState, useEffect } from 'react';
import Router from 'next/router'
import { useUser } from '../../../../lib/hooks';
import { Container, Button, Card, Col, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { useRouter } from 'next/router';

const ModifyCourse = () => {
    useUser({ redirectTo: "/", redirectFound: true });

    const [errorMessage, setErrorMessage] = useState("");
    const [course, setCourse] = useState(null);
    const router = useRouter();
    const [changeName, setChangeName] = useState("");
    const [changeAcemicYear, setChangeAcademicYear] = useState("");

    const { courseId } = router.query;

    const cambioNome = (e) => {
        setChangeName(e.target.value)
    }

    const cambioAnno = (e) => {
        setChangeAcademicYear(e.target.value)
    }



    const body = {
        courseId: courseId,
    }

    useEffect(() => {
        if (courseId) {
            fetch("../../../api/admin/courses/getSingleCourse", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(body),
            })
                .then((res) => res.json())
                .then((c) => {
                    setCourse(c);
                    setChangeName(c.name);
                    setChangeAcademicYear(c.academicYear);
                });
        }
    }, [router.query]);

    async function handleSubmit(e) {
        e.preventDefault();

        if (!errorMessage) {
            setErrorMessage("");

            const body = {
                courseId: courseId,
                name: e.currentTarget.name.value,
                academicYear: e.currentTarget.academicYear.value
            };

            try {
                const res = await fetch("/api/admin/courses/modifyCourse", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });

                if (res.status === 200) {
                    setCourse(res);
                    toast.success("Course updated successfully", {
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
                console.log("An unexpected error happened occurred:", error);
                setErrorMessage(error.message);
            }
        }
    }

    return (
        <Container className="p-5" style={{ color: "white" }}>
            <Row className="justify-content-center">
                <Col className="p-5">
                    <Card className="shadow-lg bg-dark text-white my-5 mx-auto" style={{ borderRadius: "1rem", opacity: 0.9 }}>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>

                                <Form.Label>Name</Form.Label>
                                <Form.Control className="mb-3" value={changeName} onChange={cambioNome} id="name" name="name" type="text" required />

                                <Form.Label className="mb-3" >academic year</Form.Label>
                                <Form.Control id="academicyear" value={changeAcemicYear} onChange={cambioAnno} name="academicYear" type="text" required />

                                <div className="mb-3"></div>

                                <div className="d-flex mb-3 justify-content-center">

                                    <Button variant="primary" type="submit">
                                        Update course
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

export default ModifyCourse;