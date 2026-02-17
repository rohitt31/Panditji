import AdminCRUD from "@/components/admin/AdminCRUD";

const TestimonialsManager = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-white/50 text-sm italic mb-4">You can manage the testimonials from devotees here.</h2>
            <AdminCRUD
                title="Manage Testimonials"
                resource="testimonials"
                fields={[
                    { name: "name", label: "Devotee Name", type: "text" },
                    { name: "location", label: "Location", type: "text" },
                    { name: "quote", label: "Testimonial Quote", type: "textarea" },
                    { name: "stars", label: "Rating (Stars 1-5)", type: "number" },
                    { name: "image", label: "Photo (Optional)", type: "image" }
                ]}
            />
        </div>
    );
};

export default TestimonialsManager;
