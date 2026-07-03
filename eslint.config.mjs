import nextVitals from 'eslint-config-next/core-web-vitals';

const ignores = [
  {
    ignores: ['.next/**', 'node_modules/**']
  }
];

const config = [...nextVitals, ...ignores];

export default config;
