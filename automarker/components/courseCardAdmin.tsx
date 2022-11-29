import { Button, Card, Dropdown } from "react-bootstrap";

const courseCardAdmin = (props) => {
    return (
        <Card style={{ width: '18rem' }} className="shadow-lg bg-dark mx-auto text-center">
            <Card.Img variant="top" src={"/placeholder/place1.jpg"} />
            <Card.Body className="d-flex flex-column">
                <Card.Title>{props.courseName}</Card.Title>
                <Card.Subtitle className="mb-3 text-muted"><i>Prof.</i> {props.prof}</Card.Subtitle>
                <Card.Text className="mb-3 text-muted">{props.academicYear}</Card.Text>
                <Card.Footer className="mt-auto">
                    <Button className="m-1" variant="success" onClick={props.clickOnUpdateCourse} id={"button" + props.courseId}>Modify</Button>
                    <Button className="m-1" variant="danger" onClick={props.clickOnDeleteCourse} id={"button" + props.courseId}>Delete</Button>
                </Card.Footer>
            </Card.Body>
        </Card>
    );

}

export default courseCardAdmin;