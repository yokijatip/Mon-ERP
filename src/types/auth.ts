// src/types/auth.ts
export interface UserProfile {
    id: string
    email: string
    displayName: string
    photoURL: string | null
    phoneNumber: string | null
    profile: {
        fullName: string
        position: string | null
        whatsapp: string | null
    }
    organizations: {
        [orgId: string]: {
            role: 'owner' | 'admin' | 'member'
            joinedAt: Date
        }
    }
    createdAt: Date
    lastLoginAt: Date
}

export interface Organization {
    id: string
    name: string
    type: 'company' | 'cv' | 'individual' | 'nonprofit'
    address?: string
    currency: string
    taxRate: number
    fiscalYearStart: number
    ownerId: string
    members: {
        [userId: string]: {
            role: 'owner' | 'admin' | 'member'
            joinedAt: Date
        }
    }
    logo?: string
    createdAt: Date
    updatedAt: Date
}// src/types/auth.ts
export interface UserProfile {
    id: string
    email: string
    displayName: string
    photoURL: string | null
    phoneNumber: string | null
    profile: {
        fullName: string
        position: string | null
        whatsapp: string | null
    }
    organizations: {
        [orgId: string]: {
            role: 'owner' | 'admin' | 'member'
            joinedAt: Date
        }
    }
    createdAt: Date
    lastLoginAt: Date
}

export interface Organization {
    id: string
    name: string
    type: 'company' | 'cv' | 'individual' | 'nonprofit'
    address?: string
    currency: string
    taxRate: number
    fiscalYearStart: number
    ownerId: string
    members: {
        [userId: string]: {
            role: 'owner' | 'admin' | 'member'
            joinedAt: Date
        }
    }
    logo?: string
    createdAt: Date
    updatedAt: Date
}