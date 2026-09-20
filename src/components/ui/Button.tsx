import { forwardRef, type ButtonHTMLAttributes, type MouseEventHandler } from 'react'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'saffron' | 'outline'
type Size = 'sm' | 'md' | 'lg'

const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 select-none'

const variants: Record<Variant, string> = {
  primary: 'bg-primary-900 text-white hover:bg-primary-800 active:bg-primary-950 shadow-sm',
  secondary: 'bg-primary-50 text-primary-800 hover:bg-primary-100 border border-primary-100',
  outline: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm',
  saffron: 'bg-saffron-500 text-white hover:bg-saffron-600 shadow-sm',
}

const sizes: Record<Size, string> = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-sm px-4 py-2.5',
  lg: 'text-base px-6 py-3',
}

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  variant?: Variant
  size?: Size
  to?: string
  loading?: boolean
  onClick?: MouseEventHandler
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', to, loading, className = '', children, onClick, ...rest },
  ref,
) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`
  if (to) {
    return (
      <Link to={to} className={cls} onClick={onClick}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        {children}
      </Link>
    )
  }
  return (
    <button ref={ref} className={cls} onClick={onClick} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
      {children}
    </button>
  )
})
