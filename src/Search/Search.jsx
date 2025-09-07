// VoiceCall.jsx
import React, { useRef, useState } from "react";

const API_BASE = ""; // e.g. "http://localhost:5000" or "" if same origin

export default function VoiceCall() {
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const dcRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [muted, setMuted] = useState(false);

  async function startCall() {
    try {
      // 1) get mic
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;

      // 2) create RTCPeerConnection
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" }
          // If you face connectivity issues, add TURN servers here.
        ],
      });
      pcRef.current = pc;

      // play remote audio
      pc.ontrack = (evt) => {
        // evt.streams[0] should be the remote audio stream
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = evt.streams[0];
        }
      };

      // optional: receive text events on datachannel
      pc.ondatachannel = (evt) => {
        const ch = evt.channel;
        ch.onmessage = (m) => {
          try {
            const parsed = JSON.parse(m.data);
            // handle messages (e.g., model events)
            console.log("Model event:", parsed);
          } catch (e) {
            console.log("Data channel raw:", m.data);
          }
        };
      };

      // create an outgoing data channel to receive events (optional)
      const outCh = pc.createDataChannel("oai-events");
      outCh.onopen = () => console.log("datachannel open");
      outCh.onmessage = (e) => console.log("datachannel message:", e.data);
      dcRef.current = outCh;

      // 3) add local tracks
      stream.getTracks().forEach((t) => pc.addTrack(t, stream));

      // 4) create offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // 5) POST offer.sdp to your backend; backend returns answer SDP
      const resp = await fetch(`${API_BASE}/api/gemini-live/offer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sdp: offer.sdp }),
      });

      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error("SDP exchange failed: " + txt);
      }

      const json = await resp.json();
      const answerSdp = json.answer;
      if (!answerSdp) throw new Error("No answer from server");

      // 6) set remote description
      await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });

      setConnected(true);
    } catch (err) {
      console.error("startCall error:", err);
      alert("Call failed: " + (err.message || err));
      cleanup();
    }
  }

  function toggleMute() {
    if (!localStreamRef.current) return;
    localStreamRef.current.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
    setMuted((m) => !m);
  }

  function cleanup() {
    try {
      pcRef.current?.close();
    } catch {}
    pcRef.current = null;
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
    }
    setConnected(false);
  }

  return (
    <div style={{ padding: 16 }}>
      <h3>AI Phone Call (Gemini Live)</h3>
      {!connected ? (
        <button onClick={startCall} style={{ marginRight: 8 }}>
          Start Call
        </button>
      ) : (
        <button onClick={cleanup} style={{ marginRight: 8 }}>
          End Call
        </button>
      )}
      <button onClick={toggleMute} disabled={!connected}>
        {muted ? "Unmute" : "Mute"}
      </button>

      <div style={{ marginTop: 12 }}>
        <div>
          <strong>Remote:</strong>
        </div>
        <audio ref={remoteAudioRef} autoPlay controls style={{ width: "100%" }} />
      </div>
    </div>
  );
}
