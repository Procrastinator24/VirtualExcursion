
export type SceneType = "vr" | "panorama" | "video" | "image" | "3d" | "mixed";

export const sceneTypeLabels: Record<SceneType, string> = {
    vr: "VR Scene",
    panorama: "360\u00b0 Panorama",
    video: "Video",
    image: "Image",
    "3d": "3D Model",
    mixed: "Mixed"
};

export const sceneTypeColors: Record<SceneType, string> = {
    vr: "bg-violet-100 text-violet-700",
    panorama: "bg-sky-100 text-sky-700",
    video: "bg-rose-100 text-rose-700",
    image: "bg-amber-100 text-amber-700",
    "3d": "bg-emerald-100 text-emerald-700",
    mixed: "bg-violet-100 text-violet-700"
};
