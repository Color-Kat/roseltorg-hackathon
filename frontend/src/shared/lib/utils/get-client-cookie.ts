/**
 * Get cookie by name on the client side from document.cookie.
 * @param name
 */
export function getClientCookie(name: string): string | undefined {
    if (typeof window === 'undefined') return undefined

    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)

    if (parts.length === 2) {
        return parts.pop()?.split(';').shift()
    }

    return undefined
}