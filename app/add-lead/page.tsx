'use client'
import { FormEvent, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { scoreLead } from '@/lib/scoring'

export default function AddLead() {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setErr(''); setMsg(''); setLoading(true)
    const fd = new FormData(e.currentTarget)
    const notes = String(fd.get('notes') || '')
    const leadType = String(fd.get('lead_type') || 'FSBO')
    const s = scoreLead({ lead_type: leadType, notes })
    const payload = {
      property_address: String(fd.get('property_address') || ''),
      first_name: String(fd.get('first_name') || ''),
      last_name: String(fd.get('last_name') || ''),
      property_city: String(fd.get('property_city') || ''),
      property_state: 'NJ',
      phone: String(fd.get('phone') || ''),
      email: String(fd.get('email') || ''),
      source_name: String(fd.get('source_name') || ''),
      source_url: String(fd.get('source_url') || ''),
      lead_type: leadType,
      notes,
      dnc_status: 'unknown',
      motivation_score: s.score,
      motivation_reason: `${s.reason}${s.possiblyAgent ? '; possibly agent' : ''}`
    }
    try {
      await supabase.leads.insert(payload)
      setMsg('Lead saved.'); e.currentTarget.reset()
    } catch (e:any) { setErr(e.message) }
    setLoading(false)
  }

  return <div><h1 className='text-2xl font-bold mb-4'>Add Lead</h1><form onSubmit={submit} className='card grid md:grid-cols-2 gap-3'><input name='property_address' required className='border p-2' placeholder='Property address' /><input name='property_city' className='border p-2' placeholder='City' /><input name='first_name' className='border p-2' placeholder='First name' /><input name='last_name' className='border p-2' placeholder='Last name' /><input name='phone' className='border p-2' placeholder='Phone' /><input name='email' className='border p-2' placeholder='Email' /><select name='lead_type' className='border p-2'><option>FSBO</option><option>Expired listing</option><option>Rental by owner</option><option>Absentee landlord</option></select><input name='source_name' required className='border p-2' placeholder='Source name' /><input name='source_url' className='border p-2 md:col-span-2' placeholder='Source URL' /><textarea name='notes' className='border p-2 md:col-span-2' placeholder='Notes, lawful contact source only' /><button disabled={loading} className='bg-navy text-white px-4 py-2 rounded w-fit'>{loading ? 'Saving...' : 'Save lead'}</button>{msg && <p className='text-green-700'>{msg}</p>}{err && <p className='text-red-700'>{err}</p>}</form></div>
}
