import { getLoginSession } from "../../../../lib/security/auth";
import { getAllProfessor } from "../../../../lib/models/user";

export default async function (req, res) {
    try {
        const session = await getLoginSession(req);

        if (!session) {
            res.status(401).json("Accesss denied: 401, please log in");
        }
        else {
            if (session.role === "ADMIN") {
                try {
                    const professors = await getAllProfessor();

                    if (professors.length == 0) {
                        res.status(401).status(null);
                    }
                    else {
                        res.status(200).json({ professors });
                    }
                } catch (error) {
                    console.error(error);
                    res.status(500).json({ messsage: "Internal error" });
                }
            } else {
                res.status(401).json("Forbidden");
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).end("Authentication token not valid, please log in again");
    }
}