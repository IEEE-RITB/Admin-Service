"use client";

import type { IconButtonProps, SpanProps } from "@chakra-ui/react"
import { ClientOnly, IconButton, Skeleton, Span } from "@chakra-ui/react"
import { ThemeProvider, useTheme } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import * as React from "react"
import { LuMoon, LuSun } from "react-icons/lu"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ColorModeProviderProps extends ThemeProviderProps { }

export function ColorModeProvider(props: ColorModeProviderProps) {
    return (
        <ThemeProvider attribute="class" defaultTheme="light" {...props} />
    )
}

export type ColorMode = "light" | "dark"

export interface UseColorModeReturn {
    colorMode: ColorMode
    setColorMode: (colorMode: ColorMode) => void
    toggleColorMode: () => void
}

export function useColorMode(): UseColorModeReturn {
    const { resolvedTheme, setTheme } = useTheme()
    const toggleColorMode = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }
    return {
        colorMode: resolvedTheme as ColorMode,
        setColorMode: setTheme,
        toggleColorMode,
    }
}

export function useColorModeValue<T>(light: T, dark: T) {
    const { colorMode } = useColorMode()
    return colorMode === "dark" ? dark : light
}

export function ColorModeIcon() {
    const { colorMode } = useColorMode()
    return colorMode === "dark" ? <LuMoon /> : <LuSun />
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ColorModeButtonProps extends Omit<IconButtonProps, "aria-label"> { }

export const ColorModeButton = React.forwardRef<
    HTMLButtonElement,
    ColorModeButtonProps
>(function ColorModeButton(props, ref) {
    const { toggleColorMode } = useColorMode()
    return (
        <ClientOnly fallback={<Skeleton boxSize="8" />}>
            <IconButton
                onClick={toggleColorMode}
                variant="ghost"
                aria-label="Toggle color mode"
                size="sm"
                ref={ref}
                {...props}
                css={{
                    _icon: {
                        width: "5",
                        height: "5",
                    },
                }}
            >
                <ColorModeIcon />
            </IconButton>
        </ClientOnly>
    )
})

export const LightMode = React.forwardRef<HTMLSpanElement, SpanProps>(
    function LightMode(props, ref) {
        return (
            <Span
                color="fg"
                display="contents"
                className="chakra-theme light"
                colorPalette="gray"
                colorScheme="light"
                ref={ref}
                {...props}
            />
        )
    },
)

export const DarkMode = React.forwardRef<HTMLSpanElement, SpanProps>(
    function DarkMode(props, ref) {
        return (
            <Span
                color="fg"
                display="contents"
                className="chakra-theme dark"
                colorPalette="gray"
                colorScheme="dark"
                ref={ref}
                {...props}
            />
        )
    },
)

export function ColorModeToggle() {
    const { setTheme, theme } = useTheme()

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
