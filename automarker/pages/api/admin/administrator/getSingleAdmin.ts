import { getLoginSession } from "../../../../lib/security/auth";
import { findOneAdmin } from "../../../../lib/models/user";

export default async function (req, res) {
    try {
        const session = await getLoginSession(req);

        if (!session) {
            res.status(401).json("Access denied: 401, please log in");
        }
        else {
            if (session.role === "ADMIN") {
                try {
                    console.log("body: " + req.body.adminId);
                    const admin = await findOneAdmin(req.body.adminId);

                    if (!admin) {
                        res.status(401).status(null);
                    }
                    else {
                        res.status(200).json(admin);
                    }
                } catch (error) {
                    console.log(error);
                    res.status(500).end("Internal error while getting a single administrator");
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