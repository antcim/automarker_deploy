import { getLoginSession } from "../../../../lib/security/auth";
import { getUserSubmissions } from "../../../../lib/models/submission";

export default async function (req, res) {
    try {
        const session = await getLoginSession(req);

        if (!session) {
            res.status(401).json("Access denied: 401, please log in");
        } else {
            if (session.role === "USER") {
                try {
                    const subms = await getUserSubmissions(req.body.userId);

                    if (!subms) {
                        res.status(404).json(null);
                    } else {
                        res.status(200).json(subms);
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
