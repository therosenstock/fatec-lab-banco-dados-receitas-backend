# Foodpedia API

## Setup

Instala as dependências do projeto usando o gerenciador de pacotes `yarn`:

```bash
yarn install
```

## Prisma

### Configuração do Prisma

Certifique-se de que o arquivo `.env` esteja configurado corretamente com as variáveis de ambiente necessárias para o Prisma.

### Atualizando o schema do Prisma
Para aplicar as migrações do Prisma, execute o seguinte comando:

```bash
yarn prisma db pull
```
### Gerar o cliente Prisma

Para gerar o cliente Prisma, execute:

```bash 
yarn prisma generate
```

## Executando o projeto

Para iniciar o projeto, execute o seguinte comando:

```bash
yarn dev
```
