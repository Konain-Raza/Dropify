import React, { useEffect, useState } from 'react';
import heroimg from '../../assets/Images/Hero-img.png';
import './Hero.css';
import {
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from '../../firebase-config';

const Hero = () => {
  const [file, setFile] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (document.cookie) {
      setRoomId(document.cookie.split('=')[1]);
    }

    const handlePaste = (e) => {
      const clipboardFile = e.clipboardData.files[0];
      if (clipboardFile && clipboardFile.size / (1024 * 1024) <= 3) {
        setFile({
          fileName: clipboardFile.name.split(".")[0] +"[$]" +  Math.random() * 1000 + clipboardFile.name.split(".")[1],
          fileSize: clipboardFile.size / (1024 * 1024),
          fileType: clipboardFile.type.split('/')[1],
        });
      } else {
        console.log('File size exceeds 3 MB or no file pasted.');
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  useEffect(() => {
    if (file) {
      const storageRef = ref(storage, 'Files/' + file.fileName);
      uploadBytesResumable(storageRef, file)
        .then((snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
          getDownloadURL(snapshot.ref)
            .then((downloadURL) => {
              setUrl(downloadURL);
              console.log('File uploaded successfully:', downloadURL);
            })
            .catch((error) => {
              console.error('Error getting download URL:', error);
            });
        })
        .catch((error) => {
          console.error('Error uploading file:', error);
        });
    }
  }, [file]);

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.size / (1024 * 1024) <= 3) {
      setFile({
        fileName: droppedFile.name.split(".")[0] +"[$]" + Math.random() * 1000 + droppedFile.name.split(".")[0],
        fileSize: droppedFile.size / (1024 * 1024),
        fileType: droppedFile.type.split('/')[1],
      });
    } else {
      console.log('File size exceeds 3 MB or no file dropped.');
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size / (1024 * 1024) <= 3) {
      setFile({
        fileName: selectedFile.name[0].split(".")[0] +"[$]" + Math.random() * 1000 + selectedFile.name[0].split(".")[1],
        fileSize: selectedFile.size / (1024 * 1024),
        fileType: selectedFile.type.split('/')[1],
      });
    } else {
      console.log('File size exceeds 3 MB or no file selected.');
    }
  };

  return (
    <div id="hero">
      <div id="hero-left">
        <div id="hero-content">
          <h1>Dropify</h1>
          <h3>Share files quicker than you can say 'upload'! ⚡📂</h3>
          <h4>Join rooms, drop files, and share IDs—because sharing is caring ❤️📁.</h4>
        </div>
        <div id="createRoom">
          <h4>{roomId || ''}</h4>
          <button>Create Room</button>
          <button>Copy ID</button>
        </div>
        <div
          id="droparea"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          onClick={() => {
            document.getElementById('file').click();
          }}
        >
          <input
            type="file"
            id="file"
            hidden
            onChange={handleFileSelect}
          />
          <p>Drag and drop your files here, or click to browse and paste them!</p>
        </div>
      </div>
      <div id="hero-right">
        <img src={heroimg} alt="Hero" />
      </div>
    </div>
  );
};

export default Hero;
