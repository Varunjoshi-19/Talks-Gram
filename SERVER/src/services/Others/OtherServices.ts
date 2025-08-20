import { notificationPayload } from "../../interfaces";


export class CacheService {

    private notificationCache: Map<string, Set<string>>;
    constructor() {
        this.notificationCache = new Map();
    }

    handleAddNotification(userData: notificationPayload) {
        const { senderUserID, receiverUserID }: notificationPayload = userData;
        if (!this.notificationCache.has(senderUserID)) {
            this.notificationCache.set(senderUserID, new Set());
        }

        this.notificationCache.get(senderUserID)?.add(receiverUserID);
        this.handleRemoveNotification(userData);
    }

    handleAlreadyNotified(userData: notificationPayload): boolean {
        const { senderUserID, receiverUserID }: notificationPayload = userData;
        const senders = this.notificationCache?.get(senderUserID);
        return senders?.has(receiverUserID) || false;

    }



    handleRemoveNotification(userData: notificationPayload) {
        const { senderUserID, receiverUserID }: notificationPayload = userData;

        setTimeout(() => {
            const senders = this.notificationCache.get(senderUserID);
            senders?.delete(receiverUserID);
            if (senders?.size === 0) {
                this.notificationCache.delete(senderUserID);
            }


        }, 5000);
    }


}