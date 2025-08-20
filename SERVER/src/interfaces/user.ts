export interface UserData {
    id: string,
    username: string
    email: string
}

export interface MessageInfo {
    chatId: string,
    userId: string,
    otherUserId: string,
    senderUsername: string,
    receiverUsername: string,
    initateTime: string,
    chat?: string,
    seenStatus?: boolean,
    AdditionalData?: [{ data: Buffer, contentType: string }],
    sharedContent?: {
        type: string,
        postOwnerId: string,
        postOwnerName: string,
        refId: string,
        previewText?: string
        previewImage?: string

    }


}