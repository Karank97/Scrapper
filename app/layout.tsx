import './globals.css'
import Link from 'next/link'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const nav = ['dashboard','leads','add-lead','csv-upload','source-review','outreach-queue','compliance-center','settings']
  return <html><body><div className='min-h-screen'><header className='bg-navy text-white p-4 font-semibold'>Streamline Lead Scanner</header><div className='flex'><aside className='w-64 border-r p-4 space-y-2'>{nav.map(n=><Link className='block hover:underline' key={n} href={`/${n}`}>{n}</Link>)}</aside><main className='flex-1 p-6'>{children}</main></div></div></body></html>
}
