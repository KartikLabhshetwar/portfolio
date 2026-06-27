import { useTiks } from "@rexa-developer/tiks/react"
import { toast } from "sonner"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { TypeIcon, SquareDashedIcon, DownloadIcon } from "lucide-react"

export type BrandAssetsMenuProps = {
  logomark: React.ReactElement
  logomarkSVG: string
  logotypeSVG: string
  brandGuidelinesURL: string
  brandAssetsURL: string
  children: React.ReactElement
}

export function BrandAssetsMenu({
  logomark,
  logomarkSVG,
  logotypeSVG,
  brandGuidelinesURL,
  brandAssetsURL,
  children,
}: BrandAssetsMenuProps) {
  const { success } = useTiks()

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>

      <ContextMenuContent className="w-fit">
        <ContextMenuItem
          onClick={() => {
            copyText(logomarkSVG)
            toast.success("Logomark as SVG copied")
            success()
          }}
        >
          {logomark}
          Copy Logomark as SVG
        </ContextMenuItem>

        <ContextMenuItem
          onClick={() => {
            copyText(logotypeSVG)
            toast.success("Logotype as SVG copied")
            success()
          }}
        >
          <TypeIcon
          />
          Copy Logotype as SVG
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem asChild>
          <a
            href={brandGuidelinesURL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <SquareDashedIcon
            />
            Brand Guidelines
          </a>
        </ContextMenuItem>

        <ContextMenuItem asChild>
          <a
            href={brandAssetsURL}
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            <DownloadIcon
            />
            Download Brand Assets
          </a>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
