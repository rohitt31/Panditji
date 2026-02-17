import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Loader2, Upload, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import logger from "@/lib/logger";

interface Field {
    name: string;
    label: string;
    type: "text" | "textarea" | "number" | "image";
}

interface AdminCRUDProps {
    title: string;
    resource: string;
    fields: Field[];
}

const AdminCRUD = ({ title, resource, fields }: AdminCRUDProps) => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null); // If null, adding new.

    // Form State
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Fetch Data
    const fetchItems = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/${resource}`);
            const data = await res.json();
            setItems(Array.isArray(data) ? data : []);
        } catch (err) {
            logger.error('Failed to fetch items', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [resource]);

    // Handle Form Change
    const handleChange = (name: string, value: any) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Open Modal
    const openModal = (item?: any) => {
        if (item) {
            setEditingItem(item);
            setFormData(item);
            setImageFile(null); // Reset file input
        } else {
            setEditingItem(null);
            setFormData({});
            setImageFile(null);
        }
        setIsOpen(true);
    };

    // Submit Form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const data = new FormData();
        // Append text fields
        Object.keys(formData).forEach(key => {
            if (key !== 'id' && key !== 'image') {
                data.append(key, formData[key]);
            }
        });
        // Append new image if selected
        if (imageFile) {
            data.append('image', imageFile);
        }

        try {
            const url = editingItem ? `/api/${resource}/${editingItem.id}` : `/api/${resource}`;
            const method = editingItem ? 'PUT' : 'POST';
            const token = localStorage.getItem('adminToken');

            const res = await fetch(url, {
                method,
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                body: data
            });

            if (res.ok) {
                setIsOpen(false);
                fetchItems();
            } else {
                alert("Failed to save.");
            }
        } catch (err) {
            logger.error('Failed to save item', err);
            alert("Error saving.");
        } finally {
            setSubmitting(false);
        }
    };

    // Delete Item
    const handleDelete = async (id: string) => {
        if (!confirm("Delete this item?")) return;
        const token = localStorage.getItem('adminToken');
        try {
            await fetch(`/api/${resource}/${id}`, {
                method: 'DELETE',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });
            fetchItems();
        } catch (err) {
            logger.error('Failed to delete item', err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">{title}</h1>
                <Button onClick={() => openModal()} className="bg-primary text-black hover:bg-primary/90 gap-2">
                    <Plus className="w-4 h-4" /> Add New
                </Button>
            </div>

            {/* List / Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full flex justify-center py-20 text-white/50"><Loader2 className="animate-spin w-8 h-8" /></div>
                ) : items.length === 0 ? (
                    <div className="col-span-full text-center py-20 text-white/30 italic">No {resource} found. Add one!</div>
                ) : (
                    items.map(item => (
                        <div key={item.id} className="glass-card group relative p-4 rounded-xl border border-white/10 hover:border-primary/30 transition-all duration-300">
                            {/* Image Preview */}
                            {item.image && (
                                <div className="aspect-video w-full rounded-lg bg-black/50 overflow-hidden mb-4 relative">
                                    <img src={item.image} alt={item.title || "Item"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            )}

                            <h3 className="font-bold text-lg text-white mb-1 truncate">{item.title || item.name || "Untitled"}</h3>
                            <p className="text-sm text-white/60 line-clamp-2 h-10">{item.description || item.review || "No description"}</p>

                            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-white/5">
                                <Button variant="ghost" size="icon" onClick={() => openModal(item)} className="hover:text-primary hover:bg-white/5">
                                    <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="hover:text-destructive hover:bg-red-500/10 text-white/40">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add/Edit Modal */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="bg-[#0a0a0a] border-white/10 text-white sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        {fields.map(field => (
                            <div key={field.name} className="space-y-2">
                                <Label htmlFor={field.name} className="text-white/70">{field.label}</Label>

                                {field.type === 'textarea' ? (
                                    <Textarea
                                        id={field.name}
                                        value={formData[field.name] || ''}
                                        onChange={e => handleChange(field.name, e.target.value)}
                                        className="bg-white/5 border-white/10 focus:border-primary text-white min-h-[100px]"
                                        required
                                    />
                                ) : field.type === 'image' ? (
                                    <div className="space-y-2">
                                        <div className="relative border-2 border-dashed border-white/10 rounded-lg p-6 text-center hover:bg-white/5 cursor-pointer transition-colors">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={e => setImageFile(e.target.files?.[0] || null)}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                            <div className="flex flex-col items-center gap-2 text-white/50">
                                                <Upload className="w-6 h-6" />
                                                <span className="text-xs">{imageFile ? imageFile.name : (formData.image ? "Change Image" : "Upload Image")}</span>
                                            </div>
                                        </div>
                                        {/* Preview existing image if editing */}
                                        {formData.image && !imageFile && (
                                            <div className="text-xs text-white/40">Current: {formData.image.split('/').pop()}</div>
                                        )}
                                    </div>
                                ) : (
                                    <Input
                                        id={field.name}
                                        type={field.type}
                                        value={formData[field.name] || ''}
                                        onChange={e => handleChange(field.name, e.target.value)}
                                        className="bg-white/5 border-white/10 focus:border-primary text-white"
                                        required
                                    />
                                )}
                            </div>
                        ))}

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="hover:bg-white/5">Cancel</Button>
                            <Button type="submit" disabled={submitting} className="bg-primary text-black font-bold">
                                {submitting ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : (editingItem ? 'Save Changes' : 'Create Item')}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminCRUD;
