import React, { useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import './ParaEditor.css';

const ParaEditor = ({ isOpen, content, onSave, onClose }) => {
  const [editorContent, setEditorContent] = useState(content);
  const editorRef = useRef(null);
  const apiKey = 'hddpazfss5mb3ppinipav37ap1zt3pqs9oz3c897fidqfddq'; // Replace with your TinyMCE API key

  const handleInsertVariable = (value) => {
    if (editorRef.current && editorRef.current.editor) {
      const editor = editorRef.current.editor;
      editor.focus();
      editor.selection.setContent(value);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-para">
      <div className="modal-content-para">
        <Editor
          apiKey={apiKey}
          value={editorContent}
          onEditorChange={(newContent) => setEditorContent(newContent)}
          onInit={(evt, editor) => {
            editorRef.current = { editor };
          }}
          init={{
            menubar: true,
            branding: false,
            plugins: [
               'lists', 'link', 'textcolor', 'colorpicker'],
            toolbar: `
              undo redo | bold italic underline | fontselect fontsize | fontselect fontfamily | 
              alignleft aligncenter alignright | 
              bullist numlist | forecolor backcolor
            `,
          }}
        />

        <div className="button-group">
          <button className='para-btn' onClick={() => onSave(editorContent)}>Save</button>
          <button className='para-btn' onClick={onClose}>Cancel</button>
          <select
            onChange={(e) => {
              handleInsertVariable(e.target.value);
              e.target.value = ''; // Reset selection after insertion
            }}
            className="select-variable-para"
          >
            <option value="" disabled selected>
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
      </div>
    </div>
  );
};

export default ParaEditor;
