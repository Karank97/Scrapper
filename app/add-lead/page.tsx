'use client'
import { FormEvent, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { scoreLead } from '@/lib/scoring'

const initialForm = {
  property_address: '',
  property_city: '',
  first_name: '',
  last_name: '',
  phone: '',
  email: '',
  lead_type: 'FSBO',
  source_name: '',
  source_url: '',
  notes: ''
}

export default function AddLead() {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [form, setForm] = useState(initialForm)

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErr('')
    setMsg('')
    setLoading(true)

    const notes = form.notes
    const leadType = form.lead_type || 'FSBO'
    const s = scoreLead({ lead_type: leadType, notes })

    const payload = {
      property_address: form.property_address,
      first_name: form.first_name,
      last_name: form.last_name,
      property_city: form.property_city,
      property_state: 'NJ',
      phone: form.phone,
      email: form.email,
      source_name: form.source_name,
      source_url: form.source_url,
      lead_type: leadType,
      notes,
      dnc_status: 'unknown',
      motivation_score: s.score,
      motivation_reason: `${s.reason}${s.possiblyAgent ? '; possibly agent' : ''}`
    }

    try {
      await supabase.leads.insert(payload)
      setMsg('Lead saved')
      setForm(initialForm)
    } catch (e: any) {
      setErr(e.message)
    }

    setLoading(false)
  }

  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>Add Lead</h1>
      <form onSubmit={submit} className='card grid md:grid-cols-2 gap-3'>
        <input name='property_address' required value={form.property_address} onChange={(e) => setForm(f => ({ ...f, property_address: e.target.value }))} className='border p-2' placeholder='Property address' />
        <input name='property_city' value={form.property_city} onChange={(e) => setForm(f => ({ ...f, property_city: e.target.value }))} className='border p-2' placeholder='City' />
        <input name='first_name' value={form.first_name} onChange={(e) => setForm(f => ({ ...f, first_name: e.target.value }))} className='border p-2' placeholder='First name' />
        <input name='last_name' value={form.last_name} onChange={(e) => setForm(f => ({ ...f, last_name: e.target.value }))} className='border p-2' placeholder='Last name' />
        <input name='phone' value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} className='border p-2' placeholder='Phone' />
        <input name='email' value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} className='border p-2' placeholder='Email' />
        <select name='lead_type' value={form.lead_type} onChange={(e) => setForm(f => ({ ...f, lead_type: e.target.value }))} className='border p-2'>
          <option>FSBO</option>
          <option>Expired listing</option>
          <option>Rental by owner</option>
          <option>Absentee landlord</option>
        </select>
        <input name='source_name' required value={form.source_name} onChange={(e) => setForm(f => ({ ...f, source_name: e.target.value }))} className='border p-2' placeholder='Source name' />
        <input name='source_url' value={form.source_url} onChange={(e) => setForm(f => ({ ...f, source_url: e.target.value }))} className='border p-2 md:col-span-2' placeholder='Source URL' />
        <textarea name='notes' value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} className='border p-2 md:col-span-2' placeholder='Notes, lawful contact source only' />
        <button disabled={loading} className='bg-navy text-white px-4 py-2 rounded w-fit'>{loading ? 'Saving...' : 'Save lead'}</button>
        {msg && <p className='text-green-700'>{msg}</p>}
        {err && <p className='text-red-700'>{err}</p>}
      </form>
    </div>
  )
}