import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const DEFAULT_ADMIN = {
  name: 'Administrador',
  email: 'admin@homecode.com',
  password: 'admin123',
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
}

main()
  .catch((error) => {
    console.error('Error ejecutando seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
