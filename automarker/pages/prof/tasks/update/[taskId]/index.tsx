import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap"
import { useUser } from "../../../../../lib/hooks";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import katex from "katex";
import "katex/dist/katex.css";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";

const MDEditor = dynamic(
    () => import("@uiw/react-md-editor").then((mod) => mod.default),
    { ssr: false }
);



const UpdatePage = () => {
    const user = useUser({ redirectTo: "/login" });
    const router = useRouter();

    const [isUser, setIsUser] = useState(null);

    const [title, setTitle] = useState(null);
    const [assignment, setAssignment] = useState(null);
    const [deadline, setDeadline] = useState(null);
    const [testCase, setTesCase] = useState(null);
    const [hint, setHint] = useState(null);
    const [solution, setSolution] = useState(null);
    const [language, setLanguage] = useState(null);


    const { taskId } = router.query;


    useEffect(() => {
        if (user && taskId) {
            if (user.role === "PROF") {
                setIsUser(true);

                const body = {
                    taskId: taskId,
                }

                fetch("/api/prof/task/getTask", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                })
                    .then((res) => res.json())
                    .then((task) => {
                        if (task) {
                            console.log(task)
                            setTitle(task.title);
                            setAssignment(task.assignment);
                            setTesCase(task.testCase);
                            setHint(task.hint);
                            setSolution(task.solution);
                            setLanguage(task.language);

                            let deadline = new Date(new Date(parseInt(task.deadline)).toString().split('GMT')[0] + ' UTC').toISOString().split('.')[0];  //è stato un parto
                            setDeadline(deadline);

                        }
                    });
            }

        }
    }, [user, taskId]);


    const changeSolution = (e) => {
        setSolution(e.target.value);
    }

    const changeTitle = (e) => {
        setTitle(e.target.value);
    }

    const changeTestCase = (e) => {
        setTesCase(e.target.value);
    }

    const changeLanguage = (e) => {
        setLanguage(e.target.value);
    }

    const changeDeadline = (e) => {
        setDeadline(e.target.value);
    }

    const updateTask = (e) => {
        e.preventDefault();

        const body = {
            id: taskId,
            title: title,
            assignment: assignment,
            deadline: (Date.parse(e.currentTarget.deadline.value)).toString(),
            testCase: testCase,
            hint: hint,
            solution: solution,
            language: language,
        }

        fetch("/api/prof/task/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })
            .then((res) => {
                if (res.status === 200) {
                    toast.success("Task updated successfully", {
                        position: "top-right",
                        autoClose: 2500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                    router.push("/prof/tasks");
                } else {
                    toast.error("Something went wrong during the update", {
                        position: "top-right",
                        autoClose: 2500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });

                }
            })
    }


    return (
        <Container className="p-5" style={{ color: "white" }}>

            {isUser ? (
                <>
                    <h2>Update Task 🖋</h2>
                    <br />
                    <Card className="shadow-lg bg-dark mx-auto">
                        <Card.Body>
                            <Form onSubmit={updateTask}>
                                <Row>
                                    <Col>
                                        <Form.Label htmlFor="taskTitle">Task title 🔖</Form.Label>
                                        <Form.Control
                                            className="mb-3"
                                            type="text"
                                            id="taskTitle"
                                            value={title}
                                            onChange={changeTitle}
                                            required
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Deadline ⌛️</Form.Label>
                                            <Form.Control value={deadline} onChange={changeDeadline} id="deadline" type="datetime-local" placeholder="Enter deadline" required />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Label>Language 🈴</Form.Label>
                                        <Form.Select value={language} onChange={changeLanguage} id="language" className="mb-3" required>
                                            <option value="c">C</option>
                                            <option value="java">Java</option>
                                            <option value="python">Python</option>
                                            <option value="c++">C++</option>
                                            <option value="javascript">Javascript</option>
                                            <option value="rust">Rust</option>
                                        </Form.Select>
                                        <Form.Text className="text-muted">
                                            Please select the language again
                                        </Form.Text>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Test case 🧪⚗️</Form.Label>
                                    <Form.Control value={testCase} onChange={changeTestCase} id="testcase" as="textarea" aria-label="With textarea" required />
                                    <Form.Text className="text-muted">
                                        Insert a series of inputs and related outputs in "Test case solution".
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Test case solution 💡</Form.Label>
                                    <Form.Control value={solution} onChange={changeSolution} id="solution" as="textarea" aria-label="With textarea" required />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Assignment 🖋</Form.Label>
                                    <MDEditor
                                        className="mb-3"
                                        value={assignment}
                                        onChange={setAssignment}

                                    />
                                </Form.Group>

                                <Form.Label>Hint 🕯</Form.Label>

                                <MDEditor
                                    className="mb-3"
                                    value={hint}
                                    onChange={setHint}

                                />

                                <Button variant="primary" type="submit">
                                    Update
                                </Button>
                            </Form>

                        </Card.Body>

                    </Card>





                </>
            ) : (
                <>
                    <h1>Forbidden</h1>
                </>
            )}

        </Container>

    );
}


export default UpdatePage;