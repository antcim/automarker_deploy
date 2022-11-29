import { getLoginSession } from "../../../../lib/security/auth";
import { modifyCourse } from "../../../../lib/models/course";

export default async function (req, res) {
    try {
        const session = await getLoginSession(req);

        if (!session) {
            res.status(401).json("Access denied: 401, please log in");
        }
        else {
            if (session.role === "ADMIN") {
                try {
                    const up = await modifyCourse(req.body.courseId, req.body.userId, req.body.name, req.body.academicYear);

                    if (!up) {
                        res.status(404).json();
                    }
                    else {
                        res.status(200).json({ up });
                    }
                } catch (error) {
                    console.log(error);
                    res.status(500).end("Internal error");
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