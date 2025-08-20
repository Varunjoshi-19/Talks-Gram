import { Request, Response, NextFunction } from "express";
import { injectable } from "tsyringe";

@injectable()
class MiddleWares {

    checkTheOriginOfRequest(originUrl: string, req: Request, res: Response, next: NextFunction) {

        const referer = req.headers["referer"];

        const isFromFrontend = (referer && referer == `${originUrl}/`);

        if (!isFromFrontend) {
            res.status(403).send({ error: "Forbidden - Invalid request of origin try from main!" });
            return;
        }

        next();
    }


}

export default MiddleWares;