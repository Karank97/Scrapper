export type DncStatus = 'unknown' | 'needs_review' | 'clear' | 'do_not_contact'
export type Lead = {
  id?: string
  first_name?: string
  last_name?: string
  company_name?: string
  property_address: string
  property_city?: string
  property_state?: string
  property_zip?: string
  phone?: string
  email?: string
  lead_type: string
  property_type?: string
  owner_type?: string
  source_name: string
  source_url?: string
  source_category?: string
  motivation_score?: number
  motivation_reason?: string
  dnc_status: DncStatus
  contact_status?: string
  notes?: string
}
