import { computed, ref } from 'vue'
import type { ZodObject, ZodTypeAny } from 'zod'
import type {
  FieldData,
  FormCtx,
  KeyOfSchema,
  UseFormInput,
  UseFormOutput,
} from './types'
import { useField } from './useField'
import { hasAny, hasEvery } from './utils'

export function useForm<
  TSchema extends ZodObject<any>,
>({
  fieldsSchema,
  defaultValues,
  validator,
}: UseFormInput<TSchema>): UseFormOutput<TSchema> {
  const {
    isLoading,
    isSubmitting,
    submitCount,
    disabled,
    fields,
  } = getFormContext({ fieldsSchema, defaultValues, validator })

  const isDirty = computed(() => hasAny('isDirty', true, fields))
  const isValid = computed(() => hasEvery('isValid', true, fields))

  function onSubmit(cb: () => any) {
    submitCount.value++

    return cb()
  }

  return {
    isDirty,
    isLoading,
    isSubmitting,
    isValid,
    onSubmit,
    disabled,
    ...fields,
    fields,
  }
}

function getFormContext<
  TSchema extends ZodObject<any, any, any>,
>({
  fieldsSchema,
  defaultValues,
  validator,
}: UseFormInput<TSchema>):
  Omit<FormCtx<TSchema>, 'isDirty' | 'isValid' | 'onSubmit'> {
  const isValidating = ref(false)
  const isLoading = ref(true)
  const isSubmitted = ref(false)
  const isSubmitting = ref(false)
  const isSubmitSuccessful = ref(false)
  const submitCount = ref(0)
  const disabled = ref(false)
  const fields = getFieldsContext({ fieldsSchema, defaultValues, validator })

  return {
    isValidating,
    isLoading,
    isSubmitted,
    isSubmitting,
    isSubmitSuccessful,
    submitCount,
    disabled,
    fields,
  }
}

function getFieldsContext<
  TSchema extends ZodObject<any>,
>({ fieldsSchema, defaultValues, validator }: UseFormInput<TSchema>) {
  const fieldCtxMap = Object.keys(fieldsSchema.shape)
    .reduce<FieldData<TSchema>>((acc, key) => {
      const defaultValue = defaultValues?.[key]
      const schema = fieldsSchema.shape[key] as ZodTypeAny
      const fieldCtx = useField({
        defaultValue,
        options: {
          validation: {
            callback: validator,
            schema,
          },
        },
      })

      acc[key as KeyOfSchema<TSchema>] = fieldCtx
      return acc
    }, {} as FieldData<TSchema>)
  return fieldCtxMap
}
