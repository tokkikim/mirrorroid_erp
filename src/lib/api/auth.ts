import { supabase, handleSupabaseError } from '@/lib/supabase'
import { Database } from '@/types/database'

export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export interface AuthResponse {
  user: User | null
  session: any
}

export interface SignUpData {
  email: string
  password: string
  name: string
  role?: 'admin' | 'staff' | 'accounting'
  business_number?: string
  phone?: string
}

export interface SignInData {
  email: string
  password: string
}

// 회원가입
export const signUp = async (data: SignUpData): Promise<AuthResponse> => {
  try {
    const { email, password, name, role = 'staff', business_number, phone } = data

    // Supabase Auth로 사용자 생성
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) throw authError

    if (!authData.user) {
      throw new Error('사용자 생성에 실패했습니다.')
    }

    // users 테이블에 추가 정보 저장
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        name,
        role,
        business_number,
        phone,
      })
      .select()
      .single()

    if (userError) throw userError

    return {
      user: userData,
      session: authData.session,
    }
  } catch (error) {
    throw handleSupabaseError(error)
  }
}

// 로그인
export const signIn = async (data: SignInData): Promise<AuthResponse> => {
  try {
    const { email, password } = data

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) throw authError

    if (!authData.user) {
      throw new Error('로그인에 실패했습니다.')
    }

    // users 테이블에서 사용자 정보 가져오기
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (userError) throw userError

    return {
      user: userData,
      session: authData.session,
    }
  } catch (error) {
    throw handleSupabaseError(error)
  }
}

// 로그아웃
export const signOut = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    throw handleSupabaseError(error)
  }
}

// 현재 사용자 정보 가져오기
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) throw authError
    if (!user) return null

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (userError) throw userError

    return userData
  } catch (error) {
    throw handleSupabaseError(error)
  }
}

// 사용자 프로필 업데이트
export const updateProfile = async (id: string, updates: UserUpdate): Promise<User> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return data
  } catch (error) {
    throw handleSupabaseError(error)
  }
}

// 비밀번호 변경
export const changePassword = async (newPassword: string): Promise<void> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) throw error
  } catch (error) {
    throw handleSupabaseError(error)
  }
}

// 비밀번호 재설정 이메일 발송
export const sendPasswordResetEmail = async (email: string): Promise<void> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) throw error
  } catch (error) {
    throw handleSupabaseError(error)
  }
}

// 세션 새로고침
export const refreshSession = async (): Promise<AuthResponse> => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.refreshSession()
    
    if (sessionError) throw sessionError
    if (!session?.user) throw new Error('세션을 찾을 수 없습니다.')

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (userError) throw userError

    return {
      user: userData,
      session,
    }
  } catch (error) {
    throw handleSupabaseError(error)
  }
}

// 사용자 역할 확인
export const checkUserRole = async (userId: string, requiredRole: 'admin' | 'staff' | 'accounting'): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()

    if (error) throw error

    if (requiredRole === 'admin') {
      return data.role === 'admin'
    } else if (requiredRole === 'accounting') {
      return data.role === 'admin' || data.role === 'accounting'
    } else {
      return data.role === 'admin' || data.role === 'accounting' || data.role === 'staff'
    }
  } catch (error) {
    throw handleSupabaseError(error)
  }
}