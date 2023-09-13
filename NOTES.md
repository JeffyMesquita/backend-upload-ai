# Starting a Nodejs Project

## 1. Initialize a Nodejs Project

```bash
pnpm init
```

## 2. Install Dependencies

```bash
pnpm i typescript @types/node tsx -D
```

```bash
pnpm i fastify
```

```bash
pnpm i prisma -D
```

## 3. Initialize Prisma

```bash
pnpm prisma init --datasource-provider sqlite
```

## 4. Create a Database

```bash
pnpm prisma migrate dev
```

## 5. Install fastify/multipart

```bash
pnpm i @fastify/multipart
```

## 6. Install Zod

```bash
pnpm i zod
```

## 7. Install OpenAi

```bash
pnpm i openai
```

## 8. Install dotenv

```bash
pnpm i dotenv -D
```
