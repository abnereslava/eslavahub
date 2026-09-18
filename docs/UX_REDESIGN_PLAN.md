# Plano de Redesign Visual — EslavaHub

**Estado:** planejamento  
**Escopo:** aparência, consistência visual, densidade, hierarquia e experiência de uso  
**Regra principal:** preservar integralmente o comportamento funcional já consolidado

---

## 1. Objetivo

Reestruturar a aparência do EslavaHub para que a aplicação tenha uma linguagem visual coerente, mais profissional, mais compacta e mais fácil de escanear, sem reimplementar o produto nem alterar suas regras de negócio.

O redesign deve melhorar:

- hierarquia visual;
- consistência entre telas;
- densidade de informação;
- legibilidade;
- navegação;
- tabelas e grades editáveis;
- formulários;
- feedback de estado;
- responsividade;
- acessibilidade visual;
- percepção de qualidade do produto.

---

## 2. O que NÃO faz parte desta fase

O redesign não deve alterar:

- modelo Firestore;
- coleções ou caminhos de documentos;
- autenticação;
- allowlist;
- Firestore Security Rules;
- regras de domínio;
- regras de status;
- regras de vencimento;
- contratos de repositories;
- contratos de services;
- comportamento de CRUD;
- IDs;
- rotas/hash routing;
- lógica de filtros;
- lógica de ordenação;
- migração da planilha;
- workflow de deploy;
- stack do MVP.

Mudanças funcionais descobertas durante o redesign devem ser registradas separadamente e não incorporadas silenciosamente às tasks visuais.

---

## 3. Princípios de UX adotados

### 3.1 Progressive disclosure

A interface deve manter ações frequentes imediatamente acessíveis e revelar opções secundárias apenas quando solicitadas.

Aplicações:

- busca e ordenação permanecem expostas;
- filtros avançados ficam sob “Mais filtros”;
- ações destrutivas ficam em áreas secundárias;
- detalhes menos frequentes não devem competir visualmente com dados operacionais.

Referência:
- Nielsen Norman Group — Progressive Disclosure  
  https://www.nngroup.com/articles/progressive-disclosure/

### 3.2 Design tokens como fonte única de verdade

Cores, espaçamentos, tipografia, raio, bordas, sombras e estados devem ser definidos semanticamente e reutilizados.

Exemplos futuros:

```css
--color-surface
--color-surface-subtle
--color-text
--color-text-muted
--color-border
--color-primary
--color-success
--color-warning
--color-danger

--space-1
--space-2
--space-3
--space-4

--radius-sm
--radius-md
--radius-lg
```

A UI não deve continuar acumulando valores próximos, porém diferentes, para o mesmo papel visual.

Referências:
- Atlassian Design — Design tokens  
  https://atlassian.design/tokens/design-tokens/
- Atlassian Design — Spacing  
  https://atlassian.design/foundations/spacing

### 3.3 Hierarquia tipográfica consistente

A aplicação deve possuir poucos níveis tipográficos claramente definidos:

- título de página;
- título de seção;
- texto principal;
- texto secundário;
- label;
- metadado.

Referência:
- Atlassian Design — Typography  
  https://atlassian.design/foundations/typography

### 3.4 Interfaces densas para dados operacionais

EslavaHub é uma ferramenta de acompanhamento, não uma landing page.

Consequências:

- tabelas devem priorizar escaneabilidade;
- cards não devem ser usados quando uma linha tabular comunica melhor;
- espaçamento deve ser suficiente para legibilidade sem desperdiçar área útil;
- ícones e ações recorrentes devem manter posição estável;
- cabeçalhos e colunas devem ser previsíveis.

Referência:
- Carbon Design System — Data table  
  https://v10.carbondesignsystem.com/components/data-table/style/

### 3.5 Cor sem depender apenas de cor

Cor pode reforçar status, prioridade e alertas, mas o significado deve continuar disponível em texto, ícone, label ou estrutura.

Exemplos atuais:

- Idealizado — cinza;
- Desenvolvendo — amarelo;
- Funcional — azul;
- Finalizado — verde;
- Abandonado — vermelho.

### 3.6 Consistência antes de ornamentação

Priorizar:

1. alinhamento;
2. escala;
3. espaçamento;
4. contraste;
5. hierarquia;
6. estados;
7. responsividade.

Sombras, gradientes e detalhes decorativos são secundários.

---

## 4. Direção visual proposta

### 4.1 Personalidade

A interface deve parecer:

- técnica;
- organizada;
- sóbria;
- moderna;
- compacta;
- confiável.

Evitar aparência:

- excessivamente “dashboard genérico”;
- colorida demais;
- com muitos cards;
- com bordas e sombras competindo entre si;
- com tamanhos de controle inconsistentes.

### 4.2 Estrutura visual

Direção inicial:

- fundo geral neutro;
- superfícies brancas ou levemente diferenciadas;
- bordas discretas;
- elevação mínima;
- cor usada principalmente para semântica;
- controles com alturas padronizadas;
- tabela como componente central da área de projetos;
- ficha do projeto orientada a dados, não a grandes blocos.

---

## 5. Sistema visual a criar

### Tokens

Definir:

- paleta neutra;
- paleta semântica;
- status de projeto;
- status de pendência;
- tipografia;
- espaçamento;
- radius;
- bordas;
- sombras;
- tamanho de controles;
- breakpoints.

### Componentes-base

Padronizar visualmente:

- botão primário;
- botão secundário;
- botão destrutivo;
- botão de ícone;
- input;
- select;
- checkbox;
- badge;
- status select;
- chip;
- painel;
- tabela;
- linha de tabela;
- toolbar;
- filtro;
- estado vazio;
- loading;
- erro;
- confirmação;
- tooltip visual quando necessário.

---

## 6. Telas incluídas

### Login

Revisar:

- composição;
- marca;
- ação principal;
- feedback de autenticação.

### Shell

Revisar:

- topbar;
- navegação;
- conta;
- largura máxima;
- gutters;
- comportamento sticky;
- mobile.

### Dashboard

Revisar:

- hierarquia dos indicadores;
- densidade;
- agrupamento;
- tabelas/listas;
- uso de cor.

### Projetos

Revisar:

- toolbar;
- busca;
- filtros;
- tabela;
- status;
- links;
- domínio;
- paginação;
- estados vazios.

### Detalhe do projeto

Revisar:

- resumo superior;
- metadados;
- domínio;
- pendências;
- ações;
- área de arquivamento.

### Pendências

Preservar a grade inline já consolidada, trabalhando apenas em:

- densidade;
- hierarquia;
- affordance de edição;
- foco;
- status;
- prioridade;
- mobile.

### Domínios

Revisar:

- tabela/lista;
- vencimento;
- hierarquia de alertas;
- filtros.

### Cadastros auxiliares

Revisar:

- categorias;
- tecnologias;
- ações inline;
- consistência com demais tabelas.

---

## 7. Estratégia de implementação

O redesign deve ser incremental.

### Fase A — Fundação

Criar tokens e padrões sem trocar telas inteiras.

### Fase B — Componentes

Unificar controles e componentes repetidos.

### Fase C — Shell

Aplicar nova hierarquia global.

### Fase D — Telas operacionais

Aplicar em Projetos, Detalhe, Pendências, Domínios e Dashboard.

### Fase E — Responsividade e acessibilidade

Revisar todos os breakpoints e estados de teclado/foco.

### Fase F — QA visual

Comparar fluxos antes/depois e validar que nenhuma funcionalidade foi perdida.

---

## 8. Guard rails técnicos

Toda task de redesign deve respeitar:

- preferir alterações em CSS e markup de apresentação;
- JavaScript somente quando necessário para comportamento estritamente visual/interativo;
- não alterar repositories por necessidade estética;
- não alterar services por necessidade estética;
- não alterar regras de domínio;
- não renomear campos Firestore;
- não alterar IDs ou migrações;
- não remover ações existentes;
- não mudar fluxo de autenticação;
- não mudar URLs/rotas;
- preservar labels acessíveis;
- manter suporte desktop e mobile.

Se uma proposta exigir mudança funcional, ela deve virar uma task independente fora do redesign.

---

## 9. Breakpoints de validação

Validar pelo menos:

- 360 px — celular estreito;
- 390/430 px — celular comum;
- 768 px — tablet;
- 1024 px — notebook/tablet landscape;
- 1280 px — desktop;
- 1440 px ou mais — desktop amplo.

O layout não precisa ser idêntico entre tamanhos; deve preservar prioridade e usabilidade.

---

## 10. Critérios de aceite do redesign

O redesign estará concluído quando:

- tokens substituírem decisões visuais duplicadas relevantes;
- controles semelhantes tiverem aparência e dimensões consistentes;
- hierarquia tipográfica for uniforme;
- navegação for consistente em desktop/mobile;
- tabelas forem fáceis de escanear;
- formulários tiverem densidade coerente;
- status e alertas forem claros sem depender só de cor;
- foco por teclado estiver visível;
- telas principais funcionarem nos breakpoints definidos;
- nenhum fluxo consolidado for removido ou alterado;
- CI continuar passando;
- validação visual manual não encontrar regressões bloqueadoras.

---

## 11. Referências

- Nielsen Norman Group — Progressive Disclosure  
  https://www.nngroup.com/articles/progressive-disclosure/
- Atlassian Design — Foundations  
  https://atlassian.design/foundations
- Atlassian Design — Design Tokens  
  https://atlassian.design/tokens/design-tokens/
- Atlassian Design — Spacing  
  https://atlassian.design/foundations/spacing
- Atlassian Design — Typography  
  https://atlassian.design/foundations/typography
- Carbon Design System — Data Table  
  https://v10.carbondesignsystem.com/components/data-table/style/

---

## 12. Backlog

A execução detalhada está em:

[Redesign visual — tasks](tasks/08-redesign-visual.md)
