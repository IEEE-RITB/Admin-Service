"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
    return (
        <nav className="w-full bg-gray-100 px-20">
            <div className="flex justify-end items-center w-full px-8 py-2">
                <Avatar>
                    <AvatarFallback>SA</AvatarFallback>
                </Avatar>
            </div>
        </nav>
    );
};

export default Navbar;