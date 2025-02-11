import cron from "node-cron";
import axios from "axios";
import apiConfig from "../my-app/src/apiconfig/apiConfig.js";
import Camhistory from "./models/Camhistory.js";
import Campaign from "./models/Campaign.js";

console.log("Cron job started for sending scheduled emails.");

cron.schedule('* * * * *', async () => {
    try {
        console.log("Checking for scheduled emails...");
        const nowUTC = new Date();
        nowUTC.setSeconds(0, 0); // Round to the nearest minute
        const nextMinute = new Date(nowUTC);
        nextMinute.setMinutes(nextMinute.getMinutes() + 1);
        console.log("Checking for scheduled emails at:", nowUTC.toISOString());

        const camhistories = await Camhistory.find({
            status: "Scheduled On",
            scheduledTime: {
                $gte: nowUTC.toISOString(),
                $lt: nextMinute.toISOString()
            }
        });

        if (camhistories.length === 0) {
            console.log("No scheduled emails found.");
            return;
        }
        let sentEmails = [];
        let failedEmails = [];

        // Process emails for each scheduled campaign
        for (const camhistory of camhistories) {
            console.log(`Processing scheduled email for user: ${camhistory.user}`);

            if (!camhistory.groupId || camhistory.groupId === "no group") {
                console.log("No group found, sending emails directly.");

                // Update status to 'Pending' before sending
                await axios.put(`${apiConfig.baseURL}/api/stud/camhistory/${camhistory._id}`, {
                    status: "Pending",
                });


                let recipients = camhistory.recipients.split(",").map(email => email.trim());


                for (const email of recipients) {
                    const personalizedContent = camhistory.previewContent.map((item) => {
                        return item.content ? {
                            ...item,
                            content: item.content.replace(/\{?Email\}?/g, email)
                        } : item;
                    });

                    const emailData = {
                        recipientEmail: email,
                        subject: camhistory.subject,
                        body: JSON.stringify(personalizedContent),
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

                // Update campaign history with final status
                const finalStatus = failedEmails.length > 0 ? "Failed" : "Success";
                await axios.put(`${apiConfig.baseURL}/api/stud/camhistory/${camhistory._id}`, {
                    sendcount: sentEmails.length,
                    sentEmails: sentEmails,
                    failedEmails: failedEmails.length > 0 ? failedEmails : [],
                    failedcount: failedEmails.length,
                    status: finalStatus,
                });

                console.log(`Emails sent successfully for user: ${camhistory.user}`);
            }

            // If groupId is a string (e.g., "No id"), send only to failedEmails and return early
            if (!camhistory.groupId || camhistory.groupId === "No id") {
                console.log("No group found, sending emails directly.");

                // Update status to 'Pending' before resending
                await axios.put(`${apiConfig.baseURL}/api/stud/camhistory/${camhistory._id}`, {
                    status: "Pending",
                });


                for (const student of camhistory.exceldata) {
                    const personalizedContent = camhistory.previewContent.map((item) => {
                        if (!item.content) return item; // Skip if content is empty

                        let updatedContent = item.content;

                        // Ensure we're using the correct data structure
                        const studentData = student._doc || student; // Extract actual data


                        Object.entries(studentData).forEach(([key, value]) => {
                            const cleanKey = key.trim(); // Remove extra spaces if any
                            const cellValue = value != null ? String(value).trim() : "";

                            const placeholderRegex = new RegExp(`\\{${cleanKey}\\}`, "gi");
                            updatedContent = updatedContent.replace(placeholderRegex, cellValue);
                        });

                        return {
                            ...item,
                            content: updatedContent
                        };
                    });
                    const emailData = {
                        recipientEmail: student.Email,
                        subject: camhistory.subject,
                        body: JSON.stringify(personalizedContent),
                        bgColor: camhistory.bgColor,
                        previewtext: camhistory.previewtext,
                        userId: camhistory.user,
                        groupId: camhistory.groupname,
                        campaignId: camhistory._id,
                    };

                    try {
                        await axios.post(`${apiConfig.baseURL}/api/stud/sendbulkEmail`, emailData);
                        sentEmails.push(student.Email);
                    } catch (error) {
                        console.error(`Failed to send email to ${student.Email}:`, error);
                        failedEmails.push(student.Email);
                    }
                }

                // Update campaign history
                const finalStatus = failedEmails.length > 0 ? "Failed" : "Success";
                await axios.put(`${apiConfig.baseURL}/api/stud/camhistory/${camhistory._id}`, {
                    sendcount: sentEmails.length,
                    sentEmails: sentEmails,
                    failedEmails: failedEmails.length > 0 ? failedEmails : [],
                    failedcount: failedEmails.length,
                    status: finalStatus,
                });
                console.log(`Emails sent successfully for user: ${camhistory.user}`);
                return;
            }

            // If groupId exists, fetch students and follow existing logic
            if (camhistory.groupId) {
                console.log("Found group, sending emails through group.");

                const studentsResponse = await axios.get(`${apiConfig.baseURL}/api/stud/groups/${camhistory.groupId}/students`);
                const students = studentsResponse.data;
                // Update status to 'Pending' before resending
                await axios.put(`${apiConfig.baseURL}/api/stud/camhistory/${camhistory._id}`, {
                    status: "Pending",
                });

                for (const student of students) {
                    const personalizedContent = camhistory.previewContent.map((item) => {
                        const personalizedItem = {
                            ...item
                        };

                        if (item.content) {
                            Object.entries(student).forEach(([key, value]) => {
                                const placeholderRegex = new RegExp(`\\{?${key}\\}?`, "g");
                                const cellValue = value != null ? String(value).trim() : "";
                                personalizedItem.content = personalizedItem.content.replace(placeholderRegex, cellValue);
                            });
                        }
                        return personalizedItem;
                    });
                    const emailData = {
                        recipientEmail: student.Email,
                        subject: camhistory.subject,
                        body: JSON.stringify(personalizedContent),
                        bgColor: camhistory.bgColor,
                        previewtext: camhistory.previewtext,
                        userId: camhistory.user,
                        groupId: camhistory.groupname,
                        campaignId: camhistory._id,
                    };

                    try {
                        await axios.post(`${apiConfig.baseURL}/api/stud/sendbulkEmail`, emailData);
                        sentEmails.push(student.Email);
                    } catch (error) {
                        console.error(`Failed to send email to ${student.Email}:`, error);
                        failedEmails.push(student.Email);
                    }
                }

                // Update campaign history
                const finalStatus = failedEmails.length > 0 ? "Failed" : "Success";
                await axios.put(`${apiConfig.baseURL}/api/stud/camhistory/${camhistory._id}`, {
                    sendcount: sentEmails.length,
                    sentEmails: sentEmails,
                    failedEmails: failedEmails.length > 0 ? failedEmails : [],
                    failedcount: failedEmails.length,
                    status: finalStatus,
                });
                console.log(`Emails sent successfully for user: ${camhistory.user}`);
                return;
            }

        }
    } catch (error) {
        console.error("Error in cron job:", error);
    }
});