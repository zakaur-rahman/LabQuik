import * as React from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "secondary"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "px-4 py-2 rounded-md text-sm font-medium",
          variant === "default" && "bg-blue-500 text-white hover:bg-blue-600",
          variant === "outline" && "border border-gray-300 hover:bg-gray-50",
          variant === "secondary" && "bg-gray-100 hover:bg-gray-200",
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button }
