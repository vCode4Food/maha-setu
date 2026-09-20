import { MahaSetuBrand } from '@/components/branding/MahaSetuBrand'

/**
 * Legacy brand entry point — kept for existing call sites.
 * Now backed by the official logo asset via MahaSetuBrand.
 */
export function Logo({ light, to = '/', compact }: { light?: boolean; to?: string; compact?: boolean }) {
  return <MahaSetuBrand variant={compact ? 'icon' : 'full'} light={light} to={to} />
}
