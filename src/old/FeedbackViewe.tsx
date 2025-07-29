import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../api/axiosInstance";

interface Question {
  questionId: string;
  questionText: string;
  type: string;
  textAnswer: string;
  selectedAnswers: string[];
}

interface Section {
  sectionTitle: string;
  questions: Question[];
}

interface FeedbackEntry {
  formTitle: string;
  submittedAt: string;
  userEmail?: string;
  sections: Section[];
}

const FeedbackViewer: React.FC = () => {
  const [feedbackList, setFeedbackList] = useState<FeedbackEntry[]>([]);
  const [userFilter, setUserFilter] = useState<string>("");
  const [questionFilter, setQuestionFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [questionSuggestions, setQuestionSuggestions] = useState<string[]>([]);
  const [userSuggestions, setUserSuggestions] = useState<string[]>([]);
  const [showQuestionSuggestions, setShowQuestionSuggestions] = useState<boolean>(true);
  const [showUserSuggestions, setShowUserSuggestions] = useState<boolean>(false);

  useEffect(() => {
    axiosInstance.get("/feedback/all")
      .then(res => setFeedbackList(res.data))
      .catch(err => console.error("Failed to fetch feedback:", err));
  }, []);

  const questionStats = useMemo(() => {
    const counts: Record<string, number> = {};
    const users: Set<string> = new Set();
    feedbackList.forEach(fb => {
      if (fb.userEmail) users.add(fb.userEmail);
      fb.sections.forEach(sec => {
        sec.questions.forEach(q => {
          if (!counts[q.questionText]) counts[q.questionText] = 0;
          counts[q.questionText]++;
        });
      });
    });
    setUserSuggestions(Array.from(users));
    return counts;
  }, [feedbackList]);

  useEffect(() => {
    setQuestionSuggestions(Object.keys(questionStats));
  }, [questionStats]);

  const filteredFeedbacks = feedbackList
    .filter(entry => {
      const matchesUser = userFilter === "" || (entry.userEmail ?? "").includes(userFilter);
      const matchesQuestion = questionFilter === "" || entry.sections.some(section =>
        section.questions.some(q => q.questionText.toLowerCase().includes(questionFilter.toLowerCase()))
      );
      const date = new Date(entry.submittedAt);
      const from = startDate ? new Date(startDate) : null;
      const to = endDate ? new Date(endDate) : null;
      const matchesDate = (!from || date >= from) && (!to || date <= to);
      return matchesUser && matchesQuestion && matchesDate;
    })
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">MedSearch Feedback Summary</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Filter by user email"
            className="border rounded p-2 w-full"
            value={userFilter}
            onChange={e => {
              setUserFilter(e.target.value);
              setShowUserSuggestions(true);
            }}
            onFocus={() => setShowUserSuggestions(true)}
          />
          {userFilter && showUserSuggestions && (
            <ul className="absolute z-10 bg-white border w-full max-h-40 overflow-y-auto mt-1 shadow">
              {userSuggestions
                .filter(email => email.toLowerCase().includes(userFilter.toLowerCase()))
                .map((email, idx) => (
                  <li
                    key={idx}
                    onClick={() => {
                      setUserFilter(email);
                      setShowUserSuggestions(false);
                    }}
                    className="cursor-pointer px-3 py-1 hover:bg-gray-100"
                  >
                    {email}
                  </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Filter by question text"
            className="border rounded p-2 w-full"
            value={questionFilter}
            onChange={e => {
              setQuestionFilter(e.target.value);
              setShowQuestionSuggestions(true);
            }}
            onFocus={() => setShowQuestionSuggestions(true)}
          />
          {questionFilter && showQuestionSuggestions && (
            <ul className="absolute z-10 bg-white border w-full max-h-40 overflow-y-auto mt-1 shadow">
              {questionSuggestions
                .filter(q => q.toLowerCase().includes(questionFilter.toLowerCase()))
                .map((q, idx) => (
                  <li
                    key={idx}
                    onClick={() => {
                      setQuestionFilter(q);
                      setShowQuestionSuggestions(false);
                    }}
                    className="cursor-pointer px-3 py-1 hover:bg-gray-100"
                  >
                    {q} <span className="text-xs text-gray-500">({questionStats[q]} answers)</span>
                  </li>
              ))}
            </ul>
          )}
        </div>

        <input
          type="date"
          className="border rounded p-2 w-full"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="border rounded p-2 w-full"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
        />
      </div>

      {filteredFeedbacks.map((entry, idx) => (
        <div key={idx} className="border rounded-lg shadow p-4 mb-6 bg-white">
          <div className="text-sm text-gray-600 mb-2">
            <span className="font-semibold">Submitted:</span> {new Date(entry.submittedAt).toLocaleString()}<br />
            <span className="font-semibold">User:</span> {entry.userEmail ?? "(Anonymous)"}
          </div>

          <div className="text-lg font-semibold mb-4">{entry.formTitle}</div>

          {entry.sections.map((section, sIdx) => (
            <div key={sIdx} className="mb-6">
              <h3 className="font-semibold text-blue-800 border-b pb-1 mb-2 text-lg">{section.sectionTitle}</h3>

              <div className="grid grid-cols-1 gap-4">
                {section.questions.map((q, qIdx) => (
                  <div key={q.questionId} className="border rounded bg-gray-50 p-4">
                    <div className="text-sm text-gray-500 mb-1">Question</div>
                    <p className="font-medium text-gray-800 mb-2">{q.questionText}</p>

                    {q.textAnswer && (
                      <div>
                        <div className="text-sm text-gray-500">Answer</div>
                        <p className="text-sm text-gray-700 bg-white p-2 border rounded whitespace-pre-wrap">
                          {q.textAnswer}
                        </p>
                      </div>
                    )}

                    {q.selectedAnswers?.length > 0 && (
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Selected Answers</div>
                        <ul className="list-disc list-inside text-sm text-gray-700">
                          {q.selectedAnswers.map((ans, i) => (
                            <li key={i}>{ans}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default FeedbackViewer;