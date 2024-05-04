import React, { useState } from 'react';
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid'; // Import UUID library
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_apiKey,
    authDomain: process.env.REACT_APP_authDomain,
    projectId: process.env.REACT_APP_projectId,
    storageBucket: process.env.REACT_APP_storageBucket,
    messagingSenderId: process.env.REACT_APP_messagingSenderId,
    appId: process.env.REACT_APP_appId,
    measurementId: process.env.REACT_APP_measurementId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const UploadFile = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            toast.error('No file selected');
            return;
        }

        try {
            // Generate a UUID for the filename
            const uuid = uuidv4();

            // Append the UUID to the filename
            const filenameWithUUID = `${uuid}_${selectedFile.name}`;

            // Create a reference to the storage bucket and the file path
            const storageRef = ref(storage, `${process.env.storageUrl}/${filenameWithUUID}`);

            setUploading(true)

            // Upload the file to the storage bucket
            // eslint-disable-next-line
            const snapshot = await uploadBytes(storageRef, selectedFile);

            toast.success('File uploaded successfully');
            setSelectedFile(null);
            setUploading(false);
        } catch (error) {
            toast.error('Error uploading file');
            setUploading(false);
        }
    };

    return (
        <div style={{ margin: '0 12px', padding: '8px', boxShadow: '0 0 1px', overflow: 'hidden' }}>
            <h1>KS Upload File Service</h1>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                {!selectedFile ? (
                    <p>
                        Select a file
                    </p>
                ) : (
                    <p style={{ color: 'green' }}>
                        File ready to be sent!
                    </p>
                )}
                <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                    <img src={!selectedFile ? "imgs/upload.jpg" : uploading ? "imgs/spin.gif" : "imgs/fileok.avif"} alt="Upload" style={{ width: '350px', height: '350px', border: !selectedFile ? '2px dashed lightgray' : 'none', borderRadius: selectedFile ? '50%' : '0' }} />
                </label>
                <input id="file-upload" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                <div>
                    <button disabled={!selectedFile} style={{ margin: '24px', padding: '12px', fontSize: 'bolder', backgroundColor: selectedFile ? 'green' : 'blue', cursor: selectedFile ? 'pointer' : 'default', border: 'none', borderRadius: '5px', color: 'white', width: '150px' }} onClick={handleFileUpload}>Upload File</button>
                    <button style={{ margin: '24px', padding: '12px', fontSize: 'bolder', border: 'none', borderRadius: '5px', color: 'black', width: '150px' }} onClick={() => { setSelectedFile(null) }}>Cancel</button>
                </div>

            </div>
            <ToastContainer />
        </div>
    );
};

export default UploadFile;
