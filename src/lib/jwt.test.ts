import { describe, it, expect } from 'vitest'
import { signJWT, verifyJWT, JWTPayload } from './jwt'

describe('JWT Auth', () => {
    const mockPayload: JWTPayload = {
        id: '123',
        email: 'test@example.com',
        role: 'customer'
    }

    it('should sign and verify a token', async () => {
        const token = await signJWT(mockPayload)
        expect(token).toBeDefined()
        expect(typeof token).toBe('string')
        expect(token.length).toBeGreaterThan(0)

        const verified = await verifyJWT(token)
        expect(verified).toBeDefined()
        expect(verified?.id).toBe(mockPayload.id)
        expect(verified?.email).toBe(mockPayload.email)
        expect(verified?.role).toBe(mockPayload.role)
    })

    it('should return null for invalid token', async () => {
        const verified = await verifyJWT('invalid-token')
        expect(verified).toBeNull()
    })

    // We can't easily test expiration without mocking time or waiting, 
    // but basic sign/verify proves the jose integration works.
})
