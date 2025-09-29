// src/types/auth.ts
import type { Timestamp } from 'firebase/firestore'

export interface UserProfile {
    id: string
    email: string
    displayName: string
    photoURL?: string | null
    phoneNumber?: string | null

    profile: {
        fullName: string
        position?: string | null
        whatsapp?: string | null
    }

    organizations: {
        [orgId: string]: {
            role: 'owner' | 'admin' | 'manager' | 'staff' | 'accountant' | 'viewer'
            joinedAt: Timestamp | Date
            status: 'active' | 'invited' | 'suspended'
            invitedBy?: string
        }
    }

    createdAt: Timestamp | Date
    lastLoginAt: Timestamp | Date
}

export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterData {
    email: string
    password: string
    displayName: string
}