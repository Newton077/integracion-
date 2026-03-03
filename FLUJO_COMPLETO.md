# Flujo Completo de Integración con Wavy Node

## 📋 Resumen

Este documento explica el flujo completo desde el registro de una wallet hasta recibir notificaciones de cumplimiento normativo.

## 🔄 Flujo de Integración

```
┌─────────────────────────────────────────────────────────────────┐
│                    1. REGISTRO DE WALLET                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
        Tu Aplicación ──────────────────► Wavy Node API
        POST /projects/{id}/addresses
        {
          "address": "0x33a8CeDfd6c123cCdB3D81A1cdA5F28AeC5832B6",
          "foreign_user_id": "user-123",
          "description": "Wallet principal"
        }
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              2. WAVY NODE MONITOREA LA BLOCKCHAIN               │
│                                                                 │
│  • Ethereum Mainnet                                             │
│  • Polygon                                                      │
│  • Arbitrum                                                     │
│  • Otras chains...                                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ¿Transacción detectada?
                              │
                    ┌─────────┴─────────┐
                    │                   │
                   NO                  SÍ
                    │                   │
                    │                   ▼
                    │     ┌─────────────────────────────┐
                    │     │ 3. ANÁLISIS DE CUMPLIMIENTO │
                    │     └─────────────────────────────┘
                    │                   │
                    │                   ▼
                    │     ¿Necesita datos del usuario?
                    │                   │
                    │                  SÍ
                    │                   │
                    │                   ▼
                    │     ┌─────────────────────────────┐
                    │     │ 4. SOLICITUD DE DATOS       │
                    │     └─────────────────────────────┘
                    │                   │
                    │                   ▼
                    │     Wavy Node ──────────► Tu Servidor
                    │     GET /users/user-123
                    │                   │
                    │                   ▼
                    │     Tu Servidor ──────────► Wavy Node
                    │     {
                    │       "givenName": "Maria",
                    │       "email": "maria@example.com",
                    │       ...
                    │     }
                    │                   │
                    └───────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────┐
│              5. NOTIFICACIÓN A TU SERVIDOR                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
        Wavy Node ──────────────────► Tu Servidor
        POST /webhook
        {
          "type": "notification",
          "data": {
            "txHash": "0xabc123...",
            "address": {
              "userId": "user-123",
              "address": "0x33a8CeDfd6c123cCdB3D81A1cdA5F28AeC5832B6"
            },
            "amount": { "usd": 3000 },
            "inflictedLaws": [...]
          }
        }
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              6. TU APLICACIÓN PROCESA LA NOTIFICACIÓN           │
│                                                                 │
│  • Guardar en base de datos                                     │
│  • Enviar alerta al usuario                                     │
│  • Generar reporte                                              │
│  • Bloquear cuenta si es necesario                              │
└─────────────────────────────────────────────────────────────────┘
```

## 🎯 Caso de Uso: Wallet Específica

### Wallet a Monitorear
```
0x33a8CeDfd6c123cCdB3D81A1cdA5F28AeC5832B6
```

### Usuario en tu Sistema
```
user-123
```

### Paso 1: Registrar la Wallet

```bash
# Ejecutar el script de registro
bun run scripts/register-user-address.ts
```

O manualmente con cURL:

```bash
curl -X POST "https://api.wavynode.com/v1/projects/YOUR_PROJECT_ID/addresses" \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "address": "0x33a8CeDfd6c123cCdB3D81A1cdA5F28AeC5832B6",
    "foreign_user_id": "user-123",
    "description": "Wallet principal del usuario"
  }'
```

### Paso 2: Wavy Node Monitorea

Wavy Node automáticamente comienza a monitorear todas las transacciones de esta wallet en las blockchains soportadas.

### Paso 3: Transacción Detectada

Ejemplo: El usuario envía 5 ETH (≈$15,000 USD) a otra dirección.

### Paso 4: Wavy Node Solicita Datos del Usuario

```http
GET /users/user-123
Host: tu-servidor.com
x-wavynode-hmac: abc123...
x-wavynode-timestamp: 1234567890
```

Tu servidor responde con:

```json
{
  "givenName": "Maria Guadalupe",
  "maternalSurname": "Sánchez",
  "paternalSurname": "Rodríguez",
  "birthdate": "1992-05-15",
  "nationality": "MX",
  "email": "maria.guadalupe@example.com",
  "mexico": {
    "rfc": "ROSM920515XXX",
    "curp": "ROSM920515MDFRXXXX"
  }
}
```

