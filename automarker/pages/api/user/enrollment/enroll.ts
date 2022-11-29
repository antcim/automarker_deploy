import { getLoginSession } from "../../../../lib/security/auth";
import { enrollCourse, findEnrollment } from "../../../../lib/models/enrollment";

export default async function (req, res) {
    try {
        const session = await getLoginSession(req);

        if (!session) {
            res.status(401).json("Access denied: 401, please log in");
        } else {
            if (session.role === "USER") {

                if (!req.body.userId && !req.body.courseId) {
                    res.status(400).json();
                } else {

                    try {
                        const isPresent = await findEnrollment(req.body.userId, req.body.courseId);

                        if (!isPresent) {
                            const enrollment = await enrollCourse(req.body.userId, req.body.courseId);

                            if (enrollment) {
                                res.status(200).json();
                            } else {
                                res.status(400).json();
                            }
                        } else {
                            res.status(400).json({ message: "Enrollment already present" });
                        }

                    } catch (error) {
                        console.error(error);
                        res.status(500).end("Internal Error");
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
