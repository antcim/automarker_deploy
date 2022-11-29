import { getLoginSession } from "../../../../lib/security/auth";
import { getProfCourseNumber } from "../../../../lib/models/user";

export default async function (req, res) {
    try {
        const session = await getLoginSession(req);

        if (!session) {
            res.status(401).json("Access denied: 401, please log in");
        } else {
            if (session.role === "PROF") {
                try {

                    const courses = await getProfCourseNumber(req.body.userId);

                    if (!courses) {
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