### Paso 5: Wavy Node Analiza y Envía Notificación

Si detecta una violación (ej: transacción excede límite sin KYC completo):

```http
POST /webhook
Host: tu-servidor.com
Content-Type: application/json
x-wavynode-hmac: def456...
x-wavynode-timestamp: 1234567890

{
  "type": "notification",
  "data": {
    "id": 1,
    "projectId": 1,
    "chainId": 1,
    "address": {
      "id": 543,
      "userId": "user-123",
      "address": "0x33a8CeDfd6c123cCdB3D81A1cdA5F28AeC5832B6",
      "description": "Wallet principal del usuario"
    },
    "txHash": "0xabc123def456...",
    "timestamp": "2026-03-03T10:30:00.000Z",
    "amount": {
      "value": 5000000000000000000,
      "usd": 15000
    },
    "token": {
      "name": "Ethereum",
      "symbol": "ETH",
      "decimals": 18,
      "address": null
    },
    "inflictedLaws": [
      {
        "name": "Límite de transacción excedido",
        "description": "Transacciones superiores a $10,000 USD requieren KYC completo",
        "source": "Ley Fintech México Art. 58",
        "risk": "warn",
        "country": "mexico",
        "countryCode": "MX"
      }
    ]
  }
}
```

### Paso 6: Tu Aplicación Procesa

Tu código en `server/routes/webhook/index.post.ts` procesa la notificación:

```typescript
case 'notification':
  const notification = body.data;
  
  // 1. Guardar en base de datos
  await saveNotification(notification);
  
  // 2. Si hay violaciones, alertar al usuario
  if (notification.inflictedLaws.length > 0) {
    await sendUserAlert(notification.address.userId, notification);
    
    // 3. Acciones adicionales según el riesgo
    for (const law of notification.inflictedLaws) {
      if (law.risk === 'illegal') {
        // Bloquear cuenta
        await blockUserAccount(notification.address.userId);
      } else if (law.risk === 'warn') {
        // Solicitar KYC adicional
        await requestAdditionalKYC(notification.address.userId);
      }
    }
  }
  
  break;
```

## 🔐 Autenticación

Todas las solicitudes de Wavy Node incluyen:

```
x-wavynode-hmac: <firma-hmac-sha256>
x-wavynode-timestamp: <timestamp-en-ms>
```

Tu middleware (`server/middleware/auth.ts`) verifica automáticamente estas firmas usando el paquete `@wavynode/utils`.

## 📊 Tipos de Riesgo

### `warn` (Advertencia)
- Transacción sospechosa pero no ilegal
- Requiere revisión manual
- Usuario puede continuar operando

### `illegal` (Ilegal)
- Violación clara de regulaciones
- Requiere acción inmediata
- Considerar bloqueo de cuenta

## 🚨 Ejemplos de Violaciones Comunes

1. **Límite de transacción excedido**
   - Transacciones > $10,000 USD sin KYC completo
   - Regulación: Ley Fintech México

2. **Interacción con wallet en lista negra**
   - Envío/recepción de fondos de direcciones sancionadas
   - Regulación: OFAC, UE, etc.

3. **Patrón de lavado de dinero**
   - Múltiples transacciones pequeñas (smurfing)
   - Movimientos circulares de fondos

4. **Jurisdicción restringida**
   - Usuario en país sancionado
   - Regulación: Sanciones internacionales

## 📈 Próximos Pasos

1. ✅ Configurar variables de entorno
2. ✅ Registrar la wallet `0x33a8CeDfd6c123cCdB3D81A1cdA5F28AeC5832B6`
3. ⏳ Implementar lógica de base de datos en `server/utils/database.ts`
4. ⏳ Personalizar manejo de notificaciones en `server/routes/webhook/index.post.ts`
5. ⏳ Configurar sistema de alertas (email, SMS, push)
6. ⏳ Desplegar a producción

## 🔗 Referencias

- [Documentación Completa](./INTEGRACION_WAVYNODE.md)
- [Guía de Registro](./COMO_REGISTRAR_WALLET.md)
- [Wavy Node Docs](https://docs.wavynode.com)
