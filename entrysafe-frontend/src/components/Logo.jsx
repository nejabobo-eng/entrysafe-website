import { useState } from "react"

export default function Logo({ className = "", variant = "full", light = false }) {
  const [hasLogoAsset, setHasLogoAsset] = useState(true)
  const asset = variant === "icon"
    ? "/images/logo/entrysafe-logo-icon.svg"
    : "/images/logo/entrysafe-logo-full.png"

  if (hasLogoAsset) {
    return (
      <img
        src={asset}
        alt="EntrySafe"
        className={`object-contain ${variant === "icon" ? "h-10 w-10" : "h-14 w-14 rounded-xl shadow-lg shadow-black/20"} ${className}`}
        onError={() => setHasLogoAsset(false)}
      />
    )
  }

  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold text-sm font-extrabold tracking-tight text-navy shadow-lg shadow-gold/20">ES</span>
      {variant === "full" && (
        <span className={`text-xl font-extrabold tracking-tight ${light ? "text-white" : "text-navy"}`}>
          Entry<span className="text-gold">Safe</span>
        </span>
      )}
    </span>
  )
}
