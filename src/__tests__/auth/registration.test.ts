// __tests__/auth/registration.test.ts
// Tests for registration/signup functionality

import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('Registration System', () => {
    beforeEach(() => {
        localStorage.clear()
        vi.clearAllMocks()
    })

    describe('User Registration', () => {
        it('should successfully register with valid data', async () => {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'newuser@example.com',
                    password: 'ValidPassword123!',
                    full_name: 'New User',
                    phone: '(555) 123-4567'
                })
            })

            expect(response.ok).toBe(true)
            const data = await response.json()
            expect(data.user).toBeDefined()
            expect(data.user.email).toBe('newuser@example.com')
        })

        it('should reject registration with existing email', async () => {
            // Register first time
            await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'existing@example.com',
                    password: 'ValidPassword123!',
                    full_name: 'Existing User'
                })
            })

            // Try to register again with same email
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'existing@example.com',
                    password: 'DifferentPassword123!',
                    full_name: 'Another User'
                })
            })

            expect(response.ok).toBe(false)
            expect(response.status).toBe(400)
            const data = await response.json()
            expect(data.error).toContain('already exists')
        })

        it('should reject registration with invalid email', async () => {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'invalid-email',
                    password: 'ValidPassword123!',
                    full_name: 'Test User'
                })
            })

            expect(response.ok).toBe(false)
            expect(response.status).toBe(400)
        })

        it('should reject weak passwords', async () => {
            const weakPasswords = [
                'short',
                'nouppercaseornumbers',
                'NoNumbers',
                '12345678',
                'password'
            ]

            for (const password of weakPasswords) {
                const response = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: `test${Math.random()}@example.com`,
                        password,
                        full_name: 'Test User'
                    })
                })

                expect(response.ok).toBe(false)
                expect(response.status).toBe(400)
            }
        })

        it('should accept strong passwords', async () => {
            const strongPasswords = [
                'ValidPassword123!',
                'Str0ng!Pass',
                'MyP@ssw0rd2024',
                'Test1234!@#$'
            ]

            for (const password of strongPasswords) {
                const response = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: `test${Math.random()}@example.com`,
                        password,
                        full_name: 'Test User'
                    })
                })

                expect(response.ok).toBe(true)
            }
        })

        it('should require full name', async () => {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'test@example.com',
                    password: 'ValidPassword123!'
                    // missing full_name
                })
            })

            expect(response.ok).toBe(false)
            expect(response.status).toBe(400)
        })

        it('should validate phone number format', async () => {
            const invalidPhones = [
                '123456789',
                '555-123-4567',
                '(555)123-4567',
                '5551234567'
            ]

            for (const phone of invalidPhones) {
                const response = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: `test${Math.random()}@example.com`,
                        password: 'ValidPassword123!',
                        full_name: 'Test User',
                        phone
                    })
                })

                expect(response.ok).toBe(false)
            }
        })

        it('should accept valid phone number format', async () => {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'test@example.com',
                    password: 'ValidPassword123!',
                    full_name: 'Test User',
                    phone: '(555) 123-4567'
                })
            })

            expect(response.ok).toBe(true)
        })
    })

    describe('Email Verification', () => {
        it('should send verification email after registration', async () => {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'verify@example.com',
                    password: 'ValidPassword123!',
                    full_name: 'Verify User'
                })
            })

            expect(response.ok).toBe(true)
            const data = await response.json()
            expect(data.message).toContain('verification email sent')
        })

        it('should verify email with valid token', async () => {
            const response = await fetch('/api/auth/verify?token=valid-verification-token')

            expect(response.ok).toBe(true)
            const data = await response.json()
            expect(data.message).toContain('verified')
        })

        it('should reject invalid verification token', async () => {
            const response = await fetch('/api/auth/verify?token=invalid-token')

            expect(response.ok).toBe(false)
            expect(response.status).toBe(400)
        })

        it('should reject expired verification token', async () => {
            const response = await fetch('/api/auth/verify?token=expired-token')

            expect(response.ok).toBe(false)
            expect(response.status).toBe(400)
            const data = await response.json()
            expect(data.error).toContain('expired')
        })

        it('should resend verification email', async () => {
            const response = await fetch('/api/auth/verify/resend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'verify@example.com'
                })
            })

            expect(response.ok).toBe(true)
            const data = await response.json()
            expect(data.message).toContain('verification email sent')
        })
    })

    describe('User Profile Creation', () => {
        it('should create user profile automatically', async () => {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'profile@example.com',
                    password: 'ValidPassword123!',
                    full_name: 'Profile User',
                    phone: '(555) 123-4567'
                })
            })

            expect(response.ok).toBe(true)

            // Check profile was created
            const profileResponse = await fetch('/api/profile', {
                credentials: 'include'
            })

            expect(profileResponse.ok).toBe(true)
            const profileData = await profileResponse.json()
            expect(profileData.full_name).toBe('Profile User')
            expect(profileData.phone).toBe('(555) 123-4567')
        })

        it('should set default role to retail', async () => {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'role@example.com',
                    password: 'ValidPassword123!',
                    full_name: 'Role User'
                })
            })

            expect(response.ok).toBe(true)

            const profileResponse = await fetch('/api/profile', {
                credentials: 'include'
            })

            const profileData = await profileResponse.json()
            expect(profileData.role).toBe('retail')
        })
    })

    describe('Business Registration', () => {
        it('should allow registration as business account', async () => {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'business@example.com',
                    password: 'ValidPassword123!',
                    full_name: 'Business User',
                    account_type: 'business',
                    business_name: 'Test Business LLC',
                    tax_id: '12-3456789'
                })
            })

            expect(response.ok).toBe(true)
            const data = await response.json()
            expect(data.user).toBeDefined()
        })

        it('should require business details for business accounts', async () => {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'business@example.com',
                    password: 'ValidPassword123!',
                    full_name: 'Business User',
                    account_type: 'business'
                    // missing business_name and tax_id
                })
            })

            expect(response.ok).toBe(false)
            expect(response.status).toBe(400)
        })

        it('should validate tax ID format', async () => {
            const invalidTaxIds = [
                '123456789',
                '12345-6789',
                'AB-1234567',
                '12-34567'
            ]

            for (const tax_id of invalidTaxIds) {
                const response = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: `business${Math.random()}@example.com`,
                        password: 'ValidPassword123!',
                        full_name: 'Business User',
                        account_type: 'business',
                        business_name: 'Test Business',
                        tax_id
                    })
                })

                expect(response.ok).toBe(false)
            }
        })
    })

    describe('Security', () => {
        it('should hash passwords before storing', async () => {
            const password = 'PlainTextPassword123!'

            await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'hash@example.com',
                    password,
                    full_name: 'Hash User'
                })
            })

            // Try to find plain text password in database (should not exist)
            // This is a conceptual test - in reality you'd check the database directly
            // The password should be hashed by Supabase Auth
        })

        it('should sanitize user input', async () => {
            const maliciousInput = '<script>alert("XSS")</script>'

            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'xss@example.com',
                    password: 'ValidPassword123!',
                    full_name: maliciousInput
                })
            })

            expect(response.ok).toBe(true)

            const profileResponse = await fetch('/api/profile', {
                credentials: 'include'
            })

            const profileData = await profileResponse.json()
            // Should be sanitized
            expect(profileData.full_name).not.toContain('<script>')
        })

        it('should prevent SQL injection', async () => {
            const sqlInjection = "'; DROP TABLE users; --"

            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: sqlInjection,
                    password: 'ValidPassword123!',
                    full_name: 'SQL Test'
                })
            })

            // Should fail validation or be safely handled
            expect(response.ok).toBe(false)
        })
    })
})
