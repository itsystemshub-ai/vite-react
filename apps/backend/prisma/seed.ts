import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const ALL_PERMISSIONS = [
  ...['create','read','update','delete','approve','invoice','credit_note','export'].map(a => ({ module: 'ventas', action: a })),
  ...['create','read','update','delete','approve','receive','export'].map(a => ({ module: 'compras', action: a })),
  ...['create','read','update','delete','adjust','transfer','count','export'].map(a => ({ module: 'inventario', action: a })),
  ...['create','read','update','delete','close_period','reopen_period','export','approve'].map(a => ({ module: 'contabilidad', action: a })),
  ...['create','read','update','delete','process_payroll','approve_payroll','export','view_salary'].map(a => ({ module: 'rrhh', action: a })),
  ...['create','read','update','delete','export','campaigns'].map(a => ({ module: 'crm', action: a })),
  ...['create','read','update','delete','approve','export'].map(a => ({ module: 'produccion', action: a })),
  ...['create','read','update','delete','approve','export'].map(a => ({ module: 'proyectos', action: a })),
  ...['create','read','update','delete','depreciate','retire','export'].map(a => ({ module: 'activos', action: a })),
  ...['create','read','update','delete','approve','reconcile','export'].map(a => ({ module: 'tesoreria', action: a })),
  ...['create','read','update','delete','approve','export'].map(a => ({ module: 'presupuesto', action: a })),
  ...['create','read','update','delete','approve','export'].map(a => ({ module: 'calidad', action: a })),
  ...['create','read','update','delete','approve','export'].map(a => ({ module: 'mantenimiento', action: a })),
  ...['create','read','update','delete','close_shift','export'].map(a => ({ module: 'pos', action: a })),
  ...['read','export','schedule','share'].map(a => ({ module: 'reportes', action: a })),
  ...['read','write','schema_read','schema_write','users','roles','audit','backup'].map(a => ({ module: 'config', action: a })),
  ...['read','use','train','export'].map(a => ({ module: 'ai', action: a })),
  ...['create','read','delete','export'].map(a => ({ module: 'importacion', action: a })),
  ...['create','read','update','delete','share'].map(a => ({ module: 'documentos', action: a })),
  ...['read','manage'].map(a => ({ module: 'notificaciones', action: a })),
  ...['read','approve','reject','manage'].map(a => ({ module: 'aprobaciones', action: a })),
];

