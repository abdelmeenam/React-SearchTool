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
  const [formData, setFormData] = useState<FeedbackFormData>({
    formTitle: "MedSearch Intake Team Feedback",
    sections: [
      {
        sectionTitle: "Tool Mechanism",
        questions: [
          {
            questionId: "q1",
            questionText: "Do you understand how MedSearch suggests drug alternatives?",
            type: "SingleChoice",
            options: ["Yes", "Somewhat", "No"],
            selectedAnswers: [],
            textAnswer: ""
          },
          {
            questionId: "q2",
            questionText: "Are the reasons behind the suggestions clear?",
            type: "SingleChoice",
            options: ["Always clear", "Sometimes clear", "Rarely clear", "Not at all"],
            selectedAnswers: [],
            textAnswer: ""
          },
          {
            questionId: "q3",
            questionText: "Would you like the tool to explain why each alternative is selected?",
            type: "SingleChoice",
            options: ["Yes", "No", "Maybe"],
            selectedAnswers: [],
            textAnswer: ""
          },
          {
            questionId: "q4",
            questionText: "Do the suggested alternatives feel relevant to the original prescription?",
            type: "SingleChoice",
            options: ["Always", "Often", "Sometimes", "Rarely"],
            selectedAnswers: [],
            textAnswer: ""
          },
          {
            questionId: "q5",
            questionText: "What would help you better understand the suggestions?",
            type: "ShortAnswer",
            selectedAnswers: [],
            textAnswer: ""
          }
        ]
      },
      {
        sectionTitle: "Data Quality",
        questions: [
          {
            questionId: "q6",
            questionText: "How accurate is the reimbursement/value data provided by MedSearch?",
            type: "SingleChoice",
            options: ["Very accurate", "Mostly accurate", "Occasionally wrong", "Often wrong", "Not sure"],
            selectedAnswers: [],
            textAnswer: ""
          },
          {
            questionId: "q7",
            questionText: "Have you ever encountered suggestions that were not covered or reimbursed as expected?",
            type: "SingleChoice",
            options: ["Yes", "No", "Not sure"],
            selectedAnswers: [],
            textAnswer: ""
          },
          {
            questionId: "q8",
            questionText: "Do you trust the drug grouping and classifications shown in the tool?",
            type: "SingleChoice",
            options: ["Yes", "No", "I don’t know enough to judge"],
            selectedAnswers: [],
            textAnswer: ""
          },
          {
            questionId: "q9",
            questionText: "Would seeing data sources increase your confidence in the results?",
            type: "SingleChoice",
            options: ["Yes", "No", "Not necessary"],
            selectedAnswers: [],
            textAnswer: ""
          },
          {
            questionId: "q10",
            questionText: "Please describe any issues or gaps you’ve seen in the tool’s data.",
            type: "Paragraph",
            selectedAnswers: [],
            textAnswer: ""
          }
        ]
      },
      {
        sectionTitle: "Usage and Workflow",
        questions: [
          {
            questionId: "q11",
            questionText: "How often do you use MedSearch?",
            type: "SingleChoice",
            options: ["Daily", "A few times a week", "Rarely", "Never"],
            selectedAnswers: [],
            textAnswer: ""
          },
          {
            questionId: "q12",
            questionText: "At what point do you usually use it?",
            type: "MultipleChoice",
            options: ["When verifying a referral", "After a billing error", "Before pharmacy review", "Other"],
            selectedAnswers: [],
            textAnswer: ""
          },
          {
            questionId: "q13",
            questionText: "Does MedSearch help you work faster or slower?",
            type: "SingleChoice",
            options: ["Much faster", "A bit faster", "No difference", "Slower", "I don’t use it enough to say"],
            selectedAnswers: [],
            textAnswer: ""
          },
          {
            questionId: "q14",
            questionText: "What affects how often you use the tool?",
            type: "MultipleChoice",
            options: [
              "Easy to use",
              "Easy to understand",
              "Not sure how to use it",
              "Doesn’t always help",
              "Takes too long",
              "I forget it’s available",
              "Other"
            ],
            selectedAnswers: [],
            textAnswer: ""
          },
          {
            questionId: "q15",
            questionText: "What would encourage you to use MedSearch more often?",
            type: "Paragraph",
            selectedAnswers: [],
            textAnswer: ""
          }
        ]
      },
      {
        sectionTitle: "Final Thoughts",
        questions: [
          {
            questionId: "q16",
            questionText: "What do you like most about the tool?",
            type: "ShortAnswer",
            selectedAnswers: [],
            textAnswer: ""
          },
          {
            questionId: "q17",
            questionText: "What frustrates you most about using it?",
            type: "ShortAnswer",
            selectedAnswers: [],
            textAnswer: ""
          },
          {
            questionId: "q18",
            questionText: "Any other feedback or suggestions?",
            type: "Paragraph",
            selectedAnswers: [],
            textAnswer: ""
          }
        ]
      }
    ]
  });

  const handleInputChange = (
    sectionIndex: number,
    questionIndex: number,
    value: string,
    type?: string
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
  };

  const handleSubmit = async () => {
    try {
      await axiosInstance.post("/feedback/submit", formData);
      alert("✅ Feedback submitted successfully");
    } catch (error) {
      alert("❌ Error submitting feedback");
      console.error(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">{formData.formTitle}</h1>

      {formData.sections.map((section, sIdx) => (
        <div key={sIdx} className="mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">{section.sectionTitle}</h2>
          {section.questions.map((q, qIdx) => (
            <div key={q.questionId} className="mb-6">
              <label className="font-medium block mb-2">{q.questionText}</label>

              {(q.type === "SingleChoice" || q.type === "MultipleChoice") && q.options?.map((option) => (
                <label key={option} className="block">
                  <input
                    type={q.type === "SingleChoice" ? "radio" : "checkbox"}
                    name={`q-${sIdx}-${qIdx}`}
                    value={option}
                    checked={q.selectedAnswers.includes(option)}
                    onChange={() => handleInputChange(sIdx, qIdx, option)}
                  /> {option}
                </label>
              ))}

              {q.type === "ShortAnswer" && (
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={q.textAnswer}
                  onChange={(e) => handleInputChange(sIdx, qIdx, e.target.value)}
                />
              )}

              {q.type === "Paragraph" && (
                <textarea
                  className="w-full p-2 border rounded"
                  rows={4}
                  value={q.textAnswer}
                  onChange={(e) => handleInputChange(sIdx, qIdx, e.target.value)}
                ></textarea>
              )}
            </div>
          ))}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Submit Feedback
      </button>
    </div>
  );
};

export default FeedbackForm;