import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [files, setFiles] = useState([]);
  const [groups, setGroups] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!files.length) return alert('Please select files first!');
    setLoading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    try {
      const res = await axios.post('http://localhost:8000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setGroups(res.data.groups);
    } catch (error) {
      alert('Error uploading files');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Wedding Album Face Recognizer</h1>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading} style={{ marginLeft: '10px' }}>
        {loading ? 'Uploading...' : 'Upload'}
      </button>

      {groups && (
        <div style={{ marginTop: '20px' }}>
          <h2>Grouped Photos:</h2>
          {Object.entries(groups).map(([person, photos]) => (
            <div key={person} style={{ marginBottom: '15px' }}>
              <h3>{person}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {photos.map((photo) => (
                  <img
                    key={photo}
                    src={`http://localhost:8000/uploads/${photo}`}
                    alt={photo}
                    style={{ width: '150px', marginRight: '10px', marginBottom: '10px' }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;