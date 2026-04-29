'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type S = Record<string, number>
export default function Dashboard(){
  const [stats,setStats]=useState<S>({}); const [loading,setLoading]=useState(true); const [error,setError]=useState('')
  useEffect(()=>{(async()=>{setLoading(true); let leads:any[] = []
    try { leads = await supabase.leads.stats() } catch (e:any) { setError(e.message); setLoading(false); return }
    setStats({
      total:leads.length,
      fsbo:leads.filter(l=>l.lead_type==='FSBO').length,
      landlord:leads.filter(l=>String(l.owner_type||'').toLowerCase().includes('landlord')).length,
      absentee:leads.filter(l=>String(l.owner_type||'').toLowerCase().includes('absentee')).length,
      high:leads.filter(l=>(l.motivation_score??0)>=70).length,
      dnc:leads.filter(l=>l.dnc_status==='needs_review'||l.dnc_status==='unknown').length,
      ready:leads.filter(l=>l.dnc_status==='clear').length
    });setLoading(false)})()},[])
  const cards=[['Total Leads',stats.total],['FSBO Leads',stats.fsbo],['Landlord Leads',stats.landlord],['Absentee Owners',stats.absentee],['High Motivation',stats.high],['Needs DNC Review',stats.dnc],['Ready for Manual Outreach',stats.ready]]
  return <div><h1 className='text-2xl font-bold mb-4'>Dashboard</h1>{loading&&<div className='card'>Loading dashboard...</div>}{error&&<div className='card text-red-700'>{error}</div>}<div className='grid md:grid-cols-3 gap-4'>{cards.map(([k,v])=><div className='card' key={String(k)}><div className='text-sm text-slate-500'>{k}</div><div className='text-2xl font-bold text-navy'>{v??0}</div></div>)}</div></div>
}
