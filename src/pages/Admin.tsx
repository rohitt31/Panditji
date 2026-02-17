import { useState, useEffect } from "react";
import { Trash2, Plus, Upload } from "lucide-react";
import logger from "@/lib/logger";
interface Card {
    id: string;
    title: string;
    description: string;
    features: string[];
    experience: string;
    image: string;
}

const Admin = () => {
    const [cards, setCards] = useState<Card[]>([]);
    const [loading, setLoading] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [features, setFeatures] = useState("");
    const [exp, setExp] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);

    // Fetch Cards
    const fetchCards = async () => {
        try {
            const res = await fetch("/api/cards");
            const data = await res.json();
            setCards(data);
        } catch (err) {
            logger.error('Admin CRUD error', err);
        }
    };

    useEffect(() => {
        fetchCards();
    }, []);

    // Handle Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", desc);
        formData.append("features", JSON.stringify(features.split(",").map(f => f.trim())));
        formData.append("experience", exp);
        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            const res = await fetch("/api/cards", {
                method: "POST",
                body: formData,
            });
            if (res.ok) {
                alert("Card added successfully!");
                // Reset form
                setTitle("");
                setDesc("");
                setFeatures("");
                setExp("");
                setImageFile(null);
                fetchCards(); // Refresh list
            } else {
                alert("Failed to add card.");
            }
        } catch (err) {
            logger.error('Admin CRUD error', err);
            alert("Error adding card.");
        } finally {
            setLoading(false);
        }
    };

    // Handle Delete
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this card?")) return;

        try {
            const res = await fetch(`/api/cards/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchCards();
            }
        } catch (err) {
            logger.error('Admin CRUD error', err);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 lg:p-20 pt-32">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-heading mb-12 text-gradient-gold">Admin Dashboard - Manage Cards</h1>

                <div className="grid lg:grid-cols-2 gap-12">

                    {/* Form Section */}
                    <div className="glass-card p-8 rounded-2xl border border-white/10">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Plus className="text-primary" /> Add New Experience
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div>
                                <label className="block text-sm text-white/60 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none"
                                    placeholder="e.g. Rudrabhishek Ceremony"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-white/60 mb-2">Description</label>
                                <textarea
                                    value={desc}
                                    onChange={e => setDesc(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none h-32"
                                    placeholder="Detailed description of the ritual..."
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-white/60 mb-2">Features (comma separated)</label>
                                    <input
                                        type="text"
                                        value={features}
                                        onChange={e => setFeatures(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none"
                                        placeholder="Vedic Chants, Pure Materials"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-white/60 mb-2">Experience (Years)</label>
                                    <input
                                        type="text"
                                        value={exp}
                                        onChange={e => setExp(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none"
                                        placeholder="e.g. 5+"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-white/60 mb-2">Upload Image</label>
                                <div className="relative border-2 border-dashed border-white/10 rounded-lg p-8 text-center hover:bg-white/5 transition-colors cursor-pointer group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => setImageFile(e.target.files?.[0] || null)}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <div className="flex flex-col items-center gap-2 text-white/40 group-hover:text-primary transition-colors">
                                        <Upload className="w-8 h-8" />
                                        <span>{imageFile ? imageFile.name : "Click to upload image"}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                            >
                                {loading ? "Saving..." : "Add Content Card"}
                            </button>

                        </form>
                    </div>

                    {/* List Section */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold mb-6">Existing Content Cards</h2>

                        {cards.length === 0 ? (
                            <p className="text-white/40 italic">No dynamic cards added yet.</p>
                        ) : (
                            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                                {cards.map(card => (
                                    <div key={card.id} className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/10 items-center">
                                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-black/50 flex-shrink-0">
                                            {card.image ? (
                                                <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-white/20">No Img</div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-lg truncate">{card.title}</h3>
                                            <p className="text-sm text-white/50 truncate">{card.description}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(card.id)}
                                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
