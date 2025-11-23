import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export interface AdminUser {
    username: string
}

/**
 * Verifica las credenciales del administrador
 */
export async function verifyCredentials(username: string, password: string): Promise<boolean> {
    if (username !== ADMIN_USERNAME) {
        return false
    }

    // En producción, la contraseña debería estar hasheada en la BD
    // Por ahora comparamos directamente
    return password === ADMIN_PASSWORD
}

/**
 * Crea un token JWT para el usuario admin
 */
export function createToken(user: AdminUser): string {
    return jwt.sign(
        { username: user.username },
        JWT_SECRET,
        { expiresIn: '7d' } // Token válido por 7 días
    )
}

/**
 * Verifica y decodifica un token JWT
 */
export function verifyToken(token: string): AdminUser | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as AdminUser
        return decoded
    } catch (error) {
        return null
    }
}

/**
 * Hashea una contraseña (útil para futuras mejoras)
 */
export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}

/**
 * Compara una contraseña con su hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
}
