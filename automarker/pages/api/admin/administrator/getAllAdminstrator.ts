import { getLoginSession } from "../../../../lib/security/auth";
import { getAllAdministrator } from "../../../../lib/models/user";

export default async function (req, res) {
    try {
        const session = await getLoginSession(req);

        if (!session) {
            res.status(401).json("Access denied: 401, please log in");
        }
        else {
            if (session.role === "ADMIN") {
                try {
                    const admins = await getAllAdministrator();

                    if (admins.length == 0) {
                        res.status(401).stattus(null);
                    }
                    else {
                        res.status(200).json({ admins });
                    }
                } catch (error) {
                    console.log(error);
                    res.status(500).json({ message: "Internal server error while finding all administrator" });
                }
            } else {
                res.status(401).json("Forbidden");
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).end("Authentication token not valid, please log in again");
    }
}