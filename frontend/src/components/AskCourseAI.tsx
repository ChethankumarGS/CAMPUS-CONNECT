"use client";
import axios from "axios";
import { useState } from "react";
import { aiService } from "@/services/ai.service";
import { AiAnswer } from "@/types/ai";

export default function AskCourseAI({ courseId }: { courseId: string }) {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<AiAnswer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await aiService.askCourse(courseId, question.trim());
      setResult(res.data);
    } catch (err) {
      setResult(null);
      setError((axios.isAxiosError(err) && err.response?.data?.message) || "Something went wrong, try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-1">Ask your course materials</h2>
      <p className="text-sm text-gray-500 mb-4">
        Answers come only from the PDFs and documents uploaded to this course.
      </p>

      <form onSubmit={handleAsk} className="flex gap-2 mb-4">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          maxLength={500}
          placeholder="e.g. What is the difference between supervised and unsupervised learning?"
          className="flex-1 border rounded-md px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {result && (
        <div className="bg-gray-50 border rounded-md p-4">
          <p className="whitespace-pre-wrap text-gray-800">{result.answer}</p>
          {result.sources.length > 0 && (
            <div className="mt-4 border-t pt-3">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Sources
              </p>
              <ul className="space-y-2">
                {result.sources.map((s) => (
                  <li key={s.ref} className="text-sm text-gray-600">
                    <span className="font-medium">
                      [{s.ref}] {s.title}
                    </span>
                    <span className="block text-xs text-gray-500">
                      {s.snippet}...
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
