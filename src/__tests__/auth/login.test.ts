// __tests__/auth/login.test.ts
// Tests for login functionality

import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('Login System', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear()
        // Clear all mocks
        vi.clearAllMocks()
    })

    describe('Email/Password Login', () => {
        it('should successfully login with valid credentials', async () => {
            const mockUser = {
                id: 'user-123',
                email: 'test@example.com',
                full_name: 'Test User'
            }

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'test@example.com',
                    password: 'ValidPassword123!'
                })
            })

            expect(response.ok).toBe(true)
            const data = await response.json()
            expect(data.user).toBeDefined()
            expect(data.user.email).toBe('test@example.com')
        })

        it('should reject login with invalid email format', async () => {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'invalid-email',
                    password: 'ValidPassword123!'
                })
            })

            expect(response.ok).toBe(false)
            expect(response.status).toBe(400)
        })

        it('should reject login with wrong password', async () => {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'test@example.com',
                    password: 'WrongPassword123!'
                })
            })

            expect(response.ok).toBe(false)
            expect(response.status).toBe(401)
        })

        it('should reject login with missing password', async () => {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'test@example.com'
                })
            })

            expect(response.ok).toBe(false)
            expect(response.status).toBe(400)
        })

        it('should reject login with missing email', async () => {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password: 'ValidPassword123!'
                })
            })

            expect(response.ok).toBe(false)
            expect(response.status).toBe(400)
        })
    })

    describe('Session Management', () => {
        it('should create a session that lasts 1 day', async () => {
            const loginResponse = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'test@example.com',
                    password: 'ValidPassword123!'
                })
            })

            expect(loginResponse.ok).toBe(true)

            // Check cookie maxAge
            const setCookieHeader = loginResponse.headers.get('set-cookie')
            expect(setCookieHeader).toContain('Max-Age=86400') // 1 day in seconds
        })

        it('should persist session after page reload', async () => {
            // Login
            await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'test@example.com',
                    password: 'ValidPassword123!'
                })
            })

            // Simulate page reload by checking if session is still valid
            const sessionCheck = await fetch('/api/auth/session', {
                credentials: 'include'
            })

            expect(sessionCheck.ok).toBe(true)
            const sessionData = await sessionCheck.json()
            expect(sessionData.user).toBeDefined()
        })

        it('should invalidate session after logout', async () => {
            // Login first
            await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'test@example.com',
                    password: 'ValidPassword123!'
                })
            })

            // Logout
            const logoutResponse = await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            })

            expect(logoutResponse.ok).toBe(true)

            // Check session is gone
            const sessionCheck = await fetch('/api/auth/session', {
                credentials: 'include'
            })

            expect(sessionCheck.status).toBe(401)
        })
    })

    describe('Security', () => {
        it('should use httpOnly cookies', async () => {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'test@example.com',
                    password: 'ValidPassword123!'
                })
            })

            const setCookieHeader = response.headers.get('set-cookie')
            expect(setCookieHeader).toContain('HttpOnly')
        })

        it('should use secure cookies in production', async () => {
            // Mock production environment
            const originalEnv = process.env.NODE_ENV
            process.env.NODE_ENV = 'production'

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'test@example.com',
                    password: 'ValidPassword123!'
                })
            })

            const setCookieHeader = response.headers.get('set-cookie')
            expect(setCookieHeader).toContain('Secure')

            // Restore environment
            process.env.NODE_ENV = originalEnv
        })

        it('should use SameSite=Lax for CSRF protection', async () => {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'test@example.com',
                    password: 'ValidPassword123!'
                })
            })

            const setCookieHeader = response.headers.get('set-cookie')
            expect(setCookieHeader).toContain('SameSite=Lax')
        })

        it('should rate limit login attempts', async () => {
            const attempts = []

            // Try to login 10 times rapidly
            for (let i = 0; i < 10; i++) {
                attempts.push(
                    fetch('/api/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: 'test@example.com',
                            password: 'WrongPassword'
                        })
                    })
                )
            }

            const responses = await Promise.all(attempts)
            const lastResponse = responses[responses.length - 1]

            // Should be rate limited
            expect(lastResponse.status).toBe(429)
        })
    })

    describe('OAuth Login', () => {
        it('should redirect to Google OAuth', async () => {
            const response = await fetch('/api/auth/oauth/google', {
                redirect: 'manual'
            })

            expect(response.status).toBe(302)
            expect(response.headers.get('location')).toContain('accounts.google.com')
        })

        it('should handle OAuth callback correctly', async () => {
            const response = await fetch('/api/auth/callback?code=test-oauth-code')

            expect(response.ok).toBe(true)
            const data = await response.json()
            expect(data.user).toBeDefined()
        })

        it('should reject invalid OAuth state', async () => {
            const response = await fetch('/api/auth/callback?code=test-code&state=invalid-state')

            expect(response.ok).toBe(false)
            expect(response.status).toBe(400)
        })
    })

    describe('Password Reset', () => {
        it('should send password reset email', async () => {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'test@example.com'
                })
            })

            expect(response.ok).toBe(true)
            const data = await response.json()
            expect(data.message).toContain('reset link sent')
        })

        it('should validate reset token', async () => {
            const response = await fetch('/api/auth/reset-password/verify?token=valid-token')

            expect(response.ok).toBe(true)
        })

        it('should reject expired reset token', async () => {
            const response = await fetch('/api/auth/reset-password/verify?token=expired-token')

            expect(response.ok).toBe(false)
            expect(response.status).toBe(400)
        })

        it('should update password with valid token', async () => {
            const response = await fetch('/api/auth/reset-password/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: 'valid-token',
                    password: 'NewPassword123!'
                })
            })

            expect(response.ok).toBe(true)
        })
    })
})
