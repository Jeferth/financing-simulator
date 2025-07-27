export default defineNuxtRouteMiddleware(() => {
  const adminToken = useCookie('admin-token', {
    default: () => '',
    maxAge: 60 * 60 * 24 // 24 hours
  })
  
  if (!adminToken.value) {
    return navigateTo('/login')
  }
  
  // Simple token validation (just check if it exists and has expected format)
  try {
    const tokenData = JSON.parse(atob(adminToken.value))
    if (!tokenData.admin || !tokenData.exp || Date.now() > tokenData.exp) {
      // Token expired or invalid
      adminToken.value = ''
      return navigateTo('/login')
    }
  } catch {
    // Invalid token format
    adminToken.value = ''
    return navigateTo('/login')
  }
})