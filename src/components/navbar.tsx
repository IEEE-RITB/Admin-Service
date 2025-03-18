"use client";

import { Avatar, Flex } from '@chakra-ui/react';

const Navbar = () => {
    return (
        <nav className="w-full bg-gray-100 px-20">
            <Flex justifyContent="end" alignItems="center" w={"full"} px={{base: 8}} py={2}>
                <Avatar.Root alignSelf={"flex-end"} justifySelf={"end"}>
                    <Avatar.Fallback name="Segun Adebayo" />
                </Avatar.Root>
            </Flex>
        </nav>
    );
};

export default Navbar;