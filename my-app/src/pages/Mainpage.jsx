import React, { useState, useRef } from "react";
import axios from "axios";
import "./Mainpage.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaParagraph,
  FaImage,
  FaHeading,
  FaPlusSquare,
  FaGlobe,
  FaVideo,
} from "react-icons/fa";
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
// import facebook from "../Images/facebook.png";
// import twitter from "../Images/twitter.png";
// import instagram from "../Images/instagram.png";
// import youtube from "../Images/youtube.png";

const Mainpage = () => {
  const [isLoading, setIsLoading] = useState(false); // State for loader
  const [isLoadingsch, setIsLoadingsch] = useState(false); // State for loader
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
  const [modalIndex, setModalIndex] = useState(null);
  const dragIndex = useRef(null);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSendexcelModal, setShowSendexcelModal] = useState(false); // State for opening Sendexcelmail
  const [isScheduled, setIsScheduled] = useState(false); // Toggle state
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
          backgroundColor: "#f4f4f4",
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
              margin: "5px auto",
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
              width: "50%",
              height: "auto",
              borderRadius: "0px",
              textAlign: "center",
              margin: "5px auto",
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
              margin: "5px auto",
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

  const addImageText = () => {
    setPreviewContent([
      ...previewContent,
      {
        type: "imagewithtext",
        src1: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjCoUtOal33JWLqals1Wq7p6GGCnr3o-lwpQ&s", // Default image source
        content1:
          "Artificial intelligence is transforming the way we interact with technology, enabling machines to process data with efficiency.", // Default paragraph text
        style1: {
          color: "black",
          borderRadius: "10px",
          backgroundColor: "#f4f4f4",
        },
      },
    ]);
  };

  const addTextImage = () => {
    setPreviewContent([
      ...previewContent,
      {
        type: "textwithimage",
        src2: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjCoUtOal33JWLqals1Wq7p6GGCnr3o-lwpQ&s", // Default image source
        content2:
          "Artificial intelligence is transforming the way we interact with technology, enabling machines to process data with efficiency.", // Default paragraph text
        style: {
          color: "black",
          backgroundColor: "#f4f4f4",
          borderRadius: "10px",
        },
      },
    ]);
  };

  //add video with icon
  const addVideo = () => {
    setPreviewContent([
      ...previewContent,
      {
        type: "video-icon",
        src1: "https://zawiya.org/wp-content/themes/zawiyah/images/thumbnail-default.jpg",
        src2: "https://i.ibb.co/Ngg9QVdM/output-onlinegiftools.gif",
        link: "https://www.imageconindia.com/",
        style: {
          width: "100%",
          height: "350px",
          borderRadius: "10px",
          textAlign: "center",
          margin: "5px auto",
        },
      },
    ]);
  };

  const addSocialMedia = () => {
    setPreviewContent([
      ...previewContent,
      {
        type: "icons",
        iconsrc1:
          "https://media-hosting.imagekit.io//67bd5de7d7284435/facebook.png?Expires=1834659823&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=Q3MgNGs1Jso~sjt298M6H-vs8QWdp~OxEKGNi1BF1Wq3uJwZqz2NeeW1BSNFKjYNxGR4otU8ssEUvdJ9TJMsbGUs6S1dxJiJ6ln3gxasE5ir4yXdWf1~fm-yQdE9F7Bssys1mf1aDBJjDG0ro7pHSILRd1v7eN~KS6VItz1k7kNejlwi84h0X6pjeIy5Lh7Zhilmc2ON5XD2Zio9oQa1OUJhj2D9ZXxR84ubLtUY4dmiESDaLtsUX0Gjvm6R0nXMkRL0oIxuIsgxi3JnmjesQgldTr4s9AIsgDmYy24DGbuaLji3epak-9fG0lyxZyyLQYfYmt8Wq-0PN0QDs2yQkQ__",
        style1: { width: "30px", height: "30px" },
        links1: "https://www.facebook.com",

        iconsrc2:
          "https://media-hosting.imagekit.io//29eaf64e0e144a39/twitter.png?Expires=1834659855&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=tMMasC4XY4z4xl3DzTIcSSXTBBH-eMULL3w0WH5nHGsu0zVlz8~HLSw5nfiw2iBgB~J4QPle2LM4ow1aPq0x2cCUvAHLQ8IG9P5-KSV0Em2C1eZuXFaScWasYxeX9OAV1uIRBBvQxvId20IbNK7c9eBBUy12Htg2rjE2p8zCtqhwy5Ef6AqOogF3G7FcKpY8-DMNLKVrsagHuhP2R7m9gndSODhxsfSp17lW4R0wgo73IZicToB~U1mdlNOe2I7WKXGV3znS3u0P9NYdU4KR7DLmGX7NhEQaSQ1rF7yN6lL8tZHfPNoBCh50CbkuM16wf6qCcrHlcta1sPjlgfhTdg__",
        style2: { width: "55px", height: "55px" },
        links2: "https://www.twitter.com",

        iconsrc3:
          "https://media-hosting.imagekit.io//cfa67b595a694323/instagram.png?Expires=1834659862&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=F~x667oLkHSCCRT94amSjjg-7YvZGcUgYUBAOS8PyHS6fKhyxIg1BNFqgBrI-Wfibxvg9Ju~S4TxBkdF~PAhJqW4skqoNoWnadypcOGEWQnsK4Vt34cegUPk1WkeIWFz2twm1ase7PsFMgZFHQPYmH5iZsMlCSvkwyAnIhLOJHcKuUz6YeI8wAhCAvI7mZp4oLbICW08nHqJIhfrP5h4tYZ74PHgw5Z6NGeRrXMHph~itymPichKycdyv92m~3EozEAo~qrXeuF0hbU1H2hEeTqbiQU1dnDJXlA~Nq6r1QtFhJXMoSYv7Tw~qoQqyUZqwQw8cQ7XjSBrW0-fMXq6GA__",
        style3: { width: "30px", height: "30px" },
        links3: "https://www.instagram.com",

        iconsrc4:
          "https://media-hosting.imagekit.io//24a0e8c0dfbd44da/youtube.png?Expires=1834659634&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=hKVEIuwIlua~7-1jjd~A0vSiyD9UYbdSHvQHs7nUNyetORS16hhvkxUSuQdkxNmmx~2h3JRNia3qZamzljVLCTlEiqF9OofWaXvenvzpF3tp3SkHei8WjQ5ZJdLT~YMgRgANJz7rYArnQugBukzmkHbg57GNJFTNrShLyFkSepwDlLG6nbo7qdPPmDNDyAbwhIlReMOgAnU7Mb1FsBd98TXbImb8hyiiUsM2zgTK0eEwGM1llYJlavFgrvwPbMenHEf37N~I56Z7H9ZUEPXmpZpJGIJONVVOkld~TuzfWLa52ogLEKb8ugc9gMrKJVdnL4fdrUoj7fyT~aWVxugQ0A__",
        style4: { width: "30px", height: "30px" },
        links4: "https://www.youtube.com",

        ContentStyle: {
          width: "100%",
          backgroundColor: "white",
          borderRadius: "10px",
          textAlign: "center",
        },
      },
    ]);
  };
  const handleLinksClick2 = (e, link) => {
    if (link) {
      window.open(link.startsWith("http") ? link : `http://${link}`, "_blank");
    }
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
    // Validate required fields
    if (!previewContent || previewContent.length === 0) {
      toast.warning("No preview content available.");
      return;
    }
    if (
      !emailData ||
      !emailData.recipient ||
      !emailData.subject ||
      !emailData.previewtext ||
      !emailData.scheduledTime
    ) {
      toast.warning("Please fill in all required fields.");
      return;
    }
    setIsLoadingsch(true);

    try {
      let recipients = emailData.recipient
        .split(",")
        .map((email) => email.trim());

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
        exceldata: [{}],
        status: "Scheduled On",
        scheduledTime: new Date(emailData.scheduledTime).toISOString(),
        senddate: new Date().toLocaleString(),
        user: user.id,
        groupId: "no group",
      };

      const campaignResponse = await axios.post(
        `${apiConfig.baseURL}/api/stud/camhistory`,
        campaignHistoryData
      );

      console.log("Initial Campaign History Saved:", campaignResponse.data);
      localStorage.setItem("camhistory", JSON.stringify(campaignResponse.data));
      toast.success("Email scheduled successfully!");
      navigate("/home");
    } catch (error) {
      console.error("Error scheduling email:", error);
      toast.error("Failed to schedule email.");
    } finally {
      setIsLoadingsch(false);
    }
  };

  //Normal Send Email
  const sendEmail = async () => {
    // Validate required fields
    if (!previewContent || previewContent.length === 0) {
      toast.warning("No preview content available.");
      return;
    }
    if (
      !emailData ||
      !emailData.recipient ||
      !emailData.subject ||
      !emailData.previewtext
    ) {
      toast.warning("Please fill in all required fields.");
      return;
    }
    setIsLoading(true);
    navigate("/home");

    try {
      let recipients = emailData.recipient
        .split(",")
        .map((email) => email.trim());
      let sentEmails = [];
      let failedEmails = [];

      // Store initial campaign history with "Pending" status
      const campaignHistoryData = {
        campaignname: campaign.camname,
        groupname: "No Group",
        totalcount: recipients.length,
        recipients: "no mail",
        sendcount: 0,
        failedcount: 0,
        sendEmails: 0,
        failedEmails: 0,
        subject: emailData.subject,
        previewtext: emailData.previewtext,
        previewContent,
        bgColor,
        exceldata: [{}],
        scheduledTime: new Date(),
        status: "Pending",
        senddate: new Date().toLocaleString(),
        user: user.id,
        groupId: "no group",
      };

      const campaignResponse = await axios.post(
        `${apiConfig.baseURL}/api/stud/camhistory`,
        campaignHistoryData
      );
      const campaignId = campaignResponse.data.id; // Assume response includes campaign ID
      console.log("Initial Campaign History Saved:", campaignResponse.data);

      // Start sending emails
      await Promise.all(
        recipients.map(async (email) => {
          try {
            const response = await axios.post(
              `${apiConfig.baseURL}/api/stud/sendtestmail`,
              {
                emailData: {
                  ...emailData,
                  recipient: email,
                },
                previewContent,
                bgColor,
                userId: user.id,
              }
            );

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
        })
      );

      // Update campaign history with final status
      const finalStatus = failedEmails.length > 0 ? "Failed" : "Success";
      await axios.put(
        `${apiConfig.baseURL}/api/stud/camhistory/${campaignId}`,
        {
          sendcount: sentEmails.length,
          sentEmails: sentEmails,
          failedEmails: failedEmails.length > 0 ? failedEmails : 0,
          failedcount: failedEmails.length > 0 ? failedEmails.length : 0, // Ensure failedcount is 0, not an empty array
          status: finalStatus,
        }
      );
      console.log("status updated:", finalStatus);
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
    else if (type === "imagewithtext") addImageText();
    else if (type === "textwithimage") addTextImage();
    else if (type === "video-icon") addVideo();
    else if (type === "icons") addSocialMedia();

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
            <span style={{ color: "#2f327D" }}>{campaign.camname}</span>{" "}
            <span style={{ color: "#f48c06" }}>Campaign</span>
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
                onDragStart={(e) => handleDragStart("multi-image")}
              >
                <FaImage /> Multi-Image
              </button>

              <button
                onClick={addTextImage}
                className="editor-button"
                draggable
                onDragStart={(e) => handleDragStart("textwithimage")}
              >
                <FaImage /> Text-Image
              </button>
              <button
                onClick={addImageText}
                className="editor-button"
                draggable
                onDragStart={(e) => handleDragStart("imagewithtext")}
              >
                <FaImage /> Image-Text
              </button>

              <button
                onClick={addVideo}
                className="editor-button"
                onDragStart={(e) => handleDragStart("video-icon")}
              >
                <FaVideo />
                Video
              </button>
              <button
                onClick={addSocialMedia}
                className="editor-button"
                onDragStart={(e) => handleDragStart("image")}
              >
                <FaGlobe />
                Social Icons
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

                {previewContent[selectedIndex]?.type === "icons" && (
                  <>
                    <div className="editor-bg">
                      Background Color
                      <input
                        type="color"
                        value={
                          previewContent[selectedIndex]?.ContentStyle
                            ?.backgroundColor || "#ffffff"
                        }
                        onChange={(e) =>
                          updateContent(selectedIndex, {
                            ContentStyle: {
                              ...previewContent[selectedIndex].ContentStyle,
                              backgroundColor: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <label>Link1:</label>
                    <input
                      type="text"
                      placeholder="Enter URL"
                      value={previewContent[selectedIndex].links1 || ""}
                      onChange={(e) =>
                        updateContent(selectedIndex, { links1: e.target.value })
                      }
                    />

                    <label>Link2:</label>
                    <input
                      type="text"
                      placeholder="Enter URL"
                      value={previewContent[selectedIndex].links2 || ""}
                      onChange={(e) =>
                        updateContent(selectedIndex, { links2: e.target.value })
                      }
                    />

                    <label>Link3:</label>
                    <input
                      type="text"
                      placeholder="Enter URL"
                      value={previewContent[selectedIndex].links3 || ""}
                      onChange={(e) =>
                        updateContent(selectedIndex, { links3: e.target.value })
                      }
                    />

                    <label>Link4:</label>
                    <input
                      type="text"
                      placeholder="Enter URL"
                      value={previewContent[selectedIndex].links4 || ""}
                      onChange={(e) =>
                        updateContent(selectedIndex, { links4: e.target.value })
                      }
                    />
                  </>
                )}

                {previewContent[selectedIndex].type === "link-image" && (
                  <>
                    <label>Size (%):</label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={parseInt(
                        previewContent[selectedIndex].style.width.replace(
                          "%",
                          ""
                        )
                      )}
                      onChange={(e) => {
                        const newSize = e.target.value;
                        updateContent(selectedIndex, {
                          style: {
                            ...previewContent[selectedIndex].style,
                            width: `${newSize}%`,
                            // height: `${newSize * 5}px`, // Adjusting height based on size percentage
                          },
                        });
                      }}
                    />
                    <span>
                      {parseInt(
                        previewContent[selectedIndex].style.width.replace(
                          "%",
                          ""
                        )
                      )}
                      %
                    </span>

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
                    <label>Size (%):</label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={
                        parseInt(
                          previewContent[selectedIndex].style.width.replace(
                            "%",
                            ""
                          )
                        ) || 50
                      }
                      onChange={(e) => {
                        const newSize = e.target.value;
                        updateContent(selectedIndex, {
                          style: {
                            ...previewContent[selectedIndex].style,
                            width: `${newSize}%`,
                            // height: `${newSize * 5}px`, // Adjusting height based on size percentage
                          },
                        });
                      }}
                    />
                    <span>
                      {parseInt(
                        previewContent[selectedIndex].style.width.replace(
                          "%",
                          ""
                        )
                      ) || 50}
                      %
                    </span>

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
                  </>
                )}

                {previewContent[selectedIndex].type === "textwithimage" && (
                  <>
                    <div className="editor-bg">
                      Background Color
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
                    <div className="editor-bg">
                      Text Color
                      <input
                        type="color"
                        value={
                          previewContent[selectedIndex].style.color || "#ffffff"
                        }
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
                  </>
                )}

                {previewContent[selectedIndex].type === "imagewithtext" && (
                  <>
                    <div className="editor-bg">
                      Background Color
                      <input
                        type="color"
                        value={
                          previewContent[selectedIndex].style1
                            .backgroundColor || "#ffffff"
                        }
                        onChange={(e) =>
                          updateContent(selectedIndex, {
                            style1: {
                              ...previewContent[selectedIndex].style1,
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
                        value={
                          previewContent[selectedIndex].style1.color ||
                          "#ffffff"
                        }
                        onChange={(e) =>
                          updateContent(selectedIndex, {
                            style1: {
                              ...previewContent[selectedIndex].style1,
                              color: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </>
                )}

                {previewContent[selectedIndex].type === "video-icon" && (
                  <>
                    <label>Size (%):</label>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={parseInt(
                        previewContent[selectedIndex].style.width.replace(
                          "%",
                          ""
                        )
                      )}
                      onChange={(e) => {
                        const newSize = e.target.value;
                        updateContent(selectedIndex, {
                          style: {
                            ...previewContent[selectedIndex].style,
                            width: `${newSize}%`,
                            // height: `${newSize}px`, // Adjusting height based on size percentage
                          },
                        });
                      }}
                    />
                    <span>
                      {parseInt(
                        previewContent[selectedIndex].style.width.replace(
                          "%",
                          ""
                        )
                      )}
                      %
                    </span>

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

                {previewContent[selectedIndex].type === "image" && (
                  <>
                    <label>Size (%):</label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={parseInt(
                        previewContent[selectedIndex].style.width.replace(
                          "%",
                          ""
                        )
                      )}
                      onChange={(e) => {
                        const newSize = e.target.value;
                        updateContent(selectedIndex, {
                          style: {
                            ...previewContent[selectedIndex].style,
                            width: `${newSize}%`,
                            // height: `${newSize * 5}px`, // Adjusting height based on size percentage
                          },
                        });
                      }}
                    />
                    <span>
                      {parseInt(
                        previewContent[selectedIndex].style.width.replace(
                          "%",
                          ""
                        )
                      )}
                      %
                    </span>

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

                    {item.type === "video-icon" ? (
                      <div className="video-icon">
                        <img
                          src={item.src1 || "https://via.placeholder.com/200"}
                          alt="Editable"
                          className="videoimg"
                          title="Upload Thumbnail Image"
                          style={item.style}
                          onClick={() => uploadImage(index, 1)}
                        />
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={item.src2}
                            className="video-btn"
                            alt="icon"
                          />
                        </a>
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

                    {item.type === "icons" && (
                      <div
                        className="border"
                        style={item.ContentStyle}
                        key={index}
                      >
                        <div className="icon-containers">
                          <a
                            href={item.links1 || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => handleLinksClick2(e, item.links1)}
                          >
                            <img
                              src={item.iconsrc1}
                              alt="Facebook"
                              className="icon"
                              style={item.style1}
                            />
                          </a>

                          <a
                            href={item.links2 || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => handleLinksClick2(e, item.links2)}
                          >
                            <img
                              src={item.iconsrc2}
                              alt="Twitter"
                              className="icon"
                              rel="noopener noreferrer"
                              style={item.style2}
                            />
                          </a>

                          <a
                            href={item.links3 || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => handleLinksClick2(e, item.links3)}
                          >
                            <img
                              src={item.iconsrc3}
                              alt="Instagram"
                              className="icon"
                              style={item.style3}
                            />
                          </a>

                          <a
                            href={item.links4 || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => handleLinksClick2(e, item.links4)}
                          >
                            <img
                              src={item.iconsrc4}
                              alt="Youtube"
                              className="icon"
                              style={item.style4}
                            />
                          </a>
                        </div>
                      </div>
                    )}

                    {item.type === "imagewithtext" ? (
                      <div className="image-text-container">
                        <div className="image-text-wrapper" style={item.style1}>
                          <img
                            src={item.src1 || "https://via.placeholder.com/200"}
                            alt="Editable"
                            className="image-item"
                            title="Upload Image"
                            onClick={() => uploadImage(index, 1)}
                          />
                          <p
                            className="text-item"
                            contentEditable
                            suppressContentEditableWarning
                            onClick={() => setModalIndex(index)} // Open modal for this index
                            style={item.style}
                            dangerouslySetInnerHTML={{ __html: item.content1 }}
                          />
                        </div>
                        {modalIndex === index && ( // Open only for the selected index
                          <ParaEditor
                            isOpen={true}
                            content={item.content1}
                            onSave={(newContent) => {
                              updateContent(index, { content1: newContent });
                              setModalIndex(null); // Close modal after save
                            }}
                            onClose={() => setModalIndex(null)}
                          />
                        )}
                      </div>
                    ) : null}

                    {item.type === "textwithimage" ? (
                      <div className="image-text-container">
                        <div className="image-text-wrapper" style={item.style}>
                          <p
                            className="text-item"
                            contentEditable
                            suppressContentEditableWarning
                            onClick={() => setModalIndex(index)} // Open modal for this index
                            style={item.style}
                            dangerouslySetInnerHTML={{ __html: item.content2 }}
                          />
                          <img
                            src={item.src2 || "https://via.placeholder.com/200"}
                            alt="Editable"
                            className="image-item"
                            title="Upload Image"
                            onClick={() => uploadImage(index, 2)}
                          />
                        </div>
                        {modalIndex === index && ( // Open only for the selected index
                          <ParaEditor
                            isOpen={true}
                            content={item.content2}
                            onSave={(newContent) => {
                              updateContent(index, { content2: newContent });
                              setModalIndex(null); // Close modal after save
                            }}
                            onClose={() => setModalIndex(null)}
                          />
                        )}
                      </div>
                    ) : null}

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

              {/* Toggle Button for Scheduled Mail */}
              <div className="toggle-container">
                <span>
                  {isScheduled
                    ? "Scheduled Mail Enabled :"
                    : "Scheduled Mail Disabled :"}
                </span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={isScheduled}
                    onChange={() => setIsScheduled(!isScheduled)}
                  />
                  <span className="slider-send round"></span>
                </label>
              </div>

              {/* Show scheduled time input only if the toggle is enabled */}
              {isScheduled && (
                <div>
                  <label htmlFor="schedule-time">Set Schedule Time:</label>{" "}
                  <input
                    type="datetime-local"
                    value={emailData.scheduledTime}
                    onChange={(e) =>
                      setEmailData({
                        ...emailData,
                        scheduledTime: e.target.value,
                      })
                    }
                  />
                </div>
              )}
              <button
                onClick={sendEmail}
                className="modal-button"
                disabled={isLoading || isScheduled} // Disable if scheduled is enabled
              >
                {isLoading ? "Processing..." : "Send Now"}
              </button>
              <button
                onClick={sendscheduleEmail}
                disabled={isLoadingsch || !isScheduled} // Disable if scheduled is not enabled
                className="modal-button"
              >
                {isLoadingsch ? "Processing..." : "Scheduled"}
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
