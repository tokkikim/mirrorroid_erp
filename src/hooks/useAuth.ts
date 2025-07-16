import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { 
  signIn, 
  signUp, 
  signOut, 
  getCurrentUser,
  updateProfile,
  changePassword,
  sendPasswordResetEmail,
  checkUserRole,
  type User,
  type SignInData,
  type SignUpData,
  type UserUpdate
} from '@/lib/api/auth'
import { QUERY_KEYS } from '@/lib/react-query'
import { supabase } from '@/lib/supabase'

interface AuthState {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false,
  })
  
  const queryClient = useQueryClient()
  const router = useRouter()

  // 현재 사용자 조회
  const {
    data: user,
    isLoading,
    error,
    refetch: refetchUser,
  } = useQuery({
    queryKey: QUERY_KEYS.auth.user,
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5분
  })

  // 로그인 뮤테이션
  const signInMutation = useMutation({
    mutationFn: (data: SignInData) => signIn(data),
    onSuccess: (data) => {
      setAuthState({
        user: data.user,
        loading: false,
        isAuthenticated: true,
      })
      queryClient.setQueryData(QUERY_KEYS.auth.user, data.user)
      toast.success('로그인되었습니다.')
      router.push('/')
    },
    onError: (error: any) => {
      toast.error(error.message || '로그인에 실패했습니다.')
      setAuthState(prev => ({
        ...prev,
        loading: false,
        isAuthenticated: false,
      }))
    },
  })

  // 회원가입 뮤테이션
  const signUpMutation = useMutation({
    mutationFn: (data: SignUpData) => signUp(data),
    onSuccess: (data) => {
      setAuthState({
        user: data.user,
        loading: false,
        isAuthenticated: true,
      })
      queryClient.setQueryData(QUERY_KEYS.auth.user, data.user)
      toast.success('회원가입이 완료되었습니다.')
      router.push('/')
    },
    onError: (error: any) => {
      toast.error(error.message || '회원가입에 실패했습니다.')
    },
  })

  // 로그아웃 뮤테이션
  const signOutMutation = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      setAuthState({
        user: null,
        loading: false,
        isAuthenticated: false,
      })
      queryClient.clear()
      toast.success('로그아웃되었습니다.')
      router.push('/login')
    },
    onError: (error: any) => {
      toast.error(error.message || '로그아웃에 실패했습니다.')
    },
  })

  // 프로필 업데이트 뮤테이션
  const updateProfileMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UserUpdate }) => 
      updateProfile(id, updates),
    onSuccess: (updatedUser) => {
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }))
      queryClient.setQueryData(QUERY_KEYS.auth.user, updatedUser)
      toast.success('프로필이 업데이트되었습니다.')
    },
    onError: (error: any) => {
      toast.error(error.message || '프로필 업데이트에 실패했습니다.')
    },
  })

  // 비밀번호 변경 뮤테이션
  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success('비밀번호가 변경되었습니다.')
    },
    onError: (error: any) => {
      toast.error(error.message || '비밀번호 변경에 실패했습니다.')
    },
  })

  // 비밀번호 재설정 이메일 발송 뮤테이션
  const sendPasswordResetMutation = useMutation({
    mutationFn: sendPasswordResetEmail,
    onSuccess: () => {
      toast.success('비밀번호 재설정 이메일이 발송되었습니다.')
    },
    onError: (error: any) => {
      toast.error(error.message || '이메일 발송에 실패했습니다.')
    },
  })

  // 사용자 역할 확인
  const checkRole = async (requiredRole: 'admin' | 'staff' | 'accounting'): Promise<boolean> => {
    if (!user?.id) return false
    
    try {
      return await checkUserRole(user.id, requiredRole)
    } catch (error) {
      console.error('Role check error:', error)
      return false
    }
  }

  // 권한 확인 유틸리티
  const hasPermission = (requiredRole: 'admin' | 'staff' | 'accounting'): boolean => {
    if (!user) return false
    
    switch (requiredRole) {
      case 'admin':
        return user.role === 'admin'
      case 'accounting':
        return user.role === 'admin' || user.role === 'accounting'
      case 'staff':
        return user.role === 'admin' || user.role === 'accounting' || user.role === 'staff'
      default:
        return false
    }
  }

  // 관리자 여부 확인
  const isAdmin = (): boolean => {
    return user?.role === 'admin'
  }

  // 회계 권한 확인
  const hasAccountingPermission = (): boolean => {
    return user?.role === 'admin' || user?.role === 'accounting'
  }

  // 직원 권한 확인
  const hasStaffPermission = (): boolean => {
    return user?.role === 'admin' || user?.role === 'accounting' || user?.role === 'staff'
  }

  // 인증 상태 업데이트
  useEffect(() => {
    if (user) {
      setAuthState({
        user,
        loading: false,
        isAuthenticated: true,
      })
    } else if (!isLoading) {
      setAuthState({
        user: null,
        loading: false,
        isAuthenticated: false,
      })
    }
  }, [user, isLoading])

  // Supabase 세션 변경 리스너
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          // 사용자 정보 다시 가져오기
          refetchUser()
        } else if (event === 'SIGNED_OUT') {
          setAuthState({
            user: null,
            loading: false,
            isAuthenticated: false,
          })
          queryClient.clear()
        } else if (event === 'TOKEN_REFRESHED') {
          // 토큰 갱신 시 사용자 정보 다시 가져오기
          refetchUser()
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [refetchUser, queryClient])

  return {
    // 상태
    user: authState.user,
    loading: authState.loading || isLoading,
    isAuthenticated: authState.isAuthenticated,
    error,

    // 액션
    signIn: signInMutation.mutate,
    signUp: signUpMutation.mutate,
    signOut: signOutMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    changePassword: changePasswordMutation.mutate,
    sendPasswordReset: sendPasswordResetMutation.mutate,
    refetchUser,

    // 권한 확인
    checkRole,
    hasPermission,
    isAdmin,
    hasAccountingPermission,
    hasStaffPermission,

    // 로딩 상태
    isSigningIn: signInMutation.isPending,
    isSigningUp: signUpMutation.isPending,
    isSigningOut: signOutMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,
    isSendingPasswordReset: sendPasswordResetMutation.isPending,
  }
}

// 인증이 필요한 컴포넌트를 위한 HOC
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: 'admin' | 'staff' | 'accounting'
) => {
  return function AuthenticatedComponent(props: P) {
    const { user, loading, isAuthenticated, hasPermission } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!loading) {
        if (!isAuthenticated) {
          router.push('/login')
          return
        }

        if (requiredRole && !hasPermission(requiredRole)) {
          toast.error('접근 권한이 없습니다.')
          router.push('/')
          return
        }
      }
    }, [loading, isAuthenticated, hasPermission, router])

    if (loading) {
      return null // 로딩 중일 때는 null 반환
    }

    if (!isAuthenticated) {
      return null
    }

    if (requiredRole && !hasPermission(requiredRole)) {
      return null // 권한이 없을 때는 null 반환
    }

    return React.createElement(Component, props)
  }
}

export default useAuth