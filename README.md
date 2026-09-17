# EslavaHub

O **EslavaHub** é uma aplicação web para centralizar e acompanhar projetos de programação em um único lugar.

A proposta é substituir o controle disperso em planilhas e anotações por uma visão organizada de cada projeto, reunindo informações de desenvolvimento, repositório, publicação, domínio e pendências.

## Objetivo

Permitir que cada projeto tenha uma ficha central com as informações necessárias para acompanhamento do seu ciclo de vida, sem obrigar o preenchimento de campos que não façam sentido para aquele projeto.

## Informações por projeto

| Campo | Obrigatoriedade inicial |
| --- | --- |
| ID | Automático e obrigatório |
| Categoria | Obrigatório |
| Nome | Obrigatório |
| Link do repositório | Opcional |
| Link do deploy | Opcional |
| Cliente | Opcional |
| Status | Obrigatório |
| Linguagens/tecnologias utilizadas | Opcional |
| Domínio atribuído | Opcional |
| Data de expiração do domínio | Obrigatória apenas quando houver domínio com vencimento conhecido |
| Observações rápidas | Opcional |
| Pendências | Opcional |

Quando houver domínio cadastrado, o sistema deverá destacar domínios próximos do vencimento e domínios já vencidos.

Cada projeto também poderá manter uma lista própria de pendências. A estrutura mínima de uma pendência será **Estado**, **Onde/Área** e **O que deve ser feito**.

## Escopo inicial

O primeiro ciclo do produto deverá contemplar:

- cadastro, edição, visualização e arquivamento de projetos;
- busca e filtros por nome, categoria, cliente, status e tecnologia;
- links rápidos para repositório, deploy e domínio;
- acompanhamento dos estados dos projetos;
- cadastro e acompanhamento de pendências por projeto;
- controle de domínio e data de expiração;
- alertas visuais para domínios próximos do vencimento ou vencidos;
- dashboard com visão geral dos projetos, pendências e domínios;
- campos opcionais para que projetos simples não fiquem sobrecarregados com informações desnecessárias.

## Documentação

- [Proposta do produto](docs/PROPOSTA.md)
- [Software Design Document (SDD)](docs/SDD.md)
- [Backlog e documentação das tasks](docs/TASKS.md)

## Estado do projeto

**Fase:** concepção, especificação e planejamento inicial do MVP.

As decisões de stack, infraestrutura, autenticação, hospedagem e persistência ainda não estão definidas. Essas decisões fazem parte das primeiras tasks do backlog e, quando concluídas, deverão ser refletidas no SDD.
