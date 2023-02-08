import type { Options } from 'tsup'

export default <Options>{
  entryPoints: [
    'useForm/src/*.ts',
  ],
  clean: true,
  format: ['cjs', 'esm'],
  dts: true,
  onSuccess: 'npm run build:fix',
}
