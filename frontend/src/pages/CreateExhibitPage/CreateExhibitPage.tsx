import { Link } from "react-router";
import { ChevronLeft, Upload, Plus, X, Image, Video, Box, Globe, MapPin, Tag, Save, Eye } from "lucide-react";
import { sceneTypeLabels, sceneTypeColors, type SceneType} from "@entities/sceneType";
import { useState } from "react";

const mediaTypes: { type: SceneType; icon: React.ReactNode }[] = [
    { type: "image", icon: <Image className="w-5 h-5" /> },
    { type: "video", icon: <Video className="w-5 h-5" /> },
    { type: "panorama", icon: <Globe className="w-5 h-5" /> },
    { type: "3d", icon: <Box className="w-5 h-5" /> },
];

interface POI { id: string; label: string; x: number; y: number }

export function CreateExhibitPage() {
    const [step, setStep] = useState(1);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedType, setSelectedType] = useState<SceneType>("image");
    const [tags, setTags] = useState<string[]>(["Ancient", "Architecture"]);
    const [tagInput, setTagInput] = useState("");
    const [pois, setPois] = useState<POI[]>([
        { id: "1", label: "Main Entrance", x: 30, y: 45 },
    ]);
    const [poiLabel, setPoiLabel] = useState("");

    const steps = ["Basic Info", "Media Upload", "Points of Interest", "Review"];

    const addTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
        }
    };

    const addPOI = () => {
        if (poiLabel.trim()) {
            setPois([...pois, { id: Date.now().toString(), label: poiLabel.trim(), x: Math.random() * 80 + 10, y: Math.random() * 60 + 20 }]);
            setPoiLabel("");
        }
    };

    return (
        <div className="max-w-[900px] mx-auto px-6 py-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <Link to="/dashboard" className="text-stone-400 hover:text-stone-600 no-underline">
                    <ChevronLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-stone-900" style={{ fontSize: 26, fontWeight: 600 }}>Create New Exhibit</h1>
                    <p className="text-stone-500" style={{ fontSize: 14 }}>Step {step} of {steps.length}: {steps[step - 1]}</p>
                </div>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2 mb-8">
                {steps.map((s, i) => (
                    <div key={s} className="flex items-center gap-2 flex-1">
                        <button
                            onClick={() => setStep(i + 1)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${i + 1 <= step ? "bg-stone-900 text-white" : "bg-stone-200 text-stone-500"}`}
                            style={{ fontSize: 12, fontWeight: 600 }}
                        >
                            {i + 1}
                        </button>
                        <span className={`hidden md:block ${i + 1 <= step ? "text-stone-900" : "text-stone-400"}`} style={{ fontSize: 12, fontWeight: 500 }}>{s}</span>
                        {i < steps.length - 1 && <div className={`flex-1 h-px ${i + 1 < step ? "bg-stone-900" : "bg-stone-200"}`} />}
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl border border-stone-200/60 p-6">
                {/* Step 1: Basic Info */}
                {step === 1 && (
                    <div className="space-y-5">
                        <div>
                            <label className="text-stone-600 block mb-1.5" style={{ fontSize: 13, fontWeight: 500 }}>Title</label>
                            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter exhibit title..." className="w-full px-4 py-2.5 rounded-lg border border-stone-200 outline-none focus:border-stone-400 transition-colors" style={{ fontSize: 14 }} />
                        </div>
                        <div>
                            <label className="text-stone-600 block mb-1.5" style={{ fontSize: 13, fontWeight: 500 }}>Description</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe this exhibit..." rows={4} className="w-full px-4 py-2.5 rounded-lg border border-stone-200 outline-none focus:border-stone-400 transition-colors resize-none" style={{ fontSize: 14 }} />
                        </div>
                        <div>
                            <label className="text-stone-600 block mb-1.5" style={{ fontSize: 13, fontWeight: 500 }}>Tags</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {tags.map((t) => (
                                    <span key={t} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-700" style={{ fontSize: 12 }}>
                    <Tag className="w-3 h-3" /> {t}
                                        <button onClick={() => setTags(tags.filter((x) => x !== t))} className="text-stone-400 hover:text-stone-600"><X className="w-3 h-3" /></button>
                  </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTag()} placeholder="Add tag..." className="flex-1 px-3 py-2 rounded-lg border border-stone-200 outline-none" style={{ fontSize: 13 }} />
                                <button onClick={addTag} className="px-3 py-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50" style={{ fontSize: 13 }}>Add</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Media Upload */}
                {step === 2 && (
                    <div className="space-y-5">
                        <div>
                            <label className="text-stone-600 block mb-3" style={{ fontSize: 13, fontWeight: 500 }}>Media Type</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {mediaTypes.map((m) => (
                                    <button key={m.type} onClick={() => setSelectedType(m.type)} className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${selectedType === m.type ? "border-stone-900 bg-stone-50" : "border-stone-200 hover:border-stone-300"}`}>
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${sceneTypeColors[m.type]}`}>{m.icon}</div>
                                        <span className="text-stone-700" style={{ fontSize: 12, fontWeight: 500 }}>{sceneTypeLabels[m.type]}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-stone-600 block mb-3" style={{ fontSize: 13, fontWeight: 500 }}>Upload Media</label>
                            <div className="border-2 border-dashed border-stone-200 rounded-xl p-10 text-center hover:border-stone-300 transition-colors cursor-pointer">
                                <Upload className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                                <p className="text-stone-600 mb-1" style={{ fontSize: 14, fontWeight: 500 }}>Drag and drop your file here</p>
                                <p className="text-stone-400" style={{ fontSize: 12 }}>or click to browse • Max 500MB</p>
                                <p className="text-stone-400 mt-2" style={{ fontSize: 11 }}>
                                    {selectedType === "image" && "Supports: JPG, PNG, TIFF, WebP"}
                                    {selectedType === "video" && "Supports: MP4, MOV, WebM"}
                                    {selectedType === "panorama" && "Supports: Equirectangular JPG, PNG"}
                                    {selectedType === "3d" && "Supports: GLTF, GLB, OBJ, FBX"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Points of Interest */}
                {step === 3 && (
                    <div className="space-y-5">
                        <p className="text-stone-500" style={{ fontSize: 14 }}>Add interactive markers to highlight important areas of your exhibit.</p>
                        <div className="relative aspect-video bg-stone-100 rounded-xl overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center text-stone-300">
                                <span style={{ fontSize: 14 }}>Media preview area</span>
                            </div>
                            {pois.map((poi) => (
                                <div key={poi.id} className="absolute group" style={{ left: `${poi.x}%`, top: `${poi.y}%`, transform: "translate(-50%,-50%)" }}>
                                    <div className="w-6 h-6 rounded-full bg-stone-900 border-2 border-white shadow-lg flex items-center justify-center">
                                        <MapPin className="w-3 h-3 text-white" />
                                    </div>
                                    <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 bg-stone-900 text-white rounded text-nowrap" style={{ fontSize: 10 }}>{poi.label}</span>
                                </div>
                            ))}
                        </div>
                        <div>
                            <label className="text-stone-600 block mb-2" style={{ fontSize: 13, fontWeight: 500 }}>Points of Interest</label>
                            <div className="space-y-2 mb-3">
                                {pois.map((poi) => (
                                    <div key={poi.id} className="flex items-center justify-between px-3 py-2 bg-stone-50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-3.5 h-3.5 text-stone-400" />
                                            <span className="text-stone-700" style={{ fontSize: 13 }}>{poi.label}</span>
                                        </div>
                                        <button onClick={() => setPois(pois.filter((p) => p.id !== poi.id))} className="text-stone-400 hover:text-stone-600"><X className="w-4 h-4" /></button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input value={poiLabel} onChange={(e) => setPoiLabel(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addPOI()} placeholder="Point of interest label..." className="flex-1 px-3 py-2 rounded-lg border border-stone-200 outline-none" style={{ fontSize: 13 }} />
                                <button onClick={addPOI} className="flex items-center gap-1 px-3 py-2 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50" style={{ fontSize: 13 }}>
                                    <Plus className="w-4 h-4" /> Add
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Review */}
                {step === 4 && (
                    <div className="space-y-5">
                        <h3 className="text-stone-900" style={{ fontSize: 18, fontWeight: 600 }}>Review Your Exhibit</h3>
                        <div className="space-y-3" style={{ fontSize: 14 }}>
                            {[
                                ["Title", title || "Untitled Exhibit"],
                                ["Description", description || "No description provided"],
                                ["Media Type", sceneTypeLabels[selectedType]],
                                ["Tags", tags.join(", ") || "None"],
                                ["Points of Interest", `${pois.length} marker${pois.length !== 1 ? "s" : ""}`],
                            ].map(([k, v]) => (
                                <div key={k} className="flex justify-between py-2 border-b border-stone-100">
                                    <span className="text-stone-400">{k}</span>
                                    <span className="text-stone-700 text-right max-w-md truncate" style={{ fontWeight: 500 }}>{v}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-5 border-t border-stone-100">
                    <button onClick={() => setStep(Math.max(1, step - 1))} className={`px-5 py-2.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors ${step === 1 ? "opacity-0 pointer-events-none" : ""}`} style={{ fontSize: 14 }}>
                        Back
                    </button>
                    <div className="flex gap-3">
                        {step === 4 ? (
                            <>
                                <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors" style={{ fontSize: 14 }}>
                                    <Eye className="w-4 h-4" /> Preview
                                </button>
                                <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-stone-900 text-white hover:bg-stone-800 transition-colors" style={{ fontSize: 14, fontWeight: 500 }}>
                                    <Save className="w-4 h-4" /> Publish Exhibit
                                </button>
                            </>
                        ) : (
                            <button onClick={() => setStep(Math.min(4, step + 1))} className="px-5 py-2.5 rounded-lg bg-stone-900 text-white hover:bg-stone-800 transition-colors" style={{ fontSize: 14, fontWeight: 500 }}>
                                Continue
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
