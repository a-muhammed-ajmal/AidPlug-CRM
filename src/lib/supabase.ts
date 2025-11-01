import { createClient } from '@supabase/supabase-js'
import { authStorage } from './authStorage'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: authStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'apikey': supabaseAnonKey,
    },
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Helper function with proper error handling
export async function fetchLeads() {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select(`
        id,
        created_at,
        full_name,
        email,
        phone,
        company_name,
        location,
        monthly_salary,
        product,
        product_type,
        bank_name,
        stage,
        user_id,
        loan_amount_requested,
        salary_months,
        salary_variations,
        existing_cards,
        cards_duration,
        total_credit_limit,
        has_emi,
        emi_amount,
        applied_recently,
        documents_available
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase query error:', error)
      throw new Error(`Failed to fetch leads: ${error.message}`)
    }

    return { data, error: null }
  } catch (err) {
    console.error('Unexpected error:', err)
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error occurred')
    }
  }
}
