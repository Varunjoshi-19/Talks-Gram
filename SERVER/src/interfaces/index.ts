// interfaces/index.ts
export interface Config {
  port: number | string;
  mongoUrl: string;
}


export interface notificationPayload {
  senderUserID: string,
  receiverUserID: string,
  receiverUsername: string
}


export interface ChattedUserPayload {
  chatId: string,
  userId: string,
  yourMessage : boolean,
  checkName : string,
  username: string,
  initateTime: string,
  seenStatus: string,
  recentChat: string,
  unseenCount: number
}