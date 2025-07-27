import { generateProposalPDF, type ProposalData } from '~/lib/pdf-generator'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) as ProposalData
  
  try {
    const pdfBytes = await generateProposalPDF(body)
    
    // Set headers for PDF download
    setHeader(event, 'Content-Type', 'application/pdf')
    setHeader(event, 'Content-Disposition', `attachment; filename="proposta-financiamento-${body.name.replace(/\s+/g, '-').toLowerCase()}.pdf"`)
    
    return new Uint8Array(pdfBytes)
  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao gerar PDF'
    })
  }
})