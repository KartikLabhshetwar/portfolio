"use client"

import { useEffect, useState } from "react"

import { TOCMinimap, type TOCItemType } from "@/components/toc-minimap"

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")

/**
 * Builds the scroll minimap from the page's own headings at runtime, so the same
 * tick indicator drops into every page via the layout. `selector` chooses which
 * headings become ticks (section h2s by default; prose/cards per page).
 */
export function AutoTOCMinimap({ selector = "main h2" }: { selector?: string }) {
  const [items, setItems] = useState<TOCItemType[]>([])

  useEffect(() => {
    const next: TOCItemType[] = Array.from(
      document.querySelectorAll<HTMLElement>(selector)
    )
      .filter((el) => (el.textContent ?? "").trim())
      .map((el) => {
        if (!el.id) el.id = slugify(el.textContent!) || el.tagName.toLowerCase()
        const depth = el.tagName === "H3" ? 3 : el.tagName === "H4" ? 4 : 2
        return { title: el.textContent!.trim(), url: `#${el.id}`, depth }
      })
    setItems(next)
  }, [selector])

  // ponytail: need 2+ ticks to be worth showing; one-heading pages just hide it.
  if (items.length < 2) return null
  return <TOCMinimap items={items} />
}
