import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";

const AdminLayout = () => {
    return (
        <div className="flex bg-black min-h-screen">
            {/* Sidebar (Fixed) */}
            <AdminSidebar />

            {/* Main Content Area */}
            <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen bg-dot-pattern">
                <div className="max-w-7xl mx-auto space-y-8 pb-20">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
