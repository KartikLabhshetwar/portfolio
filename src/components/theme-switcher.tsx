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
      className="relative flex size-8 items-center justify-center rounded-full text-muted-foreground transition-[color] hover:text-foreground data-[active=true]:text-foreground [&_svg]:size-4"
      role="radio"
      aria-checked={isActive}
      aria-label={`Switch to ${value} theme`}
      onClick={() => onClick(value)}
    >
      <motion.span
        className="relative z-10 flex"
        animate={{ scale: isActive ? 1.12 : 1, opacity: isActive ? 1 : 0.6 }}
        whileTap={{ scale: 0.82 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
      >
        {icon}
      </motion.span>

      {isActive && (
        <motion.span
          layoutId="theme-option"
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          className="absolute inset-0 rounded-full border"
        />
      )}
    </button>
  )
}

const THEME_OPTIONS = [
  {
    icon: (
      <MonitorIcon
      />
    ),
    value: "system",
  },
  {
    icon: (
      <SunIcon
      />
    ),
    value: "light",
  },
  {
    icon: (
      <MoonIcon
      />
    ),
    value: "dark",
  },
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
