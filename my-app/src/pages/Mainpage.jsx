import React, { useState, useRef } from "react";
import axios from "axios";
import "./Mainpage.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaParagraph, FaImage, FaHeading, FaPlusSquare } from "react-icons/fa";
import { FaUser, FaUsers, FaRocket } from "react-icons/fa"; // Import icons
import { MdSend } from "react-icons/md";
import { FaDesktop } from "react-icons/fa";
import { MdPhoneAndroid } from "react-icons/md";
import { MdAddPhotoAlternate } from "react-icons/md";
import { FiTrash2 } from "react-icons/fi";
import ParaEditor from "../component/ParaEditor.jsx";
// import { FaUndo, FaRedo } from "react-icons/fa";
import SendexcelModal from "../component/Importexcel.jsx";
import SendbulkModal from "../component/SendbulkModal.jsx";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import apiConfig from "../apiconfig/apiConfig.js";

const Mainpage = () => {
  const [isLoading, setIsLoading] = useState(false); // State for loader
  const [bgColor, setBgColor] = useState("#ffffff");
  const [isMobileView, setIsMobileView] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [emailData, setEmailData] = useState({
    recipient: "",
    subject: "",
    previewtext: "",
    scheduledTime: "",
  });
  const [selectedIndex, setSelectedIndex] = useState(null); // Track selected content index
  const dragIndex = useRef(null);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSendexcelModal, setShowSendexcelModal] = useState(false); // State for opening Sendexcelmail

  const [showSendModal, setShowSendModal] = useState(false); // State for opening SendbulkModal
  const [previewContent, setPreviewContent] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const campaign = JSON.parse(localStorage.getItem("campaign"));
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);
  // const [scheduledMessage, setScheduledMessage] = useState("");


  const handlebackcampaign = () => {
    navigate("/home");
  };




  // Add new text
  const addText = () => {
    saveToUndoStack(); // Save the current state before deleting

    setPreviewContent([
      ...previewContent,
      {
        type: "para",
        content: "Replace Your Content...",
        style: {
          fontSize: "15px",
          borderRadius: "10px",
          textAlign: "left",
          color: "#000000",
          padding: "10px 10px",
        },
      },
    ]);
  };
  const addHeading = () => {
    saveToUndoStack(); // Save the current state before deleting

    setPreviewContent([
      ...previewContent,
      {
        type: "head",
        content: "Heading",
        style: {
          fontSize: "25px",
          borderRadius: "10px",
          textAlign: "center",
          color: "#000000",
          padding: "10px 0px 10px 5px",
          fontWeight: "bold",
        },
      },
    ]);
  };

  const addImage = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("image", file);

      // Upload image to Cloudinary or server
      try {
        const response = await axios.post(
          `${apiConfig.baseURL}/api/stud/upload`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        const imageUrl1 = response.data.imageUrl;
        setPreviewContent([
          ...previewContent,
          {
            type: "image",
            src: imageUrl1,
            style: {
              width: "100%",
              height: "auto",
              borderRadius: "10px",
              textAlign: "center",
            },
          },
        ]);
      } catch (err) {
        toast.error("Image upload failed");
      }
    };
    fileInput.click();
  };

  const addLogo = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("image", file);

      // Upload image to Cloudinary or server
      try {
        const response = await axios.post(
          `${apiConfig.baseURL}/api/stud/upload`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        const imageUrl = response.data.imageUrl;
        setPreviewContent([
          ...previewContent,
          {
            type: "logo",
            src: imageUrl,
            style: {
              width: "100%",
              height: "auto",
              borderRadius: "10px",
              textAlign: "center",
              margin: "0 auto",
            },
          },
        ]);
      } catch (err) {
        toast.error("Image upload failed");
      }
    };
    fileInput.click();
  };

  const uploadImage = async (index, imageNumber) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e) => {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await axios.post(
          `${apiConfig.baseURL}/api/stud/upload`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        const imageUrl3 = response.data.imageUrl;

        // Update the correct image in the layout
        setPreviewContent((prev) =>
          prev.map((item, i) =>
            i === index
              ? {
                  ...item,
                  [imageNumber === 1 ? "src1" : "src2"]: imageUrl3,
                }
              : item
          )
        );
      } catch (err) {
        toast.error("Image upload failed");
      }
    };

    input.click();
  };

  //add  clickable image
  const addlinkImage = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("image", file);

      // Upload image to Cloudinary or server
      try {
        const response = await axios.post(
          `${apiConfig.baseURL}/api/stud/upload`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        const imageUrl2 = response.data.imageUrl;
        setPreviewContent([
          ...previewContent,
          {
            type: "link-image",
            src: imageUrl2,
            style: {
              width: "100%",
              height: "auto",
              borderRadius: "10px",
              textAlign: "center",
            },
            link: "https://www.imageconindia.com/",
          },
        ]);
      } catch (err) {
        toast.error("Image upload failed");
      }
    };
    fileInput.click();
  };

