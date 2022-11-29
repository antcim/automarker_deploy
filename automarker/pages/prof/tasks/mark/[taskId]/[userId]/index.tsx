import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Badge, Button, Card, Container, Form } from "react-bootstrap";
import { useUser } from "../../../../../../lib/hooks";
import AceEditor from "react-ace-editor";

import { toast } from "react-toastify";


const MarkPage = () => {
    const user = useUser({ redirectTo: "/login" });
    const router = useRouter();

    const [isUser, setIsUser] = useState(false);
    const [studName, setStudName] = useState("");
    const [taskTitle, setTaskTitle] = useState("");
    const [submittedAt, setSubmittedAt] = useState("");


    const [editorLanguage, setEditorLanguage] = useState(null)
    const [workspace, setWorkspace] = useState(null);
    const { userId, taskId } = router.query;

    useEffect(() => {
        if (user && userId && taskId) {
            if (user.role === "PROF") {
                setIsUser(true);

                const body = {
                    userId: userId,
                    taskId: taskId,
                }

                fetch("/api/user/submission/getUserTaskSubmission", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                })
                    .then((res) => res.json())
                    .then((sub) => {
                        if (sub) {

                            if (sub.task.language === "c" || sub.task.language === "c++") {
                                setEditorLanguage("c_cpp");
                            } else {
                                setEditorLanguage(sub.task.language);
                            }

                            setWorkspace(sub.workspace);
                            setStudName(sub.user.name + " " + sub.user.lastName);
                            setTaskTitle(sub.task.title);
                            setSubmittedAt(new Date(parseInt(sub.submittedAt)).toDateString());
                        }
                    });

            }
        }

    }, [user, userId, taskId]);


    const handleSubmit = (e) => {
        e.preventDefault();

        if (Number(e.currentTarget.mark.value)) {

            const body = {
                userId: userId,
                taskId: taskId,
                mark: e.currentTarget.mark.value
            }

            fetch("/api/prof/submission/mark", {
                method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
            })
            .then(res => {
                if(res.status === 200){
                    toast.success("Marked successfully", {
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
                    toast.error("Something went wrong. Try again, if the error persists contact the system administrator", {
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
        } else {
            toast.error("Not a number, please type a numeric value", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }


    }

    return (
        <Container className="p-5 " style={{ color: "white" }}>

            {isUser ? (
                <>
                    <Card className="shadow-lg bg-dark mb-3 mx-auto">
                        <Card.Body>
                            <div className="mb-3">
                                <h2>{taskTitle && taskTitle}</h2>
                                <p>By <i>{studName && studName}</i></p>
                                <p>Submitted At: <i>{submittedAt && submittedAt}</i></p>
                            </div>
                            <h5>Code:</h5>
                            {(editorLanguage && workspace) &&

                                <AceEditor
                                    mode={editorLanguage}
                                    theme="tomorrow_night"
                                    style={{ height: '72vh', fontSize: "18px" }}
                                    name="editor"
                                    editorProps={{ $blockScrolling: true }}
                                    setValue={workspace}
                                    setReadOnly="true"
                                />
                            }
                            <br />
                            <Form onSubmit={handleSubmit}>
                                <Form.Group>
                                    <Form.Label>Mark:</Form.Label>
                                    <Form.Control id="mark" name="mark" type="text" placeholder="Type a mark" required />
                                    <Form.Text className="text-muted">Type a grade according to your scale.</Form.Text>
                                </Form.Group>

                                <div className="d-grid gap-2 d-md-flex justify-content-center">
                                    <Button variant="danger" type="submit">
                                        Mark
                                    </Button>
                                </div>
                            </Form>


                        </Card.Body>
                    </Card>

                </>
            )
                : (<h1>Forbidden</h1>)
            }

        </Container >
    );
}


export default MarkPage;