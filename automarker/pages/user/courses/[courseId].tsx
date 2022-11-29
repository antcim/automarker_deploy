import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Badge, Button, Card, Container, Row, Col, Dropdown, Table } from 'react-bootstrap';
import { useUser } from "../../../lib/hooks";
import { clickOnEnroll } from "../../../lib/functions/clickOnEnroll";

import { MagnifyingGlass } from "react-loader-spinner";


import styles from "../../../styles/Courses.module.css";
import { clickOnUnenroll } from "../../../lib/functions/clickOnUnenroll";
import { clickOnTask } from "../../../lib/functions/clickOnTask";
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import dynamic from 'next/dynamic';
import DataTable from 'react-data-table-component';
import "../../../lib/functions/createThemeTable";

const MySyntaxHighlighter = dynamic(import("../../../components/MySyntaxHighlighter"), { ssr: false })


const Course = () => {
    const user = useUser({ redirectTo: "/login" });
    const [isUser, setIsUser] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [courseInfo, setCourseInfo] = useState(null);
    const [assignment, setAssignment] = useState(null);

    const [isLoadingSubTask, setLoadingSubTask] = useState(false);
    const [errorMsgSubTask, setErrorMsgSubTask] = useState(null);
    const [subTasksCard, setSubTasksCard] = useState(null);

    const router = useRouter();
    const { courseId } = router.query;

    const columnsSubTask = [
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

                if (user && courseId) {

                    const body = {
                        courseId: courseId,
                        userId: user.id,
                    }

                    fetch("/api/user/courses/getCourse", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(body),
                    })
                        .then((res) => res.json())
                        .then((course) => {
                            if (!course) {
                                setErrorMsg("This course does not exist");
                                setCourseInfo(null);
                            } else {
                                let courseInfo = null;
                                let assignment = [];

                                console.log(course);

                                //create an array with the users enrolled in the course
                                const subscriber = course.registrations.map(x => x.userId);

                                //check if the current user is already enrolled in the course
                                if (subscriber.includes(user.id)) {

                                    //takes the user's position in the array
                                    const index = subscriber.indexOf(user.id);

                                    //extracts the registration date
                                    const date = new Date(parseInt(course.registrations[index].createdAt)).toDateString();
                                    //create component
                                    courseInfo =
                                        <Card className="shadow-lg bg-dark mb-3 mx-auto">
                                            <Card.Img className={styles.fill} variant="top" src={"/placeholder/place1.jpg"} />

                                            <Card.Body>
                                                <Row>
                                                    <Col >
                                                        <Card.Title><h1>{course.name}</h1></Card.Title>
                                                        <Card.Subtitle className="mb-2 text-muted">{course.academicYear}</Card.Subtitle>
                                                        <Card.Subtitle className="mb-2"><i>Prof.</i> {course.user.name} {course.user.lastName}</Card.Subtitle>
                                                        <Card.Text></Card.Text>
                                                    </Col>
                                                    <Col className="d-flex my-auto justify-content-center">
                                                        <Card.Text>Enrolled in {date}</Card.Text>
                                                        <Dropdown>
                                                            <Dropdown.Toggle variant="link" />
                                                            <Dropdown.Menu>
                                                                <Dropdown.Item onClick={(e) => clickOnUnenroll(router, course.registrations[index].id)}>Unenroll</Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                        ;

                                    const now = Date.now().toString();

                                    for (let i = 0; i < course.tasks.length; i++) {
                                        const task = course.tasks[i];

                                        const deadline = new Date(parseInt(task.deadline)).toDateString();
                                        const createdAt = new Date(parseInt(task.createdAt)).toDateString();



                                        assignment.push(
                                            <Card onClick={() => clickOnTask(router, user.id, task.id)} style={{ cursor: "pointer" }} className="shadow-lg bg-dark mb-3 mx-auto">
                                                <Card.Body>

                                                    <Card.Title>
                                                        <h5>
                                                            {task.title} {task.deadline > now ? (<Badge pill bg="success">To-do</Badge>) : (<Badge pill bg="warning" text="dark">Expired</Badge>)}
                                                        </h5>
                                                    </Card.Title>
                                                    <Card.Subtitle className="mb-3 text-muted"><i>Created at</i> {createdAt}</Card.Subtitle>

                                                    <ReactMarkdown
                                                        children={task.assignment.length > 150 ? task.assignment.substring(0, 150) + "..." : task.assignment}
                                                        rehypePlugins={[rehypeKatex, remarkMath]}
                                                        remarkPlugins={[remarkGfm]}
                                                        components={{
                                                            code({ node, inline, className, children, ...props }) {
                                                                const match = /language-(\w+)/.exec(className || '')
                                                                return !inline && match ? (
                                                                    <MySyntaxHighlighter
                                                                        children={String(children).replace(/\n$/, '')}
                                                                        language={match[1]}
                                                                        PreTag="div"
                                                                        {...props}
                                                                    />
                                                                ) : (
                                                                    <code className={className} {...props}>
                                                                        {children}
                                                                    </code>
                                                                )
                                                            }
                                                        }}
                                                    />

                                                    <Card.Text className="mb-3 text-muted">
                                                        📌 &nbsp;
                                                        <i>Language: {task.language}</i>
                                                    </Card.Text>

                                                    <Card.Subtitle className="mb-3 text-muted">⌛️&nbsp; <i>Deadline</i> {deadline}</Card.Subtitle>

                                                </Card.Body>
                                            </Card >
                                        );

                                    }

                                } else {
                                    courseInfo =
                                        <Card className="shadow-lg bg-dark mb-3 mx-auto">
                                            <Card.Body>
                                                <Row>
                                                    <Col >
                                                        <Card.Title><h1>{course.name}</h1></Card.Title>
                                                        <Card.Subtitle className="mb-2 text-muted">{course.academicYear}</Card.Subtitle>
                                                        <Card.Subtitle className="mb-2">Prof. {course.user.name} {course.user.lastName}</Card.Subtitle>
                                                        <Card.Text></Card.Text>
                                                    </Col>
                                                    <Col className="d-flex my-auto justify-content-center">
                                                        <Button onClick={(e) => clickOnEnroll(e, router, user.id)} id={"button" + course.id}>Enroll</Button>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                        ;

                                    assignment.push(
                                        <Card className="shadow-lg bg-dark mb-3 mx-auto">
                                            <Card.Body>
                                                <div className="d-flex justify-content-center">
                                                    <Card.Text><h5>To view the tasks you must be enrolled ⚠️</h5></Card.Text>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    );


                                }
                                if (assignment.length === 0) {
                                    assignment.push(
                                        <Card className="shadow-lg bg-dark mb-3 mx-auto">
                                            <Card.Body>
                                                <div className="d-flex justify-content-center">
                                                    <Card.Text><h5>No Task 😴</h5></Card.Text>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    );
                                }
                                setAssignment(assignment);
                                setCourseInfo(courseInfo);
                            }
                        })

                    fetch("/api/user/submission/getUserCourseSubmissions", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(body),
                    })
                        .then((res) => res.json())
                        .then((subms) => {
                            if (!subms || subms.course.tasks.reduce((sum, x) => sum + x.submissions.length, 0) === 0) {
                                setErrorMsgSubTask("No submitted assignments");
                                setLoadingSubTask(false);
                                setSubTasksCard(null);
                            } else {

                                const subTasks = [];

                                for (let i = 0; i < subms.course.tasks.length; i++) {
                                    const taskTitle = subms.course.tasks[i].title;
                                    for (let j = 0; j < subms.course.tasks[i].submissions.length; j++) {
                                        if (subms.course.tasks[i].submissions[j].isSubmitted) {
                                            const mark = subms.course.tasks[i].submissions[j].mark;
                                            const submittedAt = new Date(parseInt(subms.course.tasks[i].submissions[j].submittedAt)).toDateString();
                                            const taskId = subms.course.tasks[i].id;

                                            subTasks.push(
                                                {
                                                    id: taskId,
                                                    task: taskTitle,
                                                    mark: mark,
                                                    submittedAt: <i>{submittedAt}</i>,
                                                    status: <td className="text-center"><Badge pill bg="primary">Submitted</Badge></td>
                                                }
                                            );
                                        }

                                    }
                                }
                                setErrorMsgSubTask(false);
                                setLoadingSubTask(false);
                                setSubTasksCard(subTasks);

                            }

                        });
                }
            }
        }



    }, [user, courseId])


    return (

        <Container className="p-5" style={{ color: "white" }}>

            {isUser
                ? (
                    <>
                        {errorMsg ? (<h1>{errorMsg}</h1>) : (<>

                            {courseInfo ? (courseInfo) : (<></>)}


                            <h3 className="mb-3">Assignments✍️</h3>

                            {assignment ? (assignment) : (<></>)}

                            <br />

                            <h3 className="mb-3">Assignments submitted 💪</h3>
                            <Card className="shadow-lg bg-dark mb-3 mx-auto">
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

                        </>)}
                    </>

                )
                : (<h1>Forbidden</h1>)}
        </Container>

    );
}

export default Course;