"use client";

import { configs } from "@/configs";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function Sidebar() {
    const router = useRouter();
    return (
        <div className="h-screen w-1/5 bg-gray-100 p-4">
            <h1 className="text-2xl cursor-pointer">IEEE</h1>
            <div className="flex flex-col gap-4 mt-4">
                {configs.linksConfig.sidebarLinks.map((link) => (
                    <Button 
                        key={link.url} 
                        onClick={() => router.push(link.url)}
                        variant="ghost"
                        className="justify-start"
                    >
                        {link.name}
                    </Button>
                ))}
            </div>
        </div>
    );
}
