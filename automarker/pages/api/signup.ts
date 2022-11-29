import { createUser } from "../../lib/models/user"

export default async function signup(req, res) {
    try {
        await createUser(req.body);
        res.status(200).send({ done: true });
    } catch (error) {
        if (error.code == "P2002") {
            error.message = "Email already used";
            res.status(500).end(error.message);
        } else {
            console.error(error.code);
            res.status(500).end(error.message);
        }

    }
}
