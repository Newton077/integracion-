# Cómo Registrar la Wallet del Usuario en Wavy Node

## Dirección a Registrar
```
0x33a8CeDfd6c123cCdB3D81A1cdA5F28AeC5832B6
```

## Pasos para Registrar

### 1. Configurar Variables de Entorno

Primero, copia el archivo de plantilla:
```bash
cp .env.template .env
```

Edita el archivo `.env` y configura:

```env
# Secret para validar firmas HMAC (obtén esto de tu dashboard de Wavy Node)
SECRET="tu-secret-de-wavynode"

# API Key para hacer llamadas a la API de Wavy Node
WAVYNODE_API_KEY="tu-api-key"

# Project ID de tu proyecto en Wavy Node
WAVYNODE_PROJECT_ID="tu-project-id"
```

### 2. Ejecutar el Script de Registro

Ejecuta el script que registrará automáticamente la wallet:

```bash
bun run scripts/register-user-address.ts
```

Este script:
- Registra la dirección `0x33a8CeDfd6c123cCdB3D81A1cdA5F28AeC5832B6`
- La vincula con el usuario `user-123` en tu sistema
- Verifica que el registro fue exitoso

### 3. Personalizar el User ID

Si necesitas usar un ID de usuario diferente, edita el archivo `scripts/register-user-address.ts`:

```typescript
// Cambia esta línea con el ID real del usuario en tu sistema
const USER_ID = "user-123"; // <- Cambia esto
```

### 4. Registro Manual con cURL

También puedes registrar la dirección manualmente usando cURL:

```bash
curl -X POST "https://api.wavynode.com/v1/projects/$WAVYNODE_PROJECT_ID/addresses" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $WAVYNODE_API_KEY" \
  -d '{
    "address": "0x33a8CeDfd6c123cCdB3D81A1cdA5F28AeC5832B6",
    "foreign_user_id": "user-123",
    "description": "Wallet principal del usuario"
  }'
```

## Qué Sucede Después del Registro

Una vez registrada la dirección:

1. **Wavy Node comienza a monitorear** todas las transacciones de esta wallet
2. **Cuando detecta actividad sospechosa**, envía una notificación a tu endpoint `POST /webhook`
3. **Si necesita datos del usuario**, llama a tu endpoint `GET /users/user-123`

## Ejemplo de Notificación que Recibirás

Cuando haya una transacción en la wallet, recibirás algo como esto en tu webhook:

```json
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
    "txHash": "0xabc123...",
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
        "name": "Límite de transacción excedido",
        "description": "La transacción excede el límite permitido",
        "source": "Regulación Fintech",
        "risk": "warn",
        "country": "mexico",
        "countryCode": "MX"
      }
    ]
  }
}
```

## Verificar el Registro

Para verificar que la dirección está registrada correctamente:

```bash
curl -H "x-api-key: $WAVYNODE_API_KEY" \
  "https://api.wavynode.com/v1/projects/$WAVYNODE_PROJECT_ID/addresses"
```

Esto te mostrará todas las direcciones registradas en tu proyecto.

## Vincular Múltiples Wallets al Mismo Usuario

Si el usuario tiene múltiples wallets, simplemente registra cada una con el mismo `foreign_user_id`:

```bash
# Wallet 1
curl -X POST "https://api.wavynode.com/v1/projects/$WAVYNODE_PROJECT_ID/addresses" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $WAVYNODE_API_KEY" \
  -d '{
    "address": "0x33a8CeDfd6c123cCdB3D81A1cdA5F28AeC5832B6",
    "foreign_user_id": "user-123",
    "description": "Wallet principal"
  }'

# Wallet 2
curl -X POST "https://api.wavynode.com/v1/projects/$WAVYNODE_PROJECT_ID/addresses" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $WAVYNODE_API_KEY" \
  -d '{
    "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "foreign_user_id": "user-123",
    "description": "Wallet secundaria"
  }'
```

Wavy Node automáticamente vinculará ambas wallets al mismo usuario.

## Solución de Problemas

### Error 401: Unauthorized
- Verifica que tu `WAVYNODE_API_KEY` sea correcta
- Asegúrate de incluir el header `x-api-key`

### Error 404: Not Found
- Verifica que tu `WAVYNODE_PROJECT_ID` sea correcto
- Confirma que el proyecto existe en tu dashboard

### Error 400: Bad Request
- Verifica que la dirección de wallet sea válida
- Asegúrate de que el formato JSON sea correcto

## Recursos

- [Documentación de Wavy Node](https://docs.wavynode.com)
- [API Reference](https://docs.wavynode.com/api-reference/introduction)
- [Dashboard de Wavy Node](https://dashboard.wavynode.com)
