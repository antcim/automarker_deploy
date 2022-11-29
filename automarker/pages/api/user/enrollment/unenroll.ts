import { getLoginSession } from "../../../../lib/security/auth";
import { unenrollCourse } from "../../../../lib/models/enrollment";

export default async function (req, res) {
    try {
        const session = await getLoginSession(req);

        if (!session) {
            res.status(401).json("Access denied: 401, please log in");
        } else {
            if (session.role === "USER") {

                if (!req.body.registrationId) {
                    res.status(400).json();
                } else {
                    try {

                        const unenrollment = await unenrollCourse(req.body.registrationId);

                        if (unenrollment) {
                            res.status(200).json();
                        } else {
                            res.status(400).json();
                        }

                    } catch (error) {
                        console.error(error);
                        res.status(404).json("Enrollment not found");
                    }
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
