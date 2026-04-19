"use client";

import { useState, useRef, useCallback } from "react";

interface StyleDNA {
  style: string;
  palette: string;
  elements: string[];
  vibe: string;
}

interface Photo {
  file: File;
  preview: string;
}

type Mode = "upload" | "describe" | "social";
type Step = "home" | "input" | "options" | "results";

const ROOM_TYPES = ["Exterior", "Living Room", "Kitchen", "Bedroom", "Bathroom"];
const BUDGETS = ["Cozy & Affordable", "Mid-Range", "Luxury"];
const VIBES = ["Modern", "Cozy & Warm", "Minimal", "Rustic", "Bold & Dramatic"];

export default function Home() {
  const [mode, setMode] = useState<Mode>("upload");
  const [step, setStep] = useState<Step>("home");

  // Upload mode
  const [photos, setPhotos] = useState<Photo[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Describe mode
  const [description, setDescription] = useState("");

  // Social mode
  const [handle, setHandle] = useState("");

  // Options
  const [roomType, setRoomType] = useState("Living Room");
  const [budget, setBudget] = useState("Mid-Range");
  const [vibe, setVibe] = useState("Modern");

  // Results
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [styleDNA, setStyleDNA] = useState<StyleDNA | null>(null);
  const [summary, setSummary] = useState("");
  const [generatedImages, setGeneratedImages] = useState<(string | null)[]>([null, null, null]);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([false, false, false]);
  const [error, setError] = useState("");

  const addPhotos = useCallback(
    (files: FileList) => {
      const newPhotos: Photo[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        if (photos.length + newPhotos.length >= 5) break;
        newPhotos.push({ file, preview: URL.createObjectURL(file) });
      }
      setPhotos((prev) => [...prev, ...newPhotos].slice(0, 5));
    },
    [photos.length]
  );

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      const next = [...prev];
      URL.revokeObjectURL(next[index].preview);
      next.splice(index, 1);
      return next;
    });
  };

  function pickMode(m: Mode) {
    setMode(m);
    setStep("input");
  }

  function goOptions() {
    setStep("options");
  }

  async function handleVisualize() {
    setStep("results");
    setIsAnalyzing(true);
    setError("");
    setStyleDNA(null);
    setSummary("");
    setGeneratedImages([null, null, null]);
    setImagesLoaded([false, false, false]);

    try {
      const formData = new FormData();
      formData.append("mode", mode);
      formData.append("roomType", roomType.toLowerCase());
      formData.append("budget", budget.toLowerCase());
      formData.append("vibe", vibe.toLowerCase());

      if (mode === "upload") photos.forEach(({ file }) => formData.append("images", file));
      if (mode === "describe") formData.append("description", description);
      if (mode === "social") formData.append("handle", handle);

      const analyzeRes = await fetch("/api/analyze", { method: "POST", body: formData });
      if (!analyzeRes.ok) throw new Error(await analyzeRes.text());
      const { styleDNA: dna, summary: sum, prompts } = await analyzeRes.json();

      setStyleDNA(dna);
      setSummary(sum);
      setIsAnalyzing(false);

      await Promise.all(
        (prompts as string[]).map(async (prompt, i) => {
          const genRes = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt, seed: i * 1000 + Math.floor(Math.random() * 999) }),
          });
          if (!genRes.ok) throw new Error(await genRes.text());
          const { imageUrl } = await genRes.json();
          setGeneratedImages((prev) => { const next = [...prev]; next[i] = imageUrl; return next; });
        })
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsAnalyzing(false);
    }
  }

  function reset() {
    photos.forEach(({ preview }) => URL.revokeObjectURL(preview));
    setPhotos([]);
    setDescription("");
    setHandle("");
    setStep("home");
    setStyleDNA(null);
    setSummary("");
    setGeneratedImages([null, null, null]);
    setImagesLoaded([false, false, false]);
    setError("");
    setIsAnalyzing(false);
  }

  const inputReady =
    (mode === "upload" && photos.length > 0) ||
    (mode === "describe" && description.trim().length > 10) ||
    (mode === "social" && handle.trim().length > 1);

  return (
    <main className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur px-8 py-5 flex items-center justify-between sticky top-0 z-10">
        <button onClick={reset} className="text-left">
          <h1 className="text-2xl font-bold text-stone-800">Dream Home Visualizer</h1>
          <p className="text-sm text-stone-500">See your perfect home before you find it</p>
        </button>
        {step !== "home" && (
          <button onClick={reset} className="text-sm text-stone-500 hover:text-stone-800 transition-colors">
            ← Start over
          </button>
        )}
      </header>

      <div className="max-w-5xl mx-auto px-8 py-12">

        {/* HOME — three options */}
        {step === "home" && (
          <div className="space-y-10">
            <div className="text-center">
              <h2 className="text-4xl font-semibold text-stone-800 mb-3">How do you want to start?</h2>
              <p className="text-stone-500 text-lg">Pick a way to show me your taste</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => pickMode("upload")}
                className="group bg-white rounded-3xl shadow-sm border-2 border-stone-100 hover:border-amber-400 hover:shadow-md transition-all p-8 text-left"
              >
                <div className="text-5xl mb-4">📸</div>
                <h3 className="text-xl font-bold text-stone-800 mb-2">Upload Photos</h3>
                <p className="text-stone-500 text-sm leading-relaxed">
                  Drop pictures of homes, rooms, or spaces you love — from anywhere.
                </p>
              </button>

              <button
                onClick={() => pickMode("describe")}
                className="group bg-white rounded-3xl shadow-sm border-2 border-stone-100 hover:border-amber-400 hover:shadow-md transition-all p-8 text-left"
              >
                <div className="text-5xl mb-4">✍️</div>
                <h3 className="text-xl font-bold text-stone-800 mb-2">Describe It</h3>
                <p className="text-stone-500 text-sm leading-relaxed">
                  Just type — describe your dream home like you&apos;re talking to a friend.
                </p>
              </button>

              <button
                onClick={() => pickMode("social")}
                className="group bg-white rounded-3xl shadow-sm border-2 border-stone-100 hover:border-amber-400 hover:shadow-md transition-all p-8 text-left"
              >
                <div className="text-5xl mb-4">⭐</div>
                <h3 className="text-xl font-bold text-stone-800 mb-2">Style Inspiration</h3>
                <p className="text-stone-500 text-sm leading-relaxed">
                  Enter a designer, influencer, or Instagram handle whose taste you love.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* INPUT — based on mode */}
        {step === "input" && (
          <div className="space-y-8 max-w-2xl mx-auto">

            {/* Upload mode */}
            {mode === "upload" && (
              <>
                <div className="text-center">
                  <h2 className="text-3xl font-semibold text-stone-800 mb-2">Show me what you love</h2>
                  <p className="text-stone-500">Upload 1–5 photos of homes or rooms that catch your eye</p>
                </div>
                <div
                  className="border-2 border-dashed border-stone-300 rounded-2xl p-12 text-center cursor-pointer hover:border-amber-400 hover:bg-amber-50/50 transition-all"
                  onDrop={(e) => { e.preventDefault(); addPhotos(e.dataTransfer.files); }}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
                    onChange={(e) => e.target.files && addPhotos(e.target.files)} />
                  <div className="text-4xl mb-3">🏠</div>
                  <p className="text-lg font-medium text-stone-700">Drop photos here</p>
                  <p className="text-stone-400 text-sm mt-1">or click to browse · up to 5 photos</p>
                </div>
                {photos.length > 0 && (
                  <div>
                    <p className="text-sm text-stone-500 mb-3">{photos.length}/5 photos added</p>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                      {photos.map((photo, i) => (
                        <div key={i} className="relative group aspect-square">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={photo.preview} alt="" className="w-full h-full object-cover rounded-xl" />
                          <button onClick={() => removePhoto(i)}
                            className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            ✕
                          </button>
                        </div>
                      ))}
                      {photos.length < 5 && (
                        <button onClick={() => fileInputRef.current?.click()}
                          className="aspect-square border-2 border-dashed border-stone-300 rounded-xl flex items-center justify-center text-stone-400 hover:border-amber-400 hover:text-amber-500 transition-all text-2xl">
                          +
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Describe mode */}
            {mode === "describe" && (
              <>
                <div className="text-center">
                  <h2 className="text-3xl font-semibold text-stone-800 mb-2">Tell me what you want</h2>
                  <p className="text-stone-500">Describe your dream home like you&apos;re talking to a friend</p>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. I love warm, cozy spaces with lots of wood and natural light. Think exposed beams, linen furniture, plants everywhere. Not too modern but not too rustic either..."
                  className="w-full h-48 border-2 border-stone-200 rounded-2xl p-5 text-stone-700 placeholder-stone-300 focus:outline-none focus:border-amber-400 resize-none text-sm leading-relaxed"
                />
              </>
            )}

            {/* Social mode */}
            {mode === "social" && (
              <>
                <div className="text-center">
                  <h2 className="text-3xl font-semibold text-stone-800 mb-2">Whose taste do you love?</h2>
                  <p className="text-stone-500">Enter a designer, influencer, or brand whose style inspires you</p>
                </div>
                <input
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="e.g. Studio McGee, @amberinteriors, Nate Berkus, Joanna Gaines..."
                  className="w-full border-2 border-stone-200 rounded-2xl px-5 py-4 text-stone-700 placeholder-stone-300 focus:outline-none focus:border-amber-400 text-sm"
                />
                <div className="flex flex-wrap gap-2">
                  {["Studio McGee", "Amber Lewis", "Nate Berkus", "Joanna Gaines", "Kelly Wearstler"].map((name) => (
                    <button key={name} onClick={() => setHandle(name)}
                      className="px-3 py-1.5 rounded-full bg-stone-100 hover:bg-amber-100 hover:text-amber-700 text-stone-600 text-xs font-medium transition-all">
                      {name}
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="flex gap-4 pt-2">
              <button onClick={() => setStep("home")}
                className="flex-1 border-2 border-stone-300 text-stone-600 font-semibold py-4 rounded-2xl hover:bg-stone-100 transition-all">
                ← Back
              </button>
              <button onClick={goOptions} disabled={!inputReady}
                className="flex-[2] bg-stone-800 hover:bg-stone-900 disabled:bg-stone-300 text-white font-bold py-4 px-10 rounded-2xl shadow-lg transition-all">
                Next: Customize →
              </button>
            </div>
          </div>
        )}

        {/* OPTIONS */}
        {step === "options" && (
          <div className="space-y-8 max-w-2xl mx-auto">
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-stone-800 mb-2">Customize your vision</h2>
              <p className="text-stone-500">Tell me what you&apos;re picturing</p>
            </div>

            <div>
              <p className="font-semibold text-stone-700 mb-3">Which room?</p>
              <div className="flex flex-wrap gap-2">
                {ROOM_TYPES.map((r) => (
                  <button key={r} onClick={() => setRoomType(r)}
                    className={`px-4 py-2 rounded-full border-2 font-medium text-sm transition-all ${roomType === r ? "border-amber-500 bg-amber-50 text-amber-700" : "border-stone-200 text-stone-600 hover:border-stone-400"}`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-semibold text-stone-700 mb-3">Budget feel?</p>
              <div className="flex flex-wrap gap-2">
                {BUDGETS.map((b) => (
                  <button key={b} onClick={() => setBudget(b)}
                    className={`px-4 py-2 rounded-full border-2 font-medium text-sm transition-all ${budget === b ? "border-amber-500 bg-amber-50 text-amber-700" : "border-stone-200 text-stone-600 hover:border-stone-400"}`}>
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-semibold text-stone-700 mb-3">Overall vibe?</p>
              <div className="flex flex-wrap gap-2">
                {VIBES.map((v) => (
                  <button key={v} onClick={() => setVibe(v)}
                    className={`px-4 py-2 rounded-full border-2 font-medium text-sm transition-all ${vibe === v ? "border-amber-500 bg-amber-50 text-amber-700" : "border-stone-200 text-stone-600 hover:border-stone-400"}`}>
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <button onClick={() => setStep("input")}
                className="flex-1 border-2 border-stone-300 text-stone-600 font-semibold py-4 rounded-2xl hover:bg-stone-100 transition-all">
                ← Back
              </button>
              <button onClick={handleVisualize}
                className="flex-[2] bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-10 rounded-2xl shadow-lg transition-all">
                Visualize My Dream Home ✨
              </button>
            </div>
          </div>
        )}

        {/* RESULTS */}
        {step === "results" && (
          <div className="space-y-8">
            {styleDNA ? (
              <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">Your Style DNA</p>
                <p className="text-stone-700 mb-5 leading-relaxed">{summary}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div><p className="text-xs text-stone-400 mb-1">Style</p><p className="font-semibold text-stone-800 text-sm">{styleDNA.style}</p></div>
                  <div><p className="text-xs text-stone-400 mb-1">Palette</p><p className="font-semibold text-stone-800 text-sm">{styleDNA.palette}</p></div>
                  <div><p className="text-xs text-stone-400 mb-1">Vibe</p><p className="font-semibold text-stone-800 text-sm">{styleDNA.vibe}</p></div>
                  <div><p className="text-xs text-stone-400 mb-1">Key Elements</p><p className="font-semibold text-stone-800 text-sm">{styleDNA.elements.slice(0, 2).join(", ")}</p></div>
                </div>
              </div>
            ) : isAnalyzing ? (
              <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 flex items-center gap-4">
                <div className="w-8 h-8 border-4 border-stone-200 border-t-amber-500 rounded-full animate-spin flex-shrink-0" />
                <div>
                  <p className="font-semibold text-stone-800">Analyzing your style...</p>
                  <p className="text-sm text-stone-500">Claude is working on it</p>
                </div>
              </div>
            ) : null}

            <div>
              <p className="text-sm font-semibold text-stone-500 uppercase tracking-widest mb-4">
                Your Dream {roomType} — 3 Interpretations
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {generatedImages.map((img, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden aspect-[4/3] relative flex items-center justify-center">
                    {img && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img} alt={`Variation ${i + 1}`}
                        className={`w-full h-full object-cover transition-opacity duration-500 ${imagesLoaded[i] ? "opacity-100" : "opacity-0 absolute"}`}
                        onLoad={() => setImagesLoaded((prev) => { const next = [...prev]; next[i] = true; return next; })}
                      />
                    )}
                    {(!img || !imagesLoaded[i]) && (
                      <div className="flex flex-col items-center gap-2 text-stone-400">
                        <div className="w-8 h-8 border-4 border-stone-200 border-t-amber-400 rounded-full animate-spin" />
                        <p className="text-xs">Variation {i + 1}...</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            {!isAnalyzing && !error && generatedImages.every(Boolean) && (
              <div className="text-center">
                <button onClick={reset}
                  className="bg-stone-800 hover:bg-stone-900 text-white font-semibold px-10 py-4 rounded-2xl shadow-lg transition-all">
                  Start Over
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
