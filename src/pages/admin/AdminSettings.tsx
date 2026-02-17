import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
    Loader2, Lock, Shield, UserPlus, Trash2, Key, Users,
    Eye, EyeOff, AlertCircle, Check, Crown
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logger from "@/lib/logger";

interface AdminUser {
    id: string;
    username: string;
    role: string;
    createdAt: string;
}

const getToken = () => localStorage.getItem("adminToken");
const authHeaders = () => ({
    "Content-Type": "application/json",
    ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

const AdminSettings = () => {
    const { toast } = useToast();
    const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);

    // Password change
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    // Add admin modal
    const [addOpen, setAddOpen] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [newAdminPassword, setNewAdminPassword] = useState("");
    const [creating, setCreating] = useState(false);

    // Reset password modal
    const [resetOpen, setResetOpen] = useState(false);
    const [resetTarget, setResetTarget] = useState<AdminUser | null>(null);
    const [resetPassword, setResetPassword] = useState("");
    const [resetting, setResetting] = useState(false);

    const isSuperAdmin = currentUser?.role === "superadmin";

    // Fetch current user + admin list
    useEffect(() => {
        const load = async () => {
            try {
                const meRes = await fetch("/api/auth/me", { headers: authHeaders() });
                if (meRes.ok) {
                    const me = await meRes.json();
                    setCurrentUser(me);
                    // Update localStorage with fresh user info
                    localStorage.setItem("adminUser", JSON.stringify(me));

                    if (me.role === "superadmin") {
                        const adminsRes = await fetch("/api/auth/admins", { headers: authHeaders() });
                        if (adminsRes.ok) setAdmins(await adminsRes.json());
                    }
                }
            } catch (err) {
                logger.error("Failed to load settings", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const refreshAdmins = async () => {
        try {
            const res = await fetch("/api/auth/admins", { headers: authHeaders() });
            if (res.ok) setAdmins(await res.json());
        } catch (err) {
            logger.error("Failed to refresh admins", err);
        }
    };

    // Change own password
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast({ title: "Passwords don't match", variant: "destructive" });
            return;
        }
        if (newPassword.length < 8) {
            toast({ title: "Password must be at least 8 characters", variant: "destructive" });
            return;
        }

        setChangingPassword(true);
        try {
            const res = await fetch("/api/auth/change-password", {
                method: "POST",
                headers: authHeaders(),
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            const data = await res.json();

            if (res.ok) {
                toast({ title: "✅ Password Changed", description: "Please login again with your new password." });
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                // Force re-login
                setTimeout(() => {
                    localStorage.removeItem("adminToken");
                    localStorage.removeItem("refreshToken");
                    localStorage.removeItem("adminUser");
                    window.location.href = "/admin/login";
                }, 2000);
            } else {
                toast({ title: "Error", description: data.error, variant: "destructive" });
            }
        } catch (err) {
            logger.error("Change password error", err);
            toast({ title: "Error", description: "Failed to change password.", variant: "destructive" });
        } finally {
            setChangingPassword(false);
        }
    };

    // Create new admin
    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        try {
            const res = await fetch("/api/auth/admins", {
                method: "POST",
                headers: authHeaders(),
                body: JSON.stringify({ username: newUsername, password: newAdminPassword }),
            });
            const data = await res.json();

            if (res.ok) {
                toast({ title: "✅ Admin Created", description: `"${newUsername}" can now login.` });
                setAddOpen(false);
                setNewUsername("");
                setNewAdminPassword("");
                refreshAdmins();
            } else {
                toast({ title: "Error", description: data.error, variant: "destructive" });
            }
        } catch (err) {
            logger.error("Create admin error", err);
            toast({ title: "Error", description: "Failed to create admin.", variant: "destructive" });
        } finally {
            setCreating(false);
        }
    };

    // Delete admin
    const handleDeleteAdmin = async (admin: AdminUser) => {
        if (!confirm(`Delete admin "${admin.username}"? They will lose all access immediately.`)) return;
        try {
            const res = await fetch(`/api/auth/admins/${admin.id}`, {
                method: "DELETE",
                headers: authHeaders(),
            });
            const data = await res.json();

            if (res.ok) {
                toast({ title: "Deleted", description: data.message });
                refreshAdmins();
            } else {
                toast({ title: "Error", description: data.error, variant: "destructive" });
            }
        } catch (err) {
            logger.error("Delete admin error", err);
            toast({ title: "Error", description: "Failed to delete admin.", variant: "destructive" });
        }
    };

    // Reset another admin's password
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resetTarget) return;
        setResetting(true);
        try {
            const res = await fetch(`/api/auth/admins/${resetTarget.id}/reset-password`, {
                method: "PUT",
                headers: authHeaders(),
                body: JSON.stringify({ newPassword: resetPassword }),
            });
            const data = await res.json();

            if (res.ok) {
                toast({ title: "✅ Password Reset", description: data.message });
                setResetOpen(false);
                setResetPassword("");
                setResetTarget(null);
            } else {
                toast({ title: "Error", description: data.error, variant: "destructive" });
            }
        } catch (err) {
            logger.error("Reset password error", err);
            toast({ title: "Error", description: "Failed to reset password.", variant: "destructive" });
        } finally {
            setResetting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin w-8 h-8 text-white/40" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-4xl">
            {/* Header */}
            <div>
                <p className="text-white/40 text-sm italic mb-1">Account security & team management</p>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent font-heading">
                    Settings
                </h1>
            </div>

            {/* Current User Info */}
            <div className="glass-card p-5 rounded-2xl border border-white/10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/20 flex items-center justify-center">
                    {isSuperAdmin ? (
                        <Crown className="w-6 h-6 text-amber-400" />
                    ) : (
                        <Shield className="w-6 h-6 text-amber-400" />
                    )}
                </div>
                <div>
                    <p className="text-white font-semibold">{currentUser?.username}</p>
                    <p className="text-xs text-white/40">
                        Role: <span className={isSuperAdmin ? "text-amber-400" : "text-blue-400"}>{currentUser?.role}</span>
                        {isSuperAdmin && " • Full Access"}
                    </p>
                </div>
            </div>

            {/* ===== SECTION 1: Change Password ===== */}
            <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center gap-3">
                    <Lock className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold text-white">Change Your Password</h2>
                </div>

                <form onSubmit={handleChangePassword} className="p-6 space-y-5">
                    <div className="space-y-2">
                        <Label className="text-white/60 text-xs">Current Password</Label>
                        <div className="relative">
                            <Input
                                type={showCurrent ? "text" : "password"}
                                value={currentPassword}
                                onChange={e => setCurrentPassword(e.target.value)}
                                className="bg-white/5 border-white/10 text-white pr-10"
                                placeholder="Enter current password"
                                required
                            />
                            <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-white/60 text-xs">New Password</Label>
                            <div className="relative">
                                <Input
                                    type={showNew ? "text" : "password"}
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    className="bg-white/5 border-white/10 text-white pr-10"
                                    placeholder="Min 8 characters"
                                    minLength={8}
                                    required
                                />
                                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-white/60 text-xs">Confirm New Password</Label>
                            <Input
                                type="password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                className="bg-white/5 border-white/10 text-white"
                                placeholder="Repeat new password"
                                required
                            />
                        </div>
                    </div>

                    {newPassword && confirmPassword && newPassword !== confirmPassword && (
                        <div className="flex items-center gap-2 text-xs text-red-400">
                            <AlertCircle className="w-3.5 h-3.5" /> Passwords don't match
                        </div>
                    )}

                    <div className="flex justify-end pt-2">
                        <Button
                            type="submit"
                            disabled={changingPassword || !currentPassword || !newPassword || newPassword !== confirmPassword}
                            className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold hover:from-amber-400 hover:to-amber-500 gap-2"
                        >
                            {changingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            Update Password
                        </Button>
                    </div>
                </form>
            </div>

            {/* ===== SECTION 2: Manage Admins (superadmin only) ===== */}
            {isSuperAdmin && (
                <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-bold text-white">Team Members</h2>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                Superadmin Only
                            </span>
                        </div>
                        <Button
                            onClick={() => setAddOpen(true)}
                            className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500 gap-2 text-sm"
                        >
                            <UserPlus className="w-4 h-4" /> Add Admin
                        </Button>
                    </div>

                    <div className="divide-y divide-white/5">
                        {admins.map(admin => (
                            <div key={admin.id} className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold ${admin.role === "superadmin"
                                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/20"
                                            : "bg-blue-500/20 text-blue-400 border border-blue-500/20"
                                        }`}>
                                        {admin.username[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium text-sm flex items-center gap-2">
                                            {admin.username}
                                            {admin.id === currentUser?.id && (
                                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/30">YOU</span>
                                            )}
                                        </p>
                                        <p className="text-xs text-white/30">
                                            {admin.role === "superadmin" ? "⭐ Superadmin" : "Admin"} • Joined {new Date(admin.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                        </p>
                                    </div>
                                </div>

                                {admin.id !== currentUser?.id && admin.role !== "superadmin" && (
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => { setResetTarget(admin); setResetPassword(""); setResetOpen(true); }}
                                            className="text-white/40 hover:text-amber-400 hover:bg-amber-500/10 gap-1.5 text-xs"
                                        >
                                            <Key className="w-3.5 h-3.5" /> Reset Password
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteAdmin(admin)}
                                            className="text-white/40 hover:text-red-400 hover:bg-red-500/10 gap-1.5 text-xs"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" /> Remove
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Add Admin Modal */}
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogContent className="bg-[#0a0a0a] border-white/10 text-white sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-heading flex items-center gap-2">
                            <UserPlus className="w-5 h-5 text-emerald-400" /> Add New Admin
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateAdmin} className="space-y-4 pt-2">
                        <div className="space-y-2">
                            <Label className="text-white/60 text-xs">Username</Label>
                            <Input
                                value={newUsername}
                                onChange={e => setNewUsername(e.target.value)}
                                className="bg-white/5 border-white/10 text-white"
                                placeholder="e.g., pandit_ram"
                                minLength={3}
                                pattern="[a-zA-Z0-9_]+"
                                title="Letters, numbers, underscores only"
                                required
                            />
                            <p className="text-[10px] text-white/20">Letters, numbers, underscores only. Min 3 chars.</p>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-white/60 text-xs">Password</Label>
                            <Input
                                type="password"
                                value={newAdminPassword}
                                onChange={e => setNewAdminPassword(e.target.value)}
                                className="bg-white/5 border-white/10 text-white"
                                placeholder="Min 8 characters"
                                minLength={8}
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <Button type="button" variant="ghost" onClick={() => setAddOpen(false)} className="hover:bg-white/5 text-white/60">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={creating} className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold gap-2">
                                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                                Create Admin
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Reset Password Modal */}
            <Dialog open={resetOpen} onOpenChange={setResetOpen}>
                <DialogContent className="bg-[#0a0a0a] border-white/10 text-white sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-heading flex items-center gap-2">
                            <Key className="w-5 h-5 text-amber-400" /> Reset Password for "{resetTarget?.username}"
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleResetPassword} className="space-y-4 pt-2">
                        <div className="space-y-2">
                            <Label className="text-white/60 text-xs">New Password</Label>
                            <Input
                                type="password"
                                value={resetPassword}
                                onChange={e => setResetPassword(e.target.value)}
                                className="bg-white/5 border-white/10 text-white"
                                placeholder="Min 8 characters"
                                minLength={8}
                                required
                            />
                        </div>
                        <p className="text-xs text-white/30">
                            This will immediately invalidate their current session. They'll need to login with the new password.
                        </p>
                        <div className="flex justify-end gap-3 pt-2">
                            <Button type="button" variant="ghost" onClick={() => setResetOpen(false)} className="hover:bg-white/5 text-white/60">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={resetting} className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold gap-2">
                                {resetting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                                Reset Password
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminSettings;