//add multimage with button
  const addMultiImage = () => {
    setPreviewContent([
      ...previewContent,
      {
        type: "multi-image",
        src1: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjCoUtOal33JWLqals1Wq7p6GGCnr3o-lwpQ&s",
        src2: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjCoUtOal33JWLqals1Wq7p6GGCnr3o-lwpQ&s",
        link1: "https://www.imageconindia.com/",
        link2: "https://www.imageconindia.com/",
        buttonStyle1: {
          textAlign: "center",
          padding: "12px 25px",
          backgroundColor: "black",
          color: "#ffffff",
          width: "auto",
          marginTop: "10px",
          alignItem: "center",
          borderRadius: "5px",
        },
        buttonStyle2: {
          textAlign: "center",
          padding: "12px 25px",
          backgroundColor: "black",
          color: "#ffffff",
          width: "auto",
          marginTop: "10px",
          alignItem: "center",
          borderRadius: "5px",
        },
        content1: "Click Me",
        content2: "Click Me",
        style: {
          width: "100%",
          height: "auto",
          borderRadius: "10px",
          textAlign: "center",
        },
      },
    ]);
  };


  const addButton = () => {
    saveToUndoStack(); // Save the current state before deleting
    setPreviewContent([
      ...previewContent,
      {
        type: "button",
        content: "Click Me",
        style: {
          textAlign: "center",
          padding: "12px 25px",
          backgroundColor: "black",
          color: "#ffffff",
          width: "auto",
          marginTop: "5px",
          alignItem: "center",
          borderRadius: "5px",
        },
        link: "https://www.imageconindia.com/",
      },
    ]);
  };

  // Handle content editing

  const updateContent = (index, newContent) => {
    saveToUndoStack(); // Save the current state before deleting
    const updated = [...previewContent];
    updated[index] = { ...updated[index], ...newContent };
    setPreviewContent(updated);
  };

  const handleItemClick = (index) => {
    setSelectedIndex(index); // Set the selected index when an item is clicked
  };

  //delete
  const deleteContent = (index) => {
    saveToUndoStack(); // Save the current state before deleting
    const updated = previewContent.filter((_, i) => i !== index);
    setPreviewContent(updated);
    if (selectedIndex === index) {
      setSelectedIndex(null); // Reset selection if the deleted item was selected
    } else if (selectedIndex > index) {
      setSelectedIndex(selectedIndex - 1); // Adjust index
    }
  };
  const saveToUndoStack = () => {
    setUndoStack([...undoStack, [...previewContent]]);
    setRedoStack([]); // Clear redo stack whenever a new action is performed
  };

  // Undo action
  const undo = () => {
    if (undoStack.length > 0) {
      const previousState = undoStack.pop(); // Pop the last state
      setRedoStack([...redoStack, [...previewContent]]); // Save current state to redo stack
      setPreviewContent(previousState); // Revert to the previous state
    }
  };

  // Redo action
  const redo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack.pop(); // Pop the redo state
      setUndoStack([...undoStack, [...previewContent]]); // Save current state to undo stack
      setPreviewContent(nextState); // Reapply the redo state
    }
  };



  //Schedule send Email
const sendscheduleEmail = async () => {
//  const scheduleTime = new Date(emailData.scheduledTime);
// const currentTime = new Date();
// const delay = scheduleTime.getTime() - currentTime.getTime();

// if (delay > 0) {
//     const formattedScheduleTime = scheduleTime.toUTCString(); // Ensure correct format
//     setScheduledMessage(`Email scheduled for ${formattedScheduleTime}`);
// } else {
//     setScheduledMessage("Please select a future date and time.");
// }

// Validate required fields
if (!previewContent || previewContent.length === 0) {
    toast.warning("No preview content available.");
    return;
}
if (!emailData || !emailData.recipient || !emailData.subject || !emailData.previewtext || !emailData.scheduledTime) {
    toast.warning("Please fill in all required fields.");
    return;
}

try {
    let recipients = emailData.recipient.split(",").map(email => email.trim());

    // Store campaign history with "scheduled" status in UTC format
    const campaignHistoryData = {
        campaignname: campaign.camname,
        groupname: "No Group",
        totalcount: recipients.length,
        recipients: emailData.recipient,
        sendcount: 0,
        failedcount: 0,
        sendEmails: 0,
        failedEmails: 0,
        subject: emailData.subject,
        previewtext: emailData.previewtext,
        previewContent,
        bgColor,
        exceldata:[{}],
        status: "Scheduled On",
        scheduledTime: new Date(emailData.scheduledTime).toISOString(),  
        senddate: new Date().toLocaleString(),
        user: user.id,
        groupId: "no group",
    };

    const campaignResponse = await axios.post(`${apiConfig.baseURL}/api/stud/camhistory`, campaignHistoryData);

        console.log("Initial Campaign History Saved:", campaignResponse.data);     
        localStorage.setItem("camhistory", JSON.stringify(campaignResponse.data));
        toast.success("Email scheduled successfully!");
        navigate("/home");
   } catch (error) {
        console.error("Error scheduling email:", error);
        toast.error("Failed to schedule email.");
    } finally {
        setIsLoading(false);
    }
};


  //Normal Send Email
