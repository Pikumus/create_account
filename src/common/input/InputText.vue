<script lang="ts" setup>
import { useField } from 'vee-validate'
import { ref, computed, watch } from 'vue'
import EyeButton from '@/common/buttons/EyeButton.vue'
import EyeSlashed from '@/common/buttons/EyeSlashed.vue'
import type { Options } from '@/features/Account/domain/models/OptionsInterface.ts'

const showPassword = ref(false)
const props = defineProps<{
  name: string
  type?: string
  placeholder?: string
  options?: Options[]
  title: string
  canToggleVisibility?: boolean
}>()

const { value, errorMessage, meta, handleBlur } = useField(() => props.name, undefined, {})

watch(
  () => props.options,
  (newOptions) => {
    if (props.type === 'select' && newOptions && !value.value) {
      value.value = props.options?.[0]?.value
    }
  },
  { immediate: true },
)

const inputType = computed(() => {
  if (props.type === 'password' && props.canToggleVisibility) {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type || 'text'
})

const errorClasses = computed(() => ({
  'border-red-500': meta.touched && errorMessage.value,
}))
</script>

<template>
  <div v-if="type !== 'hidden'" class="flex flex-col w-full">
    <label class="text-gray-700 text-sm font-medium mb-1">{{ title }}</label>

    <select
      v-if="type === 'select'"
      v-model="value"
      @blur="handleBlur"
      class="border rounded-lg px-2 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      :class="errorClasses"
    >
      <option v-for="option in props.options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>

    <div v-else class="relative w-full">
      <input
        v-model="value"
        :type="inputType"
        :placeholder="placeholder"
        @blur="handleBlur"
        class="border rounded px-3 py-2 w-full text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        :class="errorClasses"
      />

      <button
        v-if="type === 'password' && canToggleVisibility"
        type="button"
        @click="showPassword = !showPassword"
        class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
      >
        <span v-if="showPassword"><EyeButton class="w-4" /></span>
        <span v-else><EyeSlashed class="w-4" /></span>
      </button>
    </div>
  </div>
</template>
