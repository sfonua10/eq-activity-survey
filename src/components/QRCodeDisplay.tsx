import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

interface QRCodeDisplayProps {
  url: string
}

export default function QRCodeDisplay({ url }: QRCodeDisplayProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback silently
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="rounded-2xl bg-white p-5">
        <QRCodeSVG value={url} size={160} />
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className="text-xs text-text-muted hover:text-accent transition-colors"
      >
        {copied ? 'Copied!' : 'Copy link'}
      </button>
    </div>
  )
}
