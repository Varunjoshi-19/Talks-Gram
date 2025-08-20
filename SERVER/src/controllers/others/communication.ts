import { autoInjectable } from "tsyringe";
import { Request, Response } from "express";
import CommunicationService from "../../utils/others/communication"
import UserHelper from "../../utils/others/user"

@autoInjectable()
class CommunicationController {
    constructor(private commService: CommunicationService, private userHelper: UserHelper) { }


    fetchCommunicationId = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const commId = await this.commService.fetchCommunicationId(id);
            res.status(202).json({ commId });
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    };

    addCommId = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const newComm = await this.commService.addCommId(id);
            res.status(202).json({ newComm });
        } catch (error: any) {
            res.status(505).json({ error: error.message });
        }
    };
}

export default CommunicationController;
