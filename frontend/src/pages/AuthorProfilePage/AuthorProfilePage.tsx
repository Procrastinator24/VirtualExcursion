import { Link, useParams } from "react-router";
import { Star, BookOpen, Layers, Users, UserPlus, Clock } from "lucide-react";
import {ExcursionResponse} from "../../entities/excursion";
import {excursionApi} from "../../entities/excursion";
import type {GuideProfileResponse} from "../../entities/guides";
import {guideApi} from "../../entities/guides";
import {sceneTypeLabels, sceneTypeColors, type SceneType} from "../../entities/sceneType"
import { ImageWithFallback } from "../../shared/ui/imgWrapper/ImageWithFallback";
import {useEffect, useState} from "react";

export function AuthorProfilePage() {
    const { id } = useParams();
    const [excursions, setExcursions] = useState<ExcursionResponse[]>([]);
    const [author, setAuthor] = useState<GuideProfileResponse>()
    const [following, setFollowing] = useState(false);
    const [tab, setTab] = useState<"excursions" | "scenes">("excursions");

    useEffect(() => {
        excursionApi.getByGuideId(Number(id)).then((e) =>{setExcursions(e.data)})
        guideApi.getById(Number(id)).then((a) => {
            console.log(a.data)
            setAuthor(a.data)})

            }, []);

    return (
        <div className="max-w-[1320px] mx-auto px-6 py-8">
            {/* Profile Header */}
            <div className="bg-white rounded-xl border border-stone-200/60 p-6 md:p-8 mb-8">
                <div className="flex flex-col md:flex-row items-start gap-6">
                    <ImageWithFallback src={author?.logoUrl} alt={author?.isOrganization? author?.organizationName:author?.userName} className="w-24 h-24 rounded-full object-cover" />
                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-2">
                            <h1 className="text-stone-900" style={{ fontSize: 26, fontWeight: 600 }}>{author?.isOrganization ? author?.organizationName:author?.userName}</h1>
                            <button
                                onClick={() => setFollowing(!following)}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${following ? "bg-stone-100 text-stone-700" : "bg-stone-900 text-white hover:bg-stone-800"}`}
                                style={{ fontSize: 13, fontWeight: 500 }}
                            >
                                <UserPlus className="w-4 h-4" /> {following ? "Following" : "Follow"}
                            </button>
                        </div>
                        <span className="text-stone-500 block mb-3" style={{ fontSize: 14 }}>{author?.userName}</span>
                        <p className="text-stone-600 max-w-2xl" style={{ fontSize: 14, lineHeight: 1.7 }}>{author?.description}</p>
                        <div className="flex items-center gap-6 mt-4 text-stone-400" style={{ fontSize: 13 }}>
                            <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> {author?.excursionsCount} excursions</span>
                            {/*<span className="flex items-center gap-1.5"><Layers className="w-4 h-4" /> {author?.sceneCount} scenes</span>*/}
                            {/*<span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {author?.followers.toLocaleString()} followers</span>*/}
                            <span className="flex items-center gap-1.5"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {author?.rating}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                {(["excursions", "scenes"] as const).map((t) => (
                    <button key={t} onClick={() => setTab(t)} className={`px-5 py-2.5 rounded-xl transition-colors capitalize ${tab === t ? "bg-stone-900 text-white" : "bg-white border border-stone-200 text-stone-600 hover:border-stone-300"}`} style={{ fontSize: 14, fontWeight: 500 }}>
                        {t === "excursions" ? `Excursions (${excursions.length})` : `Scenes доделать!!! (${excursions[0]?.scenes?.length})`}
                    </button>
                ))}
            </div>

            {tab === "excursions" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {excursions.map((ex) => (
                        <Link key={ex.id} to={`/excursion/${ex.id}`} className="group bg-white rounded-xl overflow-hidden border border-stone-200/60 hover:shadow-lg transition-all no-underline">
                            <div className="relative h-44 overflow-hidden">
                                <ImageWithFallback src={ex.thumbnailUrl} alt={ex.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-3 left-3 flex gap-1.5">
                                    {/*{ex.contentType.slice(0, 2).map((t) => (*/}
                                        <span key={ex.contentType} className={`px-2 py-0.5 rounded-md ${sceneTypeColors[ex.contentType]}`} style={{ fontSize: 10, fontWeight: 500 }}>{sceneTypeLabels[ex.contentType]}</span>
                                    {/* ))}*/}
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-stone-900" style={{ fontSize: 15, fontWeight: 600 }}>{ex.title}</h3>
                                <div className="flex items-center justify-between mt-2 text-stone-400" style={{ fontSize: 12 }}>
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {ex.duration}</span>
                                    <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {ex.rating}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/*{tab === "scenes" && (*/}
            {/*    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">*/}
            {/*        {allScenes.slice(0, 10).map((s, i) => (*/}
            {/*            <div key={`${s.id}-${i}`} className="bg-white rounded-xl overflow-hidden border border-stone-200/60 hover:shadow-md transition-all">*/}
            {/*                <div className="relative h-28 overflow-hidden">*/}
            {/*                    <ImageWithFallback src={s.image} alt={s.title} className="w-full h-full object-cover" />*/}
            {/*                    <span className={`absolute top-2 left-2 px-1.5 py-0.5 rounded ${sceneTypeColors[s.type]}`} style={{ fontSize: 10, fontWeight: 500 }}>{sceneTypeLabels[s.type]}</span>*/}
            {/*                </div>*/}
            {/*                <div className="p-2.5">*/}
            {/*                    <span className="text-stone-800 block truncate" style={{ fontSize: 12, fontWeight: 500 }}>{s.title}</span>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        ))}*/}
            {/*    </div>*/}
            {/*)}*/}
        </div>
    );
}