const sendEmail = async () => {
    setIsLoading(true);
    navigate("/home");

    // Validate required fields
    if (!previewContent || previewContent.length === 0) {
        toast.warning("No preview content available.");
        return;
    }
    if (!emailData || !emailData.recipient || !emailData.subject || !emailData.previewtext) {
        toast.warning("Please fill in all required fields.");
        return;
    }

    try {
      
        let recipients = emailData.recipient.split(",").map(email => email.trim());
        let sentEmails = [];
        let failedEmails = [];

        // Store initial campaign history with "Pending" status
        const campaignHistoryData = {
            campaignname: campaign.camname,
            groupname: "No Group",
            totalcount: recipients.length,
            recipients:"no mail",
            sendcount: 0,
            failedcount: 0,
            sendEmails:0,
            failedEmails:0,
            subject:emailData.subject,
            previewtext:emailData.previewtext,
            previewContent,bgColor,
            exceldata:[{}],
            scheduledTime:"no schedule",
            status: "Pending",
            senddate: new Date().toLocaleString(),
            user: user.id,
            groupId:"no group",
        };

        const campaignResponse = await axios.post(`${apiConfig.baseURL}/api/stud/camhistory`, campaignHistoryData);
        const campaignId = campaignResponse.data.id; // Assume response includes campaign ID
        console.log("Initial Campaign History Saved:", campaignResponse.data);

        // Start sending emails
        await Promise.all(recipients.map(async (email) => {
            try {
                const response = await axios.post(`${apiConfig.baseURL}/api/stud/sendtestmail`, {
                    emailData: {
                        ...emailData,
                        recipient: email
                    },
                    previewContent,
                    bgColor,
                    userId: user.id,
                });

                if (response.status === 200) {
                    sentEmails.push(email);
                } else {
                    console.error(`Failed to send email to ${email}:`, response);
                    failedEmails.push(email);
                }
            } catch (err) {
                console.error(`Error sending email to ${email}:`, err);
                failedEmails.push(email);
            }
        }));


        // Update campaign history with final status
        const finalStatus = failedEmails.length > 0 ? "Failed" : "Success";
        await axios.put(`${apiConfig.baseURL}/api/stud/camhistory/${campaignId}`, {
            sendcount: sentEmails.length,
            sentEmails:sentEmails,
            failedEmails:failedEmails.length > 0 ? failedEmails : 0,
            failedcount: failedEmails.length > 0 ? failedEmails.length : 0, // Ensure failedcount is 0, not an empty array
            status: finalStatus,
        });

        toast.success("Email sending process completed.");
    } catch (error) {
        console.error("Error in sendEmail:", error);
        toast.error("An error occurred while sending the email.");
    } finally {
        setIsLoading(false);
    }
};


  //add variable
  const handleInsertName = (index, name) => {
    const updatedPreviewContent = [...previewContent];

    // Append {fname} or {lname} at the end of the existing content
    updatedPreviewContent[index].content += name;

    setPreviewContent(updatedPreviewContent);
  };

  const handleCursorPosition = (e, index) => {
    const cursorPosition = e.target.selectionStart; // Get the cursor position inside the content
    const updatedPreviewContent = [...previewContent];
    updatedPreviewContent[index].cursorPosition = cursorPosition;

    setPreviewContent(updatedPreviewContent);
  };

  // Drag and drop logic
  const handleDragStart = (index) => {
    dragIndex.current = index;
  };

  const handleDrop = (dropIndex) => {
    if (dragIndex.current !== null) {
      const tempContent = [...previewContent];
      const [draggedItem] = tempContent.splice(dragIndex.current, 1);
      tempContent.splice(dropIndex, 0, draggedItem);
      setPreviewContent(tempContent);
      dragIndex.current = null;
    }
  };

  const handleEditorDrop = (e) => {
    e.preventDefault();
    const type = dragIndex.current;
    if (type === "para") addText();
    else if (type === "head") addHeading();
    else if (type === "image") addImage();
    else if (type === "logo") addLogo();
    else if (type === "button") addButton();
    else if (type === "multi-image") addMultiImage();
    else if (type === "link-image") addlinkImage();

    dragIndex.current = null; // Reset the type after drop
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Allow drop by preventing default
  };

  const handleLinkClick = (e, index) => {
    e.preventDefault(); // Prevent default navigation
    const link = previewContent[index]?.link || "";
    if (link) {
      window.open(link.startsWith("http") ? link : `http://${link}`, "_blank");
    }
  };
  return (
    <div>
      <nav className="navbar">
        <div>
          <h3 className="company-name">
            <span style={{ color: "#2f327D" }}>{campaign.camname}</span> <span style={{ color: "#f48c06" }}>Campaign</span>
          </h3>
        </div>
        <div>
          <button
            onClick={undo}
            disabled={undoStack.length === 0}
            className="undo-btn"
            data-tooltip="Undo" // Custom tooltip using data attribute
          >
            <i className="fas fa-undo-alt"></i>
          </button>

          <button
            onClick={redo}
            disabled={redoStack.length === 0}
            className="redo-btn"
            data-tooltip="Redo" // Custom tooltip using data attribute
          >
            <i className="fas fa-redo-alt"></i>
          </button>

          <button
            onClick={() => setIsMobileView(false)}
            className="navbar-button-Desktop"
          >
            <span className="Nav-icons">
              <FaDesktop />
            </span>{" "}
            {/* <span className="nav-names">Desktop</span> */}
          </button>
          <button
            onClick={() => setIsMobileView(true)}
            className="navbar-button-Desktop"
          >
            <span className="Nav-icons">
              <MdPhoneAndroid />
            </span>{" "}
            {/* <span className="nav-names">Mobile</span> */}
          </button>

          <button
            onClick={() => setIsOpen(true)}
            className="navbar-button-send"
          >
            <span className="Nav-icons">
              <MdSend />
            </span>{" "}
            <span className="nav-names">Send Mail</span>
          </button>
          <button onClick={handlebackcampaign} className="navbar-button">
            <span className="Nav-icons">
              <FaArrowLeft />
            </span>{" "}
            <span className="nav-names">Home</span>
          </button>
        </div>
      </nav>

      <div className="app-container">
        {/* Left Editor */}
        <div className="editor">
          {/* Tabs */}
          <div className="tabs">
            <button className="tab">Components</button>
          </div>

          <div className="edit-btn">
            {/* Tab Content */}
            <div className="content-tab">
              <button
                onClick={addLogo}
                className="editor-button"
                draggable
                onDragStart={(e) => handleDragStart("logo")}
              >
                <MdAddPhotoAlternate /> Logo
              </button>
              <button
                onClick={addHeading}
                className="editor-button"
                draggable
                onDragStart={(e) => handleDragStart("head")}
              >
                <FaHeading /> Heading
              </button>
              <button
                onClick={addText}
                className="editor-button"
                draggable
                onDragStart={(e) => handleDragStart("para")}
              >
                <FaParagraph /> Paragraph
              </button>
              <button
                onClick={addImage}
                className="editor-button"
                draggable
                onDragStart={(e) => handleDragStart("image")}
              >
                <FaImage /> Image
              </button>
              <button
                onClick={addlinkImage}
                className="editor-button"
                draggable
                onDragStart={(e) => handleDragStart("link-image")}
              >
                <FaImage />
                Clickable Image
              </button>
              <button
                onClick={addMultiImage}
                className="editor-button"
                draggable
                onDragStart={(e) => handleDragStart("image")}
              >
                <FaImage /> Multi-Image
              </button>
              <button
                onClick={addButton}
                className="editor-button"
                draggable
                onDragStart={(e) => handleDragStart("button")}
              >
                <FaPlusSquare /> Button
              </button>
              <button className="editor-button">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="bg-color-pic"
                />
                Template-Bg
              </button>
            </div>
          </div>

          {/* Styling Controls */}
          {selectedIndex !== null && previewContent[selectedIndex] && (
            <div className="style-controls">
              <h3>Style Controls</h3>
              <div className="style-item">
                {previewContent[selectedIndex].type === "para" && (
                  <>
                    <div className="editor-bg">
                      Text Color
                      <input
                        type="color"
                        value={previewContent[selectedIndex].style.color}
                        onChange={(e) =>
                          updateContent(selectedIndex, {
                            style: {
                              ...previewContent[selectedIndex].style,
                              color: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="editor-bg">
                      Text Background
                      <input
                        type="color"
                        value={
                          previewContent[selectedIndex].style.backgroundColor ||
                          "#ffffff"
                        }
                        onChange={(e) =>
                          updateContent(selectedIndex, {
                            style: {
                              ...previewContent[selectedIndex].style,
                              backgroundColor: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </>
                )}

                {previewContent[selectedIndex].type === "head" && (
                  <>
                    <label>Font Size:</label>
                    <input
                      type="number"
                      value={parseInt(
                        previewContent[selectedIndex].style.fontSize.replace(
                          "px",
                          ""
                        )
                      )}
                      onChange={(e) =>
                        updateContent(selectedIndex, {
                          style: {
                            ...previewContent[selectedIndex].style,
                            fontSize: `${e.target.value}px`,
                          },
                        })
                      }
                    />
                    <div className="editor-bg">
                      Text Color
                      <input
                        type="color"
                        value={previewContent[selectedIndex].style.color}
                        onChange={(e) =>
                          updateContent(selectedIndex, {
                            style: {
                              ...previewContent[selectedIndex].style,
                              color: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="editor-bg">
                      Text Background
                      <input
                        type="color"
                        value={
                          previewContent[selectedIndex].style.backgroundColor ||
                          "#ffffff"
                        }
                        onChange={(e) =>
                          updateContent(selectedIndex, {
                            style: {
                              ...previewContent[selectedIndex].style,
                              backgroundColor: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <label>Text Alignment:</label>
                    <select
                      value={previewContent[selectedIndex].style.textAlign}
                      onChange={(e) =>
                        updateContent(selectedIndex, {
                          style: {
                            ...previewContent[selectedIndex].style,
                            textAlign: e.target.value,
                          },
                        })
                      }
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </>
                )}
                {previewContent[selectedIndex].type === "button" && (
                  <>
                    <label>Button name:</label>
                    <input
                      type="text"
                      placeholder="Enter button name"
                      value={previewContent[selectedIndex].content || ""}
                      onChange={(e) =>
                        updateContent(selectedIndex, {
                          content: e.target.value,
                        })
                      }
                    />
                    <div className="editor-bg">
                      Background Color
                      <input
                        type="color"
                        value={
                          previewContent[selectedIndex].style.backgroundColor
                        }
                        onChange={(e) =>
                          updateContent(selectedIndex, {
                            style: {
                              ...previewContent[selectedIndex].style,
                              backgroundColor: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="editor-bg">
                      Text Color
                      <input
                        type="color"
                        value={previewContent[selectedIndex].style.color}
                        onChange={(e) =>
                          updateContent(selectedIndex, {
                            style: {
                              ...previewContent[selectedIndex].style,
                              color: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <label>Text Alignment:</label>
                    <select
                      value={
                        previewContent[selectedIndex]?.style?.textAlign || ""
                      }
                      onChange={(e) =>
                        updateContent(selectedIndex, {
                          style: {
                            ...previewContent[selectedIndex].style,
                            textAlign: e.target.value,
                          },
                        })
                      }
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>

                    <label>Button Size:</label>
                    <div>
                      <button
                        className="modal-btn-size"
                        onClick={() =>
                          updateContent(selectedIndex, {
                            style: {
                              ...previewContent[selectedIndex].style,
                              width: "auto",
                            },
                          })
                        }
                      >
                        Small
                      </button>
                      <button
                        className="modal-btn-size"
                        onClick={() =>
                          updateContent(selectedIndex, {
                            style: {
                              ...previewContent[selectedIndex].style,
                              width: "60%",
                            },
                          })
                        }
                      >
                        Medium
                      </button>
                      <button
                        className="modal-btn-size"
                        onClick={() =>
                          updateContent(selectedIndex, {
                            style: {
                              ...previewContent[selectedIndex].style,
                              width: "85%",
                            },
                          })
                        }
                      >
                        Large
                      </button>
                    </div>

                    <label>Border Radius:</label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={parseInt(
                        previewContent[
                          selectedIndex
                        ].style.borderRadius.replace("px", "")
                      )}
                      onChange={(e) =>
                        updateContent(selectedIndex, {
                          style: {
                            ...previewContent[selectedIndex].style,
                            borderRadius: `${e.target.value}px`,
                          },
                        })
                      }
                    />

                    <label>Link:</label>
                    <input
                      type="text"
                      placeholder="Enter URL"
                      value={previewContent[selectedIndex].link || ""}
                      onChange={(e) =>
                        updateContent(selectedIndex, { link: e.target.value })
                      }
                    />
                  </>
                )}

             {/* New Editor for Multi-Image Links and Button Styling */}
                {previewContent[selectedIndex].type === "multi-image" && (
                  <>
                    <h4>Button-1 Styles</h4>
                    <div>
                      <label>Button Name:</label>
                      <input
                        type="text"
                        placeholder="Enter button name"
                        value={previewContent[selectedIndex].content1 || ""}
                        onChange={(e) =>
                          updateContent(selectedIndex, {
                            content1: e.target.value,
                          })
                        }
                      />
                      <label>Button Link:</label>
                      <input
                        type="text"
                        value={previewContent[selectedIndex].link1}
                        onChange={(e) =>
                          updateContent(selectedIndex, {
                            link1: e.target.value,
                          })
                        }
                      />
                      <div className="editor-bg">
                        Button Text Color:
                        <input
                          type="color"
                          value={
                            previewContent[selectedIndex].buttonStyle1.color
                          }
                          onChange={(e) =>
                            updateContent(selectedIndex, {
                              buttonStyle1: {
                                ...previewContent[selectedIndex].buttonStyle1,
                                color: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="editor-bg">
                        Button Background Color:
                        <input
                          type="color"
                          value={
                            previewContent[selectedIndex].buttonStyle1
                              .backgroundColor
                          }
                          onChange={(e) =>
                            updateContent(selectedIndex, {
                              buttonStyle1: {
                                ...previewContent[selectedIndex].buttonStyle1,
                                backgroundColor: e.target.value,
                              },
                            })
                          }
                        />
                     </div>

                        <label>Text Alignment:</label>
                        <select
                          value={
                            previewContent[selectedIndex]?.buttonStyle1
                              ?.textAlign || ""
                          }
                          onChange={(e) =>
                            updateContent(selectedIndex, {
                              buttonStyle1: {
                                ...previewContent[selectedIndex].buttonStyle1,
                                textAlign: e.target.value,
                              },
                            })
                          }
                        >
                          <option value="left">Left</option>
                          <option value="center">Center</option>
                          <option value="right">Right</option>
                        </select>
                      <label>Button Size:</label>
                      <div>
                        <button
                          className="modal-btn-size"
                          onClick={() =>
                            updateContent(selectedIndex, {
                              buttonStyle1: {
                                ...previewContent[selectedIndex].buttonStyle1,
                                width: "auto",
                              },
                            })
                          }
                        >
                          Small
                        </button>
                        <button
                          className="modal-btn-size"
                          onClick={() =>
                            updateContent(selectedIndex, {
                              buttonStyle1: {
                                ...previewContent[selectedIndex].buttonStyle1,
                                width: "50%",
                              },
                            })
                          }
                        >
                          Medium
                        </button>
                        <button
                          className="modal-btn-size"
                          onClick={() =>
                            updateContent(selectedIndex, {
                              buttonStyle1: {
                                ...previewContent[selectedIndex].buttonStyle1,
                                width: "80%",
                              },
                            })
                          }
                        >
                          Large
                        </button>
                      </div>
                      <label>Border Radius:</label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={parseInt(
                          previewContent[
                            selectedIndex
                          ].buttonStyle1.borderRadius.replace("px", "")
                        )}
                        onChange={(e) =>
                          updateContent(selectedIndex, {
                            buttonStyle1: {
                              ...previewContent[selectedIndex].buttonStyle1,
                              borderRadius: `${e.target.value}px`,
                            },
                          })
                        }
                      />
                    </div>
                    <h4>Button-2 Style</h4>
                    <div>
                      <label>Button Name:</label>
                      <input
                        type="text"
                        placeholder="Enter button name"
                        value={previewContent[selectedIndex].content2 || ""}
                        onChange={(e) =>
                          updateContent(selectedIndex, {
                            content2: e.target.value,
                          })
                        }
                      />

                      <label>Button Link:</label>
                      <input
                        type="text"
                        value={previewContent[selectedIndex].link2}
                        onChange={(e) =>
                          updateContent(selectedIndex, {
                            link2: e.target.value,
                          })
                        }
                      />

                      <div className="editor-bg">
                        Button Text Color:
                        <input
                          type="color"
                          value={
                            previewContent[selectedIndex].buttonStyle2.color
                          }
                          onChange={(e) =>
                            updateContent(selectedIndex, {
                              buttonStyle2: {
                                ...previewContent[selectedIndex].buttonStyle2,
                                color: e.target.value,
                              },
                            })
                          }
                        />
                      </div>

                      <div className="editor-bg">
                        Button Background Color:
                        <input
                          type="color"
                          value={
                            previewContent[selectedIndex].buttonStyle2
                              .backgroundColor
                          }
                          onChange={(e) =>
                            updateContent(selectedIndex, {
                              buttonStyle2: {
                                ...previewContent[selectedIndex].buttonStyle2,
                                backgroundColor: e.target.value,
                              },
                            })
                          }
                        />
                      </div>

                      <label>Text Alignment:</label>
                      <select
                        value={
                          previewContent[selectedIndex]?.buttonStyle2
                            ?.textAlign || ""
                        }
                        onChange={(e) =>
                          updateContent(selectedIndex, {
                            buttonStyle2: {
                              ...previewContent[selectedIndex].buttonStyle2,
                              textAlign: e.target.value,
                            },
                          })
                        }
                      >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                      </select>

                      <label>Button Size:</label>
                      <div>
                        <button
                          className="modal-btn-size"
                          onClick={() =>
                            updateContent(selectedIndex, {
                              buttonStyle2: {
                                ...previewContent[selectedIndex].buttonStyle2,
                                width: "auto",
                              },
                            })
                          }
                        >
                          Small
                        </button>
                        <button
                          className="modal-btn-size"
                          onClick={() =>
                            updateContent(selectedIndex, {
                              buttonStyle2: {
                                ...previewContent[selectedIndex].buttonStyle2,
                                width: "50%",
                              },
                            })
                          }
                        >
                          Medium
                        </button>
                        <button
                          className="modal-btn-size"
                          onClick={() =>
                            updateContent(selectedIndex, {
                              buttonStyle2: {
                                ...previewContent[selectedIndex].buttonStyle2,
                                width: "80%",
                              },
                            })
                          }
                        >
                          Large
                        </button>
                      </div>

                      <label>Border Radius:</label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={parseInt(
                          previewContent[
                            selectedIndex
                          ].buttonStyle2.borderRadius.replace("px", "")
                        )}
                        onChange={(e) =>
                          updateContent(selectedIndex, {
                            buttonStyle2: {
                              ...previewContent[selectedIndex].buttonStyle2,
                              borderRadius: `${e.target.value}px`,
                            },
                          })
                        }
                      />
                    </div>
                  </>
                )}

                {previewContent[selectedIndex].type === "link-image" && (
                  <>
                    <label>Width(%):</label>
                    <input
                      type="number"
                      value={parseInt(
                        previewContent[selectedIndex].style.width.replace(
                          "%",
                          ""
                        )
                      )}
                      onChange={(e) =>
                        updateContent(selectedIndex, {
                          style: {
                            ...previewContent[selectedIndex].style,
                            width: `${e.target.value}%`,
                          },
                        })
                      }
                    />
                    <label>Height (px):</label>
                    <input
                      type="number"
                      value={parseInt(
                        previewContent[selectedIndex].style.height.replace(
                          "px",
                          ""
                        )
                      )}
                      onChange={(e) =>
                        updateContent(selectedIndex, {
                          style: {
                            ...previewContent[selectedIndex].style,
                            height: `${e.target.value}px`,
                          },
                        })
                      }
                    />
                    <div className="editor-bg">
                      Image Background
                      <input
                        type="color"
                        value={
                          previewContent[selectedIndex].style.backgroundColor ||
                          "#ffffff"
                        }
                        onChange={(e) =>
                          updateContent(selectedIndex, {
                            style: {
                              ...previewContent[selectedIndex].style,
                              backgroundColor: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <label>Image Alignment:</label>
                    <select
                      value={previewContent[selectedIndex].style.textAlign}
                      onChange={(e) =>
                        updateContent(selectedIndex, {
                          style: {
                            ...previewContent[selectedIndex].style,
                            textAlign: e.target.value,
                          },
                        })
                      }
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>

                    <label>Link:</label>
                    <input
                      type="text"
                      placeholder="Enter URL"
                      value={previewContent[selectedIndex].link || ""}
                      onChange={(e) =>
                        updateContent(selectedIndex, { link: e.target.value })
                      }
                    />
                  </>
                )}

                {previewContent[selectedIndex].type === "logo" && (
                  <>
                    <label>Width (%):</label>
                    <input
                      type="number"
                      value={parseInt(
                        previewContent[selectedIndex].style.width.replace(
                          "%",
                          ""
                        )
                      )}
                      onChange={(e) =>
                        updateContent(selectedIndex, {
                          style: {
                            ...previewContent[selectedIndex].style,
                            width: `${e.target.value}%`,
                          },
                        })
                      }
                    />
                    <label>Height (px):</label>
                    <input
                      type="number"
                      value={parseInt(
                        previewContent[selectedIndex].style.height.replace(
                          "px",
                          ""
                        )
                      )}
                      onChange={(e) =>
                        updateContent(selectedIndex, {
                          style: {
                            ...previewContent[selectedIndex].style,
                            height: `${e.target.value}px`,
                          },
                        })
                      }
                    />
                    <div className="editor-bg">
                      Image Background
                      <input
                        type="color"
                        value={
                          previewContent[selectedIndex].style.backgroundColor ||
                          "#ffffff"
                        }
                        onChange={(e) =>
                          updateContent(selectedIndex, {
                            style: {
                              ...previewContent[selectedIndex].style,
                              backgroundColor: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <label>Image Alignment:</label>
                    <select
                      value={previewContent[selectedIndex].style.textAlign}
                      onChange={(e) =>
                        updateContent(selectedIndex, {
                          style: {
                            ...previewContent[selectedIndex].style,
                            textAlign: e.target.value,
                          },
                        })
                      }
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </>
                )}

                {previewContent[selectedIndex].type === "image" && (
                  <>
                    <label>Width (%):</label>
                    <input
                      type="number"
                      value={parseInt(
                        previewContent[selectedIndex].style.width.replace(
                          "%",
                          ""
                        )
                      )}
                      onChange={(e) =>
                        updateContent(selectedIndex, {
                          style: {
                            ...previewContent[selectedIndex].style,
                            width: `${e.target.value}%`,
                          },
                        })
                      }
                    />
                    <label>Height (px):</label>
                    <input
                      type="number"
                      value={parseInt(
                        previewContent[selectedIndex].style.height.replace(
                          "px",
                          ""
                        )
                      )}
                      onChange={(e) =>
                        updateContent(selectedIndex, {
                          style: {
                            ...previewContent[selectedIndex].style,
                            height: `${e.target.value}px`,
                          },
                        })
                      }
                    />
                    <div className="editor-bg">
                      Image Background
                      <input
                        type="color"
                        value={
                          previewContent[selectedIndex].style.backgroundColor ||
                          "#ffffff"
                        }
                        onChange={(e) =>
                          updateContent(selectedIndex, {
                            style: {
                              ...previewContent[selectedIndex].style,
                              backgroundColor: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <label>Image Alignment:</label>
                    <select
                      value={previewContent[selectedIndex].style.textAlign}
                      onChange={(e) =>
                        updateContent(selectedIndex, {
                          style: {
                            ...previewContent[selectedIndex].style,
                            textAlign: e.target.value,
                          },
                        })
                      }
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Preview */}
        <div className="preview-container">
          <div
            className={`template-preview ${isMobileView ? "mobile-view" : ""}`}
            style={{ backgroundColor: bgColor }}
            onDrop={handleEditorDrop}
            onDragOver={handleDragOver}
          >
            <div className="preview-card" style={{ backgroundColor: bgColor }}>
              {previewContent.map((item, index) => {
                if (!item || !item.type) {
                  return null; // Skip rendering undefined or malformed items
                }
                return (
                  <div
                    key={index}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(index)}
                    className="content-item"
                    onClick={() => handleItemClick(index)}
                    style={item.style}
                  >
                    {item.type === "para" && (
                      <>
                        <p
                          className="border"
                          contentEditable
                          suppressContentEditableWarning
                          onClick={() => {
                            setSelectedIndex(index);
                            setIsModalOpen(true); // Open the modal
                          }}
                          style={item.style}
                          dangerouslySetInnerHTML={{ __html: item.content }} // Render HTML content here
                        />
                        <ParaEditor
                          isOpen={isModalOpen}
                          content={item.content} // Pass the content to the modal
                          style={item.style}
                          onSave={(newContent) => {
                            updateContent(index, { content: newContent }); // Save the new content
                            setIsModalOpen(false); // Close the modal after saving
                          }}
                          onClose={() => setIsModalOpen(false)} // Close the modal without saving
                        />
                      </>
                    )}

                    {item.type === "multi-image" ? (
                      <div className="Layout-img">
                        <div className="Layout">
                          <img
                            src={item.src1 || "https://via.placeholder.com/200"}
                            alt="Editable"
                            className="multiimg"
                            title="Upload Image"
                            style={item.style}
                            onClick={() => uploadImage(index, 1)}
                          />
                          <a
                            href={item.link1}
                            target="_blank"
                            className="button-preview"
                            rel="noopener noreferrer"
                            style={item.buttonStyle1}
                          >
                            {item.content1}
                          </a>
                        </div>

                        <div className="Layout">
                          <img
                            src={item.src2 || "https://via.placeholder.com/200"}
                            alt="Editable"
                            className="multiimg"
                            title="Upload Image"
                            style={item.style}
                            onClick={() => uploadImage(index, 2)}
                          />
                          <a
                            href={item.link2}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button-preview"
                            style={item.buttonStyle2}
                          >
                            {item.content2}
                          </a>
                        </div>
                      </div>
                    ) : null}

                    {item.type === "head" && (
                      <div>
                        <p
                          className="border"
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) =>
                            updateContent(index, {
                              content: e.target.textContent,
                            })
                          }
                          onMouseUp={(e) => handleCursorPosition(e, index)}
                          onSelect={(e) => handleCursorPosition(e, index)}
                          style={item.style}
                        >
                          {item.content}
                        </p>
                        <select
                          onChange={(e) =>
                            handleInsertName(index, e.target.value)
                          }
                          defaultValue=""
                          className="select-variable"
                        >
                          <option value="" disabled>
                            Add Variable
                          </option>
                          <option value="{Fname}">First Name</option>
                          <option value="{Lname}">Last Name</option>
                          <option value="{Email}">Email</option>
                          <option value="{EMIamount}">EMI Amount</option>
                          <option value="{Balance}">Balance</option>
                          <option value="{Totalfees}">Total Fees</option>
                          <option value="{Coursename}">Course Name</option>
                          <option value="{Coursetype}">Course Type</option>
                          <option value="{Offer}">Offer</option>
                          <option value="{Number}">Number</option>
                          <option value="{Date}">Date</option>
                          <option value="{College}">College</option>
                        </select>
                      </div>
                    )}

                    {item.type === "link-image" && (
                      <div className="border">
                        <a
                          href={item.link || "#"}
                          onClick={(e) => handleLinkClick(e, index)}
                        >
                          <img
                            src={item.src || "https://via.placeholder.com/200"}
                            alt="Editable"
                            className="img"
                            style={item.style}
                          />
                        </a>
                      </div>
                    )}
                    {item.type === "image" && (
                      <div className="border">
                        <img
                          src={item.src || "https://via.placeholder.com/200"}
                          alt="Editable"
                          className="img"
                          style={item.style}
                        />
                      </div>
                    )}

                    {item.type === "logo" && (
                      <div className="border">
                        <img
                          src={item.src || "https://via.placeholder.com/200"}
                          alt="Editable"
                          className="logo"
                          style={item.style}
                        />
                      </div>
                    )}
                    {item.type === "button" && (
                      <div className="border-btn">
                        <a
                          href={item.link || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={item.style}
                          className="button-preview"
                        >
                          {item.content}
                        </a>
                      </div>
                    )}
                    {item.type === "link" && (
                      <div className="border-btn">
                        <a
                          href={item.href || "#"}
                          onClick={(e) => handleLinkClick(e, index)}
                          style={item.style}
                        >
                          {item.content}
                        </a>
                      </div>
                    )}

                    <button
                      className="delete-btn"
                      onClick={() => deleteContent(index)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Show SendBulkModal when button is clicked */}
        {showSendModal && (
          <SendbulkModal
            isOpen={showSendModal}
            onClose={() => setShowSendModal(false)}
            bgColor={bgColor}
            previewContent={previewContent} // Pass previewContent to Sendbulkmail
          />
        )}

        {/* Show Sendexcelmail when button is clicked */}
        {showSendexcelModal && (
          <SendexcelModal
            isOpen={showSendexcelModal}
            onClose={() => setShowSendexcelModal(false)}
            bgColor={bgColor}
            previewContent={previewContent} // Pass previewContent to Sendexcelmail
          />
        )}

        {/* send mail Modal */}
        {isOpen && (
          <div className="modal-overlay-send">
            <div className="modal-content-send" ref={modalRef}>
              <h2>Select an Option</h2>

              {/* Card Structure with Icons */}
              <div className="button-group-send">
                <button
                  className="modal-btn-send"
                  onClick={() => setModalOpen(true)}
                >
                  <FaUser className="icon-send" />
                  Send Single
                </button>
                <button
                  className="modal-btn-send"
                  onClick={() => setShowSendModal(true)}
                >
                  <FaUsers className="icon-send" />
                  Send Bulk
                </button>
                <button
                  className="modal-btn-send"
                  onClick={() => setShowSendexcelModal(true)}
                >
                  <FaRocket className="icon-send" />
                  Send Bulk Instant
                </button>
              </div>

              {/* Close Button */}
              <button
                className="close-btn-send"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Modal */}
        {modalOpen && (
          <div className="modal">
            <div className="modal-content testmail-content">
              <h2>Send Single Mail</h2>
              <input
                type="email"
                placeholder="Recipient Email"
                value={emailData.recipient}
                onChange={(e) =>
                  setEmailData({ ...emailData, recipient: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Subject"
                value={emailData.subject}
                onChange={(e) =>
                  setEmailData({ ...emailData, subject: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Preview Text"
                value={emailData.previewtext}
                onChange={(e) =>
                  setEmailData({ ...emailData, previewtext: e.target.value })
                }
              />
                    <input
        type="datetime-local"
        value={emailData.scheduledTime}
        onChange={(e) =>
          setEmailData({ ...emailData, scheduledTime: e.target.value })
        }
      />

      {/* {scheduledMessage && <p className="scheduled-message">{scheduledMessage}</p>} */}

              <button
                onClick={sendEmail}
                className="modal-button"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Send Now"}
              </button>
               <button onClick={sendscheduleEmail} className="modal-button" disabled={isLoading}>
                {isLoading ? "Processing..." : "Scheduled"}
               </button>
              <button
                onClick={() => setModalOpen(false)}
                className="modal-button"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      <ToastContainer
        className="custom-toast"
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={true} // Disable progress bar
        closeOnClick={false}
        closeButton={false}
        pauseOnHover={true}
        draggable={true}
        theme="light" // Optional: Choose theme ('light', 'dark', 'colored')
      />
    </div>
  );
};

export default Mainpage;