import type { ImageInfo } from './api'
import type { IdentityValue } from '@/identity'

export interface User {
  id: number
  name: string
  account: string | null
  email: string
  phone: string | null
  birthday: string | null
  gender_text: string
  gender: Gender
  first_login_at: string
  roles: any[]
  tax: string | null
  avatar: ImageInfo
  student_image_path: ImageInfo<string | null>
  lecturer_image_path: ImageInfo<string | null>
  job_image_path: ImageInfo<string | null>
  identity_at1: string | null
  identity1: string | null
  remark1: string
  status1: string
  identity_at2: string | null
  identity2: string | null
  remark2: string | null
  status2: string
  identity_at3: string | null
  identity3: string | null
  remark3: string | null
  status3: string | null
  store_id: number | null
  social_profile: SocialProfile
}

export interface SessionUser {
  id: number
  name: string
  email: string
  account: string | null
  avatar: ImageInfo
  identity_at1: string | null
  identity1: string | null
  identity_at2: string | null
  identity2: string | null
  identity_at3: string | null
  identity3: string | null
  store_id: number | null
  social_profile_name: string | null
}

export interface SocialProfile {
  avatar: ImageInfo | null
  name: string | null
  description: string | null
  banners: Array<{
    id: number
    image: ImageInfo
  }>
}

export enum Gender {
  Male = 0,
  Female = 1,
  Other = 2,
}

export interface UserToken {
  token: string
  token_type: string
  expired_at: string
  refresh_expired_at: string
}

export interface IRegisterFormData {
  identity: IdentityValue
  email: string
  password: string
  password_confirmation: string
  code: string
  referral_code?: string
}
