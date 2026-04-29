'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { scoreLead } from '@/lib/scoring'

function parseCsv(text: string) {
  const [headerLine, ...lines] = text.split(/\r?\n/).filter(Boolean)
  if (!headerLine) return []
  const headers = headerLine.split(',').map((h) => h.trim())
  return lines.map((line) => {
    const values = line.split(',')
    const row: Record<string, string> = {}
    headers.forEach((h, i) => {
      row[h] = (values[i] ?? '').trim()
    })
    return row
  })
}

export default function CsvUpload() {
  const [rows, setRows] = useState<any[]>([])
  const [selected, setSelected] = useState<Record<number, boolean>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  const onFile = async (f: File) => setRows(parseCsv(await f.text()))

  const insert = async () => {
    setLoading(true)
    setError('')
    setMsg('')
    const payload = rows
      .map((r, i) => ({ r, i }))
      .filter((x) => selected[x.i])
      .map(({ r }) => {
        const notes = String(r.notes || '')
        const leadType = String(r.lead_type || 'FSBO')
        const s = scoreLead({ lead_type: leadType, notes })
        return {
          property_address: r.property_address || r.address,
          property_city: r.property_city || r.city,
          property_state: r.property_state || 'NJ',
          property_zip: r.property_zip || r.zip,
          first_name: r.first_name,
          last_name: r.last_name,
          phone: r.phone,
          email: r.email,
          lead_type: leadType,
          owner_type: r.owner_type,
          source_name: r.source_name || 'CSV Upload',
          source_url: r.source_url,
          notes,
          dnc_status: 'needs_review',
          motivation_score: s.score,
          motivation_reason: s.reason
        }
      })

    if (!payload.length) {
      setError('Select at least one row')
      setLoading(false)
      return
    }

    try {
      await supabase.leads.insert(payload)
      setMsg(`Inserted ${payload.length} leads.`)
    } catch (e: any) {
      setError(e.message)
    }
    setLoading(false)
  }

  return <div><h1 className='text-2xl font-bold mb-4'>CSV Upload</h1><div className='card space-y-3'><input type='file' accept='.csv' onChange={(e)=>{const f=e.target.files?.[0]; if(f) onFile(f)}} className='border p-2'/><div className='badge-warn inline-block'>Manual review required before outreach</div></div>{error&&<div className='card text-red-700 mt-3'>{error}</div>}{msg&&<div className='card text-green-700 mt-3'>{msg}</div>}{rows.length>0&&<div className='card mt-4 overflow-x-auto'><button onClick={insert} disabled={loading} className='bg-navy text-white px-3 py-2 rounded mb-3'>{loading?'Inserting...':'Insert selected rows'}</button><table className='w-full text-xs'><thead><tr><th></th><th>Address</th><th>City</th><th>Lead Type</th><th>Source</th></tr></thead><tbody>{rows.slice(0,200).map((r,i)=><tr key={i} className='border-b'><td><input type='checkbox' checked={!!selected[i]} onChange={(e)=>setSelected(s=>({...s,[i]:e.target.checked}))}/></td><td>{r.property_address||r.address}</td><td>{r.property_city||r.city}</td><td>{r.lead_type}</td><td>{r.source_name||'CSV Upload'}</td></tr>)}</tbody></table></div>}</div>
}
