import type { JSX } from "react"
import { useSyncExternalStore } from "react"
import { motion, MotionConfig } from "motion/react"
import { ThemeProvider, useTheme } from "next-themes"
import { MonitorIcon, SunIcon, MoonIcon } from "lucide-react"
import { Toaster } from "@/components/ui/sonner"

function ThemeOption({
  icon,
  value,
  isActive,
  onClick,
}: {
  icon: JSX.Element
  value: string
  isActive?: boolean
  onClick: (value: string) => void
}) {
  return (
    <button
      data-active={isActive}
      className="relative flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors duration-200 hover:text-foreground data-[active=true]:text-foreground"
      role="radio"
      aria-checked={isActive}
      aria-label={`Switch to ${value} theme`}
      onClick={() => onClick(value)}
    >
      {isActive && (
        <motion.span
          layoutId="theme-thumb"
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
          className="absolute inset-0 rounded-full bg-muted shadow-sm"
        />
      )}
      <motion.span
        className="relative z-10 flex [&_svg]:size-4"
        whileTap={{ scale: 0.85 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {icon}
      </motion.span>
    </button>
  )
}

const THEME_OPTIONS = [
  { icon: <MonitorIcon strokeWidth={1.75} />, value: "system" },
  { icon: <SunIcon strokeWidth={1.75} />, value: "light" },
  { icon: <MoonIcon strokeWidth={1.75} />, value: "dark" },
]

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  if (!isMounted) {
    return <div className="flex h-8 w-24" />
  }

  return (
    <motion.div
      key={String(isMounted)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="inline-flex items-center overflow-clip rounded-full bg-background inset-ring-1 inset-ring-border"
      role="radiogroup"
    >
      {THEME_OPTIONS.map((option) => (
        <ThemeOption
          key={option.value}
          icon={option.icon}
          value={option.value}
          isActive={theme === option.value}
          onClick={setTheme}
        />
      ))}
    </motion.div>
  )
}

function ThemeSwitcherRoot() {
  return (
    <ThemeProvider attribute="class" storageKey="theme" defaultTheme="system" disableTransitionOnChange>
      <MotionConfig reducedMotion="user">
        <ThemeSwitcher />
      </MotionConfig>
      <Toaster />
    </ThemeProvider>
  )
}

export { ThemeSwitcherRoot as ThemeSwitcher }