async function main() {
  console.log('🌱 Iniciando seed del ERP Venezuela...');

  // Rol SUPERADMIN
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'SUPERADMIN' },
    update: {},
    create: { name: 'SUPERADMIN', permissions: { create: ALL_PERMISSIONS } },
  });
  console.log(`✅ Rol SUPERADMIN: ${ALL_PERMISSIONS.length} permisos`);

  // Roles estándar
  const roles = [
    { name: 'ADMIN', modules: ['ventas','compras','inventario','contabilidad','rrhh','reportes','config'] },
    { name: 'CONTADOR', modules: ['contabilidad','reportes','tesoreria','presupuesto','activos'] },
    { name: 'VENDEDOR', modules: ['ventas','crm','inventario','pos'] },
    { name: 'ALMACENISTA', modules: ['inventario','compras'] },
    { name: 'RRHH', modules: ['rrhh','reportes'] },
    { name: 'GERENTE', modules: ['ventas','compras','inventario','contabilidad','rrhh','reportes','crm','proyectos'] },
  ];
  for (const r of roles) {
    const perms = ALL_PERMISSIONS.filter(p => r.modules.includes(p.module));
    await prisma.role.upsert({
      where: { name: r.name },
      update: {},
      create: { name: r.name, permissions: { create: perms } },
    });
  }
  console.log(`✅ ${roles.length} roles estándar creados`);

  // Superusuario
  const hash = await bcrypt.hash('Admin@ERP2024!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@erp.local' },
    update: { passwordHash: hash, roleId: superAdminRole.id },
    create: {
      email: 'admin@erp.local',
      passwordHash: hash,
      name: 'Administrador del Sistema',
      roleId: superAdminRole.id,
    },
  });
  console.log(`✅ Superusuario: ${admin.email} / Admin@ERP2024!`);

  // Plan de cuentas venezolano
  const cuentas = [
    { code: '1', name: 'ACTIVOS', type: 'ACTIVO' as const, level: 1 },
    { code: '1.01', name: 'ACTIVO CIRCULANTE', type: 'ACTIVO' as const, level: 2 },
    { code: '1.01.01', name: 'Caja', type: 'ACTIVO' as const, level: 3 },
    { code: '1.01.02', name: 'Bancos', type: 'ACTIVO' as const, level: 3 },
    { code: '1.01.03', name: 'Inventario de Mercancías', type: 'ACTIVO' as const, level: 3 },
    { code: '1.01.04', name: 'Cuentas por Cobrar Clientes', type: 'ACTIVO' as const, level: 3 },
    { code: '1.01.05', name: 'IVA Crédito Fiscal', type: 'ACTIVO' as const, level: 3 },
    { code: '1.02', name: 'ACTIVO NO CIRCULANTE', type: 'ACTIVO' as const, level: 2 },
    { code: '1.02.01', name: 'Muebles y Enseres', type: 'ACTIVO' as const, level: 3 },
    { code: '1.02.02', name: 'Equipos de Computación', type: 'ACTIVO' as const, level: 3 },
    { code: '1.02.03', name: 'Vehículos', type: 'ACTIVO' as const, level: 3 },
    { code: '1.02.04', name: 'Depreciación Acumulada', type: 'ACTIVO' as const, level: 3 },
    { code: '2', name: 'PASIVOS', type: 'PASIVO' as const, level: 1 },
    { code: '2.01', name: 'PASIVO CIRCULANTE', type: 'PASIVO' as const, level: 2 },
    { code: '2.01.01', name: 'Cuentas por Pagar Proveedores', type: 'PASIVO' as const, level: 3 },
    { code: '2.01.02', name: 'IVA Débito Fiscal', type: 'PASIVO' as const, level: 3 },
    { code: '2.01.03', name: 'Retenciones IVA por Pagar', type: 'PASIVO' as const, level: 3 },
    { code: '2.01.04', name: 'ISLR Retenido por Pagar', type: 'PASIVO' as const, level: 3 },
    { code: '2.01.05', name: 'Prestaciones Sociales por Pagar', type: 'PASIVO' as const, level: 3 },
    { code: '2.01.06', name: 'Sueldos y Salarios por Pagar', type: 'PASIVO' as const, level: 3 },
    { code: '3', name: 'PATRIMONIO', type: 'PATRIMONIO' as const, level: 1 },
    { code: '3.01', name: 'Capital Social', type: 'PATRIMONIO' as const, level: 2 },
    { code: '3.02', name: 'Utilidades Retenidas', type: 'PATRIMONIO' as const, level: 2 },
    { code: '3.03', name: 'Resultado del Ejercicio', type: 'PATRIMONIO' as const, level: 2 },
    { code: '4', name: 'INGRESOS', type: 'INGRESO' as const, level: 1 },
    { code: '4.01', name: 'INGRESOS OPERACIONALES', type: 'INGRESO' as const, level: 2 },
    { code: '4.01.01', name: 'Ventas de Mercancías', type: 'INGRESO' as const, level: 3 },
    { code: '4.01.02', name: 'Ventas de Servicios', type: 'INGRESO' as const, level: 3 },
    { code: '4.02', name: 'OTROS INGRESOS', type: 'INGRESO' as const, level: 2 },
    { code: '4.02.01', name: 'Intereses Ganados', type: 'INGRESO' as const, level: 3 },
    { code: '4.02.02', name: 'Diferencial Cambiario Ganado', type: 'INGRESO' as const, level: 3 },
    { code: '5', name: 'COSTOS Y GASTOS', type: 'GASTO' as const, level: 1 },
    { code: '5.01', name: 'COSTO DE VENTAS', type: 'GASTO' as const, level: 2 },
    { code: '5.01.01', name: 'Costo de Mercancías Vendidas', type: 'GASTO' as const, level: 3 },
    { code: '5.02', name: 'GASTOS OPERACIONALES', type: 'GASTO' as const, level: 2 },
    { code: '5.02.01', name: 'Sueldos y Salarios', type: 'GASTO' as const, level: 3 },
    { code: '5.02.02', name: 'Prestaciones Sociales', type: 'GASTO' as const, level: 3 },
    { code: '5.02.03', name: 'Utilidades', type: 'GASTO' as const, level: 3 },
    { code: '5.02.04', name: 'Vacaciones', type: 'GASTO' as const, level: 3 },
    { code: '5.02.05', name: 'Depreciación del Ejercicio', type: 'GASTO' as const, level: 3 },
    { code: '5.02.06', name: 'Alquileres', type: 'GASTO' as const, level: 3 },
    { code: '5.02.07', name: 'Servicios Públicos', type: 'GASTO' as const, level: 3 },
    { code: '5.03', name: 'GASTOS FINANCIEROS', type: 'GASTO' as const, level: 2 },
    { code: '5.03.01', name: 'Intereses Bancarios', type: 'GASTO' as const, level: 3 },
    { code: '5.03.02', name: 'Diferencial Cambiario Perdido', type: 'GASTO' as const, level: 3 },
  ];
  for (const c of cuentas) {
    await prisma.account.upsert({ where: { code: c.code }, update: {}, create: c });
  }
  console.log(`✅ Plan de cuentas: ${cuentas.length} cuentas`);

  // Configuración inicial
  const configs = [
    { key: 'company_name', value: 'Mi Empresa C.A.', group: 'empresa' },
    { key: 'company_rif', value: 'J-00000000-0', group: 'empresa' },
    { key: 'company_address', value: 'Caracas, Venezuela', group: 'empresa' },
    { key: 'iva_rate', value: '16', group: 'impuestos' },
    { key: 'iva_reduced_rate', value: '8', group: 'impuestos' },
    { key: 'retention_iva_rate', value: '75', group: 'impuestos' },
    { key: 'invoice_prefix', value: 'F', group: 'facturacion' },
    { key: 'currency_primary', value: 'VES', group: 'moneda' },
    { key: 'currency_secondary', value: 'USD', group: 'moneda' },
    { key: 'bcv_sync_enabled', value: 'true', group: 'moneda' },
    { key: 'payroll_frequency', value: 'QUINCENAL', group: 'rrhh' },
    { key: 'min_wage_ves', value: '130', group: 'rrhh' },
  ];
  for (const c of configs) {
    await prisma.systemConfig.upsert({ where: { key: c.key }, update: {}, create: c });
  }
  console.log(`✅ Configuración inicial: ${configs.length} parámetros`);

  // Almacén principal
  await prisma.warehouse.upsert({
    where: { name: 'Almacén Principal' },
    update: {},
    create: { name: 'Almacén Principal', address: 'Sede Principal' },
  });
  console.log('✅ Almacén principal creado');

  console.log('\n🎉 Seed completado');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  Email:    admin@erp.local');
  console.log('  Password: Admin@ERP2024!');
  console.log('  ⚠️  Cambiar contraseña en primer login');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
