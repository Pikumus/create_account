<script setup lang="ts">
import { computed, onMounted } from 'vue'
import AccountTitle from '@/features/Account/presentation/AccountTitle.vue'
import PlusButton from '@/common/buttons/PlusButton.vue'
import AccountForm from '@/features/Account/presentation/AccountForm.vue'
import type { Options } from '@/features/Account/domain/models/OptionsInterface.ts'
import { useAccountStore } from '@/features/Account/domain/store/AccountStore.ts'

const accountStore = useAccountStore()

const options: Options[] = [
  { label: 'Локальная', value: 'Локальная' },
  { label: 'LDAP', value: 'LDAP' },
]

const forms = computed(() => accountStore.forms)

function addForm() {
  const id = Date.now()
  accountStore.addForm(id)
}

function deleteIdForm(id: number) {
  accountStore.deleteForm(id)
}

onMounted(( ) => {
  accountStore.loadForms()
})
</script>

<template>
  <div class="p-10 h-full flex flex-col justify-around gap-10">
    <header class="flex items-center flex-wrap gap-10 text-lg">
      <AccountTitle title="Учётные записи" />
      <PlusButton @click="addForm" />
    </header>
    <main class="flex flex-col gap-6">
      <AccountForm
        v-for="(form, id) in forms"
        :key="id"
        :form-id="Number(id)"
        :props-option="options"
        @delete-form="deleteIdForm"
      />
    </main>
  </div>
</template>
