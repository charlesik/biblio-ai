import React from "react"
import { cn } from '@/lib/utils'

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
}

export function Spinner({ size = 'md', className, ...props }: SpinnerProps) {
  return (
    <div
      className={cn(
        sizeClasses[size],
        'animate-spin rounded-full border-2 border-muted border-t-accent',
        className
      )}
      {...props}
    />
  )
}
