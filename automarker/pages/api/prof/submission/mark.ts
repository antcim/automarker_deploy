import { getLoginSession } from "../../../../lib/security/auth";
import { mark } from "../../../../lib/models/submission";

export default async function (req, res) {
    try {
        const session = await getLoginSession(req);

        if (!session) {
            res.status(401).json("Access denied: 401, please log in");
        } else {
            if (session.role === "PROF") {
                try {
                    const submission = await mark(req.body.userId, req.body.taskId, req.body.mark);

                    if (submission) {
                        res.status(200).json(null);
                    } 
                } catch (error) {
                    console.error(error);
                    res.status(400).json(null);
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
