import { useUser } from "../../../lib/hooks";
import React, { useEffect, useState } from "react";
import styles from "../styles/Courses.module.css";
import { Button, Card, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { MagnifyingGlass } from "react-loader-spinner";
import { useRouter } from "next/router";
import { clickOnCourse } from "../../../lib/functions/clickOnCourse";
import { clickOnEnroll } from "../../../lib/functions/clickOnEnroll";
import CourseCard from "../../../components/courseCard";
import { clickOnUnenroll } from "../../../lib/functions/clickOnUnenroll";

const Courses = () => {
    const user = useUser({ redirectTo: "/login" });

    const [isUser, setIsUser] = useState(false);
    const [isLoading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState(null);
    const [cards, setCards] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            if (user.role === "USER") {
                setIsUser(true);
            }
        }
    }, [user]);


    const search = async (e) => {
        e.preventDefault();

        setCards(null);
        setLoading(true);
        setErrorMsg(null);


        const body = {
            search: e.currentTarget.search.value,
        };

        try {
            const res = await fetch("/api/user/courses/findCourses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (res.status === 200) {
                const courses = await res.json();
                const cards = [];

                //takes the response from the server
                courses.courses.forEach(elem => {

                    //create an array with the users enrolled in the course
                    const subscriber = elem.registrations.map(x => x.userId);

                    //check if the current user is already enrolled in one of the resulting courses
                    if (subscriber.includes(user.id)) {

                        //takes the user's position in the array
                        const index = subscriber.indexOf(user.id);

                        //extracts the registration date
                        const date = new Date(parseInt(elem.registrations[index].createdAt));
                        //add component to rows
                        cards.push(
                            <Col className="d-flex mb-3">
                                <CourseCard
                                    onClick={(e) => clickOnCourse(e, router)}
                                    courseId={elem.id}
                                    courseName={elem.name}
                                    prof={elem.user.name + " " + elem.user.lastName}
                                    accademicYear={elem.academicYear}
                                    date={date.toDateString()}
                                    isEnrolled={true}
                                    clickOnUnenroll={(e) => clickOnUnenroll(router, elem.registrations[index].id)}

                                />
                            </Col>
                        );
                    } else {
                        //the current user is not present in the array, so it is not enrolled in the course
                        cards.push(
                            <Col className="d-flex mb-3">
                                <CourseCard
                                    onEnrollClick={(e) => clickOnEnroll(e, router, user.id)}
                                    onClick={(e) => clickOnCourse(e, router)}
                                    courseId={elem.id}
                                    courseName={elem.name}
                                    prof={elem.user.name + " " + elem.user.lastName}
                                    accademicYear={elem.academicYear}
                                    isEnrolled={false}
                                />
                            </Col>
                        );
                    }

                });
                setCards(cards);
                setLoading(false);

            } else if (res.status === 404) {
                setErrorMsg("The search did not return any results 🤷🏻‍♂️");
                setLoading(false);

            } else if (res.status === 500) {
                console.error("An unexpected error happened occurred");
                setErrorMsg("An unexpected error happened occurred");
                setLoading(false);
            }
        } catch (error) {
            console.error("An unexpected error happened occurred:", error);
            setErrorMsg(error.message);
            setLoading(false);
        }

    }


    return (



        <Container className="p-5" style={{ color: "white" }}>

            {isUser
                ? (
                    <>
                        <h2>Courses📚</h2>
                        <Card className="shadow-lg bg-dark mx-auto">
                            <Card.Body>
                                <h6 className="mb-3">Here you can search for courses</h6>
                                <Row>
                                    <Col xs={6}>
                                        <Form onSubmit={search}>
                                            <InputGroup className="mb-3">

                                                <Form.Control
                                                    id="search"
                                                    name="search"
                                                    placeholder="Search courses"
                                                    aria-label="Search courses"
                                                    aria-describedby="basic-addon1"
                                                />
                                                <Button style={{ color: "white" }} variant="danger" type="submit">
                                                    Search
                                                </Button>

                                            </InputGroup>
                                        </Form>
                                    </Col>
                                </Row>

                            </Card.Body>
                        </Card>

                        <br />

                        {isLoading ? (
                            <div className="d-flex mb-3 justify-content-center">
                                <MagnifyingGlass
                                    visible={true}
                                    height="80"
                                    width="80"
                                    ariaLabel="MagnifyingGlass-loading"
                                    wrapperStyle={{}}
                                    wrapperClass="MagnifyingGlass-wrapper"
                                    glassColor='#c0efff'
                                    color='#ff0011'
                                />
                            </div>
                        ) : (<></>)}


                        {cards ? (
                            <>
                                <h2 className="text">Result 🕵️</h2>
                                <Row lg={4}>
                                    {cards}
                                </Row>
                            </>
                        ) : (<></>)}

                        {errorMsg ? (
                            <Card className="shadow-lg bg-dark mx-auto">
                                <Card.Body>
                                    <div className="d-flex justify-content-center">
                                        <h4 className="text">{errorMsg}</h4>
                                    </div>
                                </Card.Body>
                            </Card>
                        ) : (<></>)}

                    </>
                )
                : (<h1>Forbidden</h1>)}
        </Container>


    )
}

export default Courses;
