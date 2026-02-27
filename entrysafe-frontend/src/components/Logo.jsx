export default function Logo({ className = "h-10 w-auto", variant = "full" }) {
  // Variants: 'full' (with text), 'icon' (shield only)
  
  if (variant === "icon") {
    return (
      <img 
        src="/logo-icon.png" 
        alt="Entry Safe" 
        className={className}
      />
    )
  }

  return (
    <img 
      src="/logo-full.png" 
      alt="Entry Safe - Secure Business Management" 
      className={className}
    />
  )
}
