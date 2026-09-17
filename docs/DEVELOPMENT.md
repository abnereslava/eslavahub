# Desenvolvimento local — EslavaHub

## Pré-requisitos

- Node.js 22 ou compatível;
- npm;
- Firebase CLI, instalada pelas dependências de desenvolvimento do projeto.

## Instalação

```bash
npm install
```

## Qualidade

Executar testes unitários:

```bash
npm test
```

Executar lint:

```bash
npm run lint
```

Verificar formatação:

```bash
npm run format:check
```

Executar todas as verificações:

```bash
npm run check
```

O comando de build do MVP estático executa as mesmas verificações, pois não existe etapa de compilação:

```bash
npm run build
```

## Servidor local

Com as dependências instaladas:

```bash
npm run serve
```

Isso utiliza o Firebase Hosting Emulator para servir a pasta `public/` por HTTP local.

## CI

O workflow `.github/workflows/quality.yml` executa `npm install` e `npm run check` em pushes e pull requests para `main`.

## Firebase

Configuração adicional e validação de Authentication/Firestore estão em [`SETUP_FIREBASE.md`](SETUP_FIREBASE.md).
