import { cva, type VariantProps } from 'class-variance-authority'

export { default as Button } from './Button.vue'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 font-oswald',
  {
    variants: {
      variant: {
        default: 'bg-primary-500 text-white font-bold shadow hover:bg-primary-500/90',
        primary: 'bg-primary-500 text-white font-bold shadow hover:bg-primary-600 uppercase transition-shadow duration-300 shadow-[0_12px_20px_-5px_rgb(59,130,246,0.6),0_4px_6px_-2px_rgb(59,130,246,0.3)] hover:shadow-[0_8px_15px_-5px_rgb(59,130,246,0.3),0_2px_4px_-2px_rgb(59,130,246,0.2)]',
        white: 'bg-white text-white font-bold shadow uppercase transition-shadow duration-300 shadow-md hover:shadow-sm',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline: 'border border-main bg-transparent hover:bg-main hover:text-white',
        secondary: 'bg-main text-secondary-foreground hover:bg-main/80 text-white',
        accent: 'bg-accent text-accent-foreground hover:bg-accent/80',
        ghost: 'hover:bg-slate-200',
        link: 'text-primary-500 font-regular underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
