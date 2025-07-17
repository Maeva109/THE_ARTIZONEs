const BACKEND_URL = 'http://localhost:8000';

// Generic API call function
export const apiCall = async (
  endpoint: string,
  options: RequestInit = {},
  requireAuth = false
): Promise<any> => {
  const url = `${BACKEND_URL}/api/${endpoint}`;

  // Get token from localStorage if required
  let token = null;
  if (requireAuth) {
    token = localStorage.getItem('accessToken');
  }

  const defaultHeaders: any = {};
  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Merge headers, but if FormData, remove Content-Type (let browser set it)
  let mergedHeaders = { ...defaultHeaders, ...(options.headers || {}) };
  if (options.body instanceof FormData) {
    // Remove Content-Type if present
    if ('Content-Type' in mergedHeaders) {
      delete mergedHeaders['Content-Type'];
    }
  }

  const defaultOptions: RequestInit = {
    headers: mergedHeaders,
    ...options,
  };

  const response = await fetch(url, defaultOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Erreur ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

// Artisan-specific API functions
export const artisanAPI = {
  // Get artisan profile
  getProfile: (artisanId: string) => 
    apiCall(`artisans/${artisanId}/`),
  
  // Get artisan by shop name or boutique_id
  getArtisanByShop: (shopName: string) =>
    apiCall(`artisan-by-shop/?shop_name=${encodeURIComponent(shopName)}`),
  
  // Update artisan profile (for profile completion)
  updateProfile: (artisanId: string, formData: FormData) =>
    apiCall(`artisans/${artisanId}/`, {
      method: 'PATCH',
      body: formData,
    }, true),
  
  // Validate artisan (admin only)
  validateArtisan: (artisanId: string) =>
    apiCall(`artisans/${artisanId}/validate/`, {
      method: 'POST',
    }),
  
  // Reject artisan (admin only)
  rejectArtisan: (artisanId: string) =>
    apiCall(`artisans/${artisanId}/reject/`, {
      method: 'POST',
    }),
  
  // List artisans (admin only)
  listArtisans: (filters?: Record<string, string>) => {
    const params = new URLSearchParams(filters);
    return apiCall(`artisans/${params.toString() ? `?${params.toString()}` : ''}`);
  },
  listValidatedArtisans: () => apiCall('artisans/?statut=valide'),
  listValidatedArtisansWithFilters: (filters: Record<string, string>) =>
    apiCall('artisans/?statut=valide&' + new URLSearchParams(filters).toString()),
};

// Auth-specific API functions
export const authAPI = {
  // Check if email exists
  checkEmail: (email: string) =>
    apiCall(`check-email/?email=${encodeURIComponent(email)}`),
  
  // Send verification code
  sendVerificationCode: (email: string) =>
    apiCall('send-verification-code/', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  
  // Register new artisan
  registerArtisan: (formData: FormData) =>
    apiCall('artisans/', {
      method: 'POST',
      body: formData,
    }),
};

// Cart API functions
export const cartAPI = {
  getCart: () => apiCall('cart/'),
  addToCart: (productId: number, quantity: number) =>
    apiCall('cart/', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    }),
  updateCartItem: (itemId: number, quantity: number) =>
    apiCall(`cart/${itemId}/`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    }),
  removeFromCart: (itemId: number) =>
    apiCall(`cart/${itemId}/`, {
      method: 'DELETE',
    }),
};

// Product API functions
export const productAPI = {
  getProducts: (filters?: Record<string, string>) => {
    const params = new URLSearchParams(filters);
    return apiCall(`products/${params.toString() ? `?${params.toString()}` : ''}`);
  },
  getProduct: (productId: string) => apiCall(`products/${productId}/`),
  getRelatedProducts: (productId: string) => apiCall(`products/${productId}/related/`),
  getArtisanProducts: (productId: string) => apiCall(`products/${productId}/artisan_products/`),
};

// Category API functions
export const categoryAPI = {
  getCategories: () => apiCall('categories/'),
  getCategory: (categoryId: string) => apiCall(`categories/${categoryId}/`),
};

// Review API functions
export const reviewAPI = {
  getReviews: (productId?: string) => 
    apiCall(`reviews/${productId ? `?product=${productId}` : ''}`),
  createReview: (data: any) =>
    apiCall('reviews/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getReviewsByArtisan: (artisanId: string) =>
    apiCall(`reviews/by-artisan/${artisanId}/`),
};

export const tutorialAPI = {
  // Tutorials CRUD
  getTutorials: (filters?: Record<string, string>) => {
    const params = new URLSearchParams(filters);
    return apiCall(`tutorials/${params.toString() ? `?${params.toString()}` : ''}`);
  },
  getTutorial: (id: number) => apiCall(`tutorials/${id}/`),
  createTutorial: (data: any) =>
    apiCall('tutorials/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateTutorial: (id: number, data: any) =>
    apiCall(`tutorials/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteTutorial: (id: number) =>
    apiCall(`tutorials/${id}/`, {
      method: 'DELETE',
    }),

  // Training fields
  getFields: () => apiCall('training-fields/'),
  // Tutorial categories (optionally filtered by field)
  getCategories: (fieldId?: number) =>
    apiCall(`tutorial-categories/${fieldId ? `?field=${fieldId}` : ''}`),
};

export { BACKEND_URL }; 