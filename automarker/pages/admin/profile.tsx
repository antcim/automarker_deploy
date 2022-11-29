import React from 'react';
import { Row, Col, Card, Container, Button, ButtonGroup } from "react-bootstrap";
import { clickOnDeleteCourse } from "../../lib/functions/clickOnDeleteCourse";
import { clickOnUpdateCourse } from "../../lib/functions/clickOnUpdateCourse";
import { useRouter } from 'next/router';
import CourseCardAdmin from '../../components/courseCardAdmin';
import AdminCardAdmin from '../../components/adminCardAdmin';
import ProfessorCardAdmin from '../../components/professorCardAdmin';
import { useUser } from '../../lib/hooks';
import { useEffect, useState } from 'react';
import { clickOnDeleteProfessor } from "../../lib/functions/clickOnDeleteProfessor";
import { clickOnUpdateProfessor } from "../../lib/functions/clickOnUpdateProfessor";
import { clickOnUpdateAdmin } from "../../lib/functions/clickOnUpdateAdmin";
import { clickOnDeleteAdmin } from "../../lib/functions/clickOnDeleteAdmin";


const Profile = () => {
    const user = useUser({ redirectTo: "/login" });
    const [isLoadingAdministrator, setLoadingAdministrator] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [coursesCard, setCoursesCard] = useState(null);
    const [professorsCard, setProfessorsCard] = useState(null);
    const [adminsCard, setAdminsCard] = useState(null);

    const router = useRouter();

    useEffect(() => {
        if (user) {
            setLoadingAdministrator(true);

            //gives the list of all courses
            fetch("/api/user/courses/getAllCourses")
                .then((res) => res.json())
                .then((courses) => {
                    console.log(courses)
                    if (!courses) {
                        setErrorMessage("No courses to display");
                        setCoursesCard(null);
                    }
                    else {
                        console.log("Courses: " + courses);

                        const cardsCourses = [];

                        for (let i = 0; i < courses.courses.length; i++) {
                            const elem = courses.courses[i];

                            const date = new Date(parseInt(elem.createdAt));

                            cardsCourses.push(
                                <Col className="d-flex mb-3">
                                    <CourseCardAdmin
                                        courseId={elem.courseId}
                                        courseName={elem.name}
                                        academicYear={elem.academicYear}
                                        date={date.toDateString()}
                                        prof={elem.user.name + " " + elem.user.lastName}
                                        clickOnUpdateCourse={(e) => clickOnUpdateCourse(router, elem.id)}
                                        clickOnDeleteCourse={(e) => clickOnDeleteCourse(router, elem.id)}
                                    />
                                </Col>
                            );
                        }
                        setErrorMessage(null);
                        setCoursesCard(cardsCourses);
                    }
                });

            //gives the list of all professors

            fetch("/api/admin/professors/getAllProfessors")
                .then((res) => res.json())
                .then((professors) => {
                    console.log(professors);
                    if (!professors) {
                        setErrorMessage("No professor to display");
                        setProfessorsCard(null);
                    }
                    else {

                        const cardsProfessor = [];

                        for (let i = 0; i < professors.professors.length; i++) {
                            const elem = professors.professors[i];

                            const date = new Date(parseInt(elem.createdAt));


                            cardsProfessor.push(
                                <Col className="d-flex mb-3">
                                    <ProfessorCardAdmin
                                        professorId={elem.id}
                                        professorUsername={elem.username}
                                        professorName={elem.name}
                                        professorLastName={elem.lastName}
                                        date={date.toDateString()}
                                        clickOnUpdateProfessor={(e) => clickOnUpdateProfessor(router, elem.id)}
                                        clickOnDeleteProfessor={(e) => clickOnDeleteProfessor(router, elem.id)}
                                    />
                                </Col>
                            );
                        }
                        setErrorMessage(null);
                        setProfessorsCard(cardsProfessor);
                    }
                });

            fetch("/api/admin/administrator/getAllAdminstrator")
                .then((res) => res.json())
                .then((admins) => {
                    console.log(admins);
                    if (!admins) {
                        setErrorMessage("No adminstrator to display");
                        setAdminsCard(null);
                    }
                    else {

                        const cardsAdmins = [];

                        for (let i = 0; i < admins.admins.length; i++) {
                            const elem = admins.admins[i];

                            const date = new Date(parseInt(elem.createdAt));


                            cardsAdmins.push(
                                <Col className="d-flex mb-3">
                                    <AdminCardAdmin
                                        adminId={elem.id}
                                        adminUsername={elem.username}
                                        adminName={elem.name}
                                        adminLastName={elem.lastName}
                                        date={date.toDateString()}
                                        clickOnUpdateAdmin={(e) => clickOnUpdateAdmin(router, elem.id)}
                                        clickOnDeleteAdmin={(e) => clickOnDeleteAdmin(router, elem.id)}
                                    />
                                </Col>
                            );
                        }
                        setErrorMessage(null);
                        setAdminsCard(cardsAdmins);
                    }
                });
        }
    }, [user]);

    return (
        //gives the possibility to create a new professor with a button

        //gives the possibility to create a new course with a button
        <>

            <Container className="p-5" style={{ color: "white" }}>

            <h1>Dashboard</h1>
            <br />

            <div className="d-flex justify-content-center">
                    <ButtonGroup className="mb-2">
                        <Button className="m-1" variant="success" href="/admin/courses/create/createCourse">
                            Create new Course
                        </Button>

                        <Button className="m-1" variant="success" href="/admin/prof/create/createProfessor">
                            Create new Professor
                        </Button>

                        <Button className="m-1" variant="success" href="/admin/administrator/create/createAdministrator">
                            Create new Administrator
                        </Button>
                    </ButtonGroup>

                </div>

                <br />
                <h3>Courses</h3>
                <hr />
          

                {coursesCard ? (
                    <Row lg={4}>
                        {coursesCard}
                    </Row>
                ) : (<></>)}

                <br />

                <h3>Professors</h3>
                <hr />
             
                {professorsCard ? (
                    <Row lg={4}>
                        {professorsCard}
                    </Row>
                ) : (<></>)}

                <br />

                <h3>Administrator</h3>
                <hr />
                {adminsCard ? (
                    <Row lg={4}>
                        {adminsCard}
                    </Row>
                ) : (<></>)}


                {errorMessage ? (
                    <Card className="shadow-lg bg-dark mx-auto">
                        <Card.Body>
                            <div className="d-flex justify-content-center">
                                <h4 className="text">{errorMessage}</h4>
                            </div>
                        </Card.Body>
                    </Card>
                ) : (<></>)}
            </Container>
        </>
    )

}

export default Profile
