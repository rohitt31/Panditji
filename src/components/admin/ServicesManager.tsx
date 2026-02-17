import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import logger from "@/lib/logger";

interface Service {
    id: string;
    title: string;
    description: string;
    duration: string;
    icon: string;
    [key: string]: any;
}

const ServicesManager = () => {
    const { toast } = useToast();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [newService, setNewService] = useState({
        title: "",
        description: "",
        duration: "",
        icon: "",
    });

    const fetchServices = async () => {
        try {
            const res = await fetch("/api/services");
            const data = await res.json();
            setServices(Array.isArray(data) ? data : []);
        } catch (error) {
            logger.error('Error fetching services', error);
            toast({
                title: "Error fetching services",
                description: "Please try again later.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleCreateService = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch("/api/services", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify(newService)
            });
            if (!res.ok) throw new Error('Failed to create service');

            toast({
                title: "Service created",
                description: "The new service has been added successfully.",
            });
            setNewService({ title: "", description: "", duration: "", icon: "" });
            fetchServices();
        } catch (error) {
            logger.error('Error creating service', error);
            toast({
                title: "Error creating service",
                description: "Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleDeleteService = async (id: string) => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`/api/services/${id}`, {
                method: 'DELETE',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });
            if (!res.ok) throw new Error('Failed to delete service');

            toast({
                title: "Service deleted",
                description: "The service has been removed.",
            });
            fetchServices();
        } catch (error) {
            logger.error('Error deleting service', error);
            toast({
                title: "Error deleting service",
                description: "Please try again.",
                variant: "destructive",
            });
        }
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-8">
            <div className="bg-card/30 p-6 rounded-lg border border-border/30">
                <h2 className="text-xl font-heading mb-4">Add New Service</h2>
                <form onSubmit={handleCreateService} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            placeholder="Service Title (e.g. Griha Pravesh)"
                            value={newService.title}
                            onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                            required
                        />
                        <Input
                            placeholder="Duration (e.g. 2-3 hours)"
                            value={newService.duration}
                            onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            placeholder="Icon Emoji (e.g. 🏠)"
                            value={newService.icon}
                            onChange={(e) => setNewService({ ...newService, icon: e.target.value })}
                            required
                        />
                    </div>
                    <Textarea
                        placeholder="Description"
                        value={newService.description}
                        onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                        required
                    />
                    <Button type="submit" className="w-full md:w-auto">
                        <Plus className="w-4 h-4 mr-2" /> Add Service
                    </Button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                    <div key={service.id} className="bg-card/30 p-4 rounded-lg border border-border/30 flex justify-between items-start gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">{service.icon}</span>
                                <h3 className="font-heading font-medium">{service.title}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                            <span className="text-xs text-primary/70 uppercase tracking-wider">{service.duration}</span>
                        </div>
                        <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteService(service.id)}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServicesManager;
