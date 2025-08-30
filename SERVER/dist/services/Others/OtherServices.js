"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
class CacheService {
    constructor() {
        this.notificationCache = new Map();
    }
    handleAddNotification(userData) {
        const { senderUserID, receiverUserID } = userData;
        if (!this.notificationCache.has(senderUserID)) {
            this.notificationCache.set(senderUserID, new Set());
        }
        this.notificationCache.get(senderUserID)?.add(receiverUserID);
        this.handleRemoveNotification(userData);
    }
    handleAlreadyNotified(userData) {
        const { senderUserID, receiverUserID } = userData;
        const senders = this.notificationCache?.get(senderUserID);
        return senders?.has(receiverUserID) || false;
    }
    handleRemoveNotification(userData) {
        const { senderUserID, receiverUserID } = userData;
        setTimeout(() => {
            const senders = this.notificationCache.get(senderUserID);
            senders?.delete(receiverUserID);
            if (senders?.size === 0) {
                this.notificationCache.delete(senderUserID);
            }
        }, 5000);
    }
}
exports.CacheService = CacheService;
