import { getLoginSession } from "../../../../../lib/security/auth";
import prisma from "../../../../../lib/prisma";

export default async function (req, res) {
    try {
        const session = await getLoginSession(req);

        if (!session) {
            res.status(401).json("Access denied: 401, please log in");
        } else {
            if (session.role === "USER") {
                try {
                    const subms = await prisma.submission.findFirst({
                        where: {
                            userId: req.body.userId,
                            taskId: req.body.taskId
                        },
                        include: {
                            task: true,
                        }
                    });

                    const task = await prisma.task.findUnique({
                        where: {
                            id: req.body.taskId
                        }
                    });

                    const data = {
                        userId: req.body.userId,
                        taskId: req.body.taskId,
                        mark: req.body.mark,
                        workspace: req.body.workspace,
                        isSubmitted: req.body.isSubmitted,
                        submittedAt: req.body.submittedAt,
                    }

                    if (parseInt(task.deadline) > Date.now()) {
                        if (!subms) {
                            // add submission to the database
                            await prisma.submission.create({ data: data });
                            res.status(200).json(null);
                        } else {
                            // finalize submission
                            //console.log(subms.task.deadline)
    
                            await prisma.submission.update({
                                where: {
                                    id: subms.id
                                },
                                data: data
                            });
                            res.status(200).json(null);
    
                        }

                    } else {
                        res.status(400).json(null);
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
