<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Resultado da Simulação</h1>
        <p class="mt-2 text-sm text-gray-600">Confira os detalhes do seu financiamento</p>
        <div v-if="isSaving" class="mt-2">
          <p class="text-xs text-blue-600">Salvando simulação...</p>
        </div>
      </div>

      <div v-if="simulationData" class="space-y-6">
        <!-- Dados do Cliente -->
        <Card>
          <CardHeader>
            <CardTitle>Dados do Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm font-medium text-gray-500">Nome</p>
                <p class="text-lg">{{ simulationData.name }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">E-mail</p>
                <p class="text-lg">{{ simulationData.email }}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Resumo do Financiamento -->
        <Card>
          <CardHeader>
            <CardTitle>Resumo do Financiamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div>
                  <p class="text-sm font-medium text-gray-500">Valor do Imóvel</p>
                  <p class="text-2xl font-bold text-blue-600">{{ formatCurrency(simulationData.propertyValue) }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Entrada</p>
                  <p class="text-xl font-semibold text-green-600">{{ formatCurrency(simulationData.downPayment) }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Valor Financiado</p>
                  <p class="text-xl font-semibold text-orange-600">{{ formatCurrency(simulationData.loanValue) }}</p>
                </div>
              </div>
              <div class="space-y-4">
                <div>
                  <p class="text-sm font-medium text-gray-500">Prazo</p>
                  <p class="text-xl font-semibold">{{ simulationData.termMonths }} meses</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Taxa de Juros</p>
                  <p class="text-xl font-semibold">12% a.a. (1% a.m.)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Resultado do Cálculo -->
        <Card class="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle class="text-green-800">Resultado do Cálculo</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="text-center">
                <p class="text-sm font-medium text-gray-500">Parcela Mensal</p>
                <p class="text-3xl font-bold text-green-600">{{ formatCurrency(simulationData.monthlyInstallment) }}</p>
              </div>
              <div class="text-center">
                <p class="text-sm font-medium text-gray-500">Total a Pagar</p>
                <p class="text-2xl font-bold text-gray-700">{{ formatCurrency(simulationData.totalPayable) }}</p>
              </div>
            </div>
            <div class="mt-4 text-center">
              <p class="text-sm text-gray-600">
                Juros totais: {{ formatCurrency(simulationData.totalPayable - simulationData.loanValue) }}
              </p>
            </div>
          </CardContent>
        </Card>

        <!-- Ações -->
        <div class="flex gap-4 justify-center flex-wrap">
          <Button @click="showSignatureModal = true" variant="default" class="bg-green-600 hover:bg-green-700">
            Aceitar Proposta
          </Button>
          <Button @click="newSimulation" variant="outline">
            Nova Simulação
          </Button>
        </div>
      </div>

      <div v-else class="text-center">
        <Card>
          <CardContent class="py-8">
            <p class="text-gray-500">Dados da simulação não encontrados.</p>
            <Button @click="newSimulation" class="mt-4">
              Fazer Nova Simulação
            </Button>
          </CardContent>
        </Card>
      </div>

      <!-- Modal de Assinatura -->
      <div v-if="showSignatureModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card class="max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <CardTitle>Aceitar Proposta de Financiamento</CardTitle>
            <CardDescription>
              Para aceitar esta proposta, por favor assine no campo abaixo
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <SignaturePad 
              ref="signaturePadRef" 
              :width="400" 
              :height="200"
              @update:signature="onSignatureUpdate"
            />
            
            <div class="flex gap-4 justify-end">
              <Button @click="closeSignatureModal" variant="outline">
                Cancelar
              </Button>
              <Button 
                @click="acceptProposal" 
                :disabled="!hasSignature || isGeneratingPDF"
                variant="default"
                class="bg-green-600 hover:bg-green-700"
              >
                {{ isGeneratingPDF ? 'Gerando PDF...' : 'Aceitar e Baixar PDF' }}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>      
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { SignaturePad } from '~/components/ui/signature-pad'
import { generateProposalPDF, downloadPDF, type ProposalData } from '~/lib/pdf-generator'

interface SimulationData {
  name: string
  email: string
  propertyValue: number
  downPayment: number
  loanValue: number
  termMonths: number
  monthlyInstallment: number
  totalPayable: number
}

const route = useRoute()
const simulationData = ref<SimulationData | null>(null)

// Signature modal state
const showSignatureModal = ref(false)
const signaturePadRef = ref()
const hasSignature = ref(false)
const currentSignature = ref('')
const isGeneratingPDF = ref(false)
const isSaving = ref(false)

onMounted(async () => {
  const dataParam = route.query.data as string
  if (dataParam) {
    try {
      simulationData.value = JSON.parse(dataParam)
      
      // Auto-save simulation to database
      if (simulationData.value) {
        await autoSaveSimulation()
      }
    } catch (error) {
      console.error('Erro ao carregar dados da simulação:', error)
    }
  } else {
    // If no data, redirect to home to create a new simulation
    console.warn('Nenhum dado de simulação encontrado, redirecionando para home')
    newSimulation()
  }
})

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const autoSaveSimulation = async () => {
  if (!simulationData.value) return
  
  isSaving.value = true
  try {
    const response = await $fetch('/api/simulations', {
      method: 'POST',
      body: simulationData.value
    })
    
    console.log('Simulação salva automaticamente')
  } catch (error) {
    console.error('Erro ao salvar simulação automaticamente:', error)
    // Silent error - don't show alert for auto-save failures
  } finally {
    isSaving.value = false
  }
}

const newSimulation = () => {
  navigateTo('/')
}

// Signature functions
const onSignatureUpdate = (signature: string) => {
  currentSignature.value = signature
  hasSignature.value = signature.length > 0
}

const closeSignatureModal = () => {
  showSignatureModal.value = false
  if (signaturePadRef.value) {
    signaturePadRef.value.clear()
  }
  hasSignature.value = false
  currentSignature.value = ''
}

const acceptProposal = async () => {
  if (!simulationData.value || !hasSignature.value) return
  
  isGeneratingPDF.value = true
  
  try {
    // Prepare proposal data with signature
    const proposalData: ProposalData = {
      ...simulationData.value,
      signature: currentSignature.value
    }
    
    // Generate PDF on client side
    const pdfBytes = await generateProposalPDF(proposalData)
    
    // Download PDF
    const filename = `proposta-financiamento-${simulationData.value.name.replace(/\s+/g, '-').toLowerCase()}.pdf`
    downloadPDF(pdfBytes, filename)
    
    // Close modal
    closeSignatureModal()
    
    // Show success message
    alert('PDF gerado e baixado com sucesso!')
    
  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
    alert('Erro ao gerar PDF. Tente novamente.')
  } finally {
    isGeneratingPDF.value = false
  }
}
</script>
