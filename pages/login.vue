<template>
  <div class="fixed inset-0 bg-gray-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h1 class="text-center text-3xl font-bold text-gray-900">
          Painel Administrativo
        </h1>
        <p class="mt-2 text-center text-sm text-gray-600">
          Faça login para acessar o painel
        </p>
      </div>
      
      <Card class="shadow-lg">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Entre com suas credenciais</CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="onSubmit" class="space-y-6">
            <FormField v-slot="{ componentField }" name="username">
              <FormItem>
                <FormLabel>Usuário</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Digite seu usuário"
                    v-bind="componentField"
                    autocomplete="username"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="password">
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Digite sua senha"
                    v-bind="componentField"
                    autocomplete="current-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <Button type="submit" class="w-full" :disabled="isSubmitting">
              {{ isSubmitting ? 'Entrando...' : 'Entrar' }}
            </Button>
          </form>
          
          <div v-if="loginError" class="mt-4">
            <div class="bg-red-50 border border-red-200 rounded-md p-3">
              <p class="text-sm text-red-600">{{ loginError }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div class="text-center">
        <p class="text-xs text-gray-500">
          Credenciais: admin / admin123
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'

const formSchema = toTypedSchema(z.object({
  username: z.string({ message: 'Usuário é obrigatório' }).min(1, 'Usuário é obrigatório'),
  password: z.string({ message: 'Senha é obrigatória' }).min(1, 'Senha é obrigatória')
}))

const form = useForm({
  validationSchema: formSchema,
})

const isSubmitting = ref(false)
const loginError = ref('')

const onSubmit = form.handleSubmit(async (values) => {
  isSubmitting.value = true
  loginError.value = ''
  
  try {
    const response = await $fetch('/api/admin/login', {
      method: 'POST',
      body: {
        username: values.username,
        password: values.password
      }
    })
    
    if (response.success) {
      // Force reload the page to update cookie state
      await navigateTo('/admin', { replace: true })
      await refreshCookie('admin-token')
    }
  } catch (error: any) {
    console.error('Erro no login:', error)
    loginError.value = error.data?.message || 'Credenciais inválidas'
  } finally {
    isSubmitting.value = false
  }
})

// Redirect if already logged in
onMounted(() => {
  const adminToken = useCookie('admin-token')
  if (adminToken.value) {
    navigateTo('/admin')
  }
})
</script>