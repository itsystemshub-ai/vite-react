# ERP Venezuela

Sistema ERP profesional para Venezuela — NestJS + Next.js + Neon PostgreSQL + Prisma

## Stack

- **Backend**: NestJS 10, Prisma 5, Neon PostgreSQL (serverless)
- **Frontend**: Next.js 14 (App Router), TailwindCSS, TanStack Query, Recharts
- **Base de datos**: Neon — PostgreSQL serverless gratuito (sin Docker)

## Inicio Rápido

### 1. Crear base de datos en Neon (gratis, sin instalar nada)

1. Ve a **https://neon.tech** y crea una cuenta gratuita
2. Crea un nuevo proyecto (ej: `erp-venezuela`)
3. En el dashboard copia la **Connection String** que tiene este formato:
   ```
   postgresql://usuario:password@ep-xxxx.us-east-2.aws.neon.tech/erp?sslmode=require
   ```
4. Pégala en `apps/backend/.env`:
   ```env
   DATABASE_URL="postgresql://usuario:password@ep-xxxx.us-east-2.aws.neon.tech/erp?sslmode=require"
   ```

### 2. Instalar dependencias

```bash
# Desde la raíz del proyecto
npm install
```

### 3. Crear tablas y ejecutar seed

```bash
cd apps/backend
npx prisma db push
npx ts-node prisma/seed.ts
```

### 4. Iniciar backend

```bash
# En apps/backend
npm run dev
# Corre en http://localhost:3001/api/v1
```

### 5. Iniciar frontend (nueva terminal)

```bash
# En apps/frontend
npm run dev
# Corre en http://localhost:3000
```

## Credenciales Iniciales

| Campo | Valor |
|-------|-------|
| URL | http://localhost:3000 |
| Email | admin@erp.local |
| Contraseña | Admin@ERP2024! |
| Rol | SUPERADMIN (todos los permisos) |

> Cambiar la contraseña en el primer login.

## Servicios Gratuitos Usados

| Servicio | Uso | URL |
|----------|-----|-----|
| Neon | PostgreSQL serverless | https://neon.tech |
| Upstash | Redis serverless (opcional) | https://upstash.com |
| Vercel | Deploy frontend (opcional) | https://vercel.com |
| Railway | Deploy backend (opcional) | https://railway.app |

## Módulos Disponibles

- Dashboard con KPIs y gráficos
- Ventas y Facturación (IVA venezolano)
- Compras y Proveedores
- Inventario con stock por almacén
- Contabilidad (plan de cuentas venezolano)
- RRHH / Nómina (LOTTT)
- CRM (leads, clientes, proveedores)
- Tesorería y Flujo de Caja
- Activos Fijos con depreciación automática
- Moneda / Tasas BCV con sync automático
- Configuración + Gestor de Tablas + ERD visual
- Notificaciones en tiempo real

## Estructura

```
erp-venezuela/
├── apps/
│   ├── backend/     # NestJS API (puerto 3001)
│   └── frontend/    # Next.js 14 (puerto 3000)
└── README.md
```
