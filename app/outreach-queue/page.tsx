'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

function scripts(address:string){return {
 call:`Hi, I am reaching out about ${address}. If you're open to discussing options, I'd be happy to talk.`,
 sms:`Hi! Reaching out regarding ${address}. If you'd like, we can discuss options at your convenience.`,
 email:`Subject: Question about ${address}\n\nHello, I wanted to respectfully ask whether you'd consider discussing your property at ${address}.`,
 mail:`Dear Property Owner,\n\nI am contacting you regarding ${address}. If you are considering selling or renting, I'd be glad to discuss.`
}}

export default function Page(){
  const [rows,setRows]=useState<any[]>([]);const [loading,setLoading]=useState(true);const [error,setError]=useState('')
  useEffect(()=>{(async()=>{try { const data = await supabase.leads.listClear(); setRows(data ?? []) } catch (e:any) { setError(e.message) }
  setLoading(false)})()},[])
  return <div><h1 className='text-2xl font-bold mb-4'>Outreach Queue (Manual Only)</h1>{loading&&<div className='card'>Loading...</div>}{error&&<div className='card text-red-700'>{error}</div>}<div className='space-y-3'>{rows.map(r=>{const s=scripts(r.property_address);return <div key={r.id} className='card'><div className='font-semibold'>{r.property_address}</div><div className='text-xs badge-ok inline-block mb-2'>DNC Clear</div><details><summary className='cursor-pointer'>Generate manual scripts</summary><pre className='whitespace-pre-wrap text-xs mt-2'>{`CALL:\n${s.call}\n\nSMS:\n${s.sms}\n\nEMAIL:\n${s.email}\n\nDIRECT MAIL:\n${s.mail}`}</pre></details></div>})}{!loading&&!rows.length&&<div className='card'>No DNC-clear leads ready.</div>}</div></div>
}
