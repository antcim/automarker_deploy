import { getLoginSession } from "../../../../lib/security/auth";
import { getTask } from "../../../../lib/models/task";

export default async function (req, res) {
    try {
        const session = await getLoginSession(req);

        if (!session) {
            res.status(401).json("Access denied: 401, please log in");
        } else {
            if (session.role === "USER") {
                try {

                    const task = await getTask(req.body.taskId);

                    if (!task) {
                        res.status(404).json(null);
                    } else {
                        res.status(200).json(task);
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
