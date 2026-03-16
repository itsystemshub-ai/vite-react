# ERP Venezuela

Sistema ERP profesional para Venezuela — NestJS + Next.js + PostgreSQL + Prisma

## Stack

- **Backend**: NestJS 10, Prisma 5, PostgreSQL 15
- **Frontend**: Next.js 14 (App Router), TailwindCSS, TanStack Query, Recharts
- **Infraestructura**: Docker Compose (PostgreSQL + Redis + n8n)

## Inicio Rápido

### 1. Levantar base de datos

```bash
docker-compose up -d postgres redis
```

### 2. Instalar dependencias del backend

```bash
cd apps/backend
npm install
```

### 3. Generar cliente Prisma y crear tablas

```bash
npx prisma generate
npx prisma db push
```

### 4. Ejecutar seed (superusuario + datos iniciales)

```bash
npx ts-node prisma/seed.ts
```

### 5. Iniciar backend

```bash
npm run dev
# Corre en http://localhost:3001/api/v1
```

### 6. Instalar dependencias del frontend (nueva terminal)

```bash
cd apps/frontend
npm install
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
- Configuración + Gestor de Tablas + ERD
- Notificaciones en tiempo real

## Estructura

```
erp-venezuela/
├── apps/
│   ├── backend/     # NestJS API (puerto 3001)
│   └── frontend/    # Next.js 14 (puerto 3000)
├── docker-compose.yml
└── README.md
```
