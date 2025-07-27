import { useDrizzle, tables } from '~/server/utils/drizzle'

export default defineEventHandler(async (event) => {
  try {
    // Check admin authentication
    const adminToken = getCookie(event, 'admin-token')
    
    if (!adminToken) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Não autorizado'
      })
    }
    
    // Validate token
    try {
      const tokenData = JSON.parse(atob(adminToken))
      if (!tokenData.admin || !tokenData.exp || Date.now() > tokenData.exp) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Token expirado'
        })
      }
    } catch {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token inválido'
      })
    }
    
    const db = useDrizzle()
    
    // Get all simulations ordered by creation date (newest first)
    const simulations = await db
      .select()
      .from(tables.simulations)
      .orderBy(tables.simulations.createdAt)
    
    return {
      success: true,
      data: simulations
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Erro ao buscar simulações:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor'
    })
  }
})