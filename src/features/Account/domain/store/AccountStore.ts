import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { FormsInterface } from '@/features/Account/domain/models/FormsInterface.ts'

export const useAccountStore = defineStore('account', () => {
  const forms = reactive<Record<number, FormsInterface>>({})
  const STORAGE_KEY = 'savedForms'

  function loadForms() {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Record<string, FormsInterface>
        Object.keys(parsed).forEach(id => {
          forms[Number(id)] = parsed[id]
        })
      } catch (error) {
        console.error('Failed to parse saved forms:', error)
      }
    }
  }


  function addForm(id: number) {
    if (!forms[id]) {
      forms[id] = {
        mark: [],
        typeRecord: '',
        email: '',
        password: ''
      }
    }
  }

  function updateForm(id: number, data: Partial<FormsInterface>) {
    console.log('click')
    if (!forms[id]) addForm(id)

    const updatedData = { ...data }

    if (updatedData.mark && typeof updatedData.mark === 'string') {
      updatedData.mark = updatedData.mark
        .split(';')
        .filter(el => el.trim())
        .map(el => ({ text: el.trim() }))
    }

    Object.assign(forms[id], updatedData)
    saveForms()
  }

  function saveForms() {
    const formsToSave = Object.fromEntries(
      Object.entries(forms).filter(([, form]) => form !== null)
    )
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formsToSave))
  }

  function deleteForm(id: number) {
    delete forms[id]
    saveForms()
  }

  return {
    forms,
    addForm,
    updateForm,
    deleteForm,
    loadForms
  }
})
