"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { cn } from "../lib/utils"

export type ContributionLevel = 0 | 1 | 2 | 3 | 4
export type Contribution = { date: string; count: number; level: ContributionLevel }
export type RepoContribution = { name: string; count: number; logo?: React.ReactNode; href?: string }

const DEFAULT_ACCENT = "#39d353"
const DEFAULT_CELL_SIZE = 11
const WEEKS_PER_MONTH = 365.25 / 12 / 7
const STACK_LIMIT = 3
const CARD_PADDING = 32
const LEVEL_OPACITY: Record<ContributionLevel, number> = { 0: 0, 1: 0.3, 2: 0.52, 3: 0.76, 4: 1 }
const DATE_FORMAT = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" })
const CALENDAR_API = "https://github-contributions-api.jogruber.de/v4"
const EVENTS_API = "https://api.github.com/users"
const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

export const weeksFor = (months: number) => Math.max(1, Math.ceil(months * WEEKS_PER_MONTH))
const gapFor = (cellSize: number) => Math.max(2, Math.round(cellSize / 4))

export function toWeeks(contributions: Contribution[]) {
  const weeks: Contribution[][] = []
  for (let index = 0; index < contributions.length; index += 7) weeks.push(contributions.slice(index, index + 7))
  return weeks
}

type ApiDay = { date: string; count: number; level: number }
type PushEvent = { type: string; repo?: { name: string }; payload?: { commits?: unknown[] } }

async function fetchCalendar(login: string) {
  const response = await fetch(`${CALENDAR_API}/${login}?y=last`)
  if (!response.ok) return null
  const days: ApiDay[] = (await response.json())?.contributions ?? []
  const start = days.findIndex((day) => new Date(`${day.date}T00:00:00Z`).getUTCDay() === 0)
  return days.slice(start < 0 ? 0 : start).map<Contribution>((day) => ({
    date: day.date,
    count: day.count,
    level: Math.min(4, Math.max(0, day.level)) as ContributionLevel,
  }))
}

async function fetchRepos(login: string): Promise<RepoContribution[]> {
  const response = await fetch(`${EVENTS_API}/${login}/events/public?per_page=100`)
  if (!response.ok) return []
  const counts = new Map<string, number>()
  for (const event of await response.json() as PushEvent[]) {
    if (event.type !== "PushEvent" || !event.repo) continue
    counts.set(event.repo.name, (counts.get(event.repo.name) ?? 0) + (event.payload?.commits?.length ?? 1))
  }
  return [...counts.entries()]
    .sort(([, a], [, b]) => b - a)
    .slice(0, STACK_LIMIT)
    .map(([fullName, count]) => {
      const [owner, name] = fullName.split("/")
      return {
        name,
        count,
        href: `https://github.com/${fullName}`,
        logo: owner.toLowerCase() === login.toLowerCase()
          ? undefined
          : <img src={`https://github.com/${owner}.png?size=64`} alt="" />,
      }
    })
}

function emptyDays(weeks: number): Contribution[] {
  const today = new Date()
  return Array.from({ length: weeks * 7 }, (_, index) => {
    const date = new Date(today)
    date.setDate(date.getDate() - (weeks * 7 - 1 - index))
    return { date: date.toISOString().slice(0, 10), count: 0, level: 0 }
  })
}

function useGitHubUser(login?: string, months = 12) {
  const [data, setData] = React.useState<{ contributions: Contribution[]; repos: RepoContribution[] }>()
  const placeholder = React.useMemo(() => login ? emptyDays(weeksFor(months)) : [], [login, months])

  React.useEffect(() => {
    if (!login) return
    let active = true
    Promise.all([fetchCalendar(login), fetchRepos(login)])
      .then(([contributions, repos]) => {
        if (active && contributions?.length) setData({ contributions, repos })
      })
      .catch(() => {})
    return () => { active = false }
  }, [login])

  return data ?? { contributions: placeholder, repos: [] }
}

function useColumns(cellSize: number, gap: number) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [columns, setColumns] = React.useState(1)
  useIsoLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    const measure = () => setColumns(Math.max(1, Math.floor((element.clientWidth + gap) / (cellSize + gap))))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [cellSize, gap])
  return [ref, columns] as const
}

