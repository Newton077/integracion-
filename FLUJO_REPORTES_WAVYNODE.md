# 📊 Flujo de Reportes con Wavy Node

## Cómo Funciona

```
┌─────────────────────────────────────────────────────────────────┐
│  1. TÚ REGISTRAS LA WALLET CON EL USER ID                       │
│                                                                 │
│  POST /projects/1/addresses                                     │
│  {                                                              │
│    "address": "0x33a8CeDfd6c123cCdB3D81A1cdA5F28AeC5832B6",    │
│    "foreign_user_id": "user-123"  ← ID en tu sistema           │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  2. WAVY NODE MONITOREA LA BLOCKCHAIN                           │
│                                                                 │
│  • Detecta transacciones en la wallet                           │
│  • Analiza patrones sospechosos                                 │
│  • Identifica violaciones regulatorias                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  3. WAVY NODE NECESITA DATOS DEL USUARIO                        │
│                                                                 │
│  Wavy Node llama a TU servidor:                                 │
│  GET https://tu-ngrok-url.ngrok.io/users/user-123               │
│                                                                 │
│  Headers:                                                       │
│  - x-wavynode-hmac: <firma>                                     │
│  - x-wavynode-timestamp: <timestamp>                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  4. TU SERVIDOR RESPONDE CON LOS DATOS                          │
│                                                                 │
│  {                                                              │
│    "givenName": "Maria Guadalupe",                              │
│    "maternalSurname": "Sánchez",                                │
│    "paternalSurname": "Rodríguez",                              │
│    "birthdate": "1992-05-15",                                   │
│    "nationality": "MX",                                         │
│    "email": "maria.guadalupe@example.com",                      │
│    "phoneNumber": {                                             │
│      "countryCode": "+52",                                      │
│      "phoneNumber": 5512345678                                  │
│    },                                                           │
│    "address": { ... },                                          │
│    "mexico": {                                                  │
│      "rfc": "ROSM920515XXX",                                    │
│      "curp": "ROSM920515MDFRXXXX",                              │
│      ...                                                        │
│    }                                                            │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  5. WAVY NODE GENERA REPORTES EN SU DASHBOARD                   │
│                                                                 │
│  Con los datos del usuario, Wavy Node:                          │
│  • Genera reportes de cumplimiento                              │
│  • Valida contra regulaciones (México, OFAC, etc.)              │
│  • Crea alertas si hay violaciones                              │
│  • Muestra todo en su dashboard                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  6. WAVY NODE TE NOTIFICA (OPCIONAL)                            │
│                                                                 │
│  Si hay violaciones, te envía notificación:                     │
│  POST https://tu-ngrok-url.ngrok.io/webhook                     │
│  {                                                              │
│    "type": "notification",                                      │
│    "data": {                                                    │
│      "txHash": "0xabc...",                                      │
│      "inflictedLaws": [...]                                     │
│    }                                                            │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
```

## 🎯 Lo Importante

### Tu Responsabilidad
1. ✅ Mantener tu servidor activo (con ngrok en desarrollo)
2. ✅ Responder con datos actualizados del usuario en `GET /users/{userId}`
3. ✅ Registrar las wallets con el `foreign_user_id` correcto

### Responsabilidad de Wavy Node
1. ✅ Monitorear las transacciones en blockchain
2. ✅ Analizar cumplimiento normativo
3. ✅ Generar reportes en su dashboard
4. ✅ Enviarte notificaciones cuando hay problemas

## 📋 Configuración Necesaria

### 1. Tu Servidor Debe Estar Activo

```bash
# Terminal 1: Inicia tu servidor
sudo bun run dev

# Terminal 2: Expón tu servidor con ngrok
ngrok http 80
```

### 2. Configura la URL en Wavy Node Dashboard

En el dashboard de Wavy Node, configura:

**Integration URL** o **Webhook URL**:
```
https://abc123.ngrok.io
```

Wavy Node automáticamente llamará a:
- `https://abc123.ngrok.io/users/{userId}` - Para obtener datos
- `https://abc123.ngrok.io/webhook` - Para enviar notificaciones

### 3. Configura el SECRET

En el dashboard, copia el **Integration Secret** y actualiza tu `.env`:

```env
SECRET="el-secret-real-del-dashboard"
```

## 🔄 Flujo de Datos del Usuario

### Datos que Wavy Node Necesita

Tu endpoint `GET /users/{userId}` debe devolver:

```typescript
{
  // Datos básicos (requeridos)
  givenName: string,              // Nombre(s)
  maternalSurname: string,        // Apellido materno
  paternalSurname: string,        // Apellido paterno
  birthdate: string,              // YYYY-MM-DD
  nationality: string,            // Código ISO (MX, US, etc.)
  email: string,
  phoneNumber: {
    countryCode: string,          // +52, +1, etc.
    phoneNumber: number
  },
  
  // Dirección (requerida)
  address: {
    country: string,
    region: string,
    city: string,
    street: string,
    colonia: string,
    exteriorNumber: string,
    interiorNumber?: string,
    postalCode: string
  },
  
  // Datos específicos de México (si aplica)
  mexico?: {
    rfc: string,                  // RFC del usuario
    curp: string,                 // CURP
    actividadEconomica: number,   // Código de actividad
    cuentaRelacionada: string,    // Número de cuenta
    monedaCuentaRelacionada: number, // 1=MXN, 2=USD
    documentoIdentificacion: {
      tipoIdentificacion: number, // 1=INE/IFE
      numeroIdentificacion: string
    }
  }
}
```

