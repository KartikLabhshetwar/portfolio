import { BrandAssetsMenu } from "@/components/brand-assets-menu"
import { FluidGradientText } from "@/components/fluid-gradient-text"

const LOGOMARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" font-family="monospace" font-weight="bold" font-size="48" fill="currentColor">KL</text></svg>`

const LOGOTYPE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 80"><text x="0" y="62" font-family="sans-serif" font-weight="bold" font-size="64" fill="currentColor">Kartik Labhshetwar</text></svg>`

const brandProps = {
  logomark: <span className="font-mono text-sm font-bold tracking-tight">KL</span>,
  logomarkSVG: LOGOMARK_SVG,
  logotypeSVG: LOGOTYPE_SVG,
  brandGuidelinesURL: "https://kartiklabhshetwar.com",
  brandAssetsURL: "https://github.com/KartikLabhshetwar",
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

export function HeroName({ name }: { name: string }) {
  return (
    <BrandAssetsMenu {...brandProps}>
      <h1 className="w-fit text-4xl font-semibold tracking-tight">{name}</h1>
    </BrandAssetsMenu>
  )
}
