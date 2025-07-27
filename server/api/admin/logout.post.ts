export default defineEventHandler(async (event) => {
  try {
    // Clear the admin token cookie
    setCookie(event, 'admin-token', '', {
      maxAge: 0,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })
    
    return {
      success: true,
      message: 'Logout realizado com sucesso'
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor'
    })
  }
})