# CRM de Representação Comercial

Sistema web para gestão de pipeline de clientes e oportunidades de venda para representantes comerciais.

Este projeto foi desenvolvido para organizar o processo de prospecção, negociação e acompanhamento de clientes no varejo, permitindo maior visibilidade do funil de vendas e previsibilidade de receita.

---

# Objetivo

O sistema permite que representantes comerciais acompanhem toda a jornada de relacionamento com clientes, desde a descoberta até a conversão em cliente ativo.

Entre os principais objetivos estão:

* Centralizar informações de clientes
* Organizar o pipeline de vendas
* Registrar contatos e interações
* Melhorar a gestão de oportunidades
* Gerar previsões de faturamento

---

# Funcionalidades

## Gestão de Clientes

* Cadastro de clientes
* Classificação por tipo de estabelecimento
* Armazenamento de endereço e localização
* Histórico de relacionamento

## Pipeline de Vendas

O sistema organiza os clientes em estágios do funil comercial:

* Discovery
* Prospect
* Lead
* Cotação / Negociação
* Cliente ativo
* Não atendido

Isso permite acompanhar facilmente o avanço de cada oportunidade.

## Contatos

Cada cliente pode possuir múltiplos contatos associados:

* Nome do contato
* Telefone
* E-mail
* Observações

## Filtros e Busca

A interface permite:

* busca por nome
* filtragem por tipo de cliente
* visualização rápida de volume por categoria

## Interface

O sistema possui interface web moderna com:

* layout claro e intuitivo
* navegação simples
* tabela interativa de clientes
* sidebar com filtros de categoria

---

# Arquitetura

O projeto segue uma arquitetura separada entre frontend e backend.

## Frontend

Aplicação SPA desenvolvida com:

* React
* Vite
* TypeScript
* TailwindCSS

A interface é baseada em componentes reutilizáveis e arquitetura modular.

Principais responsabilidades do frontend:

* renderização da interface
* navegação
* filtros e busca
* integração com API

## Backend

O backend utiliza:

PocketBase

Responsável por:

* persistência de dados
* autenticação
* API REST
* gerenciamento de coleções

## Banco de Dados

O armazenamento de dados utiliza:

SQLite

Estrutura de dados baseada em coleções:

* clients
* contacts
* representations
* opportunities

---

### components

Componentes reutilizáveis da interface.

### pages

Páginas principais da aplicação.

### lib

Configuração de bibliotecas externas e clientes de API.

### types

Definições de tipos TypeScript.

---

# Modelo de Dados

## Clients

Representa empresas atendidas ou potenciais clientes.

Campos principais:

* name
* type
* city
* state
* address
* site
* status

## Contacts

Contatos associados a clientes.

Campos principais:

* client
* name
* phone
* email

## Representations

Empresas representadas pelo vendedor.

Campos principais:

* name
* category
* status

---

# Fluxo Comercial

O sistema foi projetado para refletir o processo real de vendas de representantes comerciais.

Fluxo típico:

1. Descoberta de empresas (discovery)
2. Primeiro contato (prospect)
3. Interesse demonstrado (lead)
4. Negociação ou cotação
5. Cliente ativo

Clientes também podem ser classificados como não atendidos quando:

* já possuem representante
* não possuem fit comercial
* recusaram proposta

---

# Escalabilidade

O sistema foi desenvolvido de forma modular para permitir evolução futura.

Possíveis expansões incluem:

* dashboard de métricas
* previsão de faturamento
* metas comerciais
* integração com WhatsApp
* histórico de interações
* geolocalização de clientes
* rotas de visita

---

# Público-Alvo

O sistema foi projetado principalmente para:

* representantes comerciais
* distribuidores
* vendedores B2B
* profissionais de vendas externas

---

# Licença

Este projeto está disponível para uso e modificação conforme necessidade do desenvolvedor ou organização responsável.

---

# Autor

Projeto desenvolvido como sistema de gestão comercial para organização de pipeline de vendas no setor de representação comercial.