### Personalizar con tu Base de Datos

Edita `server/utils/database.ts`:

```typescript
export async function getUserFromDatabase(userId: string): Promise<IUserData> {
  // Ejemplo con tu base de datos
  const user = await db.users.findOne({ id: userId });
  
  if (!user) {
    throw createError({
      status: 404,
      message: 'Usuario no encontrado'
    });
  }
  
  return {
    givenName: user.nombre,
    maternalSurname: user.apellidoMaterno,
    paternalSurname: user.apellidoPaterno,
    birthdate: user.fechaNacimiento,
    nationality: user.nacionalidad,
    email: user.email,
    phoneNumber: {
      countryCode: user.codigoPais,
      phoneNumber: user.telefono
    },
    address: {
      country: user.direccion.pais,
      region: user.direccion.estado,
      city: user.direccion.ciudad,
      street: user.direccion.calle,
      colonia: user.direccion.colonia,
      exteriorNumber: user.direccion.numeroExterior,
      interiorNumber: user.direccion.numeroInterior,
      postalCode: user.direccion.codigoPostal
    },
    mexico: user.datosMexico ? {
      rfc: user.datosMexico.rfc,
      curp: user.datosMexico.curp,
      actividadEconomica: user.datosMexico.actividadEconomica,
      cuentaRelacionada: user.datosMexico.cuentaBancaria,
      monedaCuentaRelacionada: 1, // 1=MXN
      documentoIdentificacion: {
        tipoIdentificacion: 1, // 1=INE
        numeroIdentificacion: user.datosMexico.numeroINE
      }
    } : undefined
  };
}
```

## 📊 Reportes en el Dashboard de Wavy Node

Una vez que Wavy Node obtiene los datos de tus usuarios, genera:

1. **Reportes de Cumplimiento**
   - Validación contra regulaciones mexicanas
   - Verificación de listas negras (OFAC, UE, etc.)
   - Análisis de patrones de lavado de dinero

2. **Alertas Automáticas**
   - Transacciones que exceden límites
   - Interacciones con wallets sancionadas
   - Patrones sospechosos

3. **Historial de Transacciones**
   - Todas las transacciones monitoreadas
   - Montos en USD
   - Tokens involucrados

## ✅ Checklist de Configuración

- [x] Wallet registrada con `foreign_user_id`
- [ ] Servidor corriendo en puerto 80
- [ ] ngrok exponiendo el servidor
- [ ] URL de ngrok configurada en dashboard de Wavy Node
- [ ] SECRET real del dashboard en `.env`
- [ ] Endpoint `GET /users/{userId}` devolviendo datos reales
- [ ] Probar que Wavy Node puede acceder a tu servidor

## 🧪 Probar la Integración

### 1. Verifica que tu servidor responde

```bash
# Desde tu máquina local
curl http://localhost:80/users/user-123

# Desde internet (con ngrok)
curl https://tu-url.ngrok.io/users/user-123
```

### 2. Simula una solicitud de Wavy Node

```bash
bun run examples/test-integration.ts
```

### 3. Verifica en el Dashboard de Wavy Node

1. Ve a https://dashboard.wavynode.com
2. Navega a la sección de **Reportes** o **Compliance**
3. Deberías ver los datos de tu usuario y las transacciones monitoreadas

## 🚀 Comandos para Mantener Activo

```bash
# Terminal 1: Servidor (debe estar siempre corriendo)
sudo bun run dev

# Terminal 2: ngrok (debe estar siempre corriendo)
ngrok http 80

# Terminal 3: Monitorear logs
tail -f logs/app.log
```

## 💡 Tips

1. **Datos actualizados**: Asegúrate de que tu endpoint siempre devuelva los datos más recientes del usuario
2. **Manejo de errores**: Si un usuario no existe, devuelve 404
3. **Performance**: Optimiza las consultas a tu base de datos
4. **Logs**: Registra todas las solicitudes de Wavy Node para debugging

## 🎉 Resultado Final

Con todo configurado:
- ✅ Wavy Node monitorea la wallet `0x33a8CeDfd6c123cCdB3D81A1cdA5F28AeC5832B6`
- ✅ Cuando hay transacciones, Wavy Node obtiene datos del usuario desde tu servidor
- ✅ Wavy Node genera reportes de cumplimiento en su dashboard
- ✅ Tú recibes notificaciones si hay violaciones
- ✅ Puedes ver todos los reportes en el dashboard de Wavy Node
