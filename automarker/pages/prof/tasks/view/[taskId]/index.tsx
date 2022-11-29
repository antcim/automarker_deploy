import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Badge, Button, Card, Container } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { useUser } from "../../../../../lib/hooks";

import "../../../../../lib/functions/createThemeTable";
import { toast } from "react-toastify";


const Page = () => {
    const user = useUser({ redirectTo: "/login" });

    const [isUser, setIsUser] = useState(false);

    const [subs, setSubs] = useState(null);

    const router = useRouter();
    const { taskId } = router.query;

    const columns = [
        {
            name: 'Task',
            selector: row => row.taskTitle,
            sortable: true,
            center: true,
        },
        {
            name: 'Student',
            selector: row => row.student,
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
            name: 'Deadline',
            selector: row => row.deadline,
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

    const clickOnMark = (sub, userId, taskId) => {
        if (parseInt(sub.task.deadline) > Date.now()) {
            toast.warn("Cannot mark an ongoing task, wait for it to finish", {
                position: "top-right",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        } else {
            
            router.push("/prof/tasks/mark/" + taskId + "/" + userId);
        }
    }


    useEffect(() => {

        if (user && taskId) {
            if (user.role === "PROF") {
                setIsUser(true);

                const body = {
                    taskId: taskId,
                }

                fetch("/api/prof/submission/getTaskSubmissions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                })
                    .then((res) => res.json())
                    .then((submissions) => {

                        if (!submissions) {
                            setSubs([]);
                        } else {

                            let subsRows = [];
                            for (let i = 0; i < submissions.length; i++) {

                                subsRows.push(
                                    {
                                        id: submissions[i].id,
                                        taskTitle: submissions[i].task.title,
                                        student: submissions[i].user.name + " " + submissions[i].user.lastName,
                                        submittedAt: new Date(parseInt(submissions[i].submittedAt)).toDateString(),
                                        deadline: new Date(parseInt(submissions[i].task.deadline)).toDateString(),
                                        mark: submissions[i].mark,
                                        status: submissions[i].isSubmitted ? <Badge pill bg="success">Submitted</Badge> : <Badge pill bg="primary">In progress</Badge>,
                                        actions: submissions[i].isSubmitted ? <Button onClick={(e) => clickOnMark(submissions[i], submissions[i].userId, submissions[i].taskId)} title="Mark" variant="dark">💯</Button> : <></>,
                                    }

                                );

                            }
                            setSubs(subsRows);

                        }


                    });


            }

        }
    }, [user, taskId]);

    return (
        <Container className="p-5 " style={{ color: "white" }}>

            {isUser ? (
                <>
                    <h6>Tasks / View</h6>
                    <br />
                    <h2 className="mb-3">Submissions 📋</h2>

                    <Card className="shadow-lg bg-dark mb-3 mx-auto">
                        <Card.Body>

                            {subs && <DataTable
                                theme="customDark"
                                columns={columns}
                                data={subs}
                                pointerOnHover
                                highlightOnHover
                                striped
                                pagination
                                paginationRowsPerPageOptions={[15, 20, 25, 30, 40, 50]}
                                onRowClicked={(row, event) => null}
                            />}
                        </Card.Body>

                    </Card>

                </>
            ) : (<h1>Forbidden</h1>)}


        </Container>
    );
}

export default Page;