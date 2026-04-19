"use client";

import { useState, useRef, useCallback } from "react";

interface StyleDNA {
  style: string;
  palette: string;
  elements: string[];
  vibe: string;
}

interface RoomResult {
  roomType: string;
  currentState: string;
  prompt: string;
}

interface RoomImage {
  original: string;
  generated: string | null;
  loaded: boolean;
}

type Step = "style" | "rooms" | "options" | "results";

const BUDGETS = ["Affordable", "Mid-Range", "Luxury"];
const SCOPES = ["Light Refresh", "Full Renovation", "Complete Gut"];
const PRESETS = ["Studio McGee", "Amber Lewis", "Joanna Gaines", "Nate Berkus", "Kelly Wearstler", "Restoration Hardware"];

interface RoomPhoto {
  file: File;
  preview: string;
}

export default function Home() {
  const [step, setStep] = useState<Step>("style");

  // Style input
  const [inspiration, setInspiration] = useState("");

  // Room photos
  const [rooms, setRooms] = useState<RoomPhoto[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Options
  const [budget, setBudget] = useState("Mid-Range");
  const [scope, setScope] = useState("Full Renovation");

  // Results
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [styleDNA, setStyleDNA] = useState<StyleDNA | null>(null);
  const [summary, setSummary] = useState("");
  const [roomImages, setRoomImages] = useState<RoomImage[]>([]);
  const [error, setError] = useState("");

  const addRooms = useCallback(
    (files: FileList) => {
      const next: RoomPhoto[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        if (rooms.length + next.length >= 3) break;
        next.push({ file, preview: URL.createObjectURL(file) });
      }
      setRooms((prev) => [...prev, ...next].slice(0, 3));
    },
    [rooms.length]
  );

  const removeRoom = (i: number) => {
    setRooms((prev) => {
      const next = [...prev];
      URL.revokeObjectURL(next[i].preview);
      next.splice(i, 1);
      return next;
    });
  };

  async function handleVisualize() {
    setStep("results");
    setIsAnalyzing(true);
    setError("");
    setStyleDNA(null);
    setSummary("");
    setRoomImages(rooms.map((r) => ({ original: r.preview, generated: null, loaded: false })));

    try {
      const formData = new FormData();
      formData.append("inspiration", inspiration);
      formData.append("budget", budget.toLowerCase());
      formData.append("scope", scope.toLowerCase());
      rooms.forEach(({ file }) => formData.append("rooms", file));

      const res = await fetch("/api/analyze", { method: "POST", body: formData });
      if (!res.ok) throw new Error(await res.text());
      const { styleDNA: dna, summary: sum, rooms: roomResults } = await res.json() as {
        styleDNA: StyleDNA;
        summary: string;
        rooms: RoomResult[];
      };

      setStyleDNA(dna);
      setSummary(sum);
      setIsAnalyzing(false);

      await Promise.all(
        roomResults.map(async (room: RoomResult, i: number) => {
          const genRes = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: room.prompt, seed: i * 1000 + Math.floor(Math.random() * 999) }),
          });
          if (!genRes.ok) throw new Error(await genRes.text());
          const { imageUrl } = await genRes.json();
          setRoomImages((prev) => {
            const next = [...prev];
            next[i] = { ...next[i], generated: imageUrl };
            return next;
          });
        })
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsAnalyzing(false);
    }
  }

  function reset() {
    rooms.forEach(({ preview }) => URL.revokeObjectURL(preview));
    setRooms([]);
    setInspiration("");
    setStep("style");
    setStyleDNA(null);
    setSummary("");
    setRoomImages([]);
    setError("");
    setIsAnalyzing(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur px-8 py-5 flex items-center justify-between sticky top-0 z-10">
        <button onClick={reset} className="text-left">
          <h1 className="text-2xl font-bold text-stone-800">Dream Home Visualizer</h1>
          <p className="text-sm text-stone-500">See your rooms transformed by the style you love</p>
        </button>
        {step !== "style" && (
          <button onClick={reset} className="text-sm text-stone-500 hover:text-stone-800 transition-colors">
            ← Start over
          </button>
        )}
      </header>

      <div className="max-w-4xl mx-auto px-8 py-12">

        {/* STEP 1 — Style inspiration */}
        {step === "style" && (
          <div className="space-y-8 max-w-xl mx-auto">
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-stone-800 mb-2">Whose style do you love?</h2>
              <p className="text-stone-500">Enter a designer&apos;s name, Instagram handle, or paste a link</p>
            </div>

            <input
              value={inspiration}
              onChange={(e) => setInspiration(e.target.value)}
              placeholder="e.g. Studio McGee, @amberinteriors, or paste a Pinterest/Houzz link..."
              className="w-full border-2 border-stone-200 rounded-2xl px-5 py-4 text-stone-700 placeholder-stone-300 focus:outline-none focus:border-amber-400 text-sm"
            />

            <div>
              <p className="text-xs text-stone-400 uppercase tracking-widest mb-3">Quick picks</p>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((name) => (
                  <button key={name} onClick={() => setInspiration(name)}
                    className={`px-3 py-1.5 rounded-full border-2 text-xs font-medium transition-all ${
                      inspiration === name
                        ? "border-amber-500 bg-amber-50 text-amber-700"
                        : "border-stone-200 text-stone-600 hover:border-amber-300"
                    }`}>
                    {name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep("rooms")}
              disabled={inspiration.trim().length < 2}
              className="w-full bg-stone-800 hover:bg-stone-900 disabled:bg-stone-300 text-white font-bold py-4 rounded-2xl shadow-lg transition-all"
            >
              Next: Upload Your Rooms →
            </button>
          </div>
        )}

        {/* STEP 2 — Upload room photos */}
        {step === "rooms" && (
          <div className="space-y-8 max-w-xl mx-auto">
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-stone-800 mb-2">Upload your rooms</h2>
              <p className="text-stone-500">Photos of the actual spaces you want transformed — up to 3 rooms</p>
            </div>

            <div
              className="border-2 border-dashed border-stone-300 rounded-2xl p-10 text-center cursor-pointer hover:border-amber-400 hover:bg-amber-50/50 transition-all"
              onDrop={(e) => { e.preventDefault(); addRooms(e.dataTransfer.files); }}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
            >
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
                onChange={(e) => e.target.files && addRooms(e.target.files)} />
              <div className="text-4xl mb-3">🏚️</div>
              <p className="text-lg font-medium text-stone-700">Drop room photos here</p>
              <p className="text-stone-400 text-sm mt-1">or click to browse · up to 3 rooms</p>
            </div>

            {rooms.length > 0 && (
              <div className="space-y-3">
                {rooms.map((room, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white rounded-2xl border border-stone-100 p-3 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={room.preview} alt="" className="w-20 h-16 object-cover rounded-xl flex-shrink-0" />
                    <p className="text-sm text-stone-600 flex-1">Room {i + 1}</p>
                    <button onClick={() => removeRoom(i)}
                      className="text-stone-300 hover:text-red-400 transition-colors text-lg font-bold px-2">
                      ✕
                    </button>
                  </div>
                ))}
                {rooms.length < 3 && (
                  <button onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-stone-200 rounded-2xl py-3 text-sm text-stone-400 hover:border-amber-300 hover:text-amber-500 transition-all">
                    + Add another room
                  </button>
                )}
              </div>
            )}

            <div className="flex gap-4">
              <button onClick={() => setStep("style")}
                className="flex-1 border-2 border-stone-300 text-stone-600 font-semibold py-4 rounded-2xl hover:bg-stone-100 transition-all">
                ← Back
              </button>
              <button onClick={() => setStep("options")} disabled={rooms.length === 0}
                className="flex-[2] bg-stone-800 hover:bg-stone-900 disabled:bg-stone-300 text-white font-bold py-4 rounded-2xl shadow-lg transition-all">
                Next: Options →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Options */}
        {step === "options" && (
          <div className="space-y-8 max-w-xl mx-auto">
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-stone-800 mb-2">Final details</h2>
              <p className="text-stone-500">How far do you want to go?</p>
            </div>

            <div>
              <p className="font-semibold text-stone-700 mb-3">Budget feel?</p>
              <div className="flex gap-3">
                {BUDGETS.map((b) => (
                  <button key={b} onClick={() => setBudget(b)}
                    className={`flex-1 py-3 rounded-2xl border-2 font-medium text-sm transition-all ${
                      budget === b ? "border-amber-500 bg-amber-50 text-amber-700" : "border-stone-200 text-stone-600 hover:border-stone-400 bg-white"
                    }`}>
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-semibold text-stone-700 mb-3">Renovation scope?</p>
              <div className="flex gap-3">
                {SCOPES.map((s) => (
                  <button key={s} onClick={() => setScope(s)}
                    className={`flex-1 py-3 rounded-2xl border-2 font-medium text-sm transition-all ${
                      scope === s ? "border-amber-500 bg-amber-50 text-amber-700" : "border-stone-200 text-stone-600 hover:border-stone-400 bg-white"
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-stone-50 rounded-2xl p-4 text-sm text-stone-500 space-y-1">
              <p><span className="font-medium text-stone-700">Style:</span> {inspiration}</p>
              <p><span className="font-medium text-stone-700">Rooms:</span> {rooms.length} photo{rooms.length > 1 ? "s" : ""}</p>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep("rooms")}
                className="flex-1 border-2 border-stone-300 text-stone-600 font-semibold py-4 rounded-2xl hover:bg-stone-100 transition-all">
                ← Back
              </button>
              <button onClick={handleVisualize}
                className="flex-[2] bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all">
                Visualize My Rooms ✨
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 — Results */}
        {step === "results" && (
          <div className="space-y-10">
            {/* Style DNA */}
            {styleDNA ? (
              <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">Inspiration Style</p>
                <p className="text-stone-700 leading-relaxed mb-5">{summary}</p>
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
                  <p className="font-semibold text-stone-800">Analyzing style &amp; rooms...</p>
                  <p className="text-sm text-stone-500">Claude is planning the renovation</p>
                </div>
              </div>
            ) : null}

            {/* Room-by-room results */}
            {roomImages.map((room, i) => (
              <div key={i} className="space-y-3">
                <p className="text-sm font-semibold text-stone-500 uppercase tracking-widest">Room {i + 1}</p>
                <div className="grid grid-cols-2 gap-4">
                  {/* Original */}
                  <div className="space-y-2">
                    <p className="text-xs text-stone-400 font-medium">Before</p>
                    <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-stone-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={room.original} alt="Original room" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  {/* Generated */}
                  <div className="space-y-2">
                    <p className="text-xs text-stone-400 font-medium">After — {inspiration}</p>
                    <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-stone-100 flex items-center justify-center relative">
                      {room.generated && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={room.generated}
                          alt="Renovated room"
                          className={`w-full h-full object-cover transition-opacity duration-500 ${room.loaded ? "opacity-100" : "opacity-0 absolute"}`}
                          onLoad={() => setRoomImages((prev) => {
                            const next = [...prev];
                            next[i] = { ...next[i], loaded: true };
                            return next;
                          })}
                        />
                      )}
                      {(!room.generated || !room.loaded) && (
                        <div className="flex flex-col items-center gap-2 text-stone-400">
                          <div className="w-8 h-8 border-4 border-stone-200 border-t-amber-400 rounded-full animate-spin" />
                          <p className="text-xs">Generating...</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            {!isAnalyzing && !error && roomImages.length > 0 && roomImages.every((r) => r.loaded) && (
              <div className="text-center pt-4">
                <button onClick={reset}
                  className="bg-stone-800 hover:bg-stone-900 text-white font-semibold px-10 py-4 rounded-2xl shadow-lg transition-all">
                  Try Different Rooms
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
