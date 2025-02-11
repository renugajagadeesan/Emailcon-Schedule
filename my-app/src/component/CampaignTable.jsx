import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CampaignTable.css";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiConfig from "../apiconfig/apiConfig";

function CampaignTable() {
  const [campaigns, setCampaigns] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [failedEmails, setFailedEmails] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  // const excelstudent = JSON.parse(localStorage.getItem("excelstudent"));
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTime, setNewTime] = useState("");

  // Store old scheduled times separately
// const [oldScheduledTimes, setOldScheduledTimes] = useState({});


  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!user) {
        navigate("/");
        return;
      }

      try {
        const res = await axios.get(`${apiConfig.baseURL}/api/stud/campaigns/${user.id}`);
        setCampaigns(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch campaigns");
      }
    };
    fetchCampaigns();
  }, [user, navigate]);

  const handleBackCampaign = () => {
    navigate("/home");
  };

  const handleViewFailedEmails = (emails) => {
    setFailedEmails(emails);
    setShowModal(true);
  };

  
  const handleSaveTime = async (campaignId) => {
  if (!newTime) {
    toast.error("Please select a valid time");
    return;
  }
console.log("Scheduled time being sent:", new Date(newTime).toISOString());

  try {
    await axios.put(`${apiConfig.baseURL}/api/stud/camhistory/${campaignId}`, {
      scheduledTime: new Date(newTime).toISOString(),
    });

    toast.success("Scheduled time updated successfully!");
    setIsModalOpen(false); // Close modal after update



  } catch (error) {
    console.error("Error updating scheduled time:", error);
    toast.error("Failed to update scheduled time");
  }
};


  const handleTimeChange = (e) => {
    setNewTime(e.target.value);
  };

