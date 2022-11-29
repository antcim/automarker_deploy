import { useUser } from "../../lib/hooks";
import React, { useEffect, useState } from "react";
import styles from "../../styles/Profile.module.css";
import { Button, Badge, Card, Col, Container, Row, Table, Dropdown } from "react-bootstrap";
import { MagnifyingGlass } from "react-loader-spinner";
import { clickOnCourse } from "../../lib/functions/clickOnCourse";
import { clickOnUnenroll } from "../../lib/functions/clickOnUnenroll";
import { useRouter } from "next/router";
import CourseCard from "../../components/courseCard";
import { clickOnTask } from "../../lib/functions/clickOnTask";

import DataTable from 'react-data-table-component';
import "../../lib/functions/createThemeTable";



const Profile = () => {
    const user = useUser({ redirectTo: "/login" });
    const router = useRouter();

    const [isUser, setIsUser] = useState(false);

    const [isLoadingCourse, setLoadingCourse] = useState(false);
    const [coursesCard, setCoursesCard] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const [isLoadingTask, setLoadingTask] = useState(false);
    const [errorMsgTask, setErrorMsgTask] = useState(null);
    const [tasksCard, setTasksCard] = useState(null);

    const [isLoadingSubTask, setLoadingSubTask] = useState(false);
    const [errorMsgSubTask, setErrorMsgSubTask] = useState(null);
    const [subTasksCard, setSubTasksCard] = useState(null);


    const columnsTask = [
        {
            name: 'Course',
            selector: row => row.course,
            sortable: true,
            center: true,
        },
        {
            name: 'Task',
            selector: row => row.task,
            sortable: true,
            center: true,
        },
        {
            name: 'Deadline',
            selector: row => row.deadline,
            sortable: true,
            center: true,
        },
        {
            name: 'Status',
            selector: row => row.status,
            center: true,
        },
    ];

    const columnsSubTask = [
        {
            name: 'Course',
            selector: row => row.course,
            sortable: true,
            center: true,
        },
        {
            name: 'Task',
            selector: row => row.task,
            sortable: true,
            center: true,
        },
        {
            name: 'Mark',
            selector: row => row.mark,
            sortable: true,
            center: true,
        },
        {
            name: 'Submitted At',
            selector: row => row.submittedAt,
            sortable: true,
            center: true,
        },
        {
            name: 'Status',
            selector: row => row.status,
            center: true,
        },
    ];




    useEffect(() => {
        if (user) {
            if (user.role === "USER") {
                setIsUser(true);

                setLoadingCourse(true);
                setLoadingTask(true);

                const body = {
                    userId: user.id,
                }

                fetch("/api/user/enrollment/getUserEnrollments", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                })
                    .then((res) => res.json())
                    .then((courses) => {
                        if (!courses || courses.courses.length === 0) {
                            setErrorMsg("You are not enrolled in any course");
                            setCoursesCard(null);
                            setLoadingCourse(false);
                        } else {

                            const cards = [];

                            //takes the response from the server
                            for (let i = 0; i < courses.courses.length; i++) {
                                const elem = courses.courses[i];

                                //extracts the registration date
                                const date = new Date(parseInt(elem.createdAt));

                                //add component to rows
                                cards.push(
                                    <Col className="d-flex mb-3">
                                        <CourseCard
                                            onClick={(e) => clickOnCourse(e, router)}
                                            courseId={elem.courseId}
                                            courseName={elem.course.name}
                                            prof={elem.course.user.name + " " + elem.course.user.lastName}
                                            academicYear={elem.course.academicYear}
                                            date={date.toDateString()}
                                            isEnrolled={true}
                                            clickOnUnenroll={(e) => clickOnUnenroll(router, elem.id)}
                                        />

                                    </Col>
                                );
                            }
                            setErrorMsg(null);
                            setLoadingCourse(false);
                            setCoursesCard(cards);

                        }
                    });


                fetch("/api/user/task/getUserTasks", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                })
                    .then((res) => res.json())
                    .then((courses) => {
                        if (!courses || courses.courses.reduce((sum, x) => sum + x.course.tasks.length, 0) === 0) {
                            setErrorMsgTask("No pending assignments");
                            setLoadingTask(false);
                            setTasksCard(null);
                        } else {

                            const tasks = [];

                            for (let i = 0; i < courses.courses.length; i++) {
                                const array = courses.courses;

                                const courseName = array[i].course.name;

                                for (let j = 0; j < array[i].course.tasks.length; j++) {
                                    const deadline = new Date(parseInt(array[i].course.tasks[j].deadline)).toDateString();
                                    const deadlineInt = array[i].course.tasks[j].deadline;
                                    tasks.push(
                                        {
                                            id: array[i].course.tasks[j].id,
                                            course: courseName,
                                            task: array[i].course.tasks[j].title,
                                            deadline: <i>{deadline}</i>,
                                            status: deadlineInt > Date.now() ? (<Badge pill bg="success">To-do</Badge>) : (<Badge pill bg="warning" text="dark">Expired</Badge>)
                                        },

                                    );
                                }

                            }
                            setErrorMsgTask(false);
                            setLoadingTask(false);
                            setTasksCard(tasks);

                        }
                    });


                fetch("/api/user/submission/getUserSubmissions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                })
                    .then((res) => res.json())
                    .then((submissions) => {
                        if (submissions.length === 0) {
                            setErrorMsgSubTask("No submitted assignments");
                            setLoadingSubTask(false);
                            setSubTasksCard(null);
                        } else {

                            const tasks = [];

                            for (let i = 0; i < submissions.length; i++) {

                                if (submissions[i].isSubmitted) {
                                    const submittedAt = new Date(parseInt(submissions[i].submittedAt)).toDateString();

                                    tasks.push(
                                        {
                                            id: submissions[i].taskId,
                                            course: submissions[i].task.course.name,
                                            task: submissions[i].task.title,
                                            mark: submissions[i].mark,
                                            submittedAt: <i>{submittedAt}</i>,
                                            status: <Badge pill bg="primary">Submitted</Badge>
                                        },

                                    );
                                }
                            }
                            setErrorMsgSubTask(false);
                            setLoadingSubTask(false);
                            setSubTasksCard(tasks);
                        }
                    });
            }
        }
    }, [user])

    return (
        <>
            <Container className="p-5" style={{ color: "white" }}>
                {isUser
                    ? (
                        <>
                            <h6 className={styles.text}>Profile</h6>

                            <br />

                            <h1 className={styles.text}>👋Hi, {user && (user.name)}!</h1>

                            <br />
                            <h2 className="mb-3">Assignments ✍️</h2>
                            <Card className="shadow-lg bg-dark mx-auto">
                                <Card.Header as="h4">Pending</Card.Header>
                                <Card.Body>

                                    {isLoadingTask ? (
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


                                    {tasksCard ? (
                                        <>

                                            <DataTable
                                                columns={columnsTask}
                                                data={tasksCard}
                                                pointerOnHover
                                                highlightOnHover
                                                striped
                                                theme="customDark"
                                                pagination
                                                paginationRowsPerPageOptions={[5, 10, 15, 20, 25]}
                                                onRowClicked={(row, event) => { clickOnTask(router, user.id, row.id) }}


                                            />
                                        </>
                                    ) : (<></>)}

                                    {errorMsgTask ? (<div className="d-flex justify-content-center"><h5>{errorMsgTask}</h5></div>) : (<></>)}

                                </Card.Body>
                            </Card>

                            <br />

                            <h2 className="mb-3">Assignments submitted 💪</h2>
                            <Card className="shadow-lg bg-dark mx-auto">
                                <Card.Body>
                                    {isLoadingSubTask ? (
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


                                    {subTasksCard ? (
                                        <DataTable
                                            columns={columnsSubTask}
                                            data={subTasksCard}
                                            pointerOnHover
                                            highlightOnHover
                                            striped
                                            theme="customDark"
                                            pagination
                                            paginationRowsPerPageOptions={[5, 10, 15, 20, 25]}
                                            onRowClicked={(row, event) => { clickOnTask(router, user.id, row.id) }}


                                        />
                                    ) : (<></>)}

                                    {errorMsgSubTask ? (<div className="d-flex justify-content-center"><h5>{errorMsgSubTask}</h5></div>) : (<></>)}
                                </Card.Body>
                            </Card>

                            <br />

                            <h2 className="mb-3">Your courses📚</h2>

                            {isLoadingCourse ? (
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


                            {coursesCard ? (
                                <Row lg={4}>
                                    {coursesCard}
                                </Row>
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

        </>
    )
}


export default Profile
