'use client';

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState('hi-IN');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleTranslate = async () => {
    if (!file) return;
    setIsTranslating(true);
    setTranslatedText('');

    try {
      const text = await file.text();
      
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language })
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setTranslatedText(data.translatedText);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsTranslating(false);
    }
  };

  const downloadFile = () => {
    const blob = new Blob([translatedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translated_${language}.srt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-[#141414] border border-white/10 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
        
        {/* Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none"></div>

        <h1 className="text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          Sarvam AI Dubber
        </h1>
        <p className="text-gray-400 text-center mb-10 text-lg">
          Upload your movie subtitle (.srt) and translate it into any Indian language instantly.
        </p>

        <div className="space-y-6">
          <div className="relative group cursor-pointer">
            <input 
              type="file" 
              accept=".srt,.txt"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${file ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/20 bg-white/5 group-hover:border-blue-400 group-hover:bg-blue-400/5'}`}>
              {file ? (
                <div className="text-emerald-400 font-medium flex items-center justify-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  {file.name} Selected
                </div>
              ) : (
                <div className="text-gray-400 font-medium">
                  <span className="text-blue-400">Click to upload</span> or drag and drop your .srt file here
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
            >
              <option value="hi-IN">Hindi</option>
              <option value="ta-IN">Tamil</option>
              <option value="te-IN">Telugu</option>
              <option value="bn-IN">Bengali</option>
              <option value="ml-IN">Malayalam</option>
            </select>

            <button 
              onClick={handleTranslate}
              disabled={!file || isTranslating}
              className="flex-1 bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-400 hover:to-emerald-400 text-white rounded-xl px-8 py-4 font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] active:scale-[0.98]"
            >
              {isTranslating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Translating...
                </span>
              ) : (
                "Translate Subtitles"
              )}
            </button>
          </div>
        </div>

        {translatedText && (
          <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Result</h3>
              <button onClick={downloadFile} className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Download .srt
              </button>
            </div>
            <pre className="text-gray-300 text-sm overflow-y-auto max-h-60 p-4 bg-black/50 rounded-xl font-mono border border-white/5">
              {translatedText}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
