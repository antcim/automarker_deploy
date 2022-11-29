import passport from "passport";
import nextConnect from "next-connect";
import { localStrategy } from "../../lib/security/password-local";
import { setLoginSession } from "../../lib/security/auth";
import { NextApiRequest, NextApiResponse } from "next/types";

const authenticate = (method, req, res) =>
    new Promise((resolve, reject) => {
        passport.authenticate(method, { session: false }, (error, token) => {
            if (error) {
                reject(error)
            } else {
                resolve(token)
            }
        })(req, res)
    });

passport.use(localStrategy)

export default nextConnect()
    .use(passport.initialize())
    .post(async (req: NextApiRequest, res: NextApiResponse) => {
        try {
            const user = await authenticate("local", req, res);
            // session is the payload to save in the token, it may contain basic info about the user
            const session = { ...user as {} };
            await setLoginSession(res, session);

            res.status(200).send( user );
        } catch (error) {
            console.error(error);
            res.status(401).send(error.message);
        }
    })
