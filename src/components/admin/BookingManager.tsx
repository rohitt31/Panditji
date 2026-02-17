import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Booking = Tables<"booking_requests">;

const statusOptions = ["pending", "confirmed", "completed", "cancelled"];

const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    confirmed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    completed: "bg-primary/20 text-primary border-primary/30",
    cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

const BookingManager = () => {
    const { toast } = useToast();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchBookings = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("booking_requests")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            toast({ title: "Error loading bookings", description: error.message, variant: "destructive" });
        } else {
            setBookings(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        setUpdatingId(id);
        const { error } = await supabase
            .from("booking_requests")
            .update({ status })
            .eq("id", id);

        if (error) {
            toast({ title: "Update failed", description: error.message, variant: "destructive" });
        } else {
            setBookings((prev) =>
                prev.map((b) => (b.id === id ? { ...b, status } : b))
            );
            toast({ title: "Status updated" });
        }
        setUpdatingId(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-lg tracking-wider text-foreground">
                    Booking Requests
                </h2>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">{bookings.length} total</span>
                    <button
                        onClick={fetchBookings}
                        className="text-muted-foreground hover:text-foreground transition-colors p-2"
                        aria-label="Refresh"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
            ) : bookings.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground text-sm">
                    No booking requests yet.
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div
                            key={booking.id}
                            className="bg-card/30 border border-border/30 p-5 lg:p-6"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                {/* Info */}
                                <div className="flex-1 space-y-2">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h3 className="font-heading text-sm tracking-wider text-foreground">
                                            {booking.name}
                                        </h3>
                                        <span
                                            className={`text-[10px] uppercase tracking-widest px-2 py-0.5 border ${statusColors[booking.status] || statusColors.pending
                                                }`}
                                        >
                                            {booking.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1 text-xs text-muted-foreground">
                                        <p><span className="text-foreground/60">Ritual:</span> {booking.ritual}</p>
                                        <p><span className="text-foreground/60">Phone:</span> {booking.phone}</p>
                                        {booking.email && (
                                            <p><span className="text-foreground/60">Email:</span> {booking.email}</p>
                                        )}
                                        {booking.preferred_date && (
                                            <p><span className="text-foreground/60">Date:</span> {new Date(booking.preferred_date).toLocaleDateString()}</p>
                                        )}
                                        {booking.location && (
                                            <p><span className="text-foreground/60">Location:</span> {booking.location}</p>
                                        )}
                                        <p>
                                            <span className="text-foreground/60">Submitted:</span>{" "}
                                            {new Date(booking.created_at).toLocaleDateString()}
                                        </p>
                                    </div>

                                    {booking.message && (
                                        <p className="text-xs text-muted-foreground/80 italic mt-1">
                                            "{booking.message}"
                                        </p>
                                    )}
                                </div>

                                {/* Status Update */}
                                <div className="flex items-center gap-2 shrink-0">
                                    <select
                                        value={booking.status}
                                        onChange={(e) => updateStatus(booking.id, e.target.value)}
                                        disabled={updatingId === booking.id}
                                        className="bg-muted/30 border border-border/50 text-foreground text-xs px-3 py-2 focus:outline-none focus:border-primary/50 transition-colors"
                                    >
                                        {statusOptions.map((s) => (
                                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                        ))}
                                    </select>
                                    {updatingId === booking.id && (
                                        <Loader2 className="w-3 h-3 animate-spin text-primary" />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookingManager;
