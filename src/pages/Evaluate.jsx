import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { CheckCircle, AlertTriangle, Loader2, X } from "lucide-react";

export default function Evaluate() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [context, setContext] = useState("internal");
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEvaluate = async () => {
    if (!prompt.trim() || !output.trim()) { alert("Please provide both prompt and AI output."); return; }
    setLoading(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an AI output reliability evaluator. Analyze this AI interaction for: clarity of intent, missing constraints, inconsistency with requirements, hallucination risk.
Context: ${context}
Original Prompt: ${prompt}
AI Output: ${output}
Provide evaluation in this format: ISSUES, SUGGESTED IMPROVEMENT, CONFIDENCE (Low/Medium/High), EXPLANATION.`,
        response_json_schema: {
          type: "object",
          properties: {
            issues: { type: "array", items: { type: "string" } },
            suggested_prompt: { type: "string" },
            confidence: { type: "string" },
            explanation: { type: "string" }
          }
        }
      });
      setEvaluation(result);
    } catch (error) {
      console.error("Evaluation error:", error);
      alert("Failed to evaluate. Please try again.");
    } finally { setLoading(false); }
  };

  const reset = () => { setPrompt(""); setOutput(""); setEvaluation(null); };

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Review AI Output</h1>
          <p className="opacity-80">Verify reliability before using AI-generated content in your work.</p>
        </div>
        {!evaluation ? (
          <div className="space-y-6">
            <div className="retro-box p-6">
              <label className="block font-bold mb-3">Usage Context</label>
              <select value={context} onChange={(e) => setContext(e.target.value)} className="w-full retro-box px-4 py-3">
                <option value="internal">Internal documentation</option>
                <option value="client">Client-facing content</option>
                <option value="decision">Decision support</option>
                <option value="learning">Learning or research</option>
              </select>
            </div>
            <div className="retro-box p-6">
              <label className="block font-bold mb-3">Your Prompt</label>
              <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Paste the prompt or request you gave to the AI..." className="w-full retro-box px-4 py-3 min-h-[120px] resize-none font-mono text-sm" />
            </div>
            <div className="retro-box p-6">
              <label className="block font-bold mb-3">AI Output</label>
              <textarea value={output} onChange={(e) => setOutput(e.target.value)} placeholder="Paste the AI's response..." className="w-full retro-box px-4 py-3 min-h-[200px] resize-none font-mono text-sm" />
            </div>
            <div className="retro-box-dark p-4 text-sm opacity-90">
              <p>Your data is not used to train models. Content is not stored beyond processing.</p>
            </div>
            <button onClick={handleEvaluate} disabled={loading} className="retro-btn-primary w-full py-4 text-lg disabled:opacity-50">
              {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin" />Evaluating...</span> : "Evaluate Reliability"}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="retro-box p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Evaluation Results</h2>
                <button onClick={reset} className="retro-btn px-3 py-2"><X className="w-5 h-5" /></button>
              </div>
              <div className="mb-6">
                <div className="text-xs opacity-60 uppercase mb-2">Confidence Level</div>
                <div className={`inline-block px-4 py-2 font-bold ${evaluation.confidence === "High" ? "retro-box-green" : evaluation.confidence === "Medium" ? "retro-box" : "retro-box-dark"}`}>{evaluation.confidence || "Unknown"}</div>
              </div>
              <div className="mb-6">
                <div className="text-xs opacity-60 uppercase mb-3">Issues Identified</div>
                {evaluation.issues && evaluation.issues.length > 0 ? (
                  <div className="space-y-2">{evaluation.issues.map((issue, idx) => (
                    <div key={idx} className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 flex-shrink-0 mt-1 text-[#2D5F4F]" /><span className="text-sm">{issue}</span></div>
                  ))}</div>
                ) : (
                  <div className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-[#2D5F4F]" /><span>None identified</span></div>
                )}
              </div>
              {evaluation.suggested_prompt && evaluation.suggested_prompt !== "No changes needed" && (
                <div className="mb-6">
                  <div className="text-xs opacity-60 uppercase mb-3">Suggested Improvement</div>
                  <div className="retro-box-green p-4 font-mono text-sm whitespace-pre-wrap">{evaluation.suggested_prompt}</div>
                </div>
              )}
              <div>
                <div className="text-xs opacity-60 uppercase mb-3">Explanation</div>
                <p className="text-sm opacity-90">{evaluation.explanation}</p>
              </div>
            </div>
            <button onClick={reset} className="retro-btn w-full py-3">Evaluate Another Output</button>
          </div>
        )}
      </div>
    </div>
  );
}