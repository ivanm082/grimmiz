import { verifyCredentials, createToken, verifyToken, hashPassword, comparePassword } from '../auth'

// Usaremos las variables de entorno actuales para los tests
// En un entorno real, estos valores se configurarían en .env.test

describe('auth', () => {
  describe('verifyCredentials', () => {
    // Usamos credenciales que sabemos que existen o no
    // El entorno de test usa las variables por defecto de auth.ts
    const validUsername = process.env.ADMIN_USERNAME || 'admin'
    const validPassword = process.env.ADMIN_PASSWORD || 'admin123'

    it('should return true for correct credentials', async () => {
      const result = await verifyCredentials(validUsername, validPassword)
      expect(result).toBe(true)
    })

    it('should return false for incorrect username', async () => {
      const result = await verifyCredentials('wronguser', validPassword)
      expect(result).toBe(false)
    })

    it('should return false for incorrect password', async () => {
      const result = await verifyCredentials(validUsername, 'wrongpassword')
      expect(result).toBe(false)
    })

    it('should return false for empty username', async () => {
      const result = await verifyCredentials('', validPassword)
      expect(result).toBe(false)
    })

    it('should return false for empty password', async () => {
      const result = await verifyCredentials(validUsername, '')
      expect(result).toBe(false)
    })

    it('should be case sensitive for username', async () => {
      const result = await verifyCredentials(validUsername.toUpperCase(), validPassword)
      expect(result).toBe(false)
    })

    it('should be case sensitive for password', async () => {
      const result = await verifyCredentials(validUsername, validPassword.toUpperCase())
      expect(result).toBe(false)
    })
  })

  describe('createToken', () => {
    it('should create a valid JWT token', () => {
      const user = { username: 'testadmin' }
      const token = createToken(user)
      
      expect(token).toBeTruthy()
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3) // JWT tiene 3 partes separadas por puntos
    })

    it('should create tokens with proper structure', () => {
      const user = { username: 'testadmin' }
      const token = createToken(user)
      
      // Verificar que el token tiene la estructura correcta de JWT
      const parts = token.split('.')
      expect(parts).toHaveLength(3)
      expect(parts[0]).toBeTruthy() // header
      expect(parts[1]).toBeTruthy() // payload
      expect(parts[2]).toBeTruthy() // signature
    })

    it('should include username in token payload', () => {
      const user = { username: 'testadmin' }
      const token = createToken(user)
      const decoded = verifyToken(token)
      
      expect(decoded).toBeTruthy()
      expect(decoded?.username).toBe('testadmin')
    })
  })

  describe('verifyToken', () => {
    it('should verify and decode a valid token', () => {
      const user = { username: 'testadmin' }
      const token = createToken(user)
      const decoded = verifyToken(token)
      
      expect(decoded).not.toBeNull()
      expect(decoded?.username).toBe('testadmin')
    })

    it('should return null for invalid token', () => {
      const result = verifyToken('invalid.token.here')
      expect(result).toBeNull()
    })

    it('should return null for malformed token', () => {
      const result = verifyToken('notavalidtoken')
      expect(result).toBeNull()
    })

    it('should return null for empty token', () => {
      const result = verifyToken('')
      expect(result).toBeNull()
    })

    it('should return null for token signed with different secret', () => {
      const jwt = require('jsonwebtoken')
      const tokenWithDifferentSecret = jwt.sign(
        { username: 'testadmin' },
        'different-secret',
        { expiresIn: '7d' }
      )
      
      const result = verifyToken(tokenWithDifferentSecret)
      expect(result).toBeNull()
    })

    it('should return null for expired token', () => {
      const jwt = require('jsonwebtoken')
      const expiredToken = jwt.sign(
        { username: 'testadmin' },
        'test-secret-key',
        { expiresIn: '-1d' } // Token que expiró hace 1 día
      )
      
      const result = verifyToken(expiredToken)
      expect(result).toBeNull()
    })

    it('should verify token created by createToken', () => {
      const user = { username: 'admin123' }
      const token = createToken(user)
      const decoded = verifyToken(token)
      
      expect(decoded).toEqual(expect.objectContaining({ username: 'admin123' }))
    })
  })

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'mySecurePassword123'
      const hash = await hashPassword(password)
      
      expect(hash).toBeTruthy()
      expect(hash).not.toBe(password)
      expect(hash.length).toBeGreaterThan(20) // Los hashes de bcrypt son largos
    })

    it('should create different hashes for same password', async () => {
      const password = 'mySecurePassword123'
      const hash1 = await hashPassword(password)
      const hash2 = await hashPassword(password)
      
      expect(hash1).not.toBe(hash2) // Bcrypt usa salt aleatorio
    })

    it('should hash empty password', async () => {
      const hash = await hashPassword('')
      expect(hash).toBeTruthy()
    })

    it('should handle special characters', async () => {
      const password = '!@#$%^&*()_+-=[]{}|;:,.<>?'
      const hash = await hashPassword(password)
      
      expect(hash).toBeTruthy()
      expect(hash).not.toBe(password)
    })

    it('should handle long passwords', async () => {
      const password = 'a'.repeat(100)
      const hash = await hashPassword(password)
      
      expect(hash).toBeTruthy()
    })
  })

  describe('comparePassword', () => {
    it('should return true for matching password and hash', async () => {
      const password = 'mySecurePassword123'
      const hash = await hashPassword(password)
      const result = await comparePassword(password, hash)
      
      expect(result).toBe(true)
    })

    it('should return false for non-matching password', async () => {
      const password = 'mySecurePassword123'
      const wrongPassword = 'wrongPassword456'
      const hash = await hashPassword(password)
      const result = await comparePassword(wrongPassword, hash)
      
      expect(result).toBe(false)
    })

    it('should return false for empty password against valid hash', async () => {
      const password = 'mySecurePassword123'
      const hash = await hashPassword(password)
      const result = await comparePassword('', hash)
      
      expect(result).toBe(false)
    })

    it('should be case sensitive', async () => {
      const password = 'MyPassword'
      const hash = await hashPassword(password)
      const result = await comparePassword('mypassword', hash)
      
      expect(result).toBe(false)
    })

    it('should handle special characters correctly', async () => {
      const password = 'P@ssw0rd!#$%'
      const hash = await hashPassword(password)
      const result = await comparePassword('P@ssw0rd!#$%', hash)
      
      expect(result).toBe(true)
    })

    it('should return false for invalid hash format', async () => {
      const result = await comparePassword('password', 'not-a-valid-hash')
      expect(result).toBe(false)
    })
  })

  describe('integration tests', () => {
    it('should complete full authentication flow', async () => {
      const validUsername = process.env.ADMIN_USERNAME || 'admin'
      const validPassword = process.env.ADMIN_PASSWORD || 'admin123'
      
      // 1. Verificar credenciales
      const isValid = await verifyCredentials(validUsername, validPassword)
      expect(isValid).toBe(true)
      
      // 2. Crear token
      const user = { username: validUsername }
      const token = createToken(user)
      expect(token).toBeTruthy()
      
      // 3. Verificar token
      const decoded = verifyToken(token)
      expect(decoded).not.toBeNull()
      expect(decoded?.username).toBe(validUsername)
    })

    it('should handle password hashing and verification flow', async () => {
      const password = 'userPassword123'
      
      // Hash the password
      const hash = await hashPassword(password)
      expect(hash).toBeTruthy()
      
      // Verify correct password
      const isMatch = await comparePassword(password, hash)
      expect(isMatch).toBe(true)
      
      // Verify incorrect password
      const isNotMatch = await comparePassword('wrongPassword', hash)
      expect(isNotMatch).toBe(false)
    })
  })
})

