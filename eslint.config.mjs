import nextVitals from 'eslint-config-next/core-web-vitals'

const eslintConfig = [
  {
    ignores: [
      '.contentlayer/**',
      '.next/**',
      'node_modules/**',
      'public/**',
      '.git/**',
    ],
  },
  ...nextVitals,
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/static-components': 'off',
    },
  },
]

export default eslintConfig
