import Navbar from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main>
            <div className="flex w-full">
                <Sidebar />
                <div className="w-full">
                    <Navbar />
                    {children}
                </div>
            </div>
        </main>
    );
}
