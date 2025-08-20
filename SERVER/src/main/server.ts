// server.ts
import express, { Application } from "express";
import { autoInjectable, inject } from "tsyringe";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import http from "http";
import path from "path";
import helmet, { crossOriginResourcePolicy } from "helmet";
import { Config } from "../interfaces";
import DatabaseConnection from "../database/connections";
import MiddleWares from "../middlewares";
import Routers from "../routes/router";
import SocketConnection from "./socket";
import { publicFolderPath } from "..";


@autoInjectable()
export class Server {

    private app: Application;
    private server: http.Server;

    constructor(
        @inject("Config") private config: Config,
        private router: Routers,
        private middleware: MiddleWares,
        private socketConnection: SocketConnection,
        private dbConnection: DatabaseConnection
    ) {
        this.config = config;
        this.router = router;
        this.middleware = middleware;
        this.dbConnection = dbConnection;

        this.app = express();
        this.server = http.createServer(this.app);


        this.start();
    }

    async start() {

        this.setupMiddlewares();
        await this.connectToDatabase();
        this.setupRoutes();
        this.server.listen(this.config.port, () => {
            console.log(`Server running on port ${this.config.port}`);
        });
    }

    private setupMiddlewares() {

        this.app.use(cookieParser());
        this.app.use(helmet({
            crossOriginResourcePolicy: { policy: "cross-origin" },
            contentSecurityPolicy: false
        }));

        this.app.use(
            cors({
                origin: [process.env.FRONTEND_URL!,  "http://localhost:5173"],
                credentials: true,
                methods: ["GET", "POST", "DELETE" , "PUT" , "PATCH"],
                allowedHeaders: ["Content-Type", "Authorization"],
            })
        );

        this.app.use(express.json());
        this.app.use(bodyParser.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.static(publicFolderPath));

        // CORS middleware....


        this.socketConnection.establishConnection(this.server);

        // ORIGIN VALIDATE middleware....
        // this.app.use((req, res, next) =>
        //     this.middleware.checkTheOriginOfRequest(
        //         this.config.frontendURL,
        //         req,
        //         res,
        //         next
        //     )
        // );


    }

    private async connectToDatabase() {
        await this.dbConnection.mongodbDatabaseConnection();
    }

    private setupRoutes() {
        const mainRoutes = this.router.getRoutes();
        this.app.use("/", mainRoutes);
    }
}
