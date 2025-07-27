import { useDrizzle, tables } from '~/server/utils/drizzle'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  const db = useDrizzle()
  
  try {
    const result = await db.insert(tables.simulations).values({
      name: body.name,
      email: body.email,
      propertyValue: body.propertyValue,
      downPayment: body.downPayment,
      loanValue: body.loanValue,
      termMonths: body.termMonths,
      monthlyInstallment: body.monthlyInstallment,
      totalPayable: body.totalPayable,
      createdAt: new Date().toISOString()
    }).returning()
    
    return {
      success: true,
      data: result[0]
    }
  } catch (error) {
    console.error('Erro ao salvar simulação:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor'
    })
  }
})