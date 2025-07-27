<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto">
      <div class="text-center mb-8">
        <div class="flex justify-between items-start mb-4">
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-gray-900">
              Simulador de Financiamento
            </h1>
            <p class="mt-2 text-sm text-gray-600">
              Simule seu financiamento imobiliário
            </p>
          </div>
        </div>
      </div>

      <Card class="shadow-lg">
        <CardHeader>
          <CardTitle>Dados da Simulação</CardTitle>
          <CardDescription
            >Preencha os dados para simular seu financiamento</CardDescription
          >
        </CardHeader>
        <CardContent>
          <form
            @submit.prevent="onSubmit"
            class="space-y-6"
          >
            <FormField
              v-slot="{ componentField }"
              name="propertyValue"
            >
              <FormItem>
                <FormLabel>Valor do Imóvel</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="R$ 300.000,00"
                    @input="
                      (e) => handleCurrencyInput(e, form, 'propertyValue')
                    "
                    @blur="componentField.onBlur"
                    :name="componentField.name"
                  />
                </FormControl>
                <FormDescription
                  >Valor total do imóvel em reais</FormDescription
                >
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ componentField }"
              name="downPayment"
            >
              <FormItem>
                <FormLabel>Entrada</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="R$ 60.000,00"
                    @input="(e) => handleCurrencyInput(e, form, 'downPayment')"
                    @blur="componentField.onBlur"
                    :name="componentField.name"
                  />
                </FormControl>
                <FormDescription
                  >Valor da entrada (mínimo 20% do valor do
                  imóvel)</FormDescription
                >
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ componentField }"
              name="termMonths"
            >
              <FormItem>
                <FormLabel>Prazo (meses)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Ex: 240"
                    v-bind="componentField"
                    min="12"
                  />
                </FormControl>
                <FormDescription
                  >Prazo de financiamento em meses (mínimo 12
                  meses)</FormDescription
                >
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ componentField }"
              name="name"
            >
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Seu nome completo"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ componentField }"
              name="email"
            >
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <Button
              type="submit"
              class="w-full"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? "Simulando..." : "Simular Financiamento" }}
            </Button>
          </form>
        </CardContent>
      </Card>
      <NuxtLink
        to="/login"
        class="text-xs text-blue-600 hover:text-blue-800 underline ml-4 mt-1"
      >
        Área Administrativa
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useForm } from "vee-validate";
  import { toTypedSchema } from "@vee-validate/zod";
  import * as z from "zod";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "~/components/ui/card";
  import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "~/components/ui/form";
  import { Input } from "~/components/ui/input";
  import { Button } from "~/components/ui/button";
  import { handleCurrencyInput } from "~/lib/masks";

  const formSchema = toTypedSchema(
    z
      .object({
        propertyValue: z
          .number({ message: "Valor do imóvel é obrigatório" })
          .min(1, "Valor deve ser maior que zero"),
        downPayment: z
          .number({ message: "Entrada é obrigatória" })
          .min(1, "Entrada deve ser maior que zero"),
        termMonths: z
          .number({ message: "Prazo é obrigatório" })
          .min(12, "Prazo mínimo é de 12 meses"),
        name: z
          .string({ message: "Nome é obrigatório" })
          .min(2, "Nome deve ter pelo menos 2 caracteres"),
        email: z
          .string({ message: "E-mail é obrigatório" })
          .email("E-mail deve ser válido"),
      })
      .refine((data) => data.downPayment >= data.propertyValue * 0.2, {
        message: "Entrada deve ser pelo menos 20% do valor do imóvel",
        path: ["downPayment"],
      })
  );

  const form = useForm({
    validationSchema: formSchema,
  });

  const isSubmitting = ref(false);

  const onSubmit = form.handleSubmit(async (values) => {
    isSubmitting.value = true;

    try {
      // Calculate financing
      const loanValue = values.propertyValue - values.downPayment;
      const monthlyRate = 0.01; // 1% ao mês
      const n = values.termMonths;

      // PMT = [PV × i × (1 + i)^n] / [(1 + i)^n – 1]
      const monthlyInstallment =
        (loanValue * monthlyRate * Math.pow(1 + monthlyRate, n)) /
        (Math.pow(1 + monthlyRate, n) - 1);
      const totalPayable = monthlyInstallment * n;

      const simulationData = {
        name: values.name,
        email: values.email,
        propertyValue: values.propertyValue,
        downPayment: values.downPayment,
        loanValue,
        termMonths: values.termMonths,
        monthlyInstallment,
        totalPayable,
      };

      // Navigate to results page with simulation data
      await navigateTo({
        path: "/resultado",
        query: {
          data: JSON.stringify(simulationData),
        },
      });
    } catch (error) {
      console.error("Erro na simulação:", error);
    } finally {
      isSubmitting.value = false;
    }
  });
</script>
