export interface FinancingCalculation {
  propertyValue: number
  downPayment: number
  loanValue: number
  termMonths: number
  monthlyInstallment: number
  totalPayable: number
  totalInterest: number
}

export interface FinancingInput {
  propertyValue: number
  downPayment: number
  termMonths: number
}

/**
 * Calcula o financiamento usando o sistema de amortização com juros compostos
 * Taxa fixa de 12% a.a. (1% a.m.)
 * Fórmula: PMT = [PV × i × (1 + i)^n] / [(1 + i)^n – 1]
 */
export function calculateFinancing(input: FinancingInput): FinancingCalculation {
  const { propertyValue, downPayment, termMonths } = input
  
  // Valor financiado
  const loanValue = propertyValue - downPayment
  
  // Taxa de juros mensal (1%)
  const monthlyRate = 0.01
  
  // Número de parcelas
  const n = termMonths
  
  // Cálculo da parcela mensal usando a fórmula PMT
  const monthlyInstallment = (loanValue * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
  
  // Total a pagar
  const totalPayable = monthlyInstallment * n
  
  // Total de juros
  const totalInterest = totalPayable - loanValue
  
  return {
    propertyValue,
    downPayment,
    loanValue,
    termMonths,
    monthlyInstallment,
    totalPayable,
    totalInterest
  }
}

/**
 * Valida se a entrada é pelo menos 20% do valor do imóvel
 */
export function validateDownPayment(propertyValue: number, downPayment: number): boolean {
  return downPayment >= propertyValue * 0.2
}

/**
 * Calcula o percentual da entrada em relação ao valor do imóvel
 */
export function getDownPaymentPercentage(propertyValue: number, downPayment: number): number {
  return (downPayment / propertyValue) * 100
}

/**
 * Formata valor para moeda brasileira
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}