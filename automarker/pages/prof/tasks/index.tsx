import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Badge, Button, Card, Container, Tab, Tabs } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { clickOnDeleteTask } from "../../../lib/functions/clickOnDeleteTask";
import { clickOnUpdateTask } from "../../../lib/functions/clickOnUpdateTask";

import "../../../lib/functions/createThemeTable";
import { viewSubmissions } from "../../../lib/functions/viewSubmissions";
import { useUser } from "../../../lib/hooks";


const TasksPage = () => {
    const user = useUser({ redirectTo: "/login" });
    const [isUser, setIsUser] = useState(false);

    const [ongoingTasksError, setOngoingTasksError] = useState(null);
    const [loadingOngoingTask, setLoadingOngoingTask] = useState(null);
    const [ongoingTasksCard, setOngoingTasksCard] = useState(null);

    const [oldTaskError, setOldTasksError] = useState(null);
    const [loadingOldTask, setLoadingOldTask] = useState(null);
    const [oldTasksCard, setOldTasksCard] = useState(null);

    const router = useRouter();


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


                fetch("/api/prof/task/getOngoingTask", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                })
                    .then((res) => res.json())
                    .then((course) => {
                        if (!course || course.courses.length === 0) {
                            setOldTasksError("No Tasks");
                            setLoadingOldTask(false);
                            setOldTasksCard(null);
                        } else {
                            let oldTasks = [];

                            for (let i = 0; i < course.courses.length; i++) {
                                let tasks = [];
                                for (let j = 0; j < course.courses[i].tasks.length; j++) {
                                    let deadline = parseInt(course.courses[i].tasks[j].deadline);
                                    const elem = course.courses[i].tasks[j];
                                    if (Date.now() > deadline) {
                                        tasks.push(
                                            {
                                                id: elem.id,
                                                course: course.courses[i].name,
                                                task: elem.title,
                                                deadline: new Date(parseInt(elem.deadline)).toDateString(),
                                                createdAt: new Date(parseInt(elem.createdAt)).toDateString(),
                                                submissions: elem.submissions.length,
                                                status: <Badge pill bg="warning">Expired</Badge>,
                                                actions:
                                                    <>
                                                        <Button onClick={(e) => clickOnDeleteTask(e, elem.id, router)} className="m-1" title="Delete" variant="dark">🗑️</Button>
                                                    </>
                                            }
                                        );
                                    }
                                }
                                oldTasks.push(
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
                            setOldTasksError(false);
                            setLoadingOldTask(false);
                            setOldTasksCard(oldTasks);
                        }
                    });
            }
        }
    }, [user]);


    return (
        <Container className="p-5 " style={{ color: "white" }}>

            {isUser ? (
                <>
                    <h6>Tasks</h6>

                    <br />

                    <Button href="/prof/tasks/new" variant="success">🚀 New Task</Button>{' '}

                    <br /><br />

                    <h2 className="mb-3">Ongoing tasks 🚧</h2>
                    <Card className="shadow-lg bg-dark p-3 mx-auto">
                        <Tabs className="mb-3">
                            {ongoingTasksCard}
                        </Tabs>

                    </Card>


                    <br />


                    <h2 className="mb-3">Old tasks 🗂</h2>
                    <Card className="shadow-lg bg-dark p-3 mx-auto">
                        <Tabs className="mb-3">
                            {oldTasksCard}
                        </Tabs>

                    </Card>
                </>
            ) : (<></>)}

        </Container>
    );

}


export default TasksPage;
