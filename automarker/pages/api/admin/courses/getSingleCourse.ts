import { getLoginSession } from "../../../../lib/security/auth";
import { getSingleCourse } from "../../../../lib/models/course";

export default async function (req, res) {
    try {
        const session = await getLoginSession(req);

        if (!session) {
            res.status(401).json("Access denied: 401, please log in");
        }
        else {
            if (session.role === "ADMIN") {
                try {
                    console.log(req.body.courseId);

                    const c = await getSingleCourse(req.body.courseId);
                    if (!c) {
                        res.status(404).json();
                    }
                    else {
                        res.status(200).json(c);
                    }
                } catch (error) {
                    console.log("Errore : " + error);
                    res.status(500).end("Internal error while getting a single course");
                }
            } else {
                res.status(401).json("Forbidden");
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).end("Authentication token is invalid, plesa log in again");
    }
}