// ============================================================
// pages/HistoryPage.jsx - View Past Resume Analyses
// ============================================================

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const HistoryPage = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch resume history when the component mounts
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("/api/resume/history");
        setResumes(response.data.resumes);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load history.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Format date nicely
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8 animate-fade-up">
          <h1 className="text-3xl font-display font-800 text-white mb-2">
            Resume <span className="text-acid-400">History</span>
          </h1>
          <p className="text-ink-400 text-sm">All resumes you've analyzed with your account.</p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-acid-400 border-t-transparent animate-spin" />
            <p className="text-ink-500 text-sm font-mono">Loading history...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && resumes.length === 0 && (
          <div className="card text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-ink-800 border border-ink-700 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-ink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-display font-600 text-ink-300 mb-2">No resumes yet</h3>
            <p className="text-ink-500 text-sm mb-6">Upload your first resume to see results here.</p>
            <Link to="/" className="btn-primary inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              Upload Resume
            </Link>
          </div>
        )}

        {/* Resume list */}
        {!loading && resumes.length > 0 && (
          <div className="space-y-3 animate-fade-up">
            {resumes.map((resume, index) => (
              <div
                key={resume._id}
                className="card hover:border-ink-600 transition-colors"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* File info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-acid-400/10 border border-acid-400/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-acid-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="font-display font-600 text-white text-sm truncate">{resume.fileName}</p>
                      <p className="text-xs font-mono text-ink-500 mt-0.5">{formatDate(resume.createdAt)}</p>
                    </div>
                  </div>

                  {/* Skill count badge */}
                  <div className="flex-shrink-0 bg-ink-800 border border-ink-700 rounded-lg px-2.5 py-1 text-xs font-mono text-ink-400">
                    {resume.skills?.length || 0} skills
                  </div>
                </div>

                {/* Contact info */}
                <div className="mt-4 pt-4 border-t border-ink-800 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-xs font-mono text-ink-600 block mb-0.5">Email</span>
                    <span className="text-ink-300 truncate block">{resume.email}</span>
                  </div>
                  <div>
                    <span className="text-xs font-mono text-ink-600 block mb-0.5">Phone</span>
                    <span className="text-ink-300">{resume.phone}</span>
                  </div>
                </div>

                {/* Skills preview */}
                {resume.skills?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {resume.skills.slice(0, 8).map((skill, i) => (
                      <span key={i} className="skill-badge text-xs">{skill}</span>
                    ))}
                    {resume.skills.length > 8 && (
                      <span className="skill-badge text-xs text-ink-500">
                        +{resume.skills.length - 8} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default HistoryPage;
