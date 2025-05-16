// src/components/VoiceAgent.jsx
import React, { useState } from 'react';
import { recordAudio } from '../utils/recordAudio';

const VoiceAgent = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = speechSynthesis.getVoices()[0];
    speechSynthesis.speak(utterance);
  };

 const startListening = async () => {
  setLoading(true);
  setMessages([...messages, { from: 'user', text: '🎤 Listening...' }]);
  try {
    console.log("🎙️ Starting recording...");
    const base64Audio = await recordAudio();
    console.log("✅ Got base64 audio:", base64Audio?.slice(0, 100));

    console.log("📤 Sending to server...");
    const res = await fetch('http://localhost:5000/api/voice/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audioBase64: base64Audio }),
    });

    const data = await res.json();
    console.log("✅ Server response:", data);

    setMessages([
      ...messages.slice(0, -1),
      { from: 'user', text: '🎤 (sent audio)' },
      { from: 'agent', text: data.reply }
    ]);
    speak(data.reply);
  } catch (err) {
    console.error("❌ Error during fetch or audio:", err);
    setMessages([
      ...messages,
      { from: 'agent', text: '❌ Error during speech recognition.' }
    ]);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="bg-[#0F0F0F] min-h-screen flex items-center justify-center px-4 py-8">
      <div className="bg-[#1A1A1D] w-full max-w-xl rounded-xl shadow-xl p-6 flex flex-col">
        <h1 className="text-white text-2xl font-bold mb-4 text-center">🎤 Deepgram-style Voice Agent</h1>
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 h-[60vh] pr-2 scrollbar-thin scrollbar-thumb-[#444] scrollbar-track-transparent">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.from === 'user' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-xs px-4 py-3 rounded-2xl text-white text-sm leading-snug ${
                msg.from === 'user'
                  ? 'bg-gradient-to-br from-[#457B9D] to-[#1D3557] rounded-bl-none'
                  : 'bg-gradient-to-br from-[#E63946] to-[#6D597A] rounded-br-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <button
            onClick={startListening}
            className="bg-blue-600 text-white px-6 py-3 rounded-full hover:scale-105 transition-all shadow-md"
            disabled={loading}
          >
            {loading ? '🎙️ Listening...' : '🎙️ Speak Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceAgent;
