import type { RolEnum } from "../interfaces/RolEnum"

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

type AuthHandlers = {
  getAccessToken: () => string | null
  getRefreshToken: () => string | null
  setTokens: (args: {
    accessToken: string
    refreshToken: string | null
    activeRole: RolEnum
  }) => void
  logout: () => void
}

let authHandlers: AuthHandlers | null = null

export function initAuthHandlers(handlers: AuthHandlers) {
  authHandlers = handlers
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  ''

function normalizeUrl(path: string) {
  if (API_BASE_URL.endsWith('/') && path.startsWith('/')) {
    return `${API_BASE_URL.slice(0, -1)}${path}`
  }
  return `${API_BASE_URL}${path}`
}

async function readErrorMessage(res: Response) {
  const contentType = res.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    const data = (await res.json().catch(() => null)) as unknown
    if (
      data &&
      typeof data === 'object' &&
      'message' in data &&
      typeof (data as { message?: unknown }).message === 'string'
    ) {
      return (data as { message: string }).message
    }
  }

  const text = await res.text().catch(() => '')
  if (text) return text
  return res.statusText || 'Request failed'
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit & { auth?: boolean; retry?: boolean } = {},
): Promise<T> {
  const { auth = true, retry = false, headers, ...rest } = init;
  const nextHeaders = new Headers(headers);

  if (!nextHeaders.has('content-type') && rest.body) {
    nextHeaders.set('content-type', 'application/json');
  }

  if (auth && authHandlers) {
    const accessToken = authHandlers.getAccessToken();
    if (accessToken) {
      nextHeaders.set('authorization', `Bearer ${accessToken}`);
    }
  }

  let res: Response;
  try {
    res = await fetch(normalizeUrl(path), { ...rest, headers: nextHeaders });
  } catch (err) {
    // Si entra aquí, es un error de red o CORS. No hay status 401 disponible.
    console.error("Network/CORS error:", err);
    throw new ApiError(0, "No se pudo conectar con el servidor");
  }

  if (res.status === 401 && auth && !retry && authHandlers) {
    const refreshToken = authHandlers.getRefreshToken();
    
    if (refreshToken) {
      try {
        const refreshRes = await fetch(normalizeUrl('/api/v1/auth/refresh-token'), {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshRes.ok) {
          const refreshed = await refreshRes.json();
          authHandlers.setTokens({
            accessToken: refreshed.accessToken,
            refreshToken: refreshed.refreshToken,
            activeRole: refreshed.activeRole,
          });

          // Reintentar la petición original con el nuevo token
          return apiRequest<T>(path, { ...init, retry: true });
        }
      } catch (refreshErr) {
        console.error("Error intentando refrescar token", refreshErr);
      }
      
      // Si el refresh falla o no es ok, deslogueamos
      authHandlers.logout();
    }
  }

  if (!res.ok) {
    const message = await readErrorMessage(res);
    throw new ApiError(res.status, message);
  }

  // Si todo está bien, parsear JSON o texto
  const contentType = res.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return (await res.json()) as T;
  }

  return (await res.text()) as unknown as T;
}
