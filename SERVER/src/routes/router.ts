import { Router } from "express";
import { autoInjectable, inject } from "tsyringe";
import UserRoutes from "../routes/protected-routes/userRoute";
import PostRouter from "./protected-routes/postRoute";
import { ChatRoutes } from "./protected-routes/chatRoute";
import ReelsRoutes from "./protected-routes/reelRoute";


@autoInjectable()
class Routers {
  private router: Router;

  constructor(private userRoutes: UserRoutes,
    private postRoutes: PostRouter,
    private chatRoutes: ChatRoutes,
    private reelRoutes : ReelsRoutes
  ) {

    this.router = Router();
  }

  getRoutes(): Router {
    this.router.get("/api", (req, res) => {
      console.log("api route");
      res.send({ message: "api router" });
    });

    this.router.use("/accounts", this.userRoutes.getRoutes());
    this.router.use("/uploadPost", this.postRoutes.getRoutes());
    this.router.use("/Personal-chat", this.chatRoutes.getRoutes());
    this.router.use("/uploadReel" , this.reelRoutes.getRoutes());


    return this.router;
  }
}

export default Routers;
