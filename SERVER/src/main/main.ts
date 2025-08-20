import dotenv from "dotenv";
import "reflect-metadata";
import { container } from "tsyringe";
import { Server } from "./server";
import { Config } from "../interfaces";


dotenv.config();

const config  : Config= {
    port: process.env.PORT! || 4000,
    mongoUrl: process.env.MONGODB_URI!,
};

container.register("Config", { useValue: config });


container.resolve(Server);

