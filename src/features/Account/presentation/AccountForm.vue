<script lang="ts" setup>
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import InputText from '@/common/input/InputText.vue'
import { computed, watch } from 'vue'
import type { Options } from '@/features/Account/domain/models/OptionsInterface.ts'
import TrashButton from '@/common/buttons/TrashButton.vue'
import type { FieldInterface } from '@/features/Account/domain/models/FieldInterface.ts'
import { useAccountStore } from '@/features/Account/domain/store/AccountStore.ts'

const accountStore = useAccountStore()
const props = defineProps<{
  formId: number
  propsOption: Options[]
}>()

const arrayOptions = computed<Options[]>(() => props.propsOption)

const fields = computed<FieldInterface[]>(() => [
  { title: 'Метки', name: 'mark', placeholder: 'Имя', type: 'text' },
  {
    title: 'Тип записи',
    name: 'typeRecord',
    placeholder: 'Тип записи',
    type: 'select',
    options: arrayOptions.value,
  },
  { title: 'Логин', name: 'email', placeholder: 'Email', type: 'email' },
  { title: 'Пароль', name: 'password', placeholder: 'Пароль', type: 'password' },
])


const filteredFields = computed(() => {
  return fields.value.filter(field => {
    if (field.name === 'password' && values.typeRecord === 'LDAP') {
      return false
    }
    return true
  })
})

const initialValues = computed(() => {
  const formData = accountStore.forms[props.formId]
  const mark =
    typeof formData.mark === 'string'
      ? formData.mark
      : formData.mark?.map((m) => m.text).join('; ') || ''
  return {
    mark: mark,
    typeRecord: formData.typeRecord || '',
    email: formData.email || '',
    password: formData.password || '',
  }
})

const { values, validate } = useForm({
  validationSchema: yup.object({
    mark: yup.string().max(50),
    typeRecord: yup.string().required(),
    email: yup.string().required().email(),
    password: yup.string().when('typeRecord', {
      is: (val: string) => val !== 'LDAP',
      then: (schema) => schema.required().min(6),
      otherwise: (schema) => schema.notRequired(),
    }),
  }),
  initialValues: initialValues.value,
})

watch(
  () => values,
  async (newValues) => {
    const valid = await validate()
    if (valid.valid) {
      accountStore.updateForm(props.formId, newValues)
    }
  },
  { deep: true },
)

watch(
  () => values.typeRecord,
  (newVal) => {
    if (newVal === 'LDAP') {
      values.password = ''
    }
  },
)

const emit = defineEmits<{
  (e: 'delete-form', id: number): void
}>()
</script>

<template>
  <form>
    <div class="flex items-center gap-4">
      <InputText
        v-for="field in filteredFields"
        :key="field.name"
        :name="field.name"
        :type="field.type"
        :placeholder="field.placeholder"
        :options="field.options"
        :title="field.title"
        :can-toggle-visibility="true"
      />
      <div class="flex flex-col h-[40px] justify-end">
        <TrashButton @click="emit('delete-form', formId)" />
      </div>
    </div>
  </form>
</template>
