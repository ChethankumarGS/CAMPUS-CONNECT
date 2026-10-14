"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { aiService } from "@/services/ai.service";
import { StudyKit } from "@/types/ai";

interface Props {
  materialId: string;
  title: string;
  canGenerate: boolean;
  onClose: () => void;
}

export default function StudyKitModal({
  materialId,
  title,
  canGenerate,
  onClose,
}: Props) {
  const [kit, setKit] = useState<StudyKit | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [picked, setPicked] = useState<Record<number, number>>({});

  useEffect(() => {
    aiService
      .getStudyKit(materialId)
      .then((res) => setKit(res.data))
      .catch(() => setError("Could not load the study kit"))
      .finally(() => setLoading(false));
  }, [materialId]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError("");
    try {
      const res = await aiService.generateStudyKit(materialId);
      setKit(res.data);
      setPicked({});
    } catch (err) {
      setError((axios.isAxiosError(err) && err.response?.data?.message) || "Generation failed, try again");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-semibold">Study kit: {title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            Close
          </button>
        </div>

        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        {!loading && !kit && (
          <p className="text-gray-600 mb-3">
            No study kit yet.{" "}
            {!canGenerate && "Your lecturer hasn't generated one for this material."}
          </p>
        )}

        {canGenerate && !loading && (
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="mb-4 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {generating ? "Generating..." : kit ? "Regenerate" : "Generate summary and quiz"}
          </button>
        )}

        {kit && (
          <div>
            <h3 className="font-medium mb-1">Summary</h3>
            <p className="text-gray-700 mb-6">{kit.summary}</p>

            <h3 className="font-medium mb-2">Quiz</h3>
            <ol className="space-y-5 list-decimal pl-5">
              {kit.quiz.map((q, qi) => (
                <li key={qi}>
                  <p className="mb-2">{q.question}</p>
                  <div className="space-y-1">
                    {q.options.map((opt, oi) => {
                      const chosen = picked[qi] !== undefined;
                      const isRight = oi === q.answerIndex;
                      const isPicked = picked[qi] === oi;
                      let style = "border-gray-200 hover:bg-gray-50";
                      if (chosen && isRight) style = "border-green-500 bg-green-50";
                      else if (chosen && isPicked) style = "border-red-500 bg-red-50";
                      return (
                        <button
                          key={oi}
                          disabled={chosen}
                          onClick={() => setPicked((p) => ({ ...p, [qi]: oi }))}
                          className={`block w-full text-left text-sm border rounded px-3 py-2 ${style}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {picked[qi] !== undefined && q.explanation && (
                    <p className="text-xs text-gray-500 mt-1">{q.explanation}</p>
                  )}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
