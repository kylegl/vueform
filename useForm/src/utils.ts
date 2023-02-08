import type { ZodObject } from 'zod'
import type { MaybeRef } from '@vueuse/core'
import type { Ref } from 'vue'
import { isReactive, isRef, unref } from 'vue'
import type { ReactiveVariable } from 'vue/macros'
import type { FieldData, NativeFieldValue } from './types'

export function hasAny<
  TSchema extends ZodObject<any>,
  T extends MaybeRef<FieldData<TSchema>>,
  K extends keyof T,
  P extends keyof T[K],
  V extends NativeFieldValue,
>(key: P, val: V, obj: T) {
  const keys = Object.keys(obj) as K[]

  return keys.some(k => unref(obj[k]?.[key]) === val)
}

export function hasEvery<
  TSchema extends ZodObject<any>,
  T extends MaybeRef<FieldData<TSchema>>,
  K extends keyof T,
  P extends keyof T[K],
  V extends NativeFieldValue,
>(key: P, val: V, obj: T) {
  const keys = Object.keys(obj) as K[]

  return keys.every(k => unref(obj[k]?.[key]) === val)
}

export function unReactify<T>(val: ReactiveVariable<T> | Ref<T> | T) {
  if (isRef(val))
    return val.value

  if (isReactive(val))
    return JSON.parse(JSON.stringify(val))

  return val
}
