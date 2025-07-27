<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
            <p class="text-sm text-gray-600">Simulações de Financiamento</p>
          </div>
          <Button @click="logout" variant="outline" class="text-red-600 border-red-600 hover:bg-red-50">
            Sair
          </Button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent class="pt-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-bold">{{ simulations.length }}</span>
                  </div>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">Total de Simulações</p>
                  <p class="text-2xl font-bold text-gray-900">{{ simulations.length }}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent class="pt-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-bold">R$</span>
                  </div>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">Valor Total Simulado</p>
                  <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(totalSimulatedValue) }}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent class="pt-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span class="text-white text-sm font-bold">Ø</span>
                  </div>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">Ticket Médio</p>
                  <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(averageTicket) }}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Filters -->
        <Card class="mb-6">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                v-model="searchQuery"
                placeholder="Buscar por nome ou email..."
                type="text"
              />
              <Input
                v-model="minValue"
                placeholder="Valor mínimo"
                type="number"
              />
              <Input
                v-model="maxValue"
                placeholder="Valor máximo"
                type="number"
              />
            </div>
          </CardContent>
        </Card>

        <!-- Simulations Table -->
        <Card>
          <CardHeader>
            <CardTitle>Simulações ({{ filteredSimulations.length }})</CardTitle>
            <CardDescription>
              Lista de todas as simulações realizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div v-if="loading" class="text-center py-8">
              <p class="text-gray-500">Carregando simulações...</p>
            </div>

            <div v-else-if="filteredSimulations.length === 0" class="text-center py-8">
              <p class="text-gray-500">Nenhuma simulação encontrada</p>
            </div>

            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor do Imóvel
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entrada
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Parcela
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prazo
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="simulation in paginatedSimulations" :key="simulation.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{ simulation.name }}</div>
                      <div class="text-sm text-gray-500">{{ simulation.email }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ formatCurrency(simulation.propertyValue || 0) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ formatCurrency(simulation.downPayment || 0) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {{ formatCurrency(simulation.monthlyInstallment || 0) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ simulation.termMonths }} meses
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(simulation.createdAt) }}
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- Pagination -->
              <div v-if="totalPages > 1" class="flex justify-center mt-6">
                <nav class="flex space-x-2">
                  <Button
                    @click="currentPage--"
                    :disabled="currentPage === 1"
                    variant="outline"
                    size="sm"
                  >
                    Anterior
                  </Button>
                  <span class="flex items-center px-3 py-2 text-sm text-gray-700">
                    Página {{ currentPage }} de {{ totalPages }}
                  </span>
                  <Button
                    @click="currentPage++"
                    :disabled="currentPage === totalPages"
                    variant="outline"
                    size="sm"
                  >
                    Próxima
                  </Button>
                </nav>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

// Apply admin middleware
definePageMeta({
  middleware: 'admin'
})

interface Simulation {
  id: number
  name: string | null
  email: string | null
  propertyValue: number | null
  downPayment: number | null
  loanValue: number | null
  termMonths: number | null
  monthlyInstallment: number | null
  totalPayable: number | null
  createdAt: string | null
}

const simulations = ref<Simulation[]>([])
const loading = ref(true)

// Filters
const searchQuery = ref('')
const minValue = ref('')
const maxValue = ref('')

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

// Computed properties
const filteredSimulations = computed(() => {
  let filtered = simulations.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(sim => 
      sim.name?.toLowerCase().includes(query) || 
      sim.email?.toLowerCase().includes(query)
    )
  }

  // Value filters
  if (minValue.value) {
    filtered = filtered.filter(sim => (sim.propertyValue || 0) >= Number(minValue.value))
  }
  
  if (maxValue.value) {
    filtered = filtered.filter(sim => (sim.propertyValue || 0) <= Number(maxValue.value))
  }

  return filtered
})

const paginatedSimulations = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredSimulations.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredSimulations.value.length / itemsPerPage)
})

const totalSimulatedValue = computed(() => {
  return simulations.value.reduce((total, sim) => total + (sim.propertyValue || 0), 0)
})

const averageTicket = computed(() => {
  if (simulations.value.length === 0) return 0
  return totalSimulatedValue.value / simulations.value.length
})

// Methods
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const formatDate = (dateString: string | null): string => {
  if (!dateString) return '-'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  } catch {
    return '-'
  }
}

const loadSimulations = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/admin/simulations')
    simulations.value = response.data || []
  } catch (error) {
    console.error('Erro ao carregar simulações:', error)
    simulations.value = []
  } finally {
    loading.value = false
  }
}

const logout = async () => {
  try {
    await $fetch('/api/admin/logout', { method: 'POST' })
    // Clear the admin token cookie on client side
    const adminToken = useCookie('admin-token')
    adminToken.value = ''
    await navigateTo('/login')
  } catch (error) {
    console.error('Erro no logout:', error)
    // Force logout even on error
    const adminToken = useCookie('admin-token')
    adminToken.value = ''
    await navigateTo('/login')
  }
}

// Reset pagination when filters change
watch([searchQuery, minValue, maxValue], () => {
  currentPage.value = 1
})

// Load data on mount
onMounted(() => {
  loadSimulations()
})
</script>