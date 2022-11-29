import React, { useEffect } from "react";
import { Button, Card, Container, Form, InputGroup, Row, Col } from "react-bootstrap";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import katex from "katex";
import "katex/dist/katex.css";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useUser } from "../../../../lib/hooks";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

import AceEditor from "react-ace-editor";

const MDEditor = dynamic(
    () => import("@uiw/react-md-editor").then((mod) => mod.default),
    { ssr: false }
);


const newTask = () => {
    const [assignment, setAssignment] = useState("Type here the **assignment**");
    const [hint, setHint] = useState("Type here the **hint**");

    const [editorText, setEditorText] = useState("");

    const user = useUser({ redirectTo: "/login" });

    const router = useRouter();

    const [menu, setMenu] = useState(null);
    const [isUser, setIsUser] = useState(false);


    useEffect(() => {
        if (user) {
            if (user.role === "PROF") {
                setIsUser(true);
                //cerco i corsi del prof
                const body = {
                    userId: user.id,
                }

                fetch("/api/prof/course/getProfCourse", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                })
                    .then((res) => res.json())
                    .then((courses) => {
                        let menu = [];
                        if (courses) {
                            for (let i = 0; i < courses.length; i++) {
                                menu.push(
                                    <option value={courses[i].id}>{courses[i].name}</option>
                                )

                            }
                        }
                        setMenu(menu);
                    })
            }
        }
    }, [user]);


    const createTask = async (e) => {
        e.preventDefault();



        const body = {
            courseId: e.currentTarget.courseId.value,
            title: e.currentTarget.taskTitle.value,
            assignment: assignment,
            deadline: (Date.parse(e.currentTarget.deadline.value)).toString(),
            testCase: e.currentTarget.testcase.value,
            hint: hint,
            solution: e.currentTarget.solution.value,
            createdAt: (Date.now()).toString(),
            language: e.currentTarget.language.value,
            placeholder: editorText,
        }

        fetch("/api/prof/task/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })
            .then((res) => {
                console.log(res);
                if (res.status === 200) {
                    toast.success("Task created successfully", {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                    router.push("/prof/profile");
                }
            });


    }

    return (

        <Container className="p-5" style={{ color: "white" }}>

            {isUser ? (
                <>
                    <h1 className="mb-3">Create new task 🚀</h1>

                    <Card className="shadow-lg bg-dark mx-auto">
                        <Card.Body>
                            <Form onSubmit={createTask}>
                                <Row>
                                    <Col>
                                        <Form.Label>Course 📚</Form.Label>
                                        <Form.Select className="mb-3" id="courseId" required>
                                            {menu && menu}
                                        </Form.Select>
                                    </Col>
                                    <Col>
                                        <Form.Label htmlFor="taskTitle">Task title 🔖</Form.Label>
                                        <Form.Control
                                            className="mb-3"
                                            type="text"
                                            id="taskTitle"
                                            required

                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Deadline ⌛️</Form.Label>
                                            <Form.Control id="deadline" type="datetime-local" placeholder="Enter deadline" required />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Label>Language 🈴</Form.Label>
                                        <Form.Select id="language" className="mb-3" required>
                                            <option value="c">C</option>
                                            <option value="java">Java</option>
                                            <option value="python">Python</option>
                                            <option value="c++">C++</option>
                                            <option value="javascript">Javascript</option>
                                            <option value="rust">Rust</option>
                                        </Form.Select>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Test case 🧪⚗️</Form.Label>
                                    <Form.Control id="testcase" as="textarea" aria-label="With textarea" required />
                                    <Form.Text className="text-muted">
                                        Insert a series of inputs and related outputs in "Test case solution".
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Test case solution 💡</Form.Label>
                                    <Form.Control id="solution" as="textarea" aria-label="With textarea" required />
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

                                <Form.Group className="mb-3">
                                    <Form.Label>Placeholder</Form.Label>
                                    
                                    <Form.Text className="text-muted">
                                        <p>Type function signatures here, or the starting code for the student.</p>
                                    </Form.Text>

                                    <AceEditor
                                        mode="javascript"
                                        theme="tomorrow_night"
                                        style={{ height: '20vh', fontSize: "18px" }}
                                        onChange={(e) => setEditorText(e)}
                                        name="editor"
                                        editorProps={{ $blockScrolling: true }}
                                        setValue="//Type here"

                                    />

                                </Form.Group>

                                <Button variant="primary" type="submit">
                                    Create
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

export default newTask;