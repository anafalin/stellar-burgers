import unusedImports from 'eslint-plugin-unused-imports';

export default [
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      // Отключаем стандартное правило
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',

      // Включаем проверку импортов
      'unused-imports/no-unused-imports': 'error',

      // Настраиваем проверку переменных (с игнорированием переменных с _)
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
];