function ContributionGrid({ contributions, accent, cellSize, months }: {
  contributions: Contribution[]
  accent: string
  cellSize: number
  months: number
}) {
  const reduced = useReducedMotion()
  const gap = gapFor(cellSize)
  const [ref, columns] = useColumns(cellSize, gap)
  const weeks = React.useMemo(() => toWeeks(contributions), [contributions])
  const visible = weeks.slice(-Math.min(weeksFor(months), columns))
  const [hovered, setHovered] = React.useState<{ day: Contribution; x: number; y: number }>()

  return (
    <div ref={ref} role="img" aria-label="GitHub contribution activity" className="relative w-full">
      <div className="flex justify-center overflow-hidden" style={{ gap }} onPointerLeave={() => setHovered(undefined)}>
        {visible.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col" style={{ gap }}>
            {week.map((day) => (
              <motion.div
                key={day.date}
                className="shrink-0 rounded-[3px] bg-foreground/[0.08]"
                style={{ width: cellSize, height: cellSize }}
                initial={reduced ? false : { opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: reduced ? 0 : 0.2, delay: reduced ? 0 : weekIndex * 0.012 }}
                onPointerEnter={(event) => {
                  const cell = event.currentTarget.getBoundingClientRect()
                  setHovered({ day, x: cell.left + cell.width / 2, y: cell.top })
                }}
              >
                <div
                  className="size-full rounded-[3px]"
                  style={{ backgroundColor: accent, opacity: LEVEL_OPACITY[day.level] }}
                />
              </motion.div>
            ))}
          </div>
        ))}
      </div>
      <AnimatePresence>
        {hovered && createPortal(
          <motion.div
            key={hovered.day.date}
            className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-[calc(100%+8px)] whitespace-nowrap rounded-lg bg-foreground px-2 py-1 text-[11px] font-medium text-background shadow-md"
            style={{ left: hovered.x, top: hovered.y }}
            initial={reduced ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: reduced ? 1 : 0.94 }}
            transition={{ duration: reduced ? 0 : 0.14 }}
          >
            {hovered.day.count} {hovered.day.count === 1 ? "contribution" : "contributions"} on {DATE_FORMAT.format(new Date(`${hovered.day.date}T00:00:00`))}
          </motion.div>,
          document.body,
        )}
      </AnimatePresence>
    </div>
  )
}

function Avatar({ repo }: { repo: RepoContribution }) {
  return (
    <span className="grid size-7 shrink-0 place-items-center overflow-hidden rounded-full bg-neutral-200 text-[11px] font-medium uppercase text-foreground/70 ring-2 ring-background dark:bg-neutral-800 [&_img]:size-full [&_img]:object-cover">
      {repo.logo ?? repo.name.charAt(0)}
    </span>
  )
}

export type GitHubActivityProps = React.ComponentProps<"div"> & {
  username: string
  accent?: string
  cellSize?: number
  months?: number
  defaultOpen?: boolean
}

export default function GitHubActivity({
  username,
  accent = DEFAULT_ACCENT,
  cellSize = DEFAULT_CELL_SIZE,
  months = 12,
  defaultOpen = false,
  className,
  style,
  ...props
}: GitHubActivityProps) {
  const reduced = useReducedMotion()
  const { contributions, repos } = useGitHubUser(username, months)
  const [open, setOpen] = React.useState(defaultOpen)
  const total = React.useMemo(() => contributions.reduce((sum, day) => sum + day.count, 0), [contributions])
  const parsedYear = Number(contributions.at(-1)?.date.slice(0, 4))
  const year = Number.isFinite(parsedYear) ? parsedYear : new Date().getFullYear()
  const columns = Math.min(Math.ceil(contributions.length / 7), weeksFor(months))
  const width = columns * (cellSize + gapFor(cellSize)) - gapFor(cellSize) + CARD_PADDING

  return (
    <div
      className={cn(
        "relative w-full max-w-full overflow-hidden rounded-[28px] bg-white p-4 dark:bg-black",
        repos.length > 0 && "pb-[76px]",
        className,
      )}
      style={{ width, ...style }}
      {...props}
    >
      <p className="mb-4 px-1.5 text-base font-medium tabular-nums">{total.toLocaleString()} contributions in {year}</p>
      <ContributionGrid contributions={contributions} accent={accent} cellSize={cellSize} months={months} />

      {repos.length > 0 && (
        <motion.div
          layout
          className={cn("absolute inset-x-3 bottom-3 overflow-hidden bg-card/90 backdrop-blur-xl", open && "top-3")}
          style={{ borderRadius: 18 }}
          transition={reduced ? { duration: 0 } : { type: "spring", bounce: 0.2, duration: 0.62 }}
        >
          <motion.div layout="position" className="flex items-center justify-between gap-3 px-4 py-3">
            <span className="truncate text-sm">Top contributions in:</span>
            <div className="flex items-center gap-3">
              {!open && <div className="flex items-center">{repos.map((repo) => <span key={repo.name} className="-ml-2 first:ml-0"><Avatar repo={repo} /></span>)}</div>}
              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                aria-label={open ? "Hide top repositories" : "Show top repositories"}
                className="grid size-7 place-items-center rounded-full bg-card text-muted-foreground"
              >
                <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: reduced ? 0 : 0.2 }}>⌄</motion.span>
              </button>
            </div>
          </motion.div>
          <AnimatePresence initial={false}>
            {open && (
              <motion.ul
                initial={reduced ? false : { opacity: 0, x: 16, y: 16 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: reduced ? 0 : 16, y: reduced ? 0 : 16 }}
                className="px-0.5 pb-1"
              >
                {repos.map((repo) => (
                  <li key={repo.name}>
                    <a href={repo.href} target="_blank" rel="noreferrer" className="mx-2 flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-foreground/5">
                      <Avatar repo={repo} />
                      <span className="flex-1 truncate text-sm">{repo.name}</span>
                      <span className="text-sm tabular-nums text-foreground/70">{repo.count}</span>
                    </a>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
