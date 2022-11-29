import { createProfessor } from "../../../../lib/models/user";
import { getLoginSession } from "../../../../lib/security/auth";

export default async function (req, res) {
    try {
        const session = await getLoginSession(req);

        if (!session) {
            res.status(401).json("Acces denied: 401, please log in");
        }
        else {
            if (session.role === "ADMIN") {
                try {
                    await createProfessor(req.body);
                    res.status(200).send({ done: true });
                } catch (error) {
                    console.log(error.code);
                    res.status(500).end(error.message);
                }
            } else {
                res.status(401).json("Forbidden");
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).end("Authentication token is invalid, please log in agai");
    }
}