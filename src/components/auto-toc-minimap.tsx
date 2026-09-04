"use client"

import { useEffect, useState } from "react"
import { HookSidebar, type HookSidebarItem } from "@/components/hook-sidebar"

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")

/**
 * Builds the scroll minimap from the page's own headings at runtime, so the same
 * tick indicator drops into every page via the layout. `selector` chooses which
 * headings become ticks (section h2s by default; prose/cards per page).
 */
export function AutoTOCMinimap({ selector = "main h2" }: { selector?: string }) {
  const [items, setItems] = useState<HookSidebarItem[]>([])
  const [active, setActive] = useState(0)

  useEffect(() => {
    const headings = Array.from(document.querySelectorAll<HTMLElement>(selector))
      .filter((el) => (el.textContent ?? "").trim())
    setItems(headings.map((el) => {
      if (!el.id) el.id = slugify(el.textContent!) || el.tagName.toLowerCase()
      return { label: el.textContent!.trim(), href: `#${el.id}` }
    }))

    const update = () => {
      const threshold = window.innerHeight * 0.28
      const next = headings.findLastIndex((heading) => heading.getBoundingClientRect().top <= threshold)
      setActive(Math.max(0, next))
    }
    update()
    addEventListener("scroll", update, { passive: true })
    addEventListener("resize", update)
    return () => {
      removeEventListener("scroll", update)
      removeEventListener("resize", update)
    }
  }, [selector])

  // ponytail: need 2+ sections to make a sidebar useful.
  if (items.length < 2) return null
  return <HookSidebar items={items} value={active} label="On this page" color="var(--signal)" className="w-56" />
}
