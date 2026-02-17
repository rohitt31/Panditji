import AdminCRUD from "@/components/admin/AdminCRUD";

const GalleryManager = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-white/50 text-sm italic mb-4">Manage the photos displayed in the 'Divine Glimpses' gallery section.</h2>
            <AdminCRUD
                title="Manage Gallery"
                resource="gallery"
                fields={[
                    { name: "caption", label: "Caption / Description", type: "text" },
                    { name: "tags", label: "Tags (Comma Separated)", type: "text" },
                    { name: "image", label: "Upload Photo", type: "image" }
                ]}
            />
        </div>
    );
};

export default GalleryManager;
