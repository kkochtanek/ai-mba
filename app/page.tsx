"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "analyzing" | "generating" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    setGeneratedImage(null);
    setPrompt("");
    setStatus("idle");
    setErrorMsg("");
    const reader = new FileReader();
    reader.onload = (ev) => setUploadedImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setUploadedFile(file);
    setGeneratedImage(null);
    setPrompt("");
    setStatus("idle");
    setErrorMsg("");
    const reader = new FileReader();
    reader.onload = (ev) => setUploadedImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleRecreate() {
    if (!uploadedFile || !uploadedImage) return;
    setStatus("analyzing");
    setErrorMsg("");
    setGeneratedImage(null);
    setPrompt("");

    try {
      const formData = new FormData();
      formData.append("image", uploadedFile);

      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });
      if (!analyzeRes.ok) throw new Error(await analyzeRes.text());
      const { prompt: generatedPrompt } = await analyzeRes.json();
      setPrompt(generatedPrompt);

      setStatus("generating");

      const generateRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: generatedPrompt }),
      });
      if (!generateRes.ok) throw new Error(await generateRes.text());
      const { imageUrl } = await generateRes.json();
      setGeneratedImage(imageUrl);
      setStatus("done");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-orange-500 mb-2">Banana Generate</h1>
          <p className="text-gray-600 text-lg">Upload a photo — Claude analyzes it, AI recreates it</p>
        </div>

        {/* Upload area */}
        <div
          className="border-4 border-dashed border-orange-300 rounded-2xl p-10 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all mb-6"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          {uploadedImage ? (
            <p className="text-orange-600 font-medium">Click or drop to change photo</p>
          ) : (
            <>
              <div className="text-6xl mb-4">🍌</div>
              <p className="text-xl font-semibold text-gray-700">Drop your photo here</p>
              <p className="text-gray-400 mt-1">or click to browse</p>
            </>
          )}
        </div>

        {/* Preview + Result */}
        {uploadedImage && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-2xl shadow p-4">
              <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Original</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={uploadedImage} alt="Uploaded" className="w-full rounded-xl object-cover max-h-72" />
            </div>
            <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center justify-center min-h-48">
              <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide self-start">Recreated</p>
              {status === "analyzing" && (
                <div className="flex flex-col items-center gap-3 text-orange-500">
                  <div className="w-10 h-10 border-4 border-orange-300 border-t-orange-500 rounded-full animate-spin" />
                  <p className="text-sm font-medium">Claude is analyzing...</p>
                </div>
              )}
              {status === "generating" && (
                <div className="flex flex-col items-center gap-3 text-orange-500">
                  <div className="w-10 h-10 border-4 border-orange-300 border-t-orange-500 rounded-full animate-spin" />
                  <p className="text-sm font-medium">Generating image...</p>
                </div>
              )}
              {status === "done" && generatedImage && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={generatedImage} alt="Generated" className="w-full rounded-xl object-cover max-h-72" />
              )}
              {status === "error" && (
                <p className="text-red-500 text-sm text-center">{errorMsg}</p>
              )}
              {status === "idle" && (
                <p className="text-gray-300 text-sm">Hit &ldquo;Recreate&rdquo; to generate</p>
              )}
            </div>
          </div>
        )}

        {/* Prompt display */}
        {prompt && (
          <div className="bg-white rounded-2xl shadow p-4 mb-6">
            <p className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wide">Claude&apos;s Prompt</p>
            <p className="text-gray-700 text-sm leading-relaxed">{prompt}</p>
          </div>
        )}

        {/* CTA */}
        {uploadedImage && (
          <div className="text-center">
            <button
              onClick={handleRecreate}
              disabled={status === "analyzing" || status === "generating"}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold text-lg px-10 py-4 rounded-2xl shadow-lg transition-all"
            >
              {status === "analyzing" || status === "generating" ? "Working..." : "Recreate Photo"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
