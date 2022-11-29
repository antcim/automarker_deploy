import { Button, Card, Dropdown } from "react-bootstrap";

const AdminCardAdmin = (props) => {
    return (
        <Card style={{ width: '18rem' }} className="shadow-lg bg-dark mx-auto text-center">
            <Card.Img variant="top" src={"/placeholder/place1.jpg"} />
            <Card.Body className="d-flex flex-column">
                <Card.Text>{props.adminUsername}</Card.Text>

                <Card.Footer className="mt-auto">
                    <Button className="m-1" variant="success" onClick={props.clickOnUpdateAdmin} id={"button" + props.id}>Modify</Button>
                    <Button className="m-1" variant="danger" onClick={props.clickOnDeleteAdmin} id={"button" + props.id}>Delete</Button>
                </Card.Footer>
            </Card.Body>
        </Card>
    );
}

export default AdminCardAdmin;