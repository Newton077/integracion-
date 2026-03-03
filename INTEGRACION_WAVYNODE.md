# Integración con Wavy Node

Esta aplicación implementa una integración completa con Wavy Node para recibir notificaciones de cumplimiento normativo en tiempo real y monitorear actividad on-chain.

## Configuración Inicial

### 1. Variables de Entorno

Copia el archivo de plantilla y configura tu secreto:

```bash
cp .env.template .env
```

Edita `.env` y agrega tu secreto de Wavy Node:

```
SECRET="tu-secreto-de-wavynode"
```

### 2. Instalación de Dependencias

```bash
bun install
```

### 3. Desarrollo

```bash
bun run dev
```

El servidor estará disponible en `http://localhost:3000`

## Endpoints Implementados

### `GET /users/{foreign_user_id}`

Wavy Node llama a este endpoint para obtener información de un usuario específico.

**Parámetros:**
- `foreign_user_id`: ID del usuario en tu sistema (el mismo que proporcionaste al registrar la dirección de wallet)

**Respuesta:**
```json
{
  "givenName": "Maria Guadalupe",
  "maternalSurname": "Sánchez",
  "paternalSurname": "Rodríguez",
  "birthdate": "1992-05-15",
  "nationality": "MX",
  "phoneNumber": {
    "countryCode": "+52",
    "phoneNumber": 5512345678
  },
  "email": "maria.guadalupe@example.com",
  "address": {
    "country": "MX",
    "region": "CDMX",
    "city": "Ciudad de México",
    "street": "Avenida Insurgentes Sur",
    "colonia": "Condesa",
    "exteriorNumber": "123",
    "interiorNumber": "4B",
    "postalCode": "06100"
  },
  "mexico": {
    "rfc": "ROSM920515XXX",
    "curp": "ROSM920515MDFRXXXX",
    "actividadEconomica": 612012,
    "cuentaRelacionada": "1234567890",
    "monedaCuentaRelacionada": 1,
    "documentoIdentificacion": {
      "tipoIdentificacion": 1,
      "numeroIdentificacion": "IDMEX12345678"
    }
  }
}
```

**Nota:** El objeto `mexico` solo es necesario si tienes habilitado el cumplimiento normativo mexicano en tu dashboard.

### `POST /webhook`

Wavy Node envía notificaciones en tiempo real a este endpoint.

**Tipos de notificaciones:**

#### 1. Notificación de transacción
```json
{
  "type": "notification",
  "data": {
    "id": 1,
    "projectId": 1,
    "chainId": 42161,
    "address": {
      "id": 543,
      "userId": "user-in-your-db-123",
      "address": "0xyour-address-involved",
      "description": "Descripción de tu dirección"
    },
    "txHash": "some-tx-hash",
    "timestamp": "2025-08-20T05:10:57.228Z",
    "amount": {
      "value": 1000000000000000000,
      "usd": 3000
    },
    "token": {
      "name": "Ethereum",
      "symbol": "ETH",
      "decimals": 18,
      "address": null
    },
    "inflictedLaws": [
      {
        "name": "Nombre de la ley infringida",
        "description": "Descripción de la ley",
        "source": "Fuente de la ley",
        "risk": "warn",
        "country": "mexico",
        "countryCode": "MX"
      }
    ]
  }
}
```

#### 2. Notificación de error
```json
{
  "type": "error",
  "data": "Mensaje de error"
}
```

## Autenticación

Todas las solicitudes de Wavy Node están firmadas con HMAC-SHA256. El middleware de autenticación (`server/middleware/auth.ts`) verifica automáticamente:

1. **Firma HMAC** en el header `x-wavynode-hmac`
2. **Timestamp** en el header `x-wavynode-timestamp`
3. **Tolerancia de tiempo** de 5 minutos (300,000 ms)

Si la firma no es válida o falta algún header, la solicitud es rechazada con un error 401.

