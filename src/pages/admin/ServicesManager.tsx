import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import {
    Loader2, Plus, Trash2, Edit2, Upload, X, Sparkles, Clock,
    IndianRupee, Tag, FileText, Image as ImageIcon, Wand2, Check
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import logger from "@/lib/logger";

interface Service {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    image: string;
    icon: string;
    duration: string;
    priceRange: string;
    features: string[] | string;
    [key: string]: any;
}

const DESC_MAX = 200;

const emptyForm = {
    title: "",
    subtitle: "",
    description: "",
    icon: "",
    duration: "",
    priceRange: "",
    features: "",
};

const ServicesManager = () => {
    const { toast } = useToast();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Service | null>(null);
    const [formData, setFormData] = useState(emptyForm);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiPrompt, setAiPrompt] = useState("");
    const fileRef = useRef<HTMLInputElement>(null);

    // Fetch services
    const fetchServices = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/services");
            const data = await res.json();
            setServices(Array.isArray(data) ? data : []);
        } catch (error) {
            logger.error("Error fetching services", error);
            toast({ title: "Error", description: "Failed to load services.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchServices(); }, []);

    // Form handlers
    const handleChange = (name: string, value: string) => {
        if (name === "description" && value.length > DESC_MAX) return;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const openModal = (item?: Service) => {
        if (item) {
            setEditingItem(item);
            const featuresStr = Array.isArray(item.features)
                ? item.features.join(", ")
                : (item.features || "");
            setFormData({
                title: item.title || "",
                subtitle: item.subtitle || "",
                description: item.description || "",
                icon: item.icon || "",
                duration: item.duration || "",
                priceRange: item.priceRange || item.price || "",
                features: featuresStr,
            });
            setImagePreview(item.image || null);
        } else {
            setEditingItem(null);
            setFormData(emptyForm);
            setImagePreview(null);
        }
        setImageFile(null);
        setAiPrompt("");
        setIsOpen(true);
    };

    // AI Auto-Fill
    const handleAiFill = async () => {
        const prompt = aiPrompt.trim() || formData.title.trim();
        if (!prompt) {
            toast({ title: "Enter a service name", description: "Type a pooja/ritual name to auto-fill.", variant: "destructive" });
            return;
        }
        setAiLoading(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch("/api/ai/generate-service", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ prompt }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "AI generation failed");
            }

            const data = await res.json();
            setFormData({
                title: data.title || formData.title,
                subtitle: data.subtitle || "",
                description: (data.description || "").substring(0, DESC_MAX),
                icon: data.icon || "🙏",
                duration: data.duration || "",
                priceRange: data.priceRange || "",
                features: Array.isArray(data.features) ? data.features.join(", ") : "",
            });

            toast({ title: "✨ AI Auto-Fill Complete", description: "Fields populated! Review & adjust as needed." });
        } catch (error: any) {
            logger.error("AI auto-fill error", error);
            toast({ title: "AI Error", description: error.message || "Please try again.", variant: "destructive" });
        } finally {
            setAiLoading(false);
        }
    };

    // Submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const data = new FormData();
        data.append("title", formData.title);
        data.append("subtitle", formData.subtitle);
        data.append("description", formData.description.substring(0, DESC_MAX));
        data.append("icon", formData.icon);
        data.append("duration", formData.duration);
        data.append("priceRange", formData.priceRange);

        // Convert comma-separated features to JSON array
        const featuresArr = formData.features
            .split(",")
            .map(f => f.trim())
            .filter(Boolean);
        data.append("features", JSON.stringify(featuresArr));

        if (imageFile) {
            data.append("image", imageFile);
        }

        try {
            const token = localStorage.getItem("adminToken");
            const url = editingItem ? `/api/services/${editingItem.id}` : "/api/services";
            const method = editingItem ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                body: data,
            });

            if (res.ok) {
                setIsOpen(false);
                fetchServices();
                toast({ title: editingItem ? "✅ Service Updated" : "✅ Service Created", description: `"${formData.title}" saved successfully.`, });
            } else {
                toast({ title: "Error", description: "Failed to save. Please try again.", variant: "destructive" });
            }
        } catch (error) {
            logger.error("Save error", error);
            toast({ title: "Error", description: "Failed to save service.", variant: "destructive" });
        } finally {
            setSubmitting(false);
        }
    };

    // Delete service
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this service?")) return;
        try {
            const token = localStorage.getItem("adminToken");
            await fetch(`/api/services/${id}`, {
                method: "DELETE",
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            fetchServices();
            toast({ title: "Deleted", description: "Service removed successfully." });
        } catch (error) {
            logger.error("Delete error", error);
            toast({ title: "Error", description: "Failed to delete.", variant: "destructive" });
        }
    };

    // Parse features for display
    const getFeatures = (features: string[] | string): string[] => {
        if (Array.isArray(features)) return features;
        if (typeof features === "string") {
            try { return JSON.parse(features); } catch { return features.split(",").map(f => f.trim()).filter(Boolean); }
        }
        return [];
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <p className="text-white/40 text-sm italic mb-1">Manage the sacred services displayed on the homepage.</p>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent font-heading">
                        Sacred Rituals & Services
                    </h1>
                </div>
                <Button onClick={() => openModal()} className="bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-400 hover:to-amber-500 gap-2 font-semibold shadow-lg shadow-amber-500/20 transition-all duration-300">
                    <Plus className="w-4 h-4" /> Add New Service
                </Button>
            </div>

            {/* Stats bar */}
            <div className="flex gap-4">
                <div className="glass-card px-4 py-2 flex items-center gap-2 text-sm text-white/60">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-white font-medium">{services.length}</span> Services Active
                </div>
            </div>

            {/* Service Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full flex justify-center py-20 text-white/50">
                        <Loader2 className="animate-spin w-8 h-8" />
                    </div>
                ) : services.length === 0 ? (
                    <div className="col-span-full text-center py-20">
                        <Sparkles className="w-12 h-12 text-white/20 mx-auto mb-4" />
                        <p className="text-white/30 italic text-lg">No services yet. Add your first pooja!</p>
                    </div>
                ) : (
                    services.map(item => (
                        <div key={item.id} className="group relative rounded-2xl overflow-hidden border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-transparent hover:border-amber-500/20 transition-all duration-500 hover:shadow-lg hover:shadow-amber-500/5">
                            {/* Image */}
                            <div className="relative aspect-[16/10] w-full bg-black/50 overflow-hidden">
                                {item.image ? (
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/20">
                                        <ImageIcon className="w-16 h-16" />
                                    </div>
                                )}
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                                {/* Icon badge */}
                                {item.icon && (
                                    <div className="absolute bottom-3 left-3 w-10 h-10 rounded-full bg-amber-500/90 backdrop-blur-sm flex items-center justify-center text-lg shadow-lg shadow-black/30">
                                        {item.icon}
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <h3 className="font-heading font-bold text-lg text-white mb-1 truncate">{item.title || "Untitled"}</h3>
                                <p className="text-sm text-white/50 line-clamp-2 mb-4 leading-relaxed min-h-[2.5rem]">{item.description || "No description"}</p>

                                {/* Duration + Price */}
                                <div className="flex items-center justify-between text-xs text-white/40 mb-4 pb-4 border-b border-white/5">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>{item.duration || "—"}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-amber-400/80 font-medium">
                                        <span>{item.priceRange || item.price || "—"}</span>
                                    </div>
                                </div>

                                {/* Features */}
                                {getFeatures(item.features).length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {getFeatures(item.features).slice(0, 3).map((f, i) => (
                                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/5">
                                                {f}
                                            </span>
                                        ))}
                                        {getFeatures(item.features).length > 3 && (
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400/60">
                                                +{getFeatures(item.features).length - 3} more
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => openModal(item)} className="text-white/40 hover:text-amber-400 hover:bg-amber-500/10 gap-1.5 text-xs">
                                        <Edit2 className="w-3.5 h-3.5" /> Edit
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="text-white/40 hover:text-red-400 hover:bg-red-500/10 gap-1.5 text-xs">
                                        <Trash2 className="w-3.5 h-3.5" /> Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add/Edit Modal */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="bg-[#0a0a0a] border-white/10 text-white sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-heading flex items-center gap-2">
                            {editingItem ? (
                                <><Edit2 className="w-5 h-5 text-amber-400" /> Edit Service</>
                            ) : (
                                <><Plus className="w-5 h-5 text-amber-400" /> Add New Service</>
                            )}
                        </DialogTitle>
                    </DialogHeader>

                    {/* AI Auto-Fill Section */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-amber-500/10 border border-purple-500/20 space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-purple-300">
                            <Wand2 className="w-4 h-4" />
                            <span>AI Auto-Fill</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 ml-1">MAGIC</span>
                        </div>
                        <p className="text-xs text-white/40">Just type the pooja name and let AI fill all the details for you.</p>
                        <div className="flex gap-2">
                            <Input
                                placeholder="e.g., Navgraha Shanti Pooja"
                                value={aiPrompt}
                                onChange={e => setAiPrompt(e.target.value)}
                                className="bg-white/5 border-white/10 text-white text-sm flex-1"
                                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleAiFill())}
                            />
                            <Button
                                type="button"
                                onClick={handleAiFill}
                                disabled={aiLoading}
                                className="bg-gradient-to-r from-purple-500 to-amber-500 text-white hover:from-purple-400 hover:to-amber-400 gap-2 shrink-0 font-semibold"
                            >
                                {aiLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <Wand2 className="w-4 h-4" />}
                                {aiLoading ? "Generating..." : "Generate"}
                            </Button>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3 text-xs text-white/20">
                        <div className="flex-1 h-px bg-white/5" />
                        <span>OR FILL MANUALLY</span>
                        <div className="flex-1 h-px bg-white/5" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Row 1: Title + Icon */}
                        <div className="grid grid-cols-[1fr_80px] gap-3">
                            <div className="space-y-2">
                                <Label className="text-white/60 text-xs flex items-center gap-1.5">
                                    <Tag className="w-3 h-3" /> Service Name <span className="text-red-400">*</span>
                                </Label>
                                <Input
                                    placeholder="e.g., Griha Pravesh"
                                    value={formData.title}
                                    onChange={e => handleChange("title", e.target.value)}
                                    className="bg-white/5 border-white/10 text-white"
                                    maxLength={50}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white/60 text-xs">Icon</Label>
                                <Input
                                    placeholder="🏠"
                                    value={formData.icon}
                                    onChange={e => handleChange("icon", e.target.value)}
                                    className="bg-white/5 border-white/10 text-white text-center text-xl"
                                    maxLength={4}
                                />
                            </div>
                        </div>

                        {/* Subtitle */}
                        <div className="space-y-2">
                            <Label className="text-white/60 text-xs">Subtitle / Tagline</Label>
                            <Input
                                placeholder="e.g., House Warming Ceremony"
                                value={formData.subtitle}
                                onChange={e => handleChange("subtitle", e.target.value)}
                                className="bg-white/5 border-white/10 text-white"
                                maxLength={60}
                            />
                        </div>

                        {/* Description with character counter */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label className="text-white/60 text-xs flex items-center gap-1.5">
                                    <FileText className="w-3 h-3" /> Description <span className="text-red-400">*</span>
                                </Label>
                                <span className={`text-xs font-mono ${formData.description.length >= DESC_MAX ? "text-red-400" : formData.description.length > DESC_MAX * 0.8 ? "text-amber-400" : "text-white/30"}`}>
                                    {formData.description.length}/{DESC_MAX}
                                </span>
                            </div>
                            <Textarea
                                placeholder="Brief, compelling description of this pooja/ritual..."
                                value={formData.description}
                                onChange={e => handleChange("description", e.target.value)}
                                className="bg-white/5 border-white/10 text-white min-h-[80px] resize-none"
                                maxLength={DESC_MAX}
                                required
                            />
                            {formData.description.length >= DESC_MAX && (
                                <p className="text-[10px] text-red-400/70">Maximum {DESC_MAX} characters reached. Keep it concise for best card design.</p>
                            )}
                        </div>

                        {/* Row: Duration + Price */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label className="text-white/60 text-xs flex items-center gap-1.5">
                                    <Clock className="w-3 h-3" /> Duration
                                </Label>
                                <Input
                                    placeholder="e.g., 2-3 hours"
                                    value={formData.duration}
                                    onChange={e => handleChange("duration", e.target.value)}
                                    className="bg-white/5 border-white/10 text-white"
                                    maxLength={30}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-white/60 text-xs flex items-center gap-1.5">
                                    <IndianRupee className="w-3 h-3" /> Price Range
                                </Label>
                                <Input
                                    placeholder="e.g., ₹5,000 – ₹15,000"
                                    value={formData.priceRange}
                                    onChange={e => handleChange("priceRange", e.target.value)}
                                    className="bg-white/5 border-white/10 text-white"
                                    maxLength={40}
                                />
                            </div>
                        </div>

                        {/* Features (comma-separated) */}
                        <div className="space-y-2">
                            <Label className="text-white/60 text-xs">Included Features <span className="text-white/20">(comma separated)</span></Label>
                            <Input
                                placeholder="e.g., Ganesh Puja, Vastu Shanti, Havan, Aarti"
                                value={formData.features}
                                onChange={e => handleChange("features", e.target.value)}
                                className="bg-white/5 border-white/10 text-white"
                            />
                            {formData.features && (
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                    {formData.features.split(",").map((f, i) => f.trim() && (
                                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400/80 border border-amber-500/20">
                                            {f.trim()}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-2">
                            <Label className="text-white/60 text-xs flex items-center gap-1.5">
                                <ImageIcon className="w-3 h-3" /> Service Image
                            </Label>
                            <div
                                onClick={() => fileRef.current?.click()}
                                className="relative border-2 border-dashed border-white/10 rounded-xl p-4 text-center hover:bg-white/5 hover:border-amber-500/20 cursor-pointer transition-all duration-300 group/upload"
                            >
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                {imagePreview ? (
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/upload:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                            <span className="text-xs text-white/80">Click to change</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-white/30 py-2">
                                        <Upload className="w-6 h-6" />
                                        <span className="text-xs">Click to upload image</span>
                                        <span className="text-[10px] text-white/15">JPEG, PNG, WebP • Max 5MB</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="hover:bg-white/5 text-white/60">
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={submitting}
                                className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold hover:from-amber-400 hover:to-amber-500 gap-2 shadow-lg shadow-amber-500/20 min-w-[160px]"
                            >
                                {submitting ? (
                                    <Loader2 className="animate-spin w-4 h-4" />
                                ) : editingItem ? (
                                    <><Check className="w-4 h-4" /> Save Changes</>
                                ) : (
                                    <><Sparkles className="w-4 h-4" /> Create Service</>
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ServicesManager;
