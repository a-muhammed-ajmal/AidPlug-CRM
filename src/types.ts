export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          aecb_score: number | null;
          client_since: string | null;
          company_landline: string | null;
          company_name: string | null;
          company_website: string | null;
          created_at: string | null;
          designation: string | null;
          dob: string | null;
          email: string | null;
          emirate: string | null;
          emirates_id: string | null;
          employment_status: string | null;
          full_name: string;
          gender: string | null;
          id: string;
          last_interaction: string | null;
          ltv_ratio: number | null;
          monthly_salary: number | null;
          nationality: string | null;
          official_email: string | null;
          passport: string | null;
          payment_history: string | null;
          phone: string | null;
          photo_url: string | null;
          products: string[] | null;
          risk_category: string | null;
          salary_transferred_to: string | null;
          total_loan_amount: number | null;
          updated_at: string | null;
          user_id: string;
          visa_status: string | null;
          whatsapp_number: string | null;
        };
        Insert: {
          aecb_score?: number | null;
          client_since?: string | null;
          company_landline?: string | null;
          company_name?: string | null;
          company_website?: string | null;
          created_at?: string | null;
          designation?: string | null;
          dob?: string | null;
          email?: string | null;
          emirate?: string | null;
          emirates_id?: string | null;
          employment_status?: string | null;
          full_name: string;
          gender?: string | null;
          id?: string;
          last_interaction?: string | null;
          ltv_ratio?: number | null;
          monthly_salary?: number | null;
          nationality?: string | null;
          official_email?: string | null;
          passport?: string | null;
          payment_history?: string | null;
          phone?: string | null;
          photo_url?: string | null;
          products?: string[] | null;
          risk_category?: string | null;
          salary_transferred_to?: string | null;
          total_loan_amount?: number | null;
          updated_at?: string | null;
          user_id: string;
          visa_status?: string | null;
          whatsapp_number?: string | null;
        };
        Update: {
          aecb_score?: number | null;
          client_since?: string | null;
          company_landline?: string | null;
          company_name?: string | null;
          company_website?: string | null;
          created_at?: string | null;
          designation?: string | null;
          dob?: string | null;
          email?: string | null;
          emirate?: string | null;
          emirates_id?: string | null;
          employment_status?: string | null;
          full_name?: string;
          gender?: string | null;
          id?: string;
          last_interaction?: string | null;
          ltv_ratio?: number | null;
          monthly_salary?: number | null;
          nationality?: string | null;
          official_email?: string | null;
          passport?: string | null;
          payment_history?: string | null;
          phone?: string | null;
          photo_url?: string | null;
          products?: string[] | null;
          risk_category?: string | null;
          salary_transferred_to?: string | null;
          total_loan_amount?: number | null;
          updated_at?: string | null;
          user_id?: string;
          visa_status?: string | null;
          whatsapp_number?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'clients_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      deals: {
        Row: {
          aecb_score: number | null;
          amount: number;
          application_number: string | null;
          bank_applying: string | null;
          bdi_number: string | null;
          client_id: string | null;
          client_name: string;
          company_name: string | null;
          completed_date: string | null;
          created_at: string | null;
          designation: string | null;
          email_address: string | null;
          expected_close_date: string | null;
          id: string;
          interest_rate: number | null;
          mobile_number: string | null;
          monthly_salary: number | null;
          probability: number | null;
          product: string | null;
          product_type: string | null;
          stage:
            | 'application_processing'
            | 'verification_needed'
            | 'activation_needed'
            | 'completed'
            | 'unsuccessful'
            | null;
          tenure: number | null;
          title: string;
          updated_at: string | null;
          user_id: string;
          whatsapp_number: string | null;
        };
        Insert: {
          aecb_score?: number | null;
          amount: number;
          application_number?: string | null;
          bank_applying?: string | null;
          bdi_number?: string | null;
          client_id?: string | null;
          client_name: string;
          company_name?: string | null;
          completed_date?: string | null;
          created_at?: string | null;
          designation?: string | null;
          email_address?: string | null;
          expected_close_date?: string | null;
          id?: string;
          interest_rate?: number | null;
          mobile_number?: string | null;
          monthly_salary?: number | null;
          probability?: number | null;
          product?: string | null;
          product_type?: string | null;
          stage?:
            | 'application_processing'
            | 'verification_needed'
            | 'activation_needed'
            | 'completed'
            | 'unsuccessful'
            | null;
          tenure?: number | null;
          title: string;
          updated_at?: string | null;
          user_id: string;
          whatsapp_number?: string | null;
        };
        Update: {
          aecb_score?: number | null;
          amount?: number;
          application_number?: string | null;
          bank_applying?: string | null;
          bdi_number?: string | null;
          client_id?: string | null;
          client_name?: string;
          company_name?: string | null;
          completed_date?: string | null;
          created_at?: string | null;
          designation?: string | null;
          email_address?: string | null;
          expected_close_date?: string | null;
          id?: string;
          interest_rate?: number | null;
          mobile_number?: string | null;
          monthly_salary?: number | null;
          probability?: number | null;
          product?: string | null;
          product_type?: string | null;
          stage?:
            | 'application_processing'
            | 'verification_needed'
            | 'activation_needed'
            | 'completed'
            | 'unsuccessful'
            | null;
          tenure?: number | null;
          title?: string;
          updated_at?: string | null;
          user_id?: string;
          whatsapp_number?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'deals_client_id_fkey';
            columns: ['client_id'];
            referencedRelation: 'clients';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'deals_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      leads: {
        Row: {
          bank_name: string | null;
          company_name: string | null;
          created_at: string | null;
          email: string | null;
          employment_years: number | null;
          existing_loans: number | null;
          full_name: string;
          id: string;
          last_contact_date: string | null;
          loan_amount_requested: number | null;
          location: string | null;
          monthly_salary: number | null;
          phone: string;
          product: string | null;
          product_interest: string[] | null;
          product_type: string | null;
          qualification_status:
            | 'warm'
            | 'qualified'
            | 'appointment_booked'
            | null;
          referral_source: string | null;
          updated_at: string | null;
          urgency_level: 'low' | 'medium' | 'high' | null;
          user_id: string;
        };
        Insert: {
          bank_name?: string | null;
          company_name?: string | null;
          created_at?: string | null;
          email?: string | null;
          employment_years?: number | null;
          existing_loans?: number | null;
          full_name: string;
          id?: string;
          last_contact_date?: string | null;
          loan_amount_requested?: number | null;
          location?: string | null;
          monthly_salary?: number | null;
          phone: string;
          product?: string | null;
          product_interest?: string[] | null;
          product_type?: string | null;
          qualification_status?:
            | 'warm'
            | 'qualified'
            | 'appointment_booked'
            | null;
          referral_source?: string | null;
          updated_at?: string | null;
          urgency_level?: 'low' | 'medium' | 'high' | null;
          user_id: string;
        };
        Update: {
          bank_name?: string | null;
          company_name?: string | null;
          created_at?: string | null;
          email?: string | null;
          employment_years?: number | null;
          existing_loans?: number | null;
          full_name?: string;
          id?: string;
          last_contact_date?: string | null;
          loan_amount_requested?: number | null;
          location?: string | null;
          monthly_salary?: number | null;
          phone?: string;
          product?: string | null;
          product_interest?: string[] | null;
          product_type?: string | null;
          qualification_status?:
            | 'warm'
            | 'qualified'
            | 'appointment_booked'
            | null;
          referral_source?: string | null;
          updated_at?: string | null;
          urgency_level?: 'low' | 'medium' | 'high' | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'leads_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      notifications: {
        Row: {
          created_at: string | null;
          id: string;
          message: string;
          time: string | null;
          title: string;
          unread: boolean | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          message: string;
          time?: string | null;
          title: string;
          unread?: boolean | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          message?: string;
          time?: string | null;
          title?: string;
          unread?: boolean | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'notifications_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      sales_cycles: {
        Row: {
          created_at: string | null;
          end_date: string;
          id: string;
          start_date: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          end_date: string;
          id?: string;
          start_date: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          end_date?: string;
          id?: string;
          start_date?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'sales_cycles_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      tasks: {
        Row: {
          created_at: string | null;
          description: string | null;
          due_date: string;
          estimated_duration: number | null;
          id: string;
          priority: 'low' | 'medium' | 'high' | 'urgent' | null;
          related_to_id: string | null;
          related_to_type: 'lead' | 'client' | 'deal' | null;
          status: 'pending' | 'completed' | null;
          time: string | null;
          title: string;
          type:
            | 'call'
            | 'meeting'
            | 'documentation'
            | 'verification'
            | 'follow_up'
            | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          due_date: string;
          estimated_duration?: number | null;
          id?: string;
          priority?: 'low' | 'medium' | 'high' | 'urgent' | null;
          related_to_id?: string | null;
          related_to_type?: 'lead' | 'client' | 'deal' | null;
          status?: 'pending' | 'completed' | null;
          time?: string | null;
          title: string;
          type?:
            | 'call'
            | 'meeting'
            | 'documentation'
            | 'verification'
            | 'follow_up'
            | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          due_date?: string;
          estimated_duration?: number | null;
          id?: string;
          priority?: 'low' | 'medium' | 'high' | 'urgent' | null;
          related_to_id?: string | null;
          related_to_type?: 'lead' | 'client' | 'deal' | null;
          status?: 'pending' | 'completed' | null;
          time?: string | null;
          title?: string;
          type?:
            | 'call'
            | 'meeting'
            | 'documentation'
            | 'verification'
            | 'follow_up'
            | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'tasks_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      user_preferences: {
        Row: {
          created_at: string | null;
          email_notifications: boolean | null;
          id: string;
          mobile_sync: boolean | null;
          push_notifications: boolean | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          email_notifications?: boolean | null;
          id?: string;
          mobile_sync?: boolean | null;
          push_notifications?: boolean | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          email_notifications?: boolean | null;
          id?: string;
          mobile_sync?: boolean | null;
          push_notifications?: boolean | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_preferences_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      user_profiles: {
        Row: {
          bio: string | null;
          company_name: string | null;
          created_at: string | null;
          designation: string | null;
          email: string | null;
          full_name: string;
          id: string;
          phone: string | null;
          photo_url: string | null;
          updated_at: string | null;
          whatsapp_number: string | null;
        };
        Insert: {
          bio?: string | null;
          company_name?: string | null;
          created_at?: string | null;
          designation?: string | null;
          email?: string | null;
          full_name: string;
          id: string;
          phone?: string | null;
          photo_url?: string | null;
          updated_at?: string | null;
          whatsapp_number?: string | null;
        };
        Update: {
          bio?: string | null;
          company_name?: string | null;
          created_at?: string | null;
          designation?: string | null;
          email?: string | null;
          full_name?: string;
          id?: string;
          phone?: string | null;
          photo_url?: string | null;
          updated_at?: string | null;
          whatsapp_number?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'user_profiles_id_fkey';
            columns: ['id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      update_updated_at_column: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Lead = Database['public']['Tables']['leads']['Row'];
export type Client = Database['public']['Tables']['clients']['Row'];
export type Deal = Database['public']['Tables']['deals']['Row'];
export type Task = Database['public']['Tables']['tasks']['Row'];

// A simple interface for the BeforeInstallPromptEvent
export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}
