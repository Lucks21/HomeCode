import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const DEFAULT_ADMIN = {
  name: 'Administrador',
  email: 'admin@homecode.com',
  password: 'admin123',
  roleName: 'ADMIN',
};

const SECOND_USER = {
  name: 'lucks21',
  email: 'lucks21@homecode.com',
  password: 'cuenta123',
  roleName: 'ADMIN',
};

const PERMISSIONS = [
  { code: 'CREATE_USER', description: 'Crear usuarios' },
  { code: 'READ_USER', description: 'Ver usuarios' },
  { code: 'UPDATE_USER', description: 'Actualizar usuarios' },
  { code: 'ACTIVATE_USER', description: 'Activar usuarios' },
  { code: 'DEACTIVATE_USER', description: 'Desactivar usuarios' },
  { code: 'ASSIGN_ROLES', description: 'Asignar roles a usuarios' },
  { code: 'CREATE_ROLE', description: 'Crear roles' },
  { code: 'READ_ROLE', description: 'Ver roles' },
  { code: 'UPDATE_ROLE', description: 'Actualizar roles' },
  { code: 'DELETE_ROLE', description: 'Eliminar roles' },
];

async function main() {
  const passwordHash = await bcrypt.hash(DEFAULT_ADMIN.password, 10);

  // Ensure permissions exist.
  for (const permission of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { code: permission.code },
      update: { description: permission.description },
      create: {
        code: permission.code,
        description: permission.description,
      },
    });
  }

  const allPermissions = await prisma.permission.findMany({
    where: { code: { in: PERMISSIONS.map((p) => p.code) } },
    select: { id: true },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: DEFAULT_ADMIN.roleName },
    update: {},
    create: { name: DEFAULT_ADMIN.roleName },
  });

  await prisma.rolePermission.deleteMany({ where: { roleId: adminRole.id } });
  await prisma.rolePermission.createMany({
    data: allPermissions.map((permission: { id: number }) => ({
      roleId: adminRole.id,
      permissionId: permission.id,
    })),
    skipDuplicates: true,
  });

  const adminUser = await prisma.user.upsert({
    where: { email: DEFAULT_ADMIN.email },
    update: {
      name: DEFAULT_ADMIN.name,
      passwordHash,
      active: true,
    },
    create: {
      name: DEFAULT_ADMIN.name,
      email: DEFAULT_ADMIN.email,
      passwordHash,
      active: true,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });

  console.log('Seed completada.');
  console.log(`Usuario: ${DEFAULT_ADMIN.email}`);
  console.log(`Password: ${DEFAULT_ADMIN.password}`);
  console.log(`Rol: ${DEFAULT_ADMIN.roleName}`);

  // Segundo usuario
  const secondPasswordHash = await bcrypt.hash(SECOND_USER.password, 10);
  const secondUser = await prisma.user.upsert({
    where: { email: SECOND_USER.email },
    update: {
      name: SECOND_USER.name,
      passwordHash: secondPasswordHash,
      active: true,
    },
    create: {
      name: SECOND_USER.name,
      email: SECOND_USER.email,
      passwordHash: secondPasswordHash,
      active: true,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: secondUser.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: secondUser.id,
      roleId: adminRole.id,
    },
  });

  console.log(`Usuario: ${SECOND_USER.email}`);
  console.log(`Password: ${SECOND_USER.password}`);
  console.log(`Rol: ${SECOND_USER.roleName}`);
}

main()
  .catch((error) => {
    console.error('Error ejecutando seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
