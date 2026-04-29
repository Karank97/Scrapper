'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Lead } from '@/lib/types'

export default function Leads() {
  const [rows, setRows] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await supabase.leads.list()
        setRows((data as Lead[]) ?? [])
      } catch (e: any) {
        setError(e.message || 'Failed to load leads')
      }
      setLoading(false)
    }
    run()
  }, [])

  return <div><h1 className='text-2xl font-bold mb-4'>Leads</h1>{loading && <div className='card'>Loading leads...</div>}{error && <div className='card text-red-700'>{error}</div>}<div className='card overflow-x-auto'><table className='w-full text-sm'><thead><tr className='text-left border-b'><th>Address</th><th>City</th><th>Type</th><th>Score</th><th>DNC</th><th>Source</th></tr></thead><tbody>{rows.map((r,i)=><tr className='border-b' key={r.id ?? i}><td>{r.property_address}</td><td>{r.property_city}</td><td>{r.lead_type}</td><td>{r.motivation_score ?? 0}</td><td>{r.dnc_status}</td><td>{r.source_name}</td></tr>)}{!loading && rows.length===0 && <tr><td colSpan={6} className='py-8 text-center text-slate-500'>No leads yet.</td></tr>}</tbody></table></div></div>
}
