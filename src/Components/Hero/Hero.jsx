import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import heroimg from '../../assets/Images/Hero-img.png';
import pdf from '../../assets/Images/pdf.png';
import ai from '../../assets/Images/ai.png';
import jpg from '../../assets/Images/jpg.png';
import png from '../../assets/Images/png.png';
import mp4 from '../../assets/Images/mp4.png';
import docx from '../../assets/Images/docx.png';
import xlsx from '../../assets/Images/xlsx.png';
import txt from '../../assets/Images/txt.png';
import zip from '../../assets/Images/zip.png';
import gif from '../../assets/Images/gif.png';
import svg from '../../assets/Images/svg.png';
import mp3 from '../../assets/Images/mp3.png';
import pptx from '../../assets/Images/pptx.png';
import psd from '../../assets/Images/psd.png';
import json from '../../assets/Images/json.png';
import xml from '../../assets/Images/xml.png';
import html from '../../assets/Images/html.png';
import css from '../../assets/Images/css.png';
import js from '../../assets/Images/js.png';
import c from '../../assets/Images/c.png';
import cpp from '../../assets/Images/cpp.png';
import py from '../../assets/Images/py.png';
import rb from '../../assets/Images/rb.png';
import defaultfile from '../../assets/Images/file.png';

import './Hero.css';
import {
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  db,
  doc,
  setDoc,
  arrayUnion,
  updateDoc,
  getDoc,
} from '../../firebase-config';
import { toast } from 'react-toastify';
const Hero = () => {
  const [fileMetadata, setFileMetadata] = useState();
  const [file, setFile] = useState(null);
  const [roomId, setRoomId] = useState('');
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState(null);
  const [files, setFiles] = useState([]);
  const [icons, setIcons] = useState({
    pdf,
    jpg,
    png,
    mp4,
    docx,
    xlsx,
    txt,
    illustrator:ai,
    zip,
    gif,
    svg,
    mp3,
    pptx,
    psd,
    json,
    xml,
    html,
    css,
    js,
    c,
    cpp,
    py,
    rb,
  });
  const fetchRoomData = async () => {
    const roomIdFromCookie = document.cookie.split('=')[1];
    if (!roomIdFromCookie || roomIdFromCookie == 'roomId=') {
      setRoomId(null);
      setFiles([]);
      return;
    }

    try {
      const docRef = doc(db, 'Rooms', roomIdFromCookie);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        const roomData = snapshot.data();
        if (!roomData.files || roomData.files.length === 0) {
          setFiles([]);
          setRoomId(roomIdFromCookie);
          return;
        }

        const currentTime = new Date().getTime();
        const maxAgeThreshold = 12 * 60 * 60 * 1000;

        const updatedFiles = [];
        const filesToDelete = [];

        for (const file of roomData.files) {
          const createdAt = file.createdAt.toMillis();
          const fileAgeInMs = currentTime - createdAt;

          if (fileAgeInMs > maxAgeThreshold) {
            filesToDelete.push(file);
          } else {
            updatedFiles.push(file);
          }
        }

        if (filesToDelete.length > 0) {
          for (const file of filesToDelete) {
            const index = roomData.files.findIndex(
              (f) => f.storagePath === file.storagePath
            );
            if (index !== -1) {
              updatedFiles.splice(index, 1);
            }
          }
        }

        await updateDoc(docRef, { files: updatedFiles });

        setFiles(updatedFiles);
        setRoomId(roomIdFromCookie);
      } else {
        setFiles([]);
        setRoomId(null);
        setFile(null);
        setFileMetadata(null);
        toast.error('Room not found');
        setRoomId('');
      }
    } catch (error) {
      console.error('Error fetching room data:', error);
      setFiles([]);
      setRoomId(null);
      toast.error(`Error joining room: ${error.message}`);
    }
  };

  const generateRandomId = () => {
    const uuid = uuidv4().toUpperCase().replace(/-/g, '').substring(0, 9);
    return `${uuid.substr(0, 3)}-${uuid.substr(3, 3)}-${uuid.substr(6)}`;
  };

  const generateFileName = (originalFileName) => {
    const fileNameWithoutExtension = originalFileName.split('.')[0];
    const extension = originalFileName.split('.').slice(1).join('.');
    return `${fileNameWithoutExtension}[$]${Math.floor(
      Math.random() * 10000
    )}.${extension}`;
  };

  const createRoom = async () => {
    if (!roomId) {
      const newRoomId = generateRandomId();
      setFile('');
      setFiles([]);
      setFileMetadata('');
      setProgress('');

      try {
        const docRef = doc(db, 'Rooms', newRoomId);
        await setDoc(docRef, { files: [] });
        setRoomId(newRoomId);
        document.cookie = `roomId=${newRoomId}`;
        toast.success('Room created successfully: ' + newRoomId);
      } catch (error) {
        console.error('Error creating room:', error);
        toast.error('Error creating room: ' + error);
      }
    } else {
      console.log('First leave the current room to create a new one.');
      toast.error('First leave the current room to create a new one.');
    }
  };

  const handleFile = (selectedFile) => {
    if (roomId) {
      if (selectedFile && selectedFile.size / (1024 * 1024) <= 3) {
        setFile(selectedFile);
        const newFileMetadata = {
          fileName: generateFileName(selectedFile.name),
          fileSize: (selectedFile.size / (1024 * 1024)).toFixed(2),
          fileType: selectedFile.type.split('/')[1],
          createdAt: new Date(),
        };
        setFileMetadata(newFileMetadata);
      } else {
        toast.error('File size exceeds 3 MB or no file selected.');
      }
    } else {
      toast.error('You need to join a room to upload files.');
    }
  };

  const handleLeaveRoom = () => {
    document.cookie = 'roomId=;';
    document.getElementById('progressbar').style.display = 'none';
    setFiles([]);
    setProgress(0);
    setRoomId(null);
  };

  useEffect(() => {
    const handleCookieChange = () => {
      fetchRoomData();
    };
    if (document.cookie.split('=')[1]?.length > 0) {
      setRoomId(document.cookie.split('=')[1]);
      fetchRoomData();
    }

    const handlePaste = (e) => {
      const clipboardFile = e.clipboardData.items[0].getAsFile();
      if (clipboardFile && clipboardFile.size / (1024 * 1024) <= 3) {
        handleFile(clipboardFile);
      } else {
        toast.error('File size exceeds 3 MB or no file pasted.');
      }
    };

    window.addEventListener('cookieChange', handleCookieChange);
    window.addEventListener('paste', handlePaste);
    window.addEventListener('leaveRoom', handleLeaveRoom);

    return () => {
      window.removeEventListener('paste', handlePaste);
      window.removeEventListener('cookieChange', handleCookieChange);
      window.removeEventListener('leaveRoom', handleLeaveRoom);
    };
  }, []);

  useEffect(() => {
    const uploadFile = async () => {
      try {
        if (file && fileMetadata && roomId) {
          const storageRef = ref(storage, 'Files/' + fileMetadata.fileName);
          const uploadTask = uploadBytesResumable(storageRef, file);
          document.getElementById('progress-bar').style.display = 'flex';
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setProgress(progress);
            },
            (error) => {
              console.error('Error uploading file:', error);
              toast.error('Error uploading file: ' + error.message);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref)
                .then((downloadURL) => {
                  setUrl(downloadURL);
                  const updatedFileMetadata = {
                    ...fileMetadata,
                    url: downloadURL,
                  };
                  const docRef = doc(db, 'Rooms', roomId);

                  updateDoc(docRef, { files: arrayUnion(updatedFileMetadata) })
                    .then(() => {
                      console.log(
                        'Document successfully updated with file metadata!'
                      );
                      setFiles((prevFiles) => [
                        ...prevFiles,
                        updatedFileMetadata,
                      ]);
                    })
                    .catch((error) => {
                      console.error('Error updating document: ', error);
                      toast.error('Error updating document: ' + error.message);
                    });
                })
                .catch((error) => {
                  console.error('Error getting download URL:', error);
                  toast.error('Error getting download URL: ' + error.message);
                });
            }
          );
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        toast.error('Error uploading file: ' + error.message);
      }
    };

    uploadFile();
    fetchRoomData();
  }, [file, fileMetadata, roomId]);
  const downloadFile = (url, filename) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        // Create a temporary URL for the Blob
        const blobUrl = window.URL.createObjectURL(blob);

        // Create a temporary <a> element and trigger the download
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename || 'download'; // Set default filename if not provided
        document.body.appendChild(a);
        a.click();

        // Clean up: remove the temporary <a> and revoke the Blob URL
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch((error) => {
        console.error('Error downloading file:', error);
        // Handle any errors here
      });
  };

  return (
    <div
      id="hero"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        if (roomId) {
          handleFile(e.dataTransfer.files[0]);
        } else {
          toast.error('You must join a room to drop files.');
        }
      }}
    >
      <div id="hero-left">
        <div id="hero-content">
          <h1>Dropify</h1>
          <h3>Share files quicker than you can say 'upload'! ⚡📂</h3>
          <h4>
            Join rooms, drop files, and share IDs—because sharing is caring
            ❤️📁.
          </h4>
        </div>
        <div id="files-container">
          <div id="uploadFiles">
            <div id="createRoom">
              <h4>{roomId ? `Room Id: ${roomId}` : ''}</h4>

              <div id="createRoom-btns">
                <button
                  className="create-btn"
                  onClick={() => {
                    if (!roomId) {
                      createRoom();
                    } else {
                      toast.error(
                        'First leave the current room to create a new one.'
                      );
                    }
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.25rem"
                    height="1.25rem"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  >
                    <path d="M12 19v-7m0 0V5m0 7H5m7 0h7"></path>
                  </svg>
                  Create Room
                </button>

                <button
           
                  className="copy"
                  onClick={() => {
                    if (roomId) {
                      navigator.clipboard.writeText(roomId);
                    } else {
                      toast.error('Create Room First');
                    }
                  }}
                >
                  <span
                    data-text-end="Copied!"
                    data-text-initial="Copy to clipboard"
                    className="tooltip"
                  ></span>
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 6.35 6.35"
                      width="20"
                      height="20"
                      className="clipboard"
                    >
                      <g>
                        <path
                          fill="currentColor"
                          d="M2.43.265c-.3 0-.548.236-.573.53h-.328a.74.74 0 0 0-.735.734v3.822a.74.74 0 0 0 .735.734H4.82a.74.74 0 0 0 .735-.734V1.529a.74.74 0 0 0-.735-.735h-.328a.58.58 0 0 0-.573-.53zm0 .529h1.49c.032 0 .049.017.049.049v.431c0 .032-.017.049-.049.049H2.43c-.032 0-.05-.017-.05-.049V.843c0-.032.018-.05.05-.05zm-.901.53h.328c.026.292.274.528.573.528h1.49a.58.58 0 0 0 .573-.529h.328a.2.2 0 0 1 .206.206v3.822a.2.2 0 0 1-.206.205H1.53a.2.2 0 0 1-.206-.205V1.529a.2.2 0 0 1 .206-.206z"
                        ></path>
                      </g>
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      className="checkmark"
                    >
                      <g>
                        <path
                          fill="currentColor"
                          d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
                        ></path>
                      </g>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
            <div
              id="droparea"
              onClick={() => {
                if (roomId) {
                  document.getElementById('file').click();
                } else {
                  toast.error('Create Room First');
                }
              }}
            >
              <input
                type="file"
                id="file"
                hidden
                onChange={(e) => {
                  if (roomId) {
                    handleFile(e.target.files[0]);
                  } else {
                    toast.error('Create Room First');
                  }
                }}
              />
              <p>
                Drag and drop your files here, or click to browse and paste
                them!
              </p>
            </div>
            <div id="progress-bar">
              <img
                src={icons[fileMetadata?.fileType] || defaultfile}
                alt="fileicon"
                id="progress-bar-left"
                className="fileicon"
              />
              <div id="progress-bar-right">
                <div id="progress-bar-content">
                  <h4>{fileMetadata?.fileName?.split('[$]')[0] || ''}</h4>
                  <span>{progress > 0 && `${Math.floor(progress)}%`}</span>
                </div>
                <div id="progress-wrapper">
                  <div
                    id="progress-bar-status"
                    style={{ width: `${progress}%`, backgroundColor: 'black' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div id="downloadFiles">
            {files
              .slice()
              .reverse()
              .map((file, index) => (
                <div key={index} className="file">
                  <img
                    src={icons[file.fileType] || defaultfile}
                    alt="File icon"
                    className="fileicon"
                  />
                  <h5 className="filename">{file.fileName.split('[$]')[0]}</h5>
                  <a
                    className="download-btn"
                    onClick={() => downloadFile(file.url, file.filename)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="1em"
                      viewBox="0 0 384 512"
                      className="svgIcon"
                    >
                      <path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path>
                    </svg>
                    <span className="icon2"></span>
                  </a>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div id="hero-right">
        <img src={heroimg} alt="Hero" />
      </div>
    </div>
  );
};

export default Hero;
