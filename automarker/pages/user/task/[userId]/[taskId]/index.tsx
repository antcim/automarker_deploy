import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Accordion, Button, Card, Col, ButtonGroup, FloatingLabel, Row, Nav, Tab, Form, Container } from "react-bootstrap";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import { useUser } from "../../../../../lib/hooks";
import styles from "../../../../../styles/Task.module.css";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import dynamic from "next/dynamic";

import AceEditor from "react-ace-editor";
import { toast } from "react-toastify";

const COMP_API = process.env.NEXT_PUBLIC_COMP_API;

const MySyntaxHighlighter = dynamic(import("../../../../../components/MySyntaxHighlighter"), { ssr: false })

const Task = () => {
    const user = useUser({ redirectTo: "/login" });
    const [isUser, setIsUser] = useState(false);
    const [assignment, setAssignment] = useState(null);
    const [hint, setHint] = useState(null);
    const [task, setTask] = useState(null);
    const [workspace, setWorkspace] = useState("");

    const router = useRouter();

    const { userId, taskId } = router.query;

    const [language, setLanguage] = useState(null);
    const [editor_text, setEditorText] = useState(null);
    const [output, setOutput] = useState(null);
    const [error, setError] = useState(null);

    const [editorLanguage, setEditorLanguage] = useState(null);

    const [consoleVisible, setConsoleVisible] = useState(false);

    function manage_console(flag) {
        if (flag == true)
            setConsoleVisible(true);
        else
            setConsoleVisible(!consoleVisible);
        console.log("STATE OF CONSOLE:" + consoleVisible);
    }

    function save_request() {
        const body = {
            userId: userId,
            taskId: taskId,
            mark: 0.0,
            workspace: editor_text,
            isSubmitted: false,
            submittedAt: Date.now().toString(),
        }

        fetch("/api/user/submission/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })
            .then((res) => {

                if (res.status === 200) {
                    console.log("TASK SAVED");
                    toast.success("Workspace saved successfully", {
                        position: "top-right",
                        autoClose: 2500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                } else if (res.status === 400) {
                    toast.warn("Cannot save an expired task", {
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

                    toast.error("Error saving workspace", {
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

            });
    }

    function submit_request() {
        const body = {
            userId: userId,
            taskId: taskId,
            mark: 0.0,
            workspace: editor_text,
            isSubmitted: true,
            submittedAt: Date.now().toString(),
        }

        fetch("/api/user/submission/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })
            .then((res) => {
                if (res.status === 200) {
                    console.log("TASK SUBMITTED");
                    toast.success("Workspace submitted successfully", {
                        position: "top-right",
                        autoClose: 2500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                } else if (res.status === 400) {
                    toast.warn("Cannot submit an expired task", {
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
                    toast.error("Error submitting workspace", {
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

            });
    }

    async function run_request() {

        const body = {
            language: language,
            code: editor_text,
        };

        try {
            fetch("http://localhost:8080/api", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            })
                .then((res) => res.json())
                .then((res) => {
                    //this prints to the console the output of the compilation fetched with the api
                    console.log(res.compiler_output);
                    setOutput(res.compiler_output);
                    setError(res.compiler_error);
                    manage_console(true);
                });
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (user) {
            if (user.role === "USER") {
                setIsUser(true);

                if (userId && taskId) {


                    const body = {
                        taskId: taskId,
                        userId: userId,
                    }

                    fetch("/api/user/task/getTask", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(body),
                    })
                        .then((res) => res.json())
                        .then((task) => {
                            setAssignment(task.assignment);
                            setHint(task.hint);
                            if (task.language === "c" || task.language === "c++") {
                                setEditorLanguage("c_cpp");

                            } else {
                                setEditorLanguage(task.language);
                            }
                            setLanguage(task.language);
                            setTask(task);

                            fetch("/api/user/submission/getUserTaskSubmission", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(body),
                            })
                                .then((res) => res.json())
                                .then((sub) => {
                                    if (sub) {
                                        setWorkspace(sub.workspace);
                                    } else {
                                        setWorkspace(task.placeholder);
                                    }
                                });

                        });

                }

            }
        }


    }, [user, userId, taskId]);

    function CustomToggle({ children, eventKey }) {
        const decoratedOnClick = useAccordionButton(eventKey, () =>
            console.log('totally custom!'),
        );

        return (
            <Button
                variant="dark"
                type="button"
                onClick={decoratedOnClick}
            >
                {children}
            </Button>
        );
    }

    return (


        <div className={styles.div}>
            {isUser
                ? (
                    <>
                        <Card className={styles.card}>
                            <Card.Body>
                                <Tab.Container defaultActiveKey="first">
                                    <Row>
                                        <Col className="tabs_column">
                                            <Nav variant="pills" className="flex-column">
                                                <Nav.Item>
                                                    <Nav.Link eventKey="first">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-text-fill" viewBox="0 0 16 16">
                                                            <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM5 4h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1zm-.5 2.5A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zM5 8h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1zm0 2h3a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1z" />
                                                        </svg> Task
                                                    </Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="second">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-earmark-code-fill" viewBox="0 0 16 16">
                                                            <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM6.646 7.646a.5.5 0 1 1 .708.708L5.707 10l1.647 1.646a.5.5 0 0 1-.708.708l-2-2a.5.5 0 0 1 0-.708l2-2zm2.708 0 2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L10.293 10 8.646 8.354a.5.5 0 1 1 .708-.708z" />
                                                        </svg> Editor
                                                    </Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="third">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lightbulb" viewBox="0 0 16 16">
                                                            <path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13a.5.5 0 0 1 0 1 .5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1 0-1 .5.5 0 0 1 0-1 .5.5 0 0 1-.46-.302l-.761-1.77a1.964 1.964 0 0 0-.453-.618A5.984 5.984 0 0 1 2 6zm6-5a5 5 0 0 0-3.479 8.592c.263.254.514.564.676.941L5.83 12h4.342l.632-1.467c.162-.377.413-.687.676-.941A5 5 0 0 0 8 1z" />
                                                        </svg> Hints
                                                    </Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="fourth">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard2-check-fill" viewBox="0 0 16 16">
                                                            <path d="M10 .5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5.5.5 0 0 1-.5.5.5.5 0 0 0-.5.5V2a.5.5 0 0 0 .5.5h5A.5.5 0 0 0 11 2v-.5a.5.5 0 0 0-.5-.5.5.5 0 0 1-.5-.5Z" />
                                                            <path d="M4.085 1H3.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1h-.585c.055.156.085.325.085.5V2a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 4 2v-.5c0-.175.03-.344.085-.5Zm6.769 6.854-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708.708Z" />
                                                        </svg> Tests
                                                    </Nav.Link>
                                                </Nav.Item>
                                            </Nav>
                                        </Col>
                                        <Col>
                                            <Tab.Content>
                                                <Tab.Pane eventKey="first">
                                                    <h1>{task && task.title}</h1>
                                                    <ReactMarkdown
                                                        children={assignment}
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
                                                </Tab.Pane>
                                                <Tab.Pane eventKey="second">
                                                    <Row>
                                                        <Col>
                                                            <span className="editor_language">
                                                                Language &lt;&nbsp;{language && language}&nbsp;&gt;
                                                            </span>
                                                        </Col>

                                                        <Col>
                                                            <ButtonGroup className="editor_buttons">
                                                                <Button onClick={save_request} variant="success">Save</Button>
                                                                <Button onClick={run_request} variant="primary">Run</Button>
                                                                <Button onClick={submit_request} variant="warning">Submit</Button>
                                                            </ButtonGroup>
                                                        </Col>
                                                    </Row>
                                                    {(editorLanguage && workspace) &&
                                                        <AceEditor
                                                            mode={editorLanguage}
                                                            theme="tomorrow_night"
                                                            style={{ height: '72vh', fontSize: "18px" }}
                                                            onChange={(e) => setEditorText(e)}
                                                            name="editor"
                                                            editorProps={{ $blockScrolling: true }}
                                                            setValue={workspace}

                                                        />
                                                    }

                                                </Tab.Pane>
                                                <Tab.Pane eventKey="third">
                                                    <h1>Hints</h1>
                                                    <ReactMarkdown
                                                        children={hint}
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
                                                </Tab.Pane>
                                                <Tab.Pane eventKey="fourth">
                                                    <h1>Test Cases</h1>
                                                </Tab.Pane>
                                            </Tab.Content>
                                        </Col>
                                    </Row>
                                </Tab.Container>
                            </Card.Body>
                            <Accordion className="sticky-bottom">
                                <Card className="bg-dark">
                                    <Card.Header>
                                        <Button onClick={manage_console} variant="secondary">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-terminal-fill" viewBox="0 0 16 16">
                                                <path d="M0 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3zm9.5 5.5h-3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zm-6.354-.354a.5.5 0 1 0 .708.708l2-2a.5.5 0 0 0 0-.708l-2-2a.5.5 0 1 0-.708.708L4.793 6.5 3.146 8.146z" />
                                            </svg> Console
                                        </Button>
                                    </Card.Header>
                                    {
                                        consoleVisible &&
                                        <Accordion>
                                            <Card.Body>
                                                {
                                                    output && <div className="editor_output">
                                                        <h4>{'>'} Output</h4>
                                                        <pre>{output}</pre>
                                                    </div>
                                                }

                                                {
                                                    error && <div className="editor_error">
                                                        <h4>{'>'} Error</h4>
                                                        <pre>{error}</pre>
                                                    </div>
                                                }
                                            </Card.Body>
                                        </Accordion>
                                    }
                                </Card>
                            </Accordion>
                        </Card>
                    </>
                )
                : (
                    <Container className="p-5">
                        <h1>Forbidden</h1>
                    </Container>
                )
            }
        </div>
    );
}

export default Task;