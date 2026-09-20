import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Landmark, HeartHandshake, Building2, Sparkles } from 'lucide-react'
import { services } from '@/data/services'
import { schemes } from '@/data/schemes'
import { departments } from '@/data/departments'

/** Words too generic to be useful as search keywords. */
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'from', 'how', 'in',
  'into', 'is', 'it', 'me', 'my', 'of', 'on', 'or', 'page', 'the', 'their', 'there',
  'this', 'to', 'was', 'were', 'what', 'when', 'where', 'which', 'who', 'why', 'will',
  'with', 'www', 'com', 'http', 'https', 'html', 'php', 'aspx', 'gov', 'nic', 'id',
])

const KIND_META = {
  service: { icon: Landmark, label: 'Service' },
  scheme: { icon: HeartHandshake, label: 'Scheme' },
  department: { icon: Building2, label: 'Department' },
} as const

export interface SuggestionLinks {
  service?: (id: string) => string
  scheme?: () => string
  department?: () => string
}

/** Default resolvers point at the public catalog; portals override via props. */
const DEFAULT_LINKS: Required<SuggestionLinks> = {
  service: (id) => `/services/${id}`,
  scheme: () => '/schemes',
  department: () => '/departments',
}

type Suggestion = { kind: keyof typeof KIND_META; id: string; name: string; sub: string }

/**
 * Damerau-Levenshtein distance (optimal string alignment) — counts inserts,
 * deletes, substitutions and adjacent transpositions. Bounded: differences
 * beyond MAX_DIST short-circuit, so long non-matches stay cheap.
 */
const MAX_DIST = 3
function editDistance(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > MAX_DIST) return MAX_DIST + 1
  const m = a.length
  const n = b.length
  const d: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) d[i][0] = i
  for (let j = 0; j <= n; j++) d[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1)
      }
    }
  }
  return d[m][n]
}

/** Allowed typos for a keyword, scaling with its length. */
function fuzzyTolerance(word: string): number {
  return word.length <= 4 ? 1 : word.length <= 8 ? 2 : MAX_DIST
}

/**
 * Extracts meaningful keywords from a missing URL (segments, slugs,
 * hyphens/underscores, query params) for auto-suggest matching.
 */
export function extractKeywords(pathname: string, search: string): string[] {
  const raw = `${pathname} ${search}`
    .toLowerCase()
    .replace(/[/_?&=+#]/g, ' ')
    .replace(/\.(html?|php|aspx)$/g, ' ')
    .split(/[^a-z0-9]+/)
  const words = raw.filter((w) => w.length >= 3 && !STOP_WORDS.has(w))
  const seen = new Set<string>()
  const out: string[] = []
  for (const w of words) {
    if (!seen.has(w)) {
      seen.add(w)
      out.push(w)
    }
  }
  return out.slice(0, 6)
}

/**
 * Scores catalog entries against extracted keywords. Name hits dominate:
 *  - full slug phrase in the name ("income certificate") → +6 (desc: +2)
 *  - keyword exact in the name → +3 (desc: +0.5)
 *  - keyword fuzzy in the name (typo within tolerance) → +1 (desc: +0.25)
 *  - every keyword matched (exactly or fuzzily) → +1.5 bonus
 * so a fully-misspelled slug pointing at a real service outranks pages that
 * merely mention one of the words in their description.
 */
export function autoSuggest(keywords: string[]): Suggestion[] {
  if (keywords.length === 0) return []
  const slug = keywords.join(' ')
  const scored: { s: Suggestion; score: number }[] = []

  const push = (kind: keyof typeof KIND_META, id: string, name: string, sub: string, desc: string) => {
    const n = name.toLowerCase()
    const d = desc.toLowerCase()
    let score = 0
    if (n.includes(slug)) score += 6
    else if (d.includes(slug)) score += 2

    const nameTokens = n.split(/[^a-z0-9]+/).filter(Boolean)
    const descTokens = d.split(/[^a-z0-9]+/).filter(Boolean)
    let matchedAll = true
    for (const k of keywords) {
      const tol = fuzzyTolerance(k)
      if (n.includes(k)) {
        score += 3
        continue
      }
      if (nameTokens.some((t) => Math.abs(t.length - k.length) <= tol && editDistance(k, t) <= tol)) {
        score += 1
        continue
      }
      if (d.includes(k)) {
        score += 0.5
        continue
      }
      if (descTokens.some((t) => Math.abs(t.length - k.length) <= tol && editDistance(k, t) <= tol)) {
        score += 0.25
        continue
      }
      matchedAll = false
    }
    if (matchedAll && keywords.length > 0) score += 1.5

    if (score > 0) scored.push({ s: { kind, id, name, sub }, score })
  }

  services.forEach((x) => push('service', x.id, x.name, x.category, `${x.category} ${x.description}`))
  schemes.forEach((x) => push('scheme', x.id, x.name, x.benefit, `${x.benefit} ${x.description}`))
  departments.forEach((x) => push('department', x.id, x.name, x.domain, `${x.shortName} ${x.domain} ${x.description}`))

  return scored
    .sort((a, b) => b.score - a.score || a.s.name.localeCompare(b.s.name))
    .slice(0, 4)
    .map((x) => x.s)
}

/** Compact auto-suggest band driven by the missing URL's own words. */
export function PathSuggestions({
  pathname,
  search,
  links,
}: {
  pathname: string
  search: string
  /** Route resolvers so portals keep users inside their own portal. */
  links?: SuggestionLinks
}) {
  const keywords = useMemo(() => extractKeywords(pathname, search), [pathname, search])
  const matches = useMemo(() => autoSuggest(keywords), [keywords])
  const to = { ...DEFAULT_LINKS, ...links }

  if (matches.length === 0) return null

  return (
    <div>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
        <Sparkles className="w-4 h-4 text-primary-600" />
        Based on the address you tried — “{keywords.slice(0, 3).join(' ')}”
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {matches.map(({ kind, id, name, sub }) => {
          const meta = KIND_META[kind]
          const Icon = meta.icon
          return (
            <Link
              key={`${kind}-${id}`}
              to={kind === 'service' ? to.service(id) : kind === 'scheme' ? to.scheme() : to.department()}
              className="group flex items-start gap-3.5 rounded-2xl bg-white border border-primary-200 p-4 hover:border-primary-400 hover:shadow-pop transition-all"
            >
              <span className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold text-slate-800 text-sm truncate">{name}</span>
                <span className="block text-xs text-slate-500 mt-0.5">{meta.label} · {sub}</span>
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
