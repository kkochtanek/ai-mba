"use client";

import { useState, useRef, useCallback, useEffect } from "react";

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

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function generateWithPolling(prompt: string, image: string, seed: number): Promise<string> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, image, seed }),
  });
  if (!res.ok) throw new Error(await res.text());
  const { predictionId } = await res.json();

  while (true) {
    await new Promise((r) => setTimeout(r, 3000));
    const poll = await fetch(`/api/poll?id=${predictionId}`);
    if (!poll.ok) throw new Error(await poll.text());
    const { status, imageUrl, error } = await poll.json();
    if (status === "succeeded" && imageUrl) return imageUrl;
    if (status === "failed") throw new Error(error ?? "Generation failed");
  }
}

interface RoomImage {
  original: string;
  generated: string | null;
  loaded: boolean;
}

interface SavedStyle {
  id: string;
  name: string;
  inspiration: string;
  createdAt: number;
}

interface HistoryItem {
  id: string;
  inspiration: string;
  budget: string;
  scope: string;
  styleDNA: StyleDNA;
  summary: string;
  rooms: { generated: string; roomType: string }[];
  createdAt: number;
}

type Step = "home" | "style" | "rooms" | "options" | "results";

const BUDGETS = ["Affordable", "Mid-Range", "Luxury"];
const SCOPES = ["Light Refresh", "Full Renovation", "Complete Gut"];
const PRESETS = ["Studio McGee", "Amber Lewis", "Joanna Gaines", "Nate Berkus", "Kelly Wearstler", "Restoration Hardware"];

interface RoomPhoto {
  file: File;
  preview: string;
}

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initial;
    } catch {
      return initial;
    }
  });

  const set = useCallback((next: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      try { localStorage.setItem(key, JSON.stringify(resolved)); } catch {}
      return resolved;
    });
  }, [key]);

  return [value, set] as const;
}

