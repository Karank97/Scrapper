type Query = Record<string, string | number | boolean | null>

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

async function req(path: string, init: RequestInit = {}) {
  if (!url || !key) throw new Error('Missing Supabase env vars')
  const res = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(init.headers ?? {})
    }
  })
  const body = await res.text()
  const data = body ? JSON.parse(body) : null
  if (!res.ok) throw new Error(data?.message || `Supabase error ${res.status}`)
  return data
}

export const supabase = {
  leads: {
    list: () => req('leads?select=*&order=created_at.desc'),
    listClear: () => req("leads?select=id,property_address,first_name,last_name,dnc_status&dnc_status=eq.clear"),
    stats: () => req('leads?select=lead_type,dnc_status,owner_type,motivation_score'),
    insert: (payload: Query | Query[]) => req('leads', { method: 'POST', body: JSON.stringify(payload) })
  },
  sourceReviews: {
    list: () => req('source_reviews?select=*&order=created_at.desc'),
    insert: (payload: Query) => req('source_reviews', { method: 'POST', body: JSON.stringify(payload) })
  }
}
