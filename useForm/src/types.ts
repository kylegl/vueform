import type { MaybeRef } from '@vueuse/core'
import type { ComputedRef, Ref } from 'vue'
import type { ZodObject, ZodTypeAny } from 'zod'

export type KeyOfSchema<T extends ZodObject<any>> = T extends ZodObject<infer O> ? keyof O : never
export type FieldData<T extends ZodObject<any>> = { [K in KeyOfSchema<T>]: FieldCtx }

export interface UseFormInput<T extends ZodObject<any, any, any>> {
  fieldsSchema: T
  defaultValues?: FieldValues
  validator: ValidationFn
}

export interface FormCtx<TSchema extends ZodObject<any>> {
  isValid: ComputedRef<boolean>
  isValidating: Ref<boolean>
  isLoading: Ref<boolean>
  isSubmitted: Ref<boolean>
  isSubmitting: Ref<boolean>
  isSubmitSuccessful: Ref<boolean>
  submitCount: Ref<number>
  onSubmit: OnSubmitFn
  disabled: Ref<boolean>
  isDirty: ComputedRef<boolean>
  fields: FieldData<TSchema>
}

export type PublicFormCtx<TSchema extends ZodObject<any>> = Pick<FormCtx<TSchema>,
  | 'isDirty'
  | 'onSubmit'
  | 'disabled'
  | 'isLoading'
  | 'isSubmitting'
  | 'isValid'
> & FieldData<TSchema>

export type UseFormOutput<TSchema extends ZodObject<any>> = PublicFormCtx<TSchema>

export type OnSubmitFn = (cb: () => any) => () => any

export interface UseFieldInput<TSchema extends ZodObject<any>> {
  fieldName?: string
  defaultValue?: NativeFieldValue
  ctx?: FormCtx<TSchema>
  options: UseFieldOptions

}

export interface UseFieldOptions {
  validation: UseValidatorInput
}
export interface FormElement extends Partial<HTMLDivElement> {
  value: NativeFieldValue
  errorMsg?: string
  setFocus?: () => void
  input?: FieldElement
}

export type InternalFieldName = string

export type FieldElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement
  | HTMLDivElement

export type FieldValue<TFieldValues extends FieldValues> =
  TFieldValues[InternalFieldName]

export type FieldValues = Record<string, any>

export type NativeFieldValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | unknown[]

export interface FieldCtx {
  isDirty: Ref<boolean>
  isTouched: Ref<boolean>
  isValid: Ref<boolean>
  register: RegisterFunction
  reset: () => void
  setFocus: () => void
  fieldValue: Ref<NativeFieldValue>
  errorMsg?: ComputedRef<string | undefined>
}

export type RegisterInput = FormElement | FieldElement | null

export type RegisterFunction = (el: RegisterInput) => Ref<FieldElement | null> | undefined

export interface ZodValidateFieldInput {
  value: MaybeRef<NativeFieldValue>
  schema?: ZodTypeAny
}

export interface UseValidatorInput {
  value?: MaybeRef<NativeFieldValue>
  showErrorEvent?: string
  callback: ValidationFn
  schema: ZodTypeAny
  validate?: MaybeRef<boolean>
}

interface ValidationResult {
  msg?: string
  success: boolean
}

export type ValidationFn = (...args: any[]) => ValidationResult

