export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Basic hardcoded credentials
  const ADMIN_USERNAME = 'admin'
  const ADMIN_PASSWORD = 'admin123'
  
  try {
    const { username, password } = body
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Create simple token
      const tokenData = {
        admin: true,
        username: ADMIN_USERNAME,
        exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      }
      
      const token = btoa(JSON.stringify(tokenData))
      
      // Set cookie (not httpOnly so client can read it)
      setCookie(event, 'admin-token', token, {
        maxAge: 60 * 60 * 24, // 24 hours
        httpOnly: false, // Allow client-side access for middleware
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
      
      return {
        success: true,
        message: 'Login realizado com sucesso'
      }
    } else {
      throw createError({
        statusCode: 401,
        statusMessage: 'Credenciais inválidas'
      })
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor'
    })
  }
})