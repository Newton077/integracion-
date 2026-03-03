# WavyNode Integration Template

Esta es una integración completa con Wavy Node para monitoreo de cumplimiento normativo en transacciones blockchain.

## 🚀 Inicio Rápido

### 1. Configurar Variables de Entorno

```bash
cp .env.template .env
```

Edita `.env` con tus credenciales de Wavy Node:

```env
SECRET="tu-secret-de-wavynode"
WAVYNODE_API_KEY="tu-api-key"
WAVYNODE_PROJECT_ID="tu-project-id"
```

### 2. Instalar Dependencias

```bash
bun install
```

### 3. Iniciar Servidor de Desarrollo

```bash
bun run dev
```

El servidor estará disponible en `http://localhost:3000`

### 4. Registrar la Wallet del Usuario

Para registrar la wallet `0x33a8CeDfd6c123cCdB3D81A1cdA5F28AeC5832B6`:

```bash
bun run scripts/register-user-address.ts
```

Ver [COMO_REGISTRAR_WALLET.md](./COMO_REGISTRAR_WALLET.md) para más detalles.

## 📚 Documentación

- [Guía de Integración en Español](./INTEGRACION_WAVYNODE.md) - Documentación completa
- [Cómo Registrar Wallets](./COMO_REGISTRAR_WALLET.md) - Guía paso a paso
- [Documentación Oficial de Wavy Node](https://docs.wavynode.com)

## 🔌 Endpoints Implementados

### `GET /users/{foreign_user_id}`
Wavy Node llama a este endpoint para obtener datos del usuario.

### `POST /webhook`
Recibe notificaciones en tiempo real sobre transacciones y violaciones regulatorias.

## 🧪 Probar la Integración

Ejecuta el script de pruebas para verificar que todo funciona:

```bash
bun run examples/test-integration.ts
```

## 📁 Estructura del Proyecto

```
.
├── server/
│   ├── middleware/
│   │   └── auth.ts              # Autenticación HMAC
│   ├── routes/
│   │   ├── users/
│   │   │   └── [userId]/
│   │   │       └── index.get.ts # GET /users/{userId}
│   │   └── webhook/
│   │       └── index.post.ts    # POST /webhook
│   └── utils/
│       └── database.ts          # Funciones de base de datos
├── scripts/
│   └── register-user-address.ts # Script para registrar wallets
├── examples/
│   ├── register-address.ts      # Ejemplo de registro
│   └── test-integration.ts      # Tests de integración
├── .env.template                # Plantilla de variables de entorno
└── nitro.config.ts              # Configuración de Nitro
```

## 🔧 Desarrollo

### Construir para Producción

```bash
bun run build
```

Esto crea un directorio `.output` con el servidor listo para producción.

### Desplegar con Docker

```bash
docker build -t wavynode-integration .
docker run -p 3000:3000 --env-file .env wavynode-integration
```

## 🔐 Seguridad

Todas las solicitudes de Wavy Node están firmadas con HMAC-SHA256. El middleware de autenticación verifica automáticamente:

- Firma HMAC en el header `x-wavynode-hmac`
- Timestamp en el header `x-wavynode-timestamp`
- Tolerancia de tiempo de 5 minutos para prevenir ataques de replay

## 📝 Personalización

### Conectar con tu Base de Datos

Edita `server/utils/database.ts` y reemplaza las funciones mock con tu lógica real:

```typescript
export async function getUserFromDatabase(userId: string): Promise<IUserData> {
  // Implementa tu lógica aquí (Prisma, Drizzle, etc.)
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return mapUserToIUserData(user);
}
```

### Procesar Notificaciones

Edita `server/routes/webhook/index.post.ts` para manejar notificaciones según tus necesidades:

```typescript
case 'notification':
  await saveNotification(notification);
  if (notification.inflictedLaws.length > 0) {
    await sendUserAlert(notification.address.userId, notification);
  }
  break;
```

## 🆘 Soporte

- [Documentación de Wavy Node](https://docs.wavynode.com)
- [API Reference](https://docs.wavynode.com/api-reference/introduction)
- [Dashboard](https://dashboard.wavynode.com)
