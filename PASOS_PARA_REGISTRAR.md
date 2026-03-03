# 🚀 Pasos para Registrar la Wallet

## Wallet a Registrar
```
0x33a8CeDfd6c123cCdB3D81A1cdA5F28AeC5832B6
```

## ✅ API Key Configurada
```
wavy_cPzKp6HGRwltoaVI80G0PzYP3FVXDDALlM5arHaslTuXNbvwRod9dQLxTSV
```

## 📋 Paso 1: Obtener tu Project ID

1. Ve al dashboard de Wavy Node: https://dashboard.wavynode.com
2. Inicia sesión con tu cuenta
3. En la sección de "Projects" o "Proyectos", encontrarás tu **Project ID**
4. Copia ese ID (debería ser un número o string)

## 📝 Paso 2: Configurar el archivo .env

Una vez que tengas tu Project ID, edita el archivo `.env`:

```bash
# Secret para validar las firmas HMAC de Wavy Node
SECRET="tu-secret-del-dashboard"

# API Key de Wavy Node
WAVYNODE_API_KEY="wavy_cPzKp6HGRwltoaVI80G0PzYP3FVXDDALlM5arHaslTuXNbvwRod9dQLxTSV"

# Project ID (obtén esto del dashboard)
WAVYNODE_PROJECT_ID="TU_PROJECT_ID_AQUI"
```

**IMPORTANTE:** También necesitas el SECRET del dashboard para validar las firmas HMAC.

## 🎯 Paso 3: Registrar la Wallet

Una vez configurado el `.env`, ejecuta:

```bash
bun run scripts/register-user-address.ts
```

## 🔧 Alternativa: Registro Manual con cURL

Si prefieres hacerlo manualmente, usa este comando (reemplaza `YOUR_PROJECT_ID`):

```bash
curl -X POST "https://api.wavynode.com/v1/projects/YOUR_PROJECT_ID/addresses" \
  -H "Content-Type: application/json" \
  -H "x-api-key: ApiKey wavy_cPzKp6HGRwltoaVI80G0PzYP3FVXDDALlM5arHaslTuXNbvwRod9dQLxTSV" \
  -d '{
    "address": "0x33a8CeDfd6c123cCdB3D81A1cdA5F28AeC5832B6",
    "foreign_user_id": "user-123",
    "description": "Wallet principal del usuario"
  }'
```

## 📊 Verificar el Registro

Para verificar que la wallet fue registrada correctamente:

```bash
curl -H "x-api-key: ApiKey wavy_cPzKp6HGRwltoaVI80G0PzYP3FVXDDALlM5arHaslTuXNbvwRod9dQLxTSV" \
  "https://api.wavynode.com/v1/projects/YOUR_PROJECT_ID/addresses"
```

## 🎉 ¿Qué Sucede Después?

Una vez registrada la wallet:

1. ✅ Wavy Node comienza a monitorear todas las transacciones
2. 📨 Recibirás notificaciones en tu endpoint `POST /webhook`
3. 🔍 Wavy Node puede solicitar datos del usuario vía `GET /users/user-123`

## 🆘 Información Necesaria del Dashboard

Para completar la integración, necesitas obtener del dashboard:

1. **Project ID** - Para registrar direcciones
2. **Secret** - Para validar firmas HMAC en las notificaciones
3. **API Key** - ✅ Ya la tienes configurada

## 📞 Siguiente Paso

Una vez que tengas el Project ID y el Secret del dashboard:

1. Actualiza el archivo `.env`
2. Ejecuta `bun run scripts/register-user-address.ts`
3. Inicia tu servidor: `bun run dev`
4. ¡Listo para recibir notificaciones!
