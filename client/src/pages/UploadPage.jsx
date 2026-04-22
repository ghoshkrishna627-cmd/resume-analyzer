// ============================================================
// pages/UploadPage.jsx - Resume Upload & Analysis Page
// ============================================================

import React, { useState, useRef } from "react";
import api from "../api/axios";

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  // ── Handle file selection (from input or drag) ──
  const handleFileChange = (selectedFile) => {
    setError("");
    setResult(null);
    if (!selectedFile) return;
    if (selectedFile.type !== "application/pdf") {
      setError("Only PDF files are accepted. Please upload a .pdf file.");
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size must be under 5MB.");
      return;
    }
    setFile(selectedFile);
  };

  // ── Drag & Drop handlers ──
  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    handleFileChange(dropped);
  };

  // ── Upload to backend ──
  const handleUpload = async () => {
    if (!file) { setError("Please select a PDF file first."); return; }

    const formData = new FormData();
    formData.append("resume", file);

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await api.post("/api/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => { setFile(null); setResult(null); setError(""); };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">

        {/* ── Page Header ── */}
        <div className="mb-10 animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-ink-900 border border-ink-800 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 rounded-full bg-acid-400 animate-pulse-slow"></span>
            <span className="text-xs font-mono text-ink-400">AI-powered extraction</span>
          </div>
          <h1 className="text-4xl font-display font-800 text-white mb-3 leading-tight">
            Analyze Your<br />
            <span className="text-acid-400">Resume</span>
          </h1>
          <p className="text-ink-400 font-body text-base max-w-md">
            Upload your PDF resume and instantly extract contact info, skills, and more.
          </p>
        </div>

        {/* ── Upload Card ── */}
        {!result && (
          <div className="card animate-fade-up" style={{ animationDelay: "0.1s" }}>

            {/* Drop zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer
                transition-all duration-300 group
                ${dragging
                  ? "border-acid-400 bg-acid-400/5 drop-zone-active"
                  : file
                  ? "border-acid-400/60 bg-acid-400/5"
                  : "border-ink-700 hover:border-ink-500 bg-ink-900/50"
                }
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files[0])}
              />

              {file ? (
                /* File selected state */
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-acid-400/10 border border-acid-400/30 flex items-center justify-center">
                    <svg className="w-7 h-7 text-acid-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-display font-600 text-white">{file.name}</p>
                    <p className="text-sm text-ink-500 font-mono mt-1">
                      {(file.size / 1024).toFixed(1)} KB • PDF
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="text-xs text-ink-500 hover:text-red-400 transition-colors mt-1"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                /* Empty state */
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-ink-800 border border-ink-700 flex items-center justify-center group-hover:border-ink-500 transition-colors">
                    <svg className="w-7 h-7 text-ink-500 group-hover:text-ink-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-display font-600 text-ink-200">
                      Drop your resume here
                    </p>
                    <p className="text-sm text-ink-500 mt-1">
                      or <span className="text-acid-400">browse files</span> — PDF only, max 5MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Error message */}
            {error && (
              <div className="mt-4 flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Upload Button */}
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={handleUpload}
                disabled={!file || loading}
                className="btn-primary flex items-center gap-2 flex-1 justify-center"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Analyzing resume...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                    Analyze Resume
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── Results Card ── */}
        {result && (
          <div className="space-y-4 animate-fade-up">

            {/* Success banner */}
            <div className="flex items-center gap-3 bg-acid-400/10 border border-acid-400/30 rounded-xl p-4">
              <svg className="w-5 h-5 text-acid-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-acid-400 font-display font-600">
                Resume analyzed successfully — {result.skills?.length || 0} skills detected
              </p>
              <button onClick={resetAll} className="ml-auto text-xs text-ink-500 hover:text-ink-200 transition-colors">
                New upload
              </button>
            </div>

            {/* Contact Info */}
            <div className="card">
              <h3 className="font-display font-700 text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-acid-400/20 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-acid-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </span>
                Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-ink-800/60 rounded-xl p-4 border border-ink-700/50">
                  <p className="text-xs font-mono text-ink-500 mb-1.5 uppercase tracking-wider">Email</p>
                  <p className="font-display text-white text-sm break-all">{result.email}</p>
                </div>
                <div className="bg-ink-800/60 rounded-xl p-4 border border-ink-700/50">
                  <p className="text-xs font-mono text-ink-500 mb-1.5 uppercase tracking-wider">Phone</p>
                  <p className="font-display text-white text-sm">{result.phone}</p>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="card">
              <h3 className="font-display font-700 text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-acid-400/20 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-acid-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                  </svg>
                </span>
                Skills Detected
                <span className="ml-auto text-xs font-mono text-ink-500 bg-ink-800 px-2 py-0.5 rounded-full">
                  {result.skills?.length || 0} found
                </span>
              </h3>
              {result.skills?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {result.skills.map((skill, i) => (
                    <span key={i} className="skill-badge">{skill}</span>
                  ))}
                </div>
              ) : (
                <p className="text-ink-500 text-sm">No recognized skills found in this resume.</p>
              )}
            </div>

            {/* Raw Text Preview */}
            <div className="card">
              <h3 className="font-display font-700 text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-acid-400/20 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-acid-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                  </svg>
                </span>
                Extracted Text Preview
              </h3>
              <div className="bg-ink-950 rounded-xl p-4 border border-ink-800 max-h-64 overflow-y-auto">
                <pre className="text-xs font-mono text-ink-400 whitespace-pre-wrap leading-relaxed">
                  {result.rawText || "No text extracted."}
                </pre>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default UploadPage;
