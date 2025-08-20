import { Request, RequestHandler, Response } from "express";
import { autoInjectable } from "tsyringe";
import RenderService from "../../utils/others/render";

@autoInjectable()
class RenderController {
    constructor(private renderService: RenderService) { }

    renderImage: RequestHandler = async (req: Request, res: Response) => {
        const { id } = req.params;

        const result: any = await this.renderService.getProfileImage(id);

        if (!result.success) {
            res.status(result.status).json({ error: result.message });
            return
        }

        res.contentType(result.contentType);
        res.status(200).send(result.data);
    };

    renderMessageItem: RequestHandler = async (req: Request, res: Response) => {
        const { id1, id2 } = req.params;

        const result: any = await this.renderService.fetchMessageItem(id1, id2);

        if (!result.success) {
            res.status(result.status).json({ error: result.message });
            return
        }

        res.contentType(result.contentType);
        res.status(result.status).send(result.data);
    };

    renderPostImage = async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await this.renderService.renderPostImage(id);

        if (!result.success) {
            res.status(result.status).json({ error: result.message });
            return
        }

        res.contentType(result.contentType!);
        res.send(result.data);
        return
    };

    handleRenderReel = async (req: Request, res: Response) => {
        const id = req.params.id?.trim();
        const result = await this.renderService.handleRenderReel(id);

        if (result.error) {
            res.status(result.status).json({ error: result.error });
            return
        }

        res.contentType(result.contentType!);
        res.send(result.data);

        return;
    };


    RenderStory = async (req: Request, res: Response) => {
        const id = req.params.id?.trim();
        const result = await this.renderService.handleRenderStory(id);

        if (result.error) {
            res.status(result.status).json({ error: result.error });
            return
        }

        res.contentType(result.contentType!);
        res.send(result.data);

        return;

    }




}

export default RenderController;
