export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      distribuicao_regioes: {
        Row: {
          created_at: string | null
          distribuicao_id: string
          id: string
          regiao_nome: string
        }
        Insert: {
          created_at?: string | null
          distribuicao_id: string
          id?: string
          regiao_nome: string
        }
        Update: {
          created_at?: string | null
          distribuicao_id?: string
          id?: string
          regiao_nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "distribuicao_regioes_distribuicao_id_fkey"
            columns: ["distribuicao_id"]
            isOneToOne: false
            referencedRelation: "distribuicoes"
            referencedColumns: ["id"]
          },
        ]
      }
      distribuicoes: {
        Row: {
          created_at: string | null
          data_distribuicao: string
          distribuidor_id: string
          id: string
          lote_id: string
          observacoes: string | null
          quantidade_distribuida: number
          responsavel_distribuicao: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_distribuicao: string
          distribuidor_id: string
          id?: string
          lote_id: string
          observacoes?: string | null
          quantidade_distribuida: number
          responsavel_distribuicao: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_distribuicao?: string
          distribuidor_id?: string
          id?: string
          lote_id?: string
          observacoes?: string | null
          quantidade_distribuida?: number
          responsavel_distribuicao?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "distribuicoes_distribuidor_id_fkey"
            columns: ["distribuidor_id"]
            isOneToOne: false
            referencedRelation: "distribuidores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "distribuicoes_lote_id_fkey"
            columns: ["lote_id"]
            isOneToOne: false
            referencedRelation: "lotes_producao"
            referencedColumns: ["id"]
          },
        ]
      }
      distribuidores: {
        Row: {
          cnpj: string | null
          created_at: string | null
          email: string | null
          endereco: string | null
          id: string
          nome: string
          responsavel: string | null
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          cnpj?: string | null
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          id?: string
          nome: string
          responsavel?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          cnpj?: string | null
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          id?: string
          nome?: string
          responsavel?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      lote_itens: {
        Row: {
          created_at: string
          id: string
          lote_id: string
          produto_id: string
          quantidade_produzida: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          lote_id: string
          produto_id: string
          quantidade_produzida: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          lote_id?: string
          produto_id?: string
          quantidade_produzida?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_lote_itens_lote"
            columns: ["lote_id"]
            isOneToOne: false
            referencedRelation: "lotes_producao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_lote_itens_produto"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      lotes_producao: {
        Row: {
          codigo_lote: string
          created_at: string | null
          data_producao: string
          data_validade: string
          id: string
          nota_fiscal: string | null
          observacoes: string | null
          responsavel: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          codigo_lote: string
          created_at?: string | null
          data_producao: string
          data_validade: string
          id?: string
          nota_fiscal?: string | null
          observacoes?: string | null
          responsavel: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          codigo_lote?: string
          created_at?: string | null
          data_producao?: string
          data_validade?: string
          id?: string
          nota_fiscal?: string | null
          observacoes?: string | null
          responsavel?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      pontos_venda: {
        Row: {
          created_at: string | null
          distribuidor_id: string
          endereco: string
          id: string
          nome: string
          responsavel: string | null
          telefone: string | null
          tipo: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          distribuidor_id: string
          endereco: string
          id?: string
          nome: string
          responsavel?: string | null
          telefone?: string | null
          tipo?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          distribuidor_id?: string
          endereco?: string
          id?: string
          nome?: string
          responsavel?: string | null
          telefone?: string | null
          tipo?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pontos_venda_distribuidor_id_fkey"
            columns: ["distribuidor_id"]
            isOneToOne: false
            referencedRelation: "distribuidores"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          created_at: string | null
          id: string
          nome: string
          sabor: string | null
          tipo: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          nome: string
          sabor?: string | null
          tipo: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          nome?: string
          sabor?: string | null
          tipo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          nome: string | null
          tipo_usuario: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          nome?: string | null
          tipo_usuario: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          nome?: string | null
          tipo_usuario?: string
        }
        Relationships: []
      }
      regioes_entrega: {
        Row: {
          created_at: string | null
          estado: string | null
          id: string
          nome: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          estado?: string | null
          id?: string
          nome: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          estado?: string | null
          id?: string
          nome?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sign_up_invitations: {
        Row: {
          code: string
          consumed: boolean
          consumed_at: string | null
          created_at: string | null
          email: string
          id: string
          tipo_usuario: string
        }
        Insert: {
          code?: string
          consumed?: boolean
          consumed_at?: string | null
          created_at?: string | null
          email: string
          id?: string
          tipo_usuario?: string
        }
        Update: {
          code?: string
          consumed?: boolean
          consumed_at?: string | null
          created_at?: string | null
          email?: string
          id?: string
          tipo_usuario?: string
        }
        Relationships: []
      }
      vendas_pdv: {
        Row: {
          created_at: string | null
          data_venda: string
          distribuicao_id: string
          id: string
          observacoes: string | null
          ponto_venda_id: string
          preco_venda: number | null
          quantidade_vendida: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_venda: string
          distribuicao_id: string
          id?: string
          observacoes?: string | null
          ponto_venda_id: string
          preco_venda?: number | null
          quantidade_vendida: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_venda?: string
          distribuicao_id?: string
          id?: string
          observacoes?: string | null
          ponto_venda_id?: string
          preco_venda?: number | null
          quantidade_vendida?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendas_pdv_distribuicao_id_fkey"
            columns: ["distribuicao_id"]
            isOneToOne: false
            referencedRelation: "distribuicoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendas_pdv_ponto_venda_id_fkey"
            columns: ["ponto_venda_id"]
            isOneToOne: false
            referencedRelation: "pontos_venda"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
