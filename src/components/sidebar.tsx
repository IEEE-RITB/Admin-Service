"use client";

import { configs } from "@/configs";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export function Sidebar() {
    const router = useRouter();
    return (
        <Box h={"100vh"} w={"20%"} bg={"gray.100"} p={4}>
            <Text fontSize="2xl" cursor={"pointer"}>IEEE</Text>
            <Flex direction={"column"} gap={4} mt={4}>
                {configs.linksConfig.sidebarLinks.map((link) => (
                    <Button variant={"subtle"} key={link.url} onClick={() => router.push(link.url)} justifyContent={"start"}>
                        {link.name}
                    </Button>
                ))}
            </Flex>
        </Box>
    )
};