## Flujo de Integración

1. **Registrar direcciones para monitoreo**
   - Usa `POST /projects/{projectId}/addresses` de la API de Wavy Node
   - Incluye el parámetro `foreign_user_id` para vincular cada wallet con un usuario en tu sistema

2. **Wavy Node monitorea actividad on-chain**
   - Wavy Node vigila las direcciones registradas en busca de transacciones sospechosas
   - Detecta violaciones regulatorias e interacciones con wallets en lista negra

3. **Wavy Node solicita datos de usuario cuando es necesario**
   - Llama a tu endpoint `GET /users/{userId}`
   - Devuelve los datos que tengas disponibles (KYC completo o parcial)

4. **Recibes alertas en tiempo real**
   - Wavy Node envía notificaciones a tu endpoint `POST /webhook`
   - Incluye detalles de la transacción y violaciones regulatorias

## Personalización

### Conectar con tu Base de Datos

Edita `server/routes/users/[userId]/index.get.ts` y reemplaza la función `getUser` con tu lógica real:

```typescript
const getUser = async (userId: string): Promise<IUserData> => {
  // Ejemplo con Prisma
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { address: true, mexicanData: true }
  });

  if (!user) {
    throw createError({
      status: 404,
      message: 'Usuario no encontrado'
    });
  }

  return {
    givenName: user.givenName,
    maternalSurname: user.maternalSurname,
    paternalSurname: user.paternalSurname,
    birthdate: user.birthdate,
    nationality: user.nationality,
    phoneNumber: {
      countryCode: user.phoneCountryCode,
      phoneNumber: user.phoneNumber
    },
    email: user.email,
    address: {
      country: user.address.country,
      region: user.address.region,
      city: user.address.city,
      street: user.address.street,
      colonia: user.address.colonia,
      exteriorNumber: user.address.exteriorNumber,
      interiorNumber: user.address.interiorNumber,
      postalCode: user.address.postalCode
    },
    mexico: user.mexicanData ? {
      rfc: user.mexicanData.rfc,
      curp: user.mexicanData.curp,
      actividadEconomica: user.mexicanData.actividadEconomica,
      cuentaRelacionada: user.mexicanData.cuentaRelacionada,
      monedaCuentaRelacionada: user.mexicanData.monedaCuentaRelacionada,
      documentoIdentificacion: {
        tipoIdentificacion: user.mexicanData.tipoIdentificacion,
        numeroIdentificacion: user.mexicanData.numeroIdentificacion
      }
    } : undefined
  };
};
```

### Procesar Notificaciones

Edita `server/routes/webhook/index.post.ts` para manejar las notificaciones según tus necesidades:

```typescript
case 'notification':
  const notification = body.data;
  
  // Guardar en base de datos
  await prisma.transaction.create({
    data: {
      userId: notification.address.userId,
      txHash: notification.txHash,
      amount: notification.amount.usd,
      timestamp: new Date(notification.timestamp),
      chainId: notification.chainId,
      hasViolations: notification.inflictedLaws.length > 0
    }
  });

  // Enviar alerta si hay violaciones
  if (notification.inflictedLaws.length > 0) {
    await sendAlertToUser(notification.address.userId, notification);
  }
  
  break;
```

## Despliegue

### Con Docker

```bash
docker build -t wavynode-integration .
docker run -p 3000:3000 --env-file .env wavynode-integration
```

### Producción

```bash
bun run build
```

Esto genera un directorio `.output` con el servidor listo para producción.

## Recursos Adicionales

- [Documentación completa de Wavy Node](https://docs.wavynode.com)
- [Referencia de API](https://docs.wavynode.com/api-reference/introduction)
- [Paquete @wavynode/utils](https://www.npmjs.com/package/@wavynode/utils)

## Soporte

Para más información sobre la integración, visita [docs.wavynode.com](https://docs.wavynode.com) o consulta el archivo `llms.txt` en la documentación.
