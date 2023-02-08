import type { Ref } from 'vue'
import { computed, onUnmounted, ref } from 'vue'
import type { ZodObject } from 'zod'
import { useEventListener, useFocus } from '@vueuse/core'
import { useValidator } from './useValidator'
import type {
  FieldCtx,
  FieldElement,
  RegisterInput,
  UseFieldInput,
} from './types'

export function useField<TSchema extends ZodObject<any>>(input: UseFieldInput<TSchema>): FieldCtx {
  const { defaultValue, options } = input

  const { callback, schema, validate = true } = options.validation
  const fieldValue = ref(defaultValue)
  const fieldNode = ref<FieldElement | null>(null)
  const { focused } = useFocus(fieldNode)
  const isTouched = ref(false)
  const isDirty = computed(() => defaultValue !== fieldValue.value)

  // TODO add option to add custom showError event
  const showError = computed(() => isTouched.value)

  const { errorMsg: internalErrorMsg, isSuccess } = useValidator({
    value: fieldValue,
    callback,
    schema,
    validate,
  })

  const errorMsg = computed(() => showError.value ? internalErrorMsg.value : undefined)

  const isValid = computed(() => isSuccess.value)

  function register(el: RegisterInput) {
    if (!el)
      return

    if ('input' in el && el.input) {
      fieldNode.value = el.input
      return
    }

    fieldNode.value = el as FieldElement

    return fieldNode
  }

  function setFocus() {
    focused.value = true
  }

  function reset() {
    fieldValue.value = defaultValue
    isTouched.value = false
  }

  const cleanup = useEventListener(fieldNode, 'blur', () => isTouched.value = true)

  onUnmounted(() => {
    cleanup()
    stop()
  })

  return {
    fieldValue,
    errorMsg,
    isDirty,
    isTouched,
    isValid,
    register,
    reset,
    setFocus,
  }
}

export function setTouched(isTouched: Ref<boolean>) {
  isTouched.value = true
}
