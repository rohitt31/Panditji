import AdminCRUD from "@/components/admin/AdminCRUD";

const DynamicCardsManager = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-white/50 text-sm italic mb-4">Here you can add more custom cards like the 'Ganga Aarti' one.</h2>
            <AdminCRUD
                title="Manage Content Cards"
                resource="cards"
                fields={[
                    { name: "title", label: "Card Title", type: "text" },
                    { name: "description", label: "Description", type: "textarea" },
                    { name: "features", label: "Features (JSON Array like [\"A\", \"B\"])", type: "textarea" },
                    { name: "experience", label: "Experience (e.g. 5+)", type: "text" },
                    { name: "image", label: "Card Image", type: "image" }
                ]}
            />
        </div>
    );
};

export default DynamicCardsManager;
