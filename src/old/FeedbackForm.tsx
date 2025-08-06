import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";

interface Question {
  questionId: string;
  questionText: string;
  type: "SingleChoice" | "MultipleChoice" | "ShortAnswer" | "Paragraph";
  options?: string[];
  selectedAnswers: string[];
  textAnswer: string;
}

interface Section {
  sectionTitle: string;
  questions: Question[];
}

interface FeedbackFormData {
  formTitle: string;
  sections: Section[];
}

const FeedbackForm: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [formData, setFormData] = useState<FeedbackFormData>({
    formTitle: "MediSearch Experience Feedback",
    sections: [
      {
        sectionTitle: "Usage Frequency",
        questions: [
          {
            questionId: "q1",
            questionText: "How often do you currently use MediSearch?",
            type: "SingleChoice",
            options: ["Daily", "A few times per week", "Rarely", "Never used it"],
            selectedAnswers: [],
            textAnswer: "",
          },
          {
            questionId: "q2",
            questionText: "If you’ve used it before, what have you found helpful?",
            type: "Paragraph",
            selectedAnswers: [],
            textAnswer: "",
          },
          {
            questionId: "q3",
            questionText: "If you haven’t used it or stopped using it, what held you back?",
            type: "Paragraph",
            selectedAnswers: [],
            textAnswer: "",
          },
        ],
      },
      {
        sectionTitle: "Feature Value",
        questions: [
          {
            questionId: "q4",
            questionText: "What’s one feature or capability that would make MediSearch significantly more useful to you?",
            type: "ShortAnswer",
            selectedAnswers: [],
            textAnswer: "",
          },
          {
            questionId: "q5",
            questionText: "What type of information do you wish MediSearch surfaced better or faster?",
            type: "Paragraph",
            selectedAnswers: [],
            textAnswer: "",
          },
          {
            questionId: "q6",
            questionText: "If you could wave a magic wand and improve one part of the experience, what would it be?",
            type: "Paragraph",
            selectedAnswers: [],
            textAnswer: "",
          },
          {
            questionId: "q7",
            questionText: "How do you currently find coverage, alternatives, or pricing when not using MediSearch?",
            type: "Paragraph",
            selectedAnswers: [],
            textAnswer: "",
          },
        ],
      },
      {
        sectionTitle: "Improvement Opportunities",
        questions: [
          {
            questionId: "q8",
            questionText: "What would make you more likely to use MediSearch regularly?",
            type: "MultipleChoice",
            options: [
              "Better search filters",
              "Faster loading",
              "Easier UI",
              "Direct links to insurance formulary",
              "More training / onboarding",
              "Mobile or tablet compatibility",
              "Integration with EMR or Liberty",
              "Alerts for Needing Prior Auth, Transitional Fills, etc.",
              "Option to add feedback if Drug was an applicable alternative.",
            ],
            selectedAnswers: [],
            textAnswer: "",
          },
          {
            questionId: "q9",
            questionText: "Would you be open to joining a short focus group or user test session?",
            type: "SingleChoice",
            options: ["Yes", "No"],
            selectedAnswers: [],
            textAnswer: "",
          },
          {
            questionId: "q10",
            questionText: "Is there anything else you’d like to share that would help us improve MediSearch or make it indispensable to your workflow?",
            type: "Paragraph",
            selectedAnswers: [],
            textAnswer: "",
          },
        ],
      },
    ],
  });

  const handleInputChange = (
    sectionIndex: number,
    questionIndex: number,
    value: string
  ) => {
    const updated = { ...formData };
    const question = updated.sections[sectionIndex].questions[questionIndex];

    if (question.type === "MultipleChoice") {
      if (question.selectedAnswers.includes(value)) {
        question.selectedAnswers = question.selectedAnswers.filter((ans) => ans !== value);
      } else {
        question.selectedAnswers.push(value);
      }
    } else if (question.type === "SingleChoice") {
      question.selectedAnswers = [value];
    } else {
      question.textAnswer = value;
    }

    setFormData({ ...updated });
    setValidationErrors((prev) => prev.filter((id) => id !== question.questionId));
  };

  const handleSubmit = async () => {
    const requiredQuestions = formData.sections
      .flatMap((section) => section.questions)
      .filter((q) => !["q9", "q10"].includes(q.questionId));

    const invalidIds = requiredQuestions
      .filter((q) => {
        if (q.type === "SingleChoice" || q.type === "MultipleChoice") {
          return q.selectedAnswers.length === 0;
        } else {
          return q.textAnswer.trim() === "";
        }
      })
      .map((q) => q.questionId);

    if (invalidIds.length > 0) {
      setValidationErrors(invalidIds);
      return;
    }

    setValidationErrors([]);
    try {
      await axiosInstance.post("/feedback/submit", formData);
      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded shadow-lg">
      {isSubmitted ? (
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-green-600 mb-4">Feedback Submitted!</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Thank you for your valuable input. We truly appreciate your time and feedback.
          </p>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
            {formData.formTitle}
          </h1>

          {formData.sections.map((section, sIdx) => (
            <div key={sIdx} className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2 text-gray-700 dark:text-gray-200">
                {section.sectionTitle}
              </h2>

              {section.questions.map((q, qIdx) => (
                <div key={q.questionId} className="mb-6">
                  <label className="font-medium block mb-2 text-gray-800 dark:text-gray-300">
                    {q.questionText}
                    {!["q9", "q10"].includes(q.questionId) && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>

                  {(q.type === "SingleChoice" || q.type === "MultipleChoice") &&
                    q.options?.map((option, optIdx) => {
                      const isChecked = q.selectedAnswers.includes(option);
                      const inputType = q.type === "SingleChoice" ? "radio" : "checkbox";
                      const id = `q-${sIdx}-${qIdx}-opt-${optIdx}`;

                      return (
                        <label
                          key={id}
                          htmlFor={id}
                          className="flex items-center mb-3 cursor-pointer group"
                        >
                          <input
                            id={id}
                            type={inputType}
                            name={`q-${sIdx}-${qIdx}`}
                            value={option}
                            checked={isChecked}
                            onChange={() => handleInputChange(sIdx, qIdx, option)}
                            className="sr-only"
                          />
                          <div
                            className={`
                              w-5 h-5 mr-3 flex items-center justify-center transition border-2
                              ${inputType === "radio" ? "rounded-full" : "rounded-md"}
                              ${isChecked ? "bg-blue-600 border-blue-600" : "border-gray-400 group-hover:border-blue-500"}
                              text-white
                            `}
                          >
                            {isChecked &&
                              (inputType === "checkbox" ? (
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <div className="w-2.5 h-2.5 bg-white rounded-full" />
                              ))}
                          </div>
                          <span className="text-gray-800 dark:text-gray-300">{option}</span>
                        </label>
                      );
                    })}

                  {q.type === "ShortAnswer" && (
                    <input
                      type="text"
                      className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                      value={q.textAnswer}
                      onChange={(e) => handleInputChange(sIdx, qIdx, e.target.value)}
                    />
                  )}

                  {q.type === "Paragraph" && (
                    <textarea
                      rows={4}
                      className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                      value={q.textAnswer}
                      onChange={(e) => handleInputChange(sIdx, qIdx, e.target.value)}
                    />
                  )}

                  {!["q9", "q10"].includes(q.questionId) &&
                    validationErrors.includes(q.questionId) && (
                      <p className="text-red-600 text-sm mt-1">Please answer this question.</p>
                    )}
                </div>
              ))}
            </div>
          ))}

          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition"
          >
            Submit Feedback
          </button>
        </>
      )}
    </div>
  );
};

export default FeedbackForm;
