import React, { useState } from 'react';
import axios from 'axios';

const AirBridgeUploader = () => {
  const [files, setFiles] = useState([]);
  const [text, setText] = useState('');
  const [link, setLink] = useState('');
  const [code, setCode] = useState('');
  const [qr, setQr] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleUpload = async () => {
    if (!files.length && !text && !link) return alert("Please select a file or enter text/link");

    const sessionId = Math.random().toString(36).substr(2, 6).toUpperCase();
    const formData = new FormData();

    files.forEach((file) => formData.append('files', file));
    if (text) formData.append('text', text);
    if (link) formData.append('link', link);

    try {
      setUploading(true);
      const res = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'x-session-id': sessionId },
      });
      setCode(res.data.code);

      const qrRes = await axios.get(`http://localhost:5000/qrcode/${res.data.code}`);
      setQr(qrRes.data.qr);
    } catch (err) {
      alert('Upload failed!');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>AirBridge Web</h2>

      <input type="file" multiple onChange={handleFileChange} style={styles.input} />
      <textarea
        placeholder="Optional text note"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={styles.textarea}
      />
      <input
        placeholder="Optional link"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        style={styles.input}
      />

      <button onClick={handleUpload} disabled={uploading} style={styles.button}>
        {uploading ? 'Uploading...' : 'Send'}
      </button>

      {code && (
        <div style={styles.result}>
          <p><strong>Code:</strong> {code}</p>
          {qr && <img src={qr} alt="QR Code" style={styles.qr} />}
          <a href={`http://localhost:5000/download/${code}`} target="_blank" rel="noreferrer">Download Link</a>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 400,
    margin: '50px auto',
    padding: 20,
    border: '1px solid #ddd',
    borderRadius: 12,
    fontFamily: 'Arial',
  },
  input: {
    width: '100%',
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    border: '1px solid #ccc',
  },
  textarea: {
    width: '100%',
    height: 100,
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    padding: 12,
    background: '#3f3d56',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
  },
  result: {
    marginTop: 20,
    textAlign: 'center',
  },
  qr: {
    marginTop: 10,
    width: 150,
    height: 150,
  },
};

export default AirBridgeUploader;