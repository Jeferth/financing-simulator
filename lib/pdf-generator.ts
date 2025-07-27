import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export interface ProposalData {
  name: string
  email: string
  propertyValue: number
  downPayment: number
  loanValue: number
  termMonths: number
  monthlyInstallment: number
  totalPayable: number
  signature?: string
}

export async function generateProposalPDF(data: ProposalData): Promise<Uint8Array> {
  // Create a new PDFDocument
  const pdfDoc = await PDFDocument.create()
  
  // Add a page
  const page = pdfDoc.addPage([595.28, 841.89]) // A4 size
  
  // Get fonts
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  
  const { width, height } = page.getSize()
  
  // Helper function to format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }
  
  // Header
  page.drawText('PROPOSTA DE FINANCIAMENTO IMOBILIÁRIO', {
    x: 50,
    y: height - 80,
    size: 18,
    font: boldFont,
    color: rgb(0, 0, 0),
  })
  
  // Date
  const currentDate = new Date().toLocaleDateString('pt-BR')
  page.drawText(`Data: ${currentDate}`, {
    x: 50,
    y: height - 120,
    size: 12,
    font: font,
  })
  
  // Client Information
  let yPosition = height - 160
  
  page.drawText('DADOS DO CLIENTE', {
    x: 50,
    y: yPosition,
    size: 14,
    font: boldFont,
  })
  
  yPosition -= 30
  page.drawText(`Nome: ${data.name}`, {
    x: 50,
    y: yPosition,
    size: 12,
    font: font,
  })
  
  yPosition -= 20
  page.drawText(`E-mail: ${data.email}`, {
    x: 50,
    y: yPosition,
    size: 12,
    font: font,
  })
  
  // Financing Details
  yPosition -= 50
  page.drawText('DETALHES DO FINANCIAMENTO', {
    x: 50,
    y: yPosition,
    size: 14,
    font: boldFont,
  })
  
  yPosition -= 30
  page.drawText(`Valor do Imóvel: ${formatCurrency(data.propertyValue)}`, {
    x: 50,
    y: yPosition,
    size: 12,
    font: font,
  })
  
  yPosition -= 20
  page.drawText(`Entrada: ${formatCurrency(data.downPayment)}`, {
    x: 50,
    y: yPosition,
    size: 12,
    font: font,
  })
  
  yPosition -= 20
  page.drawText(`Valor Financiado: ${formatCurrency(data.loanValue)}`, {
    x: 50,
    y: yPosition,
    size: 12,
    font: font,
  })
  
  yPosition -= 20
  page.drawText(`Prazo: ${data.termMonths} meses`, {
    x: 50,
    y: yPosition,
    size: 12,
    font: font,
  })
  
  yPosition -= 20
  page.drawText(`Taxa de Juros: 12% a.a. (1% a.m.)`, {
    x: 50,
    y: yPosition,
    size: 12,
    font: font,
  })
  
  // Results
  yPosition -= 50
  page.drawText('RESULTADO DO FINANCIAMENTO', {
    x: 50,
    y: yPosition,
    size: 14,
    font: boldFont,
  })
  
  yPosition -= 30
  page.drawText(`Parcela Mensal: ${formatCurrency(data.monthlyInstallment)}`, {
    x: 50,
    y: yPosition,
    size: 12,
    font: boldFont,
    color: rgb(0, 0.5, 0),
  })
  
  yPosition -= 20
  page.drawText(`Total a Pagar: ${formatCurrency(data.totalPayable)}`, {
    x: 50,
    y: yPosition,
    size: 12,
    font: font,
  })
  
  const totalInterest = data.totalPayable - data.loanValue
  yPosition -= 20
  page.drawText(`Juros Totais: ${formatCurrency(totalInterest)}`, {
    x: 50,
    y: yPosition,
    size: 12,
    font: font,
  })
  
  // Terms and conditions
  yPosition -= 50
  page.drawText('TERMOS E CONDIÇÕES', {
    x: 50,
    y: yPosition,
    size: 14,
    font: boldFont,
  })
  
  const terms = [
    '• Esta proposta tem validade de 30 dias.',
    '• A aprovação está sujeita à análise de crédito.',
    '• Documentação completa deve ser apresentada.',
    '• Taxa de juros fixa de 12% ao ano.',
    '• Sistema de amortização: SAC (Sistema de Amortização Constante).'
  ]
  
  yPosition -= 20
  terms.forEach(term => {
    yPosition -= 15
    page.drawText(term, {
      x: 50,
      y: yPosition,
      size: 10,
      font: font,
    })
  })
  
  // Signature section
  yPosition -= 50
  page.drawText('ASSINATURA DO CLIENTE', {
    x: 50,
    y: yPosition,
    size: 14,
    font: boldFont,
  })
  
  // Draw signature line
  yPosition -= 40
  page.drawLine({
    start: { x: 50, y: yPosition },
    end: { x: 300, y: yPosition },
    thickness: 1,
    color: rgb(0, 0, 0),
  })
  
  // If signature is provided, embed it
  if (data.signature) {
    try {
      // Remove data URL prefix
      const base64Data = data.signature.replace(/^data:image\/[a-z]+;base64,/, '')
      const signatureImageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))
      
      const signatureImage = await pdfDoc.embedPng(signatureImageBytes)
      const signatureDims = signatureImage.scale(0.3)
      
      page.drawImage(signatureImage, {
        x: 50,
        y: yPosition - 60,
        width: signatureDims.width,
        height: signatureDims.height,
      })
    } catch (error) {
      console.error('Error embedding signature:', error)
    }
  }
  
  yPosition -= 80
  page.drawText(`${data.name}`, {
    x: 50,
    y: yPosition,
    size: 12,
    font: font,
  })
  
  // Footer
  page.drawText('Este documento foi gerado eletronicamente e é válido sem assinatura física.', {
    x: 50,
    y: 50,
    size: 8,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  })
  
  // Serialize the PDFDocument to bytes
  const pdfBytes = await pdfDoc.save()
  
  return pdfBytes
}

export function downloadPDF(pdfBytes: Uint8Array, filename: string) {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  
  // Clean up
  URL.revokeObjectURL(url)
}