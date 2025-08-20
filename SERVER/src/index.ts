import path from "path";

export const publicFolderPath = path.resolve(path.join(__dirname, "public"));
export const defaultImagePath = path.join(publicFolderPath, "default.jpg")
export const reelsUploadPath = path.join(publicFolderPath , "posts");

export const onlineUsers = new Map<string, string>();