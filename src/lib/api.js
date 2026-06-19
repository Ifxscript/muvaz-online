const BASE_URL = import.meta.env.VITE_API_BASE_URL

// ── Token helpers ─────────────────────────────────────────────────────────────

export const getToken  = ()          => localStorage.getItem('muvaz_token')
export const setToken  = token       => localStorage.setItem('muvaz_token', token)
export const clearToken = ()         => localStorage.removeItem('muvaz_token')

// ── Core fetch wrapper ────────────────────────────────────────────────────────

async function request(method, path, body, isFormData = false) {
  const token = getToken()

  const headers = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (body && !isFormData) headers['Content-Type'] = 'application/json'

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  })

  // Token expired — but skip this for auth endpoints (login returns 401 for bad credentials)
  if (res.status === 401 && !path.startsWith('/auth/')) {
    clearToken()
    window.dispatchEvent(new Event('muvaz:unauthenticated'))
    throw new Error('Session expired. Please sign in again.')
  }

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message ?? `Request failed (${res.status})`)
  }

  return data
}

// ── HTTP methods ──────────────────────────────────────────────────────────────

export const api = {
  get:    path               => request('GET',    path),
  post:   (path, body)       => request('POST',   path, body),
  put:    (path, body)       => request('PUT',    path, body),
  patch:  (path, body)       => request('PATCH',  path, body),
  delete: path               => request('DELETE', path),
  upload: (path, formData)   => request('POST',   path, formData, true),
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export const recordVisit = () => request('GET', '/visit').catch(() => {})

export const authApi = {
  register:        body => api.post('/auth/register', body),
  login:           body => api.post('/auth/login', body),
  me:              ()   => api.get('/auth/me'),
  completeProfile: body => api.patch('/auth/me/profile', body),
}

// ── Listings ──────────────────────────────────────────────────────────────────

export const listingsApi = {
  getAll:       params => api.get(`/listings${buildQuery(params)}`),
  getOne:       id     => api.get(`/listings/${id}`),
  create:       body   => api.post('/listings', body),
  update:       (id, body) => api.patch(`/listings/${id}`, body),
  remove:       id     => api.delete(`/listings/${id}`),
  togglePause:  id     => api.patch(`/listings/${id}/pause`),
  toggleSave:   id     => api.post(`/listings/${id}/save`),
  mine:         ()     => api.get('/me/listings'),
  saved:        ()     => api.get('/me/saved'),
  uploadImage:  file   => {
    const fd = new FormData()
    fd.append('file', file)
    return api.upload('/listings/upload-image', fd)
  },
}

// ── Offers ────────────────────────────────────────────────────────────────────

export const offersApi = {
  make:          (listingId, body) => api.post(`/listings/${listingId}/offers`, body),
  forListing:    listingId         => api.get(`/listings/${listingId}/offers`),
  mine:          ()                => api.get('/me/offers'),
  accept:        offerId           => api.patch(`/offers/${offerId}/accept`),
  decline:       offerId           => api.patch(`/offers/${offerId}/decline`),
}

// ── Orders ────────────────────────────────────────────────────────────────────

export const ordersApi = {
  buy:       listingId => api.post(`/listings/${listingId}/buy`),
  myOrders:  ()        => api.get('/me/orders'),
  mySales:   ()        => api.get('/me/sales'),
  getOne:    id        => api.get(`/orders/${id}`),
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export const adminApi = {
  dashboard:       ()        => api.get('/admin/dashboard'),
  users:           ()        => api.get('/admin/users'),
  pendingListings: ()        => api.get('/admin/listings'),
  approve:         id        => api.patch(`/admin/listings/${id}/approve`),
  reject:          (id, body)=> api.patch(`/admin/listings/${id}/reject`, body),
  orders:          status    => api.get(`/admin/orders${status ? `?status=${status}` : ''}`),
  whatsappLink:    id        => api.get(`/admin/orders/${id}/whatsapp-link`),
  markPaymentSent: id        => api.patch(`/admin/orders/${id}/mark-payment-sent`),
  confirmPayment:  id        => api.patch(`/admin/orders/${id}/confirm-payment`),
  inspection:      id        => api.patch(`/admin/orders/${id}/inspection`),
  close:           id        => api.patch(`/admin/orders/${id}/close`),
  cancel:          id        => api.patch(`/admin/orders/${id}/cancel`),
}

// ── Response normalizers ──────────────────────────────────────────────────────

// Maps the backend ListingResponse shape to the frontend item shape
export function normalizeListing(raw) {
  return {
    id:                raw.id,
    title:             raw.title,
    description:       raw.description ?? '',
    price:             Number(raw.price),
    condition:         raw.condition,
    cat:               raw.category ?? '',
    category:          raw.category ?? '',
    images:            Array.isArray(raw.images) ? raw.images : [],
    status:            raw.status,
    ownerName:         raw.ownerName,
    ownerId:           raw.ownerId,
    size:              raw.size ?? '',
    createdAt:         raw.createdAt,
    likeCount:         raw.likeCount ?? 0,
    saved:             raw.savedByCurrentUser ?? false,
    offerCount:        raw.offerCount ?? 0,
    region:            '',
  }
}

// ── Utility ───────────────────────────────────────────────────────────────────

function buildQuery(params = {}) {
  const q = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== 'All')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')
  return q ? `?${q}` : ''
}
