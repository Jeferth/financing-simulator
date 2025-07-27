<template>
  <div class="signature-pad-container">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold">Assinatura Digital</h3>
      <Button variant="outline" size="sm" @click="clear">
        Limpar
      </Button>
    </div>
    
    <div class="border-2 border-gray-300 rounded-lg bg-white">
      <canvas
        ref="canvasRef"
        class="signature-canvas"
        :width="width"
        :height="height"
      />
    </div>
    
    <p class="text-sm text-gray-600 mt-2">
      Assine no campo acima usando o mouse ou touch
    </p>
  </div>
</template>

<script setup lang="ts">
import SignaturePad from 'signature_pad'
import { Button } from '~/components/ui/button'

interface Props {
  width?: number
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 400,
  height: 200
})

interface Emits {
  (e: 'update:signature', value: string): void
  (e: 'signed'): void
}

const emit = defineEmits<Emits>()

const canvasRef = ref<HTMLCanvasElement>()
let signaturePad: SignaturePad | null = null

onMounted(() => {
  if (canvasRef.value) {
    signaturePad = new SignaturePad(canvasRef.value, {
      backgroundColor: 'rgba(255,255,255,0)',
      penColor: 'rgb(0, 0, 0)',
      velocityFilterWeight: 0.7,
      minWidth: 0.5,
      maxWidth: 2.5,
      throttle: 16,
      minPointDistance: 3,
    })

    // Emit signature data when user signs
    signaturePad.addEventListener('endStroke', () => {
      if (signaturePad && !signaturePad.isEmpty()) {
        const signature = signaturePad.toDataURL()
        emit('update:signature', signature)
        emit('signed')
      }
    })

    // Set canvas size
    const canvas = canvasRef.value
    const ratio = Math.max(window.devicePixelRatio || 1, 1)
    canvas.width = props.width * ratio
    canvas.height = props.height * ratio
    canvas.style.width = props.width + 'px'
    canvas.style.height = props.height + 'px'
    canvas.getContext('2d')?.scale(ratio, ratio)
    
    // Clear signature pad to ensure it's properly sized
    signaturePad.clear()
  }
})

const clear = () => {
  if (signaturePad) {
    signaturePad.clear()
    emit('update:signature', '')
  }
}

const isEmpty = () => {
  return signaturePad ? signaturePad.isEmpty() : true
}

const getSignatureData = () => {
  return signaturePad ? signaturePad.toDataURL() : ''
}

// Expose methods to parent component
defineExpose({
  clear,
  isEmpty,
  getSignatureData
})
</script>

<style scoped>
.signature-canvas {
  display: block;
  border-radius: 0.5rem;
  cursor: crosshair;
}

.signature-pad-container {
  width: 100%;
}
</style>