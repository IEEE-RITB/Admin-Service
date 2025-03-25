"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

import { toast } from "@/hooks/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

export const toaster = {
  success: ({ title, description }: { title: string; description?: string }) => {
    toast({
      title,
      description,
      variant: "default",
    });
  },
  error: ({ title, description }: { title: string; description?: string }) => {
    toast({
      title,
      description,
      variant: "destructive",
    });
  },
  info: ({ title, description }: { title: string; description?: string }) => {
    toast({
      title,
      description,
      variant: "default",
    });
  },
};