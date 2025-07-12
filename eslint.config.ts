import ycs77, { GLOB_ASTRO, GLOB_SRC, GLOB_VUE } from '@ycs77/eslint-config'
import astroExplicitWrapper from 'eslint-plugin-astro-explicit-wrapper'

export default ycs77({
  astro: true,
  typescript: true,
  vue: true,
})
  .append({
    files: [GLOB_ASTRO, GLOB_SRC, GLOB_VUE],
    languageOptions: {
      globals: {

      },
    },
    rules: {
      'no-alert': 'off',
      'no-new': 'off',
      'no-unused-vars': 'off',
      'no-use-before-define': 'off',

      'unused-imports/no-unused-vars': 'off',

      'style/jsx-closing-tag-location': 'off',
    },
  })
  .append(...astroExplicitWrapper.config)
