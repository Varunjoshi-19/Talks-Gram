import { io } from "socket.io-client";
import video1 from "../video/1.mp4";
import video2 from "../video/2.mp4";
import video3 from "../video/3.mp4";
import video4 from "../video/4.mp4";
import video5 from "../video/5.mp4";
import { MAIN_BACKEND_URL } from "./URL";


export const Reels = [


    {

        src: video3,
        autoPlay: false,


    },


    {

        src: video1,
        autoPlay: true,


    },


    {

        src: video2,
        autoPlay: false,


    },





    {

        src: video4,
        playOrPause: true,
        autoPlay: false,


    },

    {

        src: video5,
        playOrPause: true,
        autoPlay: false,


    },

];
 
export const BACKEND_URL = MAIN_BACKEND_URL;
export const socket = io(MAIN_BACKEND_URL, {
    transports: ["websocket"],
    withCredentials: true,

});

export interface ChattedUserInfo {

    chatId: string | any,
    userId: string,
    otherUserId: string,
    username: string,
    chat: string

}


 export  interface ProfileProps {

    _id: string | any,
    fullname: string,
    username: string,
    followers: number,
    following: number,
    bio: string
}

export type ShowFile = {
    extensionName: string,
    actualBlob: string,
}
 
export type InfoDataType = {
    chat?: string,
    username: string
    chatId: string,
    commId: string
    audioData? : AudioData | null;
    AdditionalInfoData?: BufferedDataType[];

}

export type AudioData = {

blobFile : Blob,
extension : string
}

export type AdditionalDataType = {
    _id?: string,
    contentType: string,

}

export interface Chat {
    _id?: string,
    userId: string | any,
    otherUserId: string | any,
    chatId: string | any;
    username: string;
    initateTime: string;
    chat?: string;
    temporaryAddData?: ShowFile[];
    AdditionalData?: any;
}

export type BufferedDataType = {

    file: any,
    extension: string,
}

