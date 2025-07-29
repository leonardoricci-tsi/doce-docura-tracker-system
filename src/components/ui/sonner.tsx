import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-amber-50 group-[.toaster]:text-amber-800 group-[.toaster]:border-amber-200 group-[.toaster]:shadow-lg text-[15px]",
          description: "group-[.toast]:text-amber-700 text-[14px]",
          actionButton:
            "group-[.toast]:bg-amber-600 group-[.toast]:text-white hover:group-[.toast]:bg-amber-700",
          cancelButton:
            "group-[.toast]:bg-amber-100 group-[.toast]:text-amber-800 hover:group-[.toast]:bg-amber-200",
          error: "group-[.toaster]:bg-rose-50 group-[.toaster]:text-rose-800 group-[.toaster]:border-rose-200",
          success: "group-[.toaster]:bg-emerald-50 group-[.toaster]:text-emerald-800 group-[.toaster]:border-emerald-200",
          warning: "group-[.toaster]:bg-amber-50 group-[.toaster]:text-amber-800 group-[.toaster]:border-amber-200",
          info: "group-[.toaster]:bg-blue-50 group-[.toaster]:text-blue-800 group-[.toaster]:border-blue-200",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