export default function Home() {
  const [step, setStep] = useState<Step>("home");
  const [inspiration, setInspiration] = useState("");
  const [rooms, setRooms] = useState<RoomPhoto[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [budget, setBudget] = useState("Mid-Range");
  const [scope, setScope] = useState("Full Renovation");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [styleDNA, setStyleDNA] = useState<StyleDNA | null>(null);
  const [summary, setSummary] = useState("");
  const [roomImages, setRoomImages] = useState<RoomImage[]>([]);
  const [error, setError] = useState("");
  const [savedStyles, setSavedStyles] = useLocalStorage<SavedStyle[]>("dhv_styles", []);
  const [history, setHistory] = useLocalStorage<HistoryItem[]>("dhv_history", []);
  const [saveStyleName, setSaveStyleName] = useState("");
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<HistoryItem | null>(null);

  const addRooms = useCallback((files: FileList) => {
    const next: RoomPhoto[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      if (rooms.length + next.length >= 3) break;
      next.push({ file, preview: URL.createObjectURL(file) });
    }
    setRooms((prev) => [...prev, ...next].slice(0, 3));
  }, [rooms.length]);

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
    setElapsed(0);
    setError("");
    setStyleDNA(null);
    setSummary("");
    setRoomImages(rooms.map((r) => ({ original: r.preview, generated: null, loaded: false })));
    timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);

    try {
      const formData = new FormData();
      formData.append("inspiration", inspiration);
      formData.append("budget", budget.toLowerCase());
      formData.append("scope", scope.toLowerCase());
      rooms.forEach(({ file }) => formData.append("rooms", file));

      const res = await fetch("/api/analyze", { method: "POST", body: formData });
      if (!res.ok) throw new Error(await res.text());
      const { styleDNA: dna, summary: sum, rooms: roomResults } = await res.json() as {
        styleDNA: StyleDNA; summary: string; rooms: RoomResult[];
      };

      setStyleDNA(dna);
      setSummary(sum);
      setIsAnalyzing(false);
      if (timerRef.current) clearInterval(timerRef.current);

      // Convert room photos to base64 for img2img
      const roomBase64s = await Promise.all(rooms.map((r) => fileToBase64(r.file)));

      const generated: { generated: string; roomType: string }[] = [];

      await Promise.all(
        roomResults.map(async (room: RoomResult, i: number) => {
          const imageUrl = await generateWithPolling(
            room.prompt,
            roomBase64s[i],
            i * 1000 + Math.floor(Math.random() * 999)
          );
          generated[i] = { generated: imageUrl, roomType: room.roomType };
          setRoomImages((prev) => {
            const next = [...prev];
            next[i] = { ...next[i], generated: imageUrl };
            return next;
          });
        })
      );

      const item: HistoryItem = {
        id: Date.now().toString(),
        inspiration,
        budget,
        scope,
        styleDNA: dna,
        summary: sum,
        rooms: generated.filter(Boolean),
        createdAt: Date.now(),
      };
      setHistory((prev) => [item, ...prev].slice(0, 20));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsAnalyzing(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }

  function saveStyle() {
    if (!saveStyleName.trim()) return;
    const s: SavedStyle = { id: Date.now().toString(), name: saveStyleName.trim(), inspiration, createdAt: Date.now() };
    setSavedStyles((prev) => [s, ...prev]);
    setSaveStyleName("");
    setShowSavePrompt(false);
  }

  function deleteStyle(id: string) {
    setSavedStyles((prev) => prev.filter((s) => s.id !== id));
  }

  function deleteHistory(id: string) {
    setHistory((prev) => prev.filter((h) => h.id !== id));
  }

  function reset() {
    rooms.forEach(({ preview }) => URL.revokeObjectURL(preview));
    setRooms([]);
    setInspiration("");
    setStep("home");
    setStyleDNA(null);
    setSummary("");
    setRoomImages([]);
    setError("");
    setIsAnalyzing(false);
    setShowSavePrompt(false);
    setSaveStyleName("");
    if (timerRef.current) clearInterval(timerRef.current);
  }

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  // ── HISTORY DETAIL VIEW ──
  if (selectedHistory) {
    const h = selectedHistory;
    return (
      <div className="min-h-screen bg-[#faf8f5]">
        <header className="bg-[#18181b] px-8 py-5 flex items-center justify-between">
          <button onClick={() => setSelectedHistory(null)} className="text-[#a8a29e] hover:text-white transition-colors text-sm">
            ← Back to History
          </button>
          <span className="font-serif text-white text-lg">{h.inspiration}</span>
          <button onClick={() => { deleteHistory(h.id); setSelectedHistory(null); }}
            className="text-[#a8a29e] hover:text-red-400 transition-colors text-sm">Delete</button>
        </header>
        <div className="max-w-4xl mx-auto px-8 py-10 space-y-8">
          <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-6">
            <p className="text-xs font-semibold text-[#a8a29e] uppercase tracking-widest mb-2">Style</p>
            <p className="font-serif text-2xl text-[#18181b] mb-3">{h.styleDNA.style}</p>
            <p className="text-[#78716c] leading-relaxed">{h.summary}</p>
          </div>
          {h.rooms.map((room, i) => (
            <div key={i}>
              <p className="text-xs font-semibold text-[#a8a29e] uppercase tracking-widest mb-3">{room.roomType || `Room ${i + 1}`}</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={room.generated} alt="" className="w-full rounded-3xl object-cover max-h-96" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Header */}
      <header className="bg-[#18181b] px-8 py-5 flex items-center justify-between sticky top-0 z-20">
        <button onClick={reset} className="text-left">
          <h1 className="font-serif text-white text-xl tracking-wide">Dream Home Visualizer</h1>
        </button>
        <div className="flex items-center gap-6">
          {step !== "home" && (
            <button onClick={reset} className="text-[#a8a29e] hover:text-white transition-colors text-sm">
              ← Start over
            </button>
          )}
          {history.length > 0 && step === "home" && (
            <span className="text-[#a8a29e] text-sm">{history.length} saved</span>
          )}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* ── HOME DASHBOARD ── */}
        {step === "home" && (
          <div className="space-y-12">
            {/* Hero */}
            <div className="text-center pt-4 pb-2">
              <h2 className="font-serif text-5xl text-[#18181b] mb-4 leading-tight">
                See your rooms<br />transformed
              </h2>
              <p className="text-[#78716c] text-lg max-w-md mx-auto">
                Pick a style you love, upload your space, and watch it come to life.
              </p>
              <button
                onClick={() => setStep("style")}
                className="mt-8 bg-[#18181b] hover:bg-[#2c2c2e] text-white font-semibold px-10 py-4 rounded-2xl shadow-lg transition-all text-lg"
              >
                Start New Visualization
              </button>
            </div>

            {/* Saved Styles */}
            {savedStyles.length > 0 && (
              <div>
                <h3 className="font-serif text-2xl text-[#18181b] mb-5">Your Saved Styles</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {savedStyles.map((s) => (
                    <div key={s.id} className="group bg-white rounded-2xl border border-stone-100 shadow-sm p-5 flex items-start justify-between hover:border-[#c9a84c] transition-all">
                      <button className="text-left flex-1" onClick={() => { setInspiration(s.inspiration); setStep("rooms"); }}>
                        <p className="font-semibold text-[#18181b] mb-1">{s.name}</p>
                        <p className="text-sm text-[#a8a29e] truncate">{s.inspiration}</p>
                      </button>
                      <button onClick={() => deleteStyle(s.id)}
                        className="text-stone-200 hover:text-red-400 transition-colors ml-3 opacity-0 group-hover:opacity-100 text-lg leading-none mt-0.5">
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* History */}
            {history.length > 0 && (
              <div>
                <h3 className="font-serif text-2xl text-[#18181b] mb-5">History</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {history.map((item) => (
                    <button key={item.id} onClick={() => setSelectedHistory(item)}
                      className="group bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden hover:border-[#c9a84c] hover:shadow-md transition-all text-left">
                      {item.rooms[0]?.generated ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.rooms[0].generated} alt="" className="w-full aspect-[4/3] object-cover" />
                      ) : (
                        <div className="w-full aspect-[4/3] bg-stone-100 flex items-center justify-center text-2xl">🏠</div>
                      )}
                      <div className="p-4">
                        <p className="font-semibold text-[#18181b] text-sm truncate">{item.inspiration}</p>
                        <p className="text-xs text-[#a8a29e] mt-1">{item.styleDNA.style}</p>
                        <p className="text-xs text-[#c9a29e] mt-1">{new Date(item.createdAt).toLocaleDateString()}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {savedStyles.length === 0 && history.length === 0 && (
              <p className="text-center text-[#a8a29e] text-sm pt-4">
                Your saved styles and past visualizations will appear here.
              </p>
            )}
          </div>
        )}

        {/* ── STEP 1: Style ── */}
        {step === "style" && (
          <div className="space-y-8 max-w-lg mx-auto">
            <div>
              <h2 className="font-serif text-4xl text-[#18181b] mb-2">Whose style do you love?</h2>
              <p className="text-[#78716c]">Enter a designer, Instagram handle, or paste a link</p>
            </div>

            <input
              value={inspiration}
              onChange={(e) => setInspiration(e.target.value)}
              placeholder="e.g. Studio McGee, @amberinteriors, or a Pinterest link..."
              className="w-full border-2 border-stone-200 rounded-2xl px-5 py-4 text-[#18181b] placeholder-stone-300 focus:outline-none focus:border-[#c9a84c] text-sm bg-white"
            />

            {savedStyles.length > 0 && (
              <div>
                <p className="text-xs text-[#a8a29e] uppercase tracking-widest mb-3">Your Saved Styles</p>
                <div className="flex flex-wrap gap-2">
                  {savedStyles.map((s) => (
                    <button key={s.id} onClick={() => setInspiration(s.inspiration)}
                      className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${inspiration === s.inspiration ? "border-[#c9a84c] bg-amber-50 text-amber-800" : "border-stone-200 text-[#78716c] hover:border-stone-400 bg-white"}`}>
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-xs text-[#a8a29e] uppercase tracking-widest mb-3">Quick Picks</p>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((name) => (
                  <button key={name} onClick={() => setInspiration(name)}
                    className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${inspiration === name ? "border-[#c9a84c] bg-amber-50 text-amber-800" : "border-stone-200 text-[#78716c] hover:border-stone-400 bg-white"}`}>
                    {name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep("home")}
                className="flex-1 border-2 border-stone-200 text-[#78716c] font-semibold py-4 rounded-2xl hover:bg-stone-100 transition-all bg-white">
                ← Back
              </button>
              <button onClick={() => setStep("rooms")} disabled={inspiration.trim().length < 2}
                className="flex-[2] bg-[#18181b] hover:bg-[#2c2c2e] disabled:bg-stone-300 text-white font-bold py-4 rounded-2xl shadow transition-all">
                Next: Upload Rooms →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Rooms ── */}
        {step === "rooms" && (
          <div className="space-y-8 max-w-lg mx-auto">
            <div>
              <h2 className="font-serif text-4xl text-[#18181b] mb-2">Upload your rooms</h2>
              <p className="text-[#78716c]">Photos of the spaces you want transformed — up to 3</p>
            </div>

            <div
              className="border-2 border-dashed border-stone-300 rounded-3xl p-12 text-center cursor-pointer hover:border-[#c9a84c] hover:bg-amber-50/30 transition-all"
              onDrop={(e) => { e.preventDefault(); addRooms(e.dataTransfer.files); }}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
            >
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
                onChange={(e) => e.target.files && addRooms(e.target.files)} />
              <div className="text-5xl mb-3">🏚️</div>
              <p className="font-semibold text-[#18181b]">Drop photos here</p>
              <p className="text-[#a8a29e] text-sm mt-1">or click to browse</p>
            </div>

            {rooms.length > 0 && (
              <div className="space-y-3">
                {rooms.map((room, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white rounded-2xl border border-stone-100 p-3 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={room.preview} alt="" className="w-20 h-14 object-cover rounded-xl flex-shrink-0" />
                    <p className="text-sm text-[#78716c] flex-1">Room {i + 1}</p>
                    <button onClick={() => removeRoom(i)} className="text-stone-300 hover:text-red-400 transition-colors text-lg px-2">✕</button>
                  </div>
                ))}
                {rooms.length < 3 && (
                  <button onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-stone-200 rounded-2xl py-3 text-sm text-[#a8a29e] hover:border-[#c9a84c] transition-all">
                    + Add another room
                  </button>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep("style")}
                className="flex-1 border-2 border-stone-200 text-[#78716c] font-semibold py-4 rounded-2xl hover:bg-stone-100 transition-all bg-white">
                ← Back
              </button>
              <button onClick={() => setStep("options")} disabled={rooms.length === 0}
                className="flex-[2] bg-[#18181b] hover:bg-[#2c2c2e] disabled:bg-stone-300 text-white font-bold py-4 rounded-2xl shadow transition-all">
                Next: Options →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Options ── */}
        {step === "options" && (
          <div className="space-y-8 max-w-lg mx-auto">
            <div>
              <h2 className="font-serif text-4xl text-[#18181b] mb-2">Final details</h2>
              <p className="text-[#78716c]">How far do you want to go?</p>
            </div>

            <div>
              <p className="font-semibold text-[#18181b] mb-3 text-sm uppercase tracking-widest">Budget</p>
              <div className="flex gap-3">
                {BUDGETS.map((b) => (
                  <button key={b} onClick={() => setBudget(b)}
                    className={`flex-1 py-3 rounded-2xl border-2 font-medium text-sm transition-all ${budget === b ? "border-[#c9a84c] bg-amber-50 text-amber-800" : "border-stone-200 text-[#78716c] hover:border-stone-400 bg-white"}`}>
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-semibold text-[#18181b] mb-3 text-sm uppercase tracking-widest">Scope</p>
              <div className="flex gap-3">
                {SCOPES.map((s) => (
                  <button key={s} onClick={() => setScope(s)}
                    className={`flex-1 py-3 rounded-2xl border-2 font-medium text-sm transition-all ${scope === s ? "border-[#c9a84c] bg-amber-50 text-amber-800" : "border-stone-200 text-[#78716c] hover:border-stone-400 bg-white"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-stone-100 p-5 text-sm space-y-2 shadow-sm">
              <p><span className="text-[#a8a29e]">Style:</span> <span className="font-medium text-[#18181b]">{inspiration}</span></p>
              <p><span className="text-[#a8a29e]">Rooms:</span> <span className="font-medium text-[#18181b]">{rooms.length} photo{rooms.length > 1 ? "s" : ""}</span></p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep("rooms")}
                className="flex-1 border-2 border-stone-200 text-[#78716c] font-semibold py-4 rounded-2xl hover:bg-stone-100 transition-all bg-white">
                ← Back
              </button>
              <button onClick={handleVisualize}
                className="flex-[2] bg-[#c9a84c] hover:bg-[#b8973b] text-white font-bold py-4 rounded-2xl shadow transition-all">
                Visualize My Rooms ✨
              </button>
            </div>
          </div>
        )}

        {/* ── RESULTS ── */}
        {step === "results" && (
          <div className="space-y-10">
            {/* Loading / Style DNA card */}
            {isAnalyzing ? (
              <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8">
                <div className="flex items-center gap-5 mb-5">
                  <div className="w-10 h-10 border-4 border-stone-200 border-t-[#c9a84c] rounded-full animate-spin flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-[#18181b] text-lg">
                      {elapsed < 20 ? "Analyzing style & rooms..." : "Generating your visualizations..."}
                    </p>
                    <p className="text-sm text-[#a8a29e]">
                      {elapsed < 20 ? "Claude is studying the inspiration and planning the renovation" : "Image generation takes 2–4 minutes — it's working"}
                    </p>
                  </div>
                  <span className="font-mono text-2xl text-stone-300 tabular-nums">{mm}:{ss}</span>
                </div>
                <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#c9a84c] rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min((elapsed / 240) * 100, 95)}%` }} />
                </div>
              </div>
            ) : styleDNA ? (
              <div className="bg-[#18181b] rounded-3xl p-8 text-white">
                <p className="text-xs font-semibold text-[#a8a29e] uppercase tracking-widest mb-2">Inspiration Style</p>
                <p className="font-serif text-3xl text-white mb-3">{styleDNA.style}</p>
                <p className="text-[#a8a29e] leading-relaxed mb-6 text-sm">{summary}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                  <div><p className="text-xs text-[#6b6b6b] mb-1">Palette</p><p className="text-sm text-white font-medium">{styleDNA.palette}</p></div>
                  <div><p className="text-xs text-[#6b6b6b] mb-1">Vibe</p><p className="text-sm text-white font-medium">{styleDNA.vibe}</p></div>
                  {styleDNA.elements.slice(0, 2).map((el, i) => (
                    <div key={i}><p className="text-xs text-[#6b6b6b] mb-1">Element {i + 1}</p><p className="text-sm text-white font-medium">{el}</p></div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Before / After rooms */}
            {roomImages.map((room, i) => (
              <div key={i} className="space-y-3">
                <p className="text-xs font-semibold text-[#a8a29e] uppercase tracking-widest">Room {i + 1}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-xs text-[#a8a29e] font-medium">Before</p>
                    <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-stone-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={room.original} alt="" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-[#a8a29e] font-medium">After — {inspiration}</p>
                    <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-stone-100 flex items-center justify-center relative">
                      {room.generated && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={room.generated} alt=""
                          className={`w-full h-full object-cover transition-opacity duration-700 ${room.loaded ? "opacity-100" : "opacity-0 absolute"}`}
                          onLoad={() => setRoomImages((prev) => { const n = [...prev]; n[i] = { ...n[i], loaded: true }; return n; })}
                        />
                      )}
                      {(!room.generated || !room.loaded) && (
                        <div className="flex flex-col items-center gap-2 text-[#a8a29e]">
                          <div className="w-8 h-8 border-4 border-stone-200 border-t-[#c9a84c] rounded-full animate-spin" />
                          <p className="text-xs">Generating...</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {error && <p className="text-red-500 text-sm text-center bg-red-50 rounded-2xl p-4">{error}</p>}

            {/* Save style prompt + actions */}
            {!isAnalyzing && !error && styleDNA && (
              <div className="space-y-4 pt-4 border-t border-stone-200">
                {showSavePrompt ? (
                  <div className="flex gap-3">
                    <input value={saveStyleName} onChange={(e) => setSaveStyleName(e.target.value)}
                      placeholder="Name this style (e.g. My Beach House)"
                      className="flex-1 border-2 border-stone-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c] bg-white"
                      onKeyDown={(e) => e.key === "Enter" && saveStyle()}
                      autoFocus
                    />
                    <button onClick={saveStyle} disabled={!saveStyleName.trim()}
                      className="bg-[#c9a84c] hover:bg-[#b8973b] disabled:bg-stone-300 text-white font-semibold px-6 py-3 rounded-2xl transition-all text-sm">
                      Save
                    </button>
                    <button onClick={() => setShowSavePrompt(false)}
                      className="text-[#a8a29e] hover:text-[#18181b] px-4 py-3 rounded-2xl transition-colors text-sm">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3 justify-center">
                    <button onClick={() => setShowSavePrompt(true)}
                      className="border-2 border-stone-200 text-[#78716c] font-semibold px-6 py-3 rounded-2xl hover:bg-stone-100 transition-all text-sm bg-white">
                      Save This Style
                    </button>
                    <button onClick={reset}
                      className="bg-[#18181b] hover:bg-[#2c2c2e] text-white font-semibold px-8 py-3 rounded-2xl shadow transition-all text-sm">
                      Try New Rooms
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
