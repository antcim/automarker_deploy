import { getLoginSession } from "../../../../lib/security/auth";
import { deleteProfessor } from "../../../../lib/models/user";

export default async function (req, res) {
    try {
        const session = await getLoginSession(req);

        if (!session) {
            res.status(401).json("Access denied: 401, please log in");
        }
        else {
            if (session.role === "ADMIN") {
                try {
                    const del = await deleteProfessor(req.body.id);

                    if (!del) {
                        res.status(404).json();
                    }
                    else {
                        res.status(200).json({ del });
                    }
                } catch (error) {
                    console.log(error);
                    res.status(500).ens("Internal error on delete professor");
                }
            } else {
                res.status(401).json("Forbidden");
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).end("Authentication token is invalid, please log in again");
    }
}