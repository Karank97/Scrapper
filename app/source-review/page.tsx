'use client'
import { FormEvent, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Page(){
  const [rows,setRows]=useState<any[]>([]);const [loading,setLoading]=useState(true);const [error,setError]=useState('')
  const load=async()=>{setLoading(true); try { const data = await supabase.sourceReviews.list(); setRows(data ?? []) } catch (e:any) { setError(e.message) } setLoading(false)}
  useEffect(()=>{load()},[])
  const submit=async(e:FormEvent<HTMLFormElement>)=>{e.preventDefault();const fd=new FormData(e.currentTarget);try { await supabase.sourceReviews.insert({source_name:String(fd.get('source_name')||''),source_url:String(fd.get('source_url')||''),allowed_use_notes:String(fd.get('allowed_use_notes')||''),is_approved:String(fd.get('is_approved'))==='true'}); e.currentTarget.reset(); load() } catch (e:any) { setError(e.message) }}
  return <div><h1 className='text-2xl font-bold mb-4'>Source Review</h1><form onSubmit={submit} className='card grid md:grid-cols-2 gap-2 mb-4'><input required name='source_name' className='border p-2' placeholder='Source name' /><input name='source_url' className='border p-2' placeholder='Source URL' /><select name='is_approved' className='border p-2'><option value='false'>Restricted / Needs Caution</option><option value='true'>Approved</option></select><input name='allowed_use_notes' className='border p-2' placeholder='Allowed use notes' /><button className='bg-navy text-white px-3 py-2 rounded w-fit'>Save Source</button></form>{loading&&<div className='card'>Loading...</div>}{error&&<div className='card text-red-700'>{error}</div>}<div className='space-y-2'>{rows.map(r=><div className='card' key={r.id}><div className='font-medium'>{r.source_name} {r.is_approved?<span className='badge-ok'>Approved</span>:<span className='badge-warn'>Restricted</span>}</div><div className='text-xs'>{r.source_url}</div><div className='text-xs text-slate-600'>{r.allowed_use_notes}</div></div>)}</div></div>
}
