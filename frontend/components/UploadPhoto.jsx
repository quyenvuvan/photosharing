import React, { useState } from 'react';

function UploadPhoto() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('photo', selectedFile);

    try {
      const response = await fetch('https://psrdvv-8081.csb.app/photos/new', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload photo');
      }

      const data = await response.json();
      setUploadStatus('Upload successful');
      console.log('Uploaded photo:', data);
    } catch (error) {
      console.error('Error uploading photo:', error);
      setUploadStatus('Upload failed');
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Add Photo</button>
      <div>{uploadStatus}</div>
    </div>
  );
}

export default UploadPhoto;
