import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Container, Row, Tab, Table, Tabs } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { useUser } from "../../lib/hooks";

import "../../lib/functions/createThemeTable";
import { MagnifyingGlass } from "react-loader-spinner";
import { useRouter } from "next/router";
import { viewSubmissions } from "../../lib/functions/viewSubmissions";

import { clickOnDeleteTask } from "../../lib/functions/clickOnDeleteTask";
import { clickOnUpdateTask } from "../../lib/functions/clickOnUpdateTask";


const Profile = () => {
    const user = useUser({ redirectTo: "/login" });
    const [isUser, setIsUser] = useState(false);

    const [errorMsg, setErrorMsg] = useState(null);
    const [isLoadingOngoingTask, setLoadingOngoingTask] = useState(null);
    const [ongoingTasksCard, setOngoingTasksCard] = useState(null);
    const [ongoingTasksError, setOngoingTasksError] = useState(null);

    const [numUser, setNumUser] = useState(null);
    const [numCourse, setNumCourse] = useState(null);
    const [numTasks, setNumTasks] = useState(null);

    const router = useRouter();


    const [greetings, setGreetings] = useState(null);

    const columnsOngoingTask = [
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
            name: 'Created At',
            selector: row => row.createdAt,
            sortable: true,
            center: true,
        },
        {
            name: 'Submissions',
            selector: row => row.submissions,
            sortable: true,
            center: true,
        },
        {
            name: 'Status',
            selector: row => row.status,
            center: true,
        },
        {
            name: '#',
            selector: row => row.actions,
            center: true,
        },
    ];


    useEffect(() => {
        var today = new Date()
        var curHr = today.getHours()

        if (curHr < 12) {
            setGreetings('Good morning')
        } else if (curHr < 18) {
            setGreetings('Good afternoon')
        } else {
            setGreetings('Good evening')
        }



        if (user) {
            if (user.role === "PROF") {
                setIsUser(true);

                const body = {
                    userId: user.id,
                }



                fetch("/api/prof/task/getOngoingTask", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                })
                    .then((res) => res.json())
                    .then((course) => {



                        if (!course || course.courses.length === 0) {
                            setOngoingTasksError("No Tasks");
                            setLoadingOngoingTask(false);
                            setOngoingTasksCard(null);
                        } else {
                            let ongoingTasks = [];

                            for (let i = 0; i < course.courses.length; i++) {
                                let tasks = [];
                                for (let j = 0; j < course.courses[i].tasks.length; j++) {
                                    let deadline = parseInt(course.courses[i].tasks[j].deadline);
                                    const elem = course.courses[i].tasks[j];
                                    if (Date.now() < deadline) {
                                        tasks.push(
                                            {
                                                id: elem.id,
                                                course: course.courses[i].name,
                                                task: elem.title,
                                                deadline: new Date(parseInt(elem.deadline)).toDateString(),
                                                createdAt: new Date(parseInt(elem.createdAt)).toDateString(),
                                                submissions: elem.submissions.length,
                                                status: <Badge pill bg="success">Ongoing</Badge>,
                                                actions:
                                                    <>
                                                        <Button onClick={(e) => clickOnDeleteTask(e, elem.id, router)} className="m-1" title="Delete" variant="dark">🗑️</Button>
                                                        <Button onClick={(e) => clickOnUpdateTask(e, elem.id, router)} className="m-1" title="Update" variant="dark">✏️</Button>
                                                    </>
                                            }
                                        );


                                    }
                                }
                                ongoingTasks.push(
                                    <Tab eventKey={course.courses[i].id} title={course.courses[i].name}>
                                        <DataTable
                                            theme="customDark"
                                            columns={columnsOngoingTask}
                                            data={tasks}
                                            pointerOnHover
                                            highlightOnHover
                                            striped
                                            pagination
                                            paginationRowsPerPageOptions={[5, 10, 15, 20, 25]}
                                            onRowClicked={(row, event) => viewSubmissions(row.id, router)} />
                                    </Tab>
                                );
                            }
                            setOngoingTasksError(false);
                            setLoadingOngoingTask(false);
                            setOngoingTasksCard(ongoingTasks);
                        }
                    });


                fetch("/api/prof/dashboard/getUserNum", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                })
                    .then((res) => res.json())
                    .then((num) => {
                        if (!num) {
                            setNumUser(0);
                        } else {
                            let userNum = [];
                            console.log(num)

                            for (let i = 0; i < num.courses.length; i++) {
                                userNum.push(
                                    <tr>
                                        <td>{num.courses[i].name}</td>
                                        <td>{num.courses[i]._count.registrations}</td>
                                    </tr>
                                );
                            }

                            setNumUser(userNum);
                        }
                    });

                fetch("/api/prof/dashboard/getCourseNum", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                })
                    .then((res) => res.json())
                    .then((num) => {
                        setNumCourse(num.courses._count.courses)

                    });

                fetch("/api/prof/dashboard/getOngoingTaskNum", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                })
                    .then((res) => res.json())
                    .then((num) => {
                        if (!num) {
                            setNumTasks(0);
                        } else {
                            let count = 0;
                            for (let i = 0; i < num.courses.length; i++) {
                                count += num.courses[i].tasks.length;
                            }
                            setNumTasks(count);
                        }
                    });


            }
        }

    }, [user]);




    return (


        <Container className="p-5" style={{ color: "white" }} >

            {isUser ? (
                <>

                    <h6>Dashboard</h6>

                    <br />
                    <h1 className="mb-5">👋 {greetings}, Prof. {user && (user.lastName)}</h1>

                    <div className="mb-5" style={{ display: 'flex', justifyContent: 'center' }}>
                        <Row lg={3}>
                            <Col className="d-flex mb-3">
                                <Card style={{ cursor: "pointer", width: '20rem' }} className="shadow-lg bg-dark mx-auto">
                                    <Card.Header className="text-center"><h5>🎓Students</h5></Card.Header>
                                    <Card.Body className="d-flex flex-column">
                                        <Table className="table table-borderless table-dark">


                                            <tbody>
                                                {numUser}

                                            </tbody>
                                        </Table>

                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col className="d-flex mb-3">
                                <Card style={{ cursor: "pointer", width: '20rem' }} className="shadow-lg bg-dark mx-auto text-center">
                                    <Card.Header><h5>📚 Courses</h5></Card.Header>
                                    <Card.Body className="d-flex flex-column">


                                        <h2>{numCourse}</h2>


                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col className="d-flex mb-3">
                                <Card onClick={() => router.push("/prof/tasks")} style={{ cursor: "pointer", width: '20rem' }} className="shadow-lg bg-dark mx-auto text-center">
                                    <Card.Header><h5>✍🏻 Ongoing Tasks</h5></Card.Header>
                                    <Card.Body className="d-flex flex-column">

                                        <h2>{numTasks}</h2>
                                    </Card.Body>
                                </Card>
                            </Col>

                        </Row>
                    </div>

                    <h2 className="mb-3">Ongoing tasks 🚧</h2>
                    <Card className="shadow-lg bg-dark mx-auto text-center">
                        <Card.Body>

                            {isLoadingOngoingTask ? (
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

                            {ongoingTasksCard ? (
                                <Tabs className="mb-3">
                                    {ongoingTasksCard}
                                </Tabs>

                            ) : (<></>)}

                            {ongoingTasksError ? (<div className="d-flex justify-content-center"><h5>{ongoingTasksError}</h5></div>) : (<></>)}


                        </Card.Body>
                    </Card>


                </>
            ) : (
                <h1>Forbidden</h1>
            )}




        </Container >





    )
}



export default Profile
