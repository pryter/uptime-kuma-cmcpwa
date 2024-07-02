const NotificationProvider = require("./notification-provider");
const axios = require("axios");
const { setting } = require("../util-server");
const { getMonitorRelativeURL, UP, DOWN } = require("../../src/util");
const webpush = require("web-push");
const admin = require("firebase-admin");
const { initFS } = require("../utils/firebase");

class TUCMCApp extends NotificationProvider {
    name = "TUCMCApp";

    /**
     * @inheritdoc
     */
    async send(notification, msg, monitorJSON = null, heartbeatJSON = null) {
        const okMsg = "Sent Successfully.";

        try {
            let textMsg = "Unnamed Notification";

            if (heartbeatJSON && heartbeatJSON.status === UP) {
                textMsg = "✅ Application is back online";
            } else if (heartbeatJSON && heartbeatJSON.status === DOWN) {
                textMsg = "🔴 Application went down";
            }

            if (heartbeatJSON.type === "summary") {
                textMsg = "🗓️ Daily Summary Notification";
            }

            const baseURL = await setting("primaryBaseURL");
            if (baseURL && monitorJSON) {
                textMsg += ` >> ${baseURL + getMonitorRelativeURL(monitorJSON.id)}`;
            }
            webpush.setVapidDetails(
                "https://dev-app.tucm.cc/",
                process.env.VAPID_PUBLIC_KEY,
                process.env.VAPID_PRIVATE_KEY
            );


            const subQuery = await initFS().collectionGroup("clients").where("eid", "==", notification.enrollmentId).get();

            if (subQuery.empty) {
                throw "Invalid enrollmentId";
            }

            const subDoc = subQuery.docs[0];
            const subscription = subDoc.get("webPush").subscription;
            if (!subscription) {
                throw "Invalid subscription database";
            }

            const pushPayload = JSON.stringify({
                title: textMsg,
                body: msg,
                data: {
                    url: "https://dev-app.tucm.cc/notification"
                }
            });
            webpush.sendNotification(subscription, pushPayload);

            return okMsg;
        } catch (error) {
            console.log(error);
            this.throwGeneralAxiosError(error);
        }

    }
}

module.exports = TUCMCApp;
