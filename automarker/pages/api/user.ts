import { getLoginSession } from "../../lib/security/auth"
import { findUser } from "../../lib/models/user"

export default async function user(req, res) {
    try {
        const session = await getLoginSession(req);
        const user = (session && (await findUser(session))) ?? null;

        if (!session) {
            res.status(401).json("Access denied: 401, please log in");
        } else {
            res.status(200).json({ user })
        }


    } catch (error) {
        console.error(error);
        res.status(500).end("Authentication token is invalid, please log in");
    }
}
