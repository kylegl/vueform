import type { SafeParseError, ZodTypeAny } from 'zod'
import { ref, unref, watchEffect } from 'vue'
import type { NativeFieldValue, UseValidatorInput } from './types'

export function useValidator({
  value,
  validate,
  callback,
  schema,
}: UseValidatorInput) {
  const errorMsg = ref<string>()
  const isSuccess = ref(false)

  watchEffect(() => {
    if (unref(validate)) {
      const { msg, success } = callback(value, schema)
      errorMsg.value = msg
      isSuccess.value = success
    }
  })

  return {
    errorMsg,
    isSuccess,
  }
}

export function getErrorMsg<T extends SafeParseError<any>>(zodOutput: T) {
  return zodOutput.error.format()._errors[0]
}

export function zodValidator(value: NativeFieldValue, schema: ZodTypeAny) {
  const parsedSchema = schema.safeParse(unref(value))
  const isSuccess = parsedSchema.success
  const errorMsg = isSuccess ? undefined : getErrorMsg(parsedSchema)

  return {
    msg: errorMsg,
    success: isSuccess,
  }
}
