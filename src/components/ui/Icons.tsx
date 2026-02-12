import type { SVGProps } from 'react'

type Props = SVGProps<SVGSVGElement>

export function BellIcon(props: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Z"
        fill="currentColor"
      />
      <path
        d="M20 17H4c1.5-1.7 2-3.1 2-6a6 6 0 1 1 12 0c0 2.9.5 4.3 2 6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ChevronDownIcon(props: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function DashboardIcon(props: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M4 4h7v7H4V4Zm9 0h7v4h-7V4ZM4 13h7v7H4v-7Zm9-3h7v10h-7V10Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  )
}


export function BoxIcon(props: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M21 8.5 12 3 3 8.5 12 14l9-5.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M3 8.5V19l9 5 9-5V8.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M12 14v10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function BookIcon(props: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M7 4h11a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H7a3 3 0 0 1 0-6h13"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CartIcon(props: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M6 6h15l-2 8H7L6 6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M6 6 5 3H2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M8 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM18 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function DollarIcon(props: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 2v20"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M16.5 7.5c0-2-2-3.5-4.5-3.5S7.5 5.5 7.5 7.5 9.3 10 12 10s4.5 1.5 4.5 3.5S14.7 17 12 17s-4.5-1.5-4.5-3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function SettingsIcon(props: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M19.4 15a8.3 8.3 0 0 0 .1-1l2-1.3-2-3.4-2.3.7a7.8 7.8 0 0 0-.8-.6L16 6h-4l-.4 2.4c-.3.2-.6.4-.8.6l-2.3-.7-2 3.4L8 14a8.3 8.3 0 0 0 .1 1L6.1 16.3l2 3.4 2.3-.7c.3.2.5.4.8.6L12 22h4l.4-2.4c.3-.2.6-.4.8-.6l2.3.7 2-3.4L19.4 15Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function HomeIcon(props: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}
