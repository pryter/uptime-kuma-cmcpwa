const { MonitorType } = require("./monitor-type");
const Monitor = require("../model/monitor");
const { Notification } = require("../notification");
const { UP } = require("../../src/util");
const dayjs = require("dayjs");

class SummaryMonitorType extends MonitorType {
    name = "summary";

    /**
     * Run the monitoring check on the given monitor
     * @param {Monitor} monitor Monitor to check
     * @param {Heartbeat} heartbeat Monitor heartbeat to update
     * @param {UptimeKumaServer} server Uptime Kuma server
     * @returns {Promise<void>}
     */
    async check(monitor, heartbeat, server) {

        heartbeat.status = UP;
        const hr = dayjs().hour();

        const summaryTime = 16;

        if (!monitor.reNight) {
            if (hr !== summaryTime) {
                return;
            }else{
                monitor.reNight = true;
            }
        }

        if (hr === summaryTime) {
            return;
        }else{
            monitor.reNight = false;
        }

        const notificationList = await Monitor.getNotificationList(monitor);
        for (let noti of notificationList) {
            await Notification.send(JSON.parse(noti.config), `🤖 ${dayjs().format("DD/MM/YYYY")} Scheduled notification.
Monitoring service is up and running normally.`, null, { type: "summary" });
        }
    }
}

module.exports = {
    SummaryMonitorType,
};
