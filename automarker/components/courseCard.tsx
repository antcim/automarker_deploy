import { Button, Card, Dropdown } from "react-bootstrap";

const courseCard = (props) => {
    return (
        <Card style={{ cursor: "pointer", width: '18rem' }} className="shadow-lg bg-dark mx-auto text-center">

            <div onClick={props.onClick} id={props.courseId}>
                <Card.Img variant="top" src={"/placeholder/place1.jpg"} />
            </div>

            <Card.Body className="d-flex flex-column">
                <div onClick={props.onClick} id={props.courseId}>
                    <Card.Title>{props.courseName}</Card.Title>
                    <Card.Subtitle className="mb-3 text-muted"><i>Prof.</i> {props.prof}</Card.Subtitle>
                    <Card.Text className="mb-3 text-muted">{props.academicYear}</Card.Text>
                </div>
                <Card.Footer className="mt-auto">
                    {props.isEnrolled
                        ? (<Card.Text><i>Enrolled on</i> {props.date}</Card.Text>)
                        : (<Button onClick={props.onEnrollClick} id={"button" + props.courseId}>Enroll</Button>)
                    }

                    {props.isEnrolled
                        && (
                            <Dropdown>
                                <Dropdown.Toggle variant="link" />
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={props.clickOnUnenroll}>Unenroll</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        )
                    }
                </Card.Footer>
            </Card.Body>
        </Card>
    );
}

export default courseCard;
