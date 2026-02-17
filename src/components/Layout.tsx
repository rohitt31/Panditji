import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background font-body text-foreground relative">
      {/* Navbar (Scroll-triggered inside the component) */}
      <Navbar />

      <main className="flex-1 w-full relative">
        {children}
        <Footer />
      </main>

      <WhatsAppButton />
    </div>
  );
};

export default Layout;