const handleToggle = async (e, campaignId) => {
  const isChecked = e.target.checked; // Get toggle state
 
  try {
    const newStatus = isChecked ? "Scheduled On" : "Scheduled Off"

    // Update status and scheduled time in DB
    await axios.put(`${apiConfig.baseURL}/api/stud/camhistory/${campaignId}`, {
      status: newStatus,
    });

  } catch (error) {
    console.error("Error updating campaign status:", error);
  }
};

  const handleResend = async (campaignId) => {
  try {
   
    setIsProcessing(true);

    // Fetch campaign details
    const response = await axios.get(`${apiConfig.baseURL}/api/stud/getcamhistory/${campaignId}`);
    const campaign = response.data;
    console.log("Fetched campaign data:", campaign);

    if (!campaign || !campaign.failedEmails || campaign.failedEmails.length === 0) {
      toast.warning("No failed emails to resend.");
      return;
    }

    let sentEmails = [];
    let failedEmails = [];

    // If groupId is a string (e.g., "no group"), send only to failedEmails and return early
    if (!campaign.groupId || campaign.groupId === "no group") {
      console.log("No group found, sending emails directly.");
      // Update status to 'Pending' before resending
    await axios.put(`${apiConfig.baseURL}/api/stud/camhistory/${campaignId}`, {
      status: "Pending",
    });

    for (const email of campaign.failedEmails) {
      const personalizedContent = campaign.previewContent.map((item) => {
        const personalizedItem = { ...item };

        if (item.content) {
          const placeholderRegex = new RegExp(`\\{?Email\\}?`, "g");
          personalizedItem.content = personalizedItem.content.replace(placeholderRegex, email);
        }
        return personalizedItem;
      });

      const emailData = {
        recipientEmail: email,
        subject: campaign.subject,
        body: JSON.stringify(personalizedContent),
        bgColor: campaign.bgColor,
        previewtext: campaign.previewtext,
        userId: campaign.user,
        groupId: campaign.groupname,
        campaignId: campaignId,
      };

        try {
          await axios.post(`${apiConfig.baseURL}/api/stud/sendbulkEmail`, emailData);
          sentEmails.push(email);
        } catch (error) {
          console.error(`Failed to send email to ${email}:`, error);
          failedEmails.push(email);
        }
      }

      // Update campaign history
      const finalStatus = failedEmails.length > 0 ? "Failed" : "Success";
      await axios.put(`${apiConfig.baseURL}/api/stud/camhistory/${campaignId}`, {
        sendcount: Number(campaign.sendcount) + sentEmails.length,
        sentEmails: [...campaign.sentEmails, ...sentEmails],
        failedEmails: failedEmails.length > 0 ? [...failedEmails] : 0,
        failedcount: failedEmails.length > 0 ? failedEmails.length : 0,
        status: finalStatus,
      });

      toast.success("Emails resent successfully!");
      return;
    }

    // If groupId is a string (e.g., "No id"), send only to failedEmails and return early
    if (!campaign.groupId || campaign.groupId === "No id") {
      console.log("No group found, sending emails directly.");

    // Update status to 'Pending' before resending
    await axios.put(`${apiConfig.baseURL}/api/stud/camhistory/${campaignId}`, {
      status: "Pending",
    });

    for (const email of campaign.failedEmails) {
      // Find the corresponding student
      const student = campaign.exceldata.find((s) => s.Email === email);
      if (!student) {
        console.warn(`No matching student found for email: ${email}`);
        failedEmails.push(email);
        continue;
      }

      // Personalize email content with student details
      const personalizedContent = campaign.previewContent.map((item) => {
        const personalizedItem = { ...item };

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
        recipientEmail: email,
        subject: campaign.subject,
        body: JSON.stringify(personalizedContent),
        bgColor: campaign.bgColor,
        previewtext: campaign.previewtext,
        userId: campaign.user,
        groupId: campaign.groupname,
        campaignId: campaignId,
      };

        try {
          await axios.post(`${apiConfig.baseURL}/api/stud/sendbulkEmail`, emailData);
          sentEmails.push(email);
        } catch (error) {
          console.error(`Failed to send email to ${email}:`, error);
          failedEmails.push(email);
        }
      }

      // Update campaign history
      const finalStatus = failedEmails.length > 0 ? "Failed" : "Success";
      await axios.put(`${apiConfig.baseURL}/api/stud/camhistory/${campaignId}`, {
        sendcount: Number(campaign.sendcount) + sentEmails.length,
        sentEmails: [...campaign.sentEmails, ...sentEmails],
        failedEmails: failedEmails.length > 0 ? [...failedEmails] : 0,
        failedcount: failedEmails.length > 0 ? failedEmails.length : 0,
        status: finalStatus,
      });

      toast.success("Emails resent successfully!");
      return;
    }

    // If groupId exists, fetch students and follow existing logic
    const studentsResponse = await axios.get(`${apiConfig.baseURL}/api/stud/groups/${campaign.groupId}/students`);
    const students = studentsResponse.data;

    // Update status to 'Pending' before resending
    await axios.put(`${apiConfig.baseURL}/api/stud/camhistory/${campaignId}`, {
      status: "Pending",
    });

    for (const email of campaign.failedEmails) {
      // Find the corresponding student
      const student = students.find((s) => s.Email === email);
      if (!student) {
        console.warn(`No matching student found for email: ${email}`);
        failedEmails.push(email);
        continue;
      }

      // Personalize email content with student details
      const personalizedContent = campaign.previewContent.map((item) => {
        const personalizedItem = { ...item };

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
        recipientEmail: email,
        subject: campaign.subject,
        body: JSON.stringify(personalizedContent),
        bgColor: campaign.bgColor,
        previewtext: campaign.previewtext,
        userId: campaign.user,
        groupId: campaign.groupname,
        campaignId: campaignId,
      };

      try {
        await axios.post(`${apiConfig.baseURL}/api/stud/sendbulkEmail`, emailData);
        sentEmails.push(email);
      } catch (error) {
        console.error(`Failed to send email to ${email}:`, error);
        failedEmails.push(email);
      }
    }

    // Update campaign history
    const finalStatus = failedEmails.length > 0 ? "Failed" : "Success";
    await axios.put(`${apiConfig.baseURL}/api/stud/camhistory/${campaignId}`, {
      sendcount: Number(campaign.sendcount) + sentEmails.length,
      sentEmails: [...campaign.sentEmails, ...sentEmails],
      failedEmails: failedEmails.length > 0 ? [...failedEmails] : 0,
      failedcount: failedEmails.length > 0 ? failedEmails.length : 0,
      status: finalStatus,
    });

    toast.success("Emails resent successfully!");
  } catch (error) {
    console.error("Error resending emails:", error);
    toast.error("Failed to resend emails.");
  } finally {
    setIsProcessing(false);
  }
};


  return (
    <div className="admin-dashboard-page">
      <div className="admin-nav">
        <h2 className="admin-dashboard-header">Campaign History</h2>
        <button onClick={handleBackCampaign} className="admin-nav-button">
          <span className="admin-nav-icons">
            <FaArrowLeft />
          </span>{" "}
          <span className="nav-names">Home</span>
        </button>
      </div>

      <table className="admin-dashboard-table">
        <thead>
          <tr>
            <th>Send Date</th>
            <th>Campaign Name</th>
            <th>Group Name</th>
            <th>Total Count</th>
            <th>Send Count</th>
            <th>Failed Count</th>
            <th>Scheduled Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <tr key={campaign._id}>
                <td>{campaign.senddate}</td>
                <td>{campaign.campaignname}</td>
                <td>{campaign.groupname}</td>
                <td>{campaign.totalcount}</td>
                <td>{campaign.sendcount}</td>
                <td>
                  {campaign.failedcount > 0 ? (
                    <button
                      className="view-btn"
                      onClick={() => handleViewFailedEmails(campaign.failedEmails)}
                    >
                      View
                    </button>
                  ) : (
                    campaign.failedcount
                  )}
                </td>
  <>
      {/* Click on time to open modal */}
      <td
        title="Edit"
        style={{ cursor: "pointer", textDecoration: "underline" }}
        onClick={(e) => {
          e.stopPropagation(); // Prevents immediate closing
          setIsModalOpen(true);
        }}
      >
        {new Date(campaign.scheduledTime).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
      </td>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-schedule" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content-schedule" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Scheduled Time</h3>
            <input
              type="datetime-local"
              value={newTime}
              onChange={handleTimeChange}
            />
            <div className="modal-actions-schedule">
              <button onClick={()=>handleSaveTime(campaign._id)}>Save</button>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
     <td
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: campaign.status === "Success" || campaign.status === "Failed" ? "center" : "flex-start",
    fontWeight: "bold",
    color: campaign.status === "Success" ? "green" : campaign.status === "Failed" ? "red" : "#2f327d",
  }}
>
  {campaign.status === "Scheduled On" || campaign.status === "Scheduled Off" ? (
    <>
      <span>{campaign.status}</span>
      <label className="toggle-switch" style={{ marginLeft: "15px" }}>
        <input
          type="checkbox"
          checked={campaign.status === "Scheduled On"}
          onChange={(e) => handleToggle(e, campaign._id)}
        />
        <span className="slider"></span>
      </label>
    </>
  ) : (
    campaign.status // Display status alone for Success/Failed
  )}

  {campaign.status === "Failed" && (
    <button
      className="resend-btn"
      onClick={() => handleResend(campaign._id)}
      disabled={isProcessing}
      style={{ marginLeft: "10px" }}
    >
      {isProcessing ? "Processing..." : "Resend"}
    </button>
  )}
</td>


              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No Campaign History
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <ToastContainer
        className="custom-toast"
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={true}
        closeOnClick={false}
        closeButton={false}
        pauseOnHover={true}
        draggable={true}
        theme="light"
      />

      {/* Modal for Failed Emails */}
      {showModal && (
        <div className="modal-overlay-fail">
          <div className="modal-content-fail">
            <h3>Failed Emails</h3>
            
            <div className="failedview">
              {failedEmails.map((email, index) => (
                <p key={index}>{email}</p>
              ))}
            </div>
            <button className="close-btn-fail" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CampaignTable;
