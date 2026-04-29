const AGENT_WORDS = ['brokerage','realtor','agent','listing office','keller williams','exp','coldwell banker','compass']
const DISTRESS = ['foreclosure','distressed','urgent','must sell','probate']

export function scoreLead(input: { absentee_owner?: boolean; llc_owned?: boolean; units?: number; out_of_state?: boolean; owned_10_plus_years?: boolean; lead_type?: string; notes?: string; }) {
  let score = 0
  const reasons: string[] = []
  if (input.absentee_owner) { score += 20; reasons.push('Absentee owner +20') }
  if (input.llc_owned) { score += 15; reasons.push('LLC-owned +15') }
  if ((input.units ?? 0) > 1) { score += 15; reasons.push('Multi-family +15') }
  if (input.out_of_state) { score += 20; reasons.push('Out-of-state owner +20') }
  if (input.owned_10_plus_years) { score += 15; reasons.push('Owned 10+ years +15') }
  if (input.lead_type === 'FSBO') { score += 20; reasons.push('FSBO +20') }
  if (input.lead_type === 'Rental by owner') { score += 15; reasons.push('Rental by owner +15') }
  if (input.lead_type === 'Expired listing') { score += 25; reasons.push('Expired listing +25') }
  const note = (input.notes || '').toLowerCase()
  if (DISTRESS.some(w => note.includes(w))) { score += 20; reasons.push('Distressed keyword +20') }
  const possiblyAgent = AGENT_WORDS.some(w => note.includes(w))
  return { score: Math.min(100, score), reason: reasons.join('; '), possiblyAgent }
}

export const PROHIBITED_SOURCES = ['zillow','realtor.com','craigslist','facebook','mls']
