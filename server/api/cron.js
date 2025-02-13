import axios from "axios";
import apiConfig from "../../my-app/src/apiconfig/apiConfig.js";
import Camhistory from "../models/Camhistory.js";
import mongoose from "mongoose";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({
            message: "Method Not Allowed"
        });
    }

    try {
        console.log("Running scheduled email check...");
        const nowUTC = new Date();
        nowUTC.setSeconds(0, 0);
        const nextMinute = new Date(nowUTC);
        nextMinute.setMinutes(nextMinute.getMinutes() + 1);

        const camhistories = await Camhistory.find({
            status: "Scheduled On",
            scheduledTime: {
                $gte: nowUTC.toISOString(),
                $lt: nextMinute.toISOString()
            }
        });

        if (camhistories.length === 0) {
            console.log("No scheduled emails found.");
            return res.status(200).json({
                message: "No scheduled emails found"
            });
        }

        let sentEmails = [];
        let failedEmails = [];

        for (const camhistory of camhistories) {
            console.log(`Processing email for user: ${camhistory.user}`);
            await axios.put(`${apiConfig.baseURL}/api/stud/camhistory/${camhistory._id}`, {
                status: "Pending"
            });

            let recipients = camhistory.recipients.split(",").map(email => email.trim());
            for (const email of recipients) {
                const emailData = {
                    recipientEmail: email,
                    subject: camhistory.subject,
                    body: JSON.stringify(camhistory.previewContent),
                    bgColor: camhistory.bgColor,
                    previewtext: camhistory.previewtext,
                    userId: camhistory.user,
                    groupId: camhistory.groupname,
                    campaignId: camhistory._id,
                };

                try {
                    await axios.post(`${apiConfig.baseURL}/api/stud/sendbulkEmail`, emailData);
                    sentEmails.push(email);
                } catch (error) {
                    console.error(`Failed to send email to ${email}:`, error);
                    failedEmails.push(email);
                }
            }

            const finalStatus = failedEmails.length > 0 ? "Failed" : "Success";
            await axios.put(`${apiConfig.baseURL}/api/stud/camhistory/${camhistory._id}`, {
                sendcount: sentEmails.length,
                sentEmails,
                failedEmails: failedEmails.length > 0 ? failedEmails : [],
                failedcount: failedEmails.length,
                status: finalStatus,
            });
        }

        res.status(200).json({
            message: "Emails processed successfully"
        });
    } catch (error) {
        console.error("Error in cron job:", error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}
