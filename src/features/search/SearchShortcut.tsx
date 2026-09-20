import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

/**
 * Global search shortcut: Cmd/Ctrl+K (or "/") opens the global search overlay
 * from any page — public, auth screens, and all five portals.
 *
 * Care taken:
 *  - ignores repeats and modifier-only chords (Cmd+Shift+K etc.)
 *  - ignores typing inside text inputs/textarea/select/contenteditable
 *  - "/" needs no competing modifier held; Cmd/Ctrl+K always wins
 *  - no-op when already on /search
 */
export function SearchShortcut() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const onSearch = location.pathname === '/search'
      const tag = (e.target as HTMLElement | null)?.tagName
      const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' ||
        (e.target as HTMLElement | null)?.isContentEditable

      if (e.repeat) return

      if ((e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && e.key.toLowerCase() === 'k') {
        if (!onSearch) navigate('/search')
        e.preventDefault()
        return
      }

      if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        if (!onSearch) navigate('/search')
        e.preventDefault()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate, location.pathname])

  return null
}
