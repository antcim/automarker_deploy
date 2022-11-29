import { getLoginSession } from "../../../../lib/security/auth";
import { getProfOngoingTask } from "../../../../lib/models/task";

export default async function (req, res) {
    try {
        const session = await getLoginSession(req);

        if (!session) {
            res.status(401).json("Access denied: 401, please log in");
        } else {
            if (session.role === "PROF") {
                try {

                    const courses = await getProfOngoingTask(req.body.userId);

                    if (courses.length === 0) {
                        res.status(404).json(null);
                    } else {
                        res.status(200).json({courses});
                    }
                } catch (error) {
                    console.error(error);
                    res.status(500).end("Internal Error");
                }
            } else {
                res.status(401).json("Forbidden");
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).end("Authentication token is invalid, please log in");
    }
}
