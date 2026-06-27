import type React from "react"
import { BrandAssetsMenu } from "@/components/brand-assets-menu"
import { FluidGradientText } from "@/components/fluid-gradient-text"

// Pixel-art K: 4 col × 6 row block grid, 64 px cells, viewBox 256 × 384
const K_PATH =
  "M0 0h64v384h-64zM192 0h64v64h-64zM128 64h64v64h-64zM64 128h64v128h-64zM128 256h64v64h-64zM192 320h64v64h-64z"

// KL initials logotype (K + 64 px gap + L)
const KL_PATH =
  K_PATH + "M320 0h64v384h-64zM320 320h128v64h-128z"

const LOGOMARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 256 384"><path fill="currentColor" d="${K_PATH}"/></svg>`

const LOGOTYPE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 448 384"><path fill="currentColor" d="${KL_PATH}"/></svg>`

export function KartikMark(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 256 384"
      aria-hidden
      {...props}
    >
      <path fill="currentColor" d={K_PATH} />
    </svg>
  )
}

const brandProps = {
  logomark: <KartikMark className="h-4 text-foreground" />,
  logomarkSVG: LOGOMARK_SVG,
  logotypeSVG: LOGOTYPE_SVG,
  brandGuidelinesURL: "https://kartiklabhshetwar.com",
  brandAssetsURL: "https://github.com/KartikLabhshetwar",
}

export function LogomarkBrand() {
  return (
    <div className="flex flex-col items-start gap-2">
      <BrandAssetsMenu {...brandProps}>
        <button type="button" className="cursor-default" aria-label="Brand assets">
          <KartikMark className="h-10 text-foreground" />
        </button>
      </BrandAssetsMenu>
    </div>
  )
}

export function FooterBrand() {
  return (
    <BrandAssetsMenu {...brandProps}>
      <div className="w-full cursor-default">
        <FluidGradientText text="Kartik Labhshetwar" svgViewBoxWidth={3300} />
      </div>
    </BrandAssetsMenu>
  )
}
