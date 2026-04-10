import Menu from "../components/Menu";
import Footer from "../components/Footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-zinc-50 dark:bg-black min-h-screen w-full font-sans flex flex-col pt-16 md:pt-14">
      <div className="flex-1 w-full">{children}</div>
    </div>
  );
}
