# Configuração Firebase — EslavaHub

## Projeto

- Firebase project ID: `eslavahub-434e5`
- Autenticação: Firebase Authentication
- Provedor permitido no MVP: Google
- Persistência: Cloud Firestore
- Hosting do frontend: GitHub Pages

## Estrutura de dados

Os dados privados do usuário ficam sob o UID autenticado:

```text
users/{uid}/
  projects/
  categories/
  statuses/
  technologies/
  domains/
  pendingItems/
```

Isso permite que as Security Rules comparem `request.auth.uid` com o `userId` presente no caminho.

## Authentication

No Firebase Console:

1. abrir **Authentication > Sign-in method**;
2. habilitar **Google**;
3. configurar o e-mail de suporte solicitado pelo Firebase;
4. em **Settings > Authorized domains**, incluir os domínios nos quais o app será executado;
5. para desenvolvimento local, confirmar que `localhost` está autorizado;
6. para produção no GitHub Pages, adicionar `abnereslava.github.io` aos domínios autorizados.

Usuários não autenticados não devem acessar a aplicação privada.

## Firestore

Criar o banco Cloud Firestore e publicar o arquivo `firestore.rules` deste repositório.

As rules atuais:

- exigem autenticação;
- exigem que o provedor de login seja Google;
- permitem que um usuário acesse apenas `/users/{seuUid}/...`;
- negam acesso global por padrão.

A validação estrutural campo a campo será endurecida conforme os modelos forem implementados.

## Configuração web

A inicialização do SDK está em:

```text
public/js/config/firebase.js
```

O `firebaseConfig` do Web SDK é configuração pública do cliente. Credenciais administrativas, tokens privados e arquivos de service account não devem ser adicionados ao frontend nem ao repositório.

## Executar localmente

A aplicação é estática e usa ES Modules. Ela deve ser servida por HTTP; não abrir `index.html` diretamente por `file://`.

Exemplo usando Python:

```bash
python -m http.server 5500 --directory public
```

Depois abrir:

```text
http://localhost:5500
```

O login Google depende de `localhost` estar autorizado no Firebase Authentication.

## Deploy do frontend

O frontend é publicado pelo GitHub Pages. O workflow `.github/workflows/pages.yml` publica automaticamente a pasta `public/` em pushes para `main`.

No GitHub, habilitar uma única vez:

```text
Settings > Pages > Build and deployment > Source > GitHub Actions
```

A URL esperada é:

```text
https://abnereslava.github.io/eslavahub/
```

## Firebase CLI

A CLI é necessária apenas se você quiser publicar as Firestore Rules/índices a partir de uma máquina local:

```bash
firebase login
firebase use eslavahub-434e5
firebase deploy --only firestore
```

## Arquivos de infraestrutura

```text
.firebaserc
firebase.json
firestore.rules
firestore.indexes.json
```

Nenhum arquivo de service account é necessário para o frontend do MVP.
