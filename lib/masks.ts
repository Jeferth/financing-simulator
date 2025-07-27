/**
 * Utilitários para máscaras visuais simples
 */

/**
 * Formata um número como moeda brasileira
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

/**
 * Aplica máscara de moeda visual em tempo real
 * Converte entrada de dígitos para formato de moeda
 */
export function applyCurrencyMask(value: string): string {
  if (!value) return ''
  
  // Remove tudo que não é dígito
  const numbers = value.replace(/\D/g, '')
  
  if (!numbers) return ''
  
  // Converte para número (centavos para reais)
  const amount = parseInt(numbers) / 100
  
  // Retorna formatado como moeda
  return formatCurrency(amount)
}

/**
 * Extrai valor numérico de um input formatado como moeda
 */
export function extractNumericValue(formattedValue: string): number {
  if (!formattedValue) return 0
  
  // Remove tudo que não é dígito
  const numbers = formattedValue.replace(/\D/g, '')
  
  if (!numbers) return 0
  
  // Converte centavos para reais
  return parseInt(numbers) / 100
}

/**
 * Função para lidar com input de moeda em formulários
 * Aplica máscara visual e atualiza valor numérico no form
 */
export function handleCurrencyInput(event: Event, form: any, fieldName: string): void {
  const input = event.target as HTMLInputElement
  const formattedValue = applyCurrencyMask(input.value)
  const numericValue = extractNumericValue(formattedValue)
  
  // Atualiza o visual do input
  input.value = formattedValue
  
  // Atualiza o valor numérico no formulário e dispara validação
  form.setFieldValue(fieldName, numericValue)
  form.setFieldTouched(fieldName, true)
}