import { Globe, BookOpen, Users, Shield, Compass, Heart } from "lucide-react";
import { IMAGES } from "@shared/MockImages/data.ts";
import { ImageWithFallback } from "@shared/ui/imgWrapper/ImageWithFallback.tsx";

const values = [
    { icon: <Globe className="w-6 h-6" />, title: "Cultural Preservation", desc: "We digitize and preserve cultural heritage sites, making them accessible to future generations through immersive technology." },
    { icon: <BookOpen className="w-6 h-6" />, title: "Education First", desc: "Every excursion is designed with educational outcomes in mind, enriched by expert commentary and scholarly research." },
    { icon: <Users className="w-6 h-6" />, title: "Global Access", desc: "We break down geographical barriers, allowing anyone to explore the world's most important historical sites." },
    { icon: <Shield className="w-6 h-6" />, title: "Academic Integrity", desc: "All content is reviewed by qualified historians and archaeologists to ensure accuracy and scholarly standards." },
    { icon: <Compass className="w-6 h-6" />, title: "Immersive Technology", desc: "We leverage VR, 360\u00b0 panoramas, 3D scanning, and multimedia to create truly engaging experiences." },
    { icon: <Heart className="w-6 h-6" />, title: "Community Driven", desc: "Our platform empowers guides, educators, and institutions to create and share their own virtual excursions." },
];

export const AboutPage = () => {
    return (
        <div>
            {/* Hero */}
            <section className="relative h-80">
                <ImageWithFallback src={IMAGES.cathedral} alt="Heritage" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-stone-900/60" />
                <div className="absolute inset-0 flex items-center justify-center text-center px-6">
                    <div>
                        <h1 className="text-white mb-3" style={{ fontSize: 40, fontWeight: 600 }}>About HistoryVR</h1>
                        <p className="text-white/75 max-w-xl mx-auto" style={{ fontSize: 16, lineHeight: 1.7 }}>
                            Preserving and sharing cultural heritage through immersive virtual experiences accessible to everyone.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission */}
            <section className="max-w-[900px] mx-auto px-6 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-stone-900 mb-4" style={{ fontSize: 28, fontWeight: 600 }}>Our Mission</h2>
                    <p className="text-stone-600 max-w-2xl mx-auto" style={{ fontSize: 16, lineHeight: 1.8 }}>
                        HistoryVR is dedicated to making cultural heritage universally accessible through cutting-edge virtual reality and multimedia technology. We partner with museums, universities, and cultural institutions worldwide to create immersive educational experiences that bring history to life.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    <div className="rounded-xl overflow-hidden h-64">
                        <ImageWithFallback src={IMAGES.artifacts} alt="Artifacts" className="w-full h-full object-cover" />
                    </div>
                    <div className="rounded-xl overflow-hidden h-64">
                        <ImageWithFallback src={IMAGES.renaissance} alt="Renaissance" className="w-full h-full object-cover" />
                    </div>
                </div>

                <div className="text-center mb-12">
                    <h2 className="text-stone-900 mb-4" style={{ fontSize: 28, fontWeight: 600 }}>Our Values</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {values.map((v) => (
                        <div key={v.title} className="bg-white rounded-xl border border-stone-200/60 p-6">
                            <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600 mb-4">{v.icon}</div>
                            <h3 className="text-stone-900 mb-2" style={{ fontSize: 16, fontWeight: 600 }}>{v.title}</h3>
                            <p className="text-stone-500" style={{ fontSize: 14, lineHeight: 1.6 }}>{v.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Educational Purpose */}
            <section className="bg-stone-900 py-16">
                <div className="max-w-[900px] mx-auto px-6 text-center">
                    <h2 className="text-white mb-4" style={{ fontSize: 28, fontWeight: 600 }}>Educational Purpose</h2>
                    <p className="text-stone-400 max-w-2xl mx-auto mb-8" style={{ fontSize: 15, lineHeight: 1.8 }}>
                        HistoryVR serves as a bridge between traditional museum experiences and modern digital learning. Our platform is used by schools, universities, and lifelong learners to explore historical periods, archaeological discoveries, and artistic movements in ways that textbooks alone cannot provide.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { num: "50+", label: "Partner Institutions" },
                            { num: "200+", label: "Virtual Excursions" },
                            { num: "1M+", label: "Learners Worldwide" },
                        ].map((s) => (
                            <div key={s.label}>
                                <span className="text-white block" style={{ fontSize: 36, fontWeight: 700 }}>{s.num}</span>
                                <span className="text-stone-400" style={{ fontSize: 14 }}>{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
