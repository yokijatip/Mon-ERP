<<<<<<< HEAD
export { default as Progress } from "./Progress.vue"
=======
import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as Progress } from "./Progress.vue"

export const progressVariants = cva(
  "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
  {
    variants: {
      variant: {
        default: "bg-primary/20",
        secondary: "bg-secondary/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export type ProgressVariants = VariantProps<typeof progressVariants>
>>>>>>> 21be25b26c919adbb0dcfd720be944bded451f22
