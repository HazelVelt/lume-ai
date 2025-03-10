
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      duration={2000}
      expand={false}
      closeButton={true}
      richColors={true}
      toastOptions={{
        classNames: {
          toast:
            "group glass-morphism toast group-[.toaster]:shadow-lg group-[.toaster]:border-border/40 group-[.toaster]:backdrop-blur-md",
          title: "text-foreground font-medium",
          description: "group-[.toast]:text-muted-foreground text-sm",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:border group-[.toast]:border-primary",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:border group-[.toast]:border-muted",
          success: "!bg-green-500/10 !border-green-500/40", 
          error: "!bg-red-500/10 !border-red-500/40",
          warning: "!bg-amber-500/10 !border-amber-500/40",
          info: "!bg-blue-500/10 !border-blue-500/40"
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
