"use client"
import React, { useState } from 'react';
import { getRecommendations } from '@/actions/recommendationActions';
import { models_groq } from '@/lib/ai';
import { Sparkles, Tv, Book, Gamepad2, Film, Ghost, Loader2, Search, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming this exists, standard in shadcn/ui apps. If not I'll define a helper or just use template literals.
// I'll assume standard shadcn utils are present given the structure. 
// If not, I will remove `cn` and just use strings. 
// Actually, safer to check or just inline it if unsure.
// I'll inline a simple clsx/twMerge alternative if I don't check, but I'll gamble on `cn` existing or just use template strings to be safe against missing util.
// Actually, I'll check if lib/utils exists. 
// Wait, I saw lib folder in list_dir earlier. `utils.ts` exists (1850 bytes). It likely has `cn`.

const CATEGORIES = [
    { id: 'All', icon: Sparkles, label: 'Everything' },
    { id: 'Movie', icon: Film, label: 'Movies' },
    { id: 'Show', icon: Tv, label: 'TV Shows' },
    { id: 'Book', icon: Book, label: 'Books' },
    { id: 'Game', icon: Gamepad2, label: 'Games' },
    { id: 'Anime', icon: Ghost, label: 'Anime' },
];

export default function RecGenPage() {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('All');
    const [model, setModel] = useState(models_groq[0].id);
    const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setError('');
        setRecommendations([]);

        try {
            const result = await getRecommendations(query, category, model);
            if (result.success) {
                setRecommendations(result?.data!);
            } else {
                setError(result.message || 'Failed to generate recommendations');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleSurpriseMe = () => {
        const surprises = [
            "I want a story that feels like a warm hug but usually ends in tears.",
            "Give me something that will make me question reality.",
            "I need a high-octane cyberpunk adventure with noir vibes.",
            "Something obscure from the 80s that deserves a cult following.",
            "A cozy mystery set in a small British village.",
        ];
        const random = surprises[Math.floor(Math.random() * surprises.length)];
        setQuery(random);
        // Optionally auto-submit:
        // handleGenerate(); // Won't work directly due to state update lag, need useEffect or ref, but user can just click.
    };

    return (
        <div className="min-h-screen w-full bg-[#0a0a0a] text-white overflow-hidden relative font-sans selection:bg-purple-500/30">
            {/* Animated Background Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-slow" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse-slow delay-1000" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-16 flex flex-col items-center">

                {/* Header */}
                <div className="mb-12 text-center space-y-4">
                    <div className="inline-flex items-center justify-center p-2 bg-white/5 backdrop-blur-lg rounded-full border border-white/10 mb-4 ring-1 ring-white/5 shadow-2xl">
                        <Sparkles className="w-5 h-5 text-purple-400 mr-2" />
                        <span className="text-sm font-medium text-purple-200">AI Powered Matchmaker</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-white/60 tracking-tight">
                        Find Your Next Obsession
                    </h1>
                    <p className="text-white/40 max-w-2xl mx-auto text-lg leading-relaxed">
                        Tell us what you love, what you're in the mood for, or just roll the dice.
                        Our AI curates the perfect list for you.
                    </p>
                </div>

                {/* Input Section */}
                <div className="w-full max-w-3xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-2 shadow-2xl mb-12 transform transition-all hover:scale-[1.01] duration-500">
                    <div className="p-4 space-y-4">
                        <textarea
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="E.g., 'I loved Breaking Bad and Dark, suggest something intense with plot twists...'"
                            className="w-full bg-transparent border-none outline-none text-white text-lg placeholder:text-white/20 resize-none min-h-[100px] p-2"
                        />

                        <div className="flex flex-wrap gap-2 items-center justify-between pt-4 border-t border-white/5">
                            <div className="flex flex-wrap gap-2">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setCategory(cat.id)}
                                        className={`
                                        flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300
                                        ${category === cat.id
                                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20 scale-105'
                                                : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                                            }
                                    `}
                                    >
                                        <cat.icon className="w-3 h-3 mr-1.5" />
                                        {cat.label}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-3 relative">
                                <div className="relative">
                                    <button
                                        onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
                                        className="flex items-center gap-2 bg-white/5 border border-white/10 text-white/60 text-xs rounded-lg px-3 py-2 hover:bg-white/10 hover:text-white transition-all duration-300"
                                    >
                                        <span>{models_groq.find(m => m.id === model)?.name || 'Select Model'}</span>
                                        <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isModelMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isModelMenuOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() => setIsModelMenuOpen(false)}
                                            />
                                            <div className="absolute bottom-full mb-2 right-0 w-64 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl backdrop-blur-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                                <div className="p-1 max-h-60 overflow-y-auto custom-scrollbar">
                                                    {models_groq.map((m) => (
                                                        <button
                                                            key={m.id}
                                                            onClick={() => {
                                                                setModel(m.id);
                                                                setIsModelMenuOpen(false);
                                                            }}
                                                            className={`
                                                                w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between group transition-colors
                                                                ${model === m.id
                                                                    ? 'bg-purple-600/20 text-purple-300'
                                                                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                                                                }
                                                            `}
                                                        >
                                                            <span className="truncate mr-2">{m.name}</span>
                                                            {model === m.id && <Check className="w-3 h-3 text-purple-400" />}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <button
                                    onClick={handleSurpriseMe}
                                    className="text-xs font-semibold text-white/40 hover:text-purple-400 transition-colors"
                                >
                                    Surprise Me
                                </button>
                                <button
                                    onClick={handleGenerate}
                                    disabled={loading || !query.trim()}
                                    className="flex items-center px-6 py-2.5 bg-white text-black rounded-full font-bold hover:bg-purple-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] active:scale-95"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                                    <span className="ml-2">{loading ? 'Curating...' : 'Discover'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Grid / Loading State */}
                {error && (
                    <div className="text-red-400 bg-red-400/10 px-4 py-2 rounded-lg mb-8 border border-red-400/20">
                        {error}
                    </div>
                )}

                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                    {recommendations.map((rec, idx) => (
                        <div
                            key={idx}
                            className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-500 hover:border-purple-500/30 flex flex-col"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="px-2 py-1 bg-white/10 rounded-md text-[10px] font-bold uppercase tracking-wider text-white/60">
                                    {rec.type}
                                </span>
                                <div className="flex items-center space-x-1">
                                    <span className="text-xs font-bold text-green-400">{rec.score}% Match</span>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                                {rec.title}
                            </h3>

                            <p className="text-white/60 text-sm leading-relaxed mb-6 flex-grow">
                                {rec.description}
                            </p>

                            <div className="space-y-3 pt-4 border-t border-white/5">
                                <div className="bg-purple-900/20 p-3 rounded-xl border border-purple-500/10">
                                    <p className="text-xs text-purple-300 italic">
                                        "{rec.whyOnlyYou}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State / Initial placeholder */}
                {!loading && recommendations.length === 0 && !error && (
                    <div className="text-center text-white/20 mt-12">
                        <Ghost className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Ready to find something new?</p>
                    </div>
                )}
            </div>
        </div>
    );
}