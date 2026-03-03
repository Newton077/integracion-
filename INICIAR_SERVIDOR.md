# 🚀 Iniciar Servidor para Recibir Notificaciones

## ✅ Estado Actual

### Wallets Registradas con foreign_user_id
- ✅ `0x33a8CeDfd6c123cCdB3D81A1cdA5F28AeC5832B6` → user-123
- ✅ `0x7812D0936a6b2df877506A6101281759e05d0D61` → user-123
- ✅ `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045` → user-123

### Configuración
- ✅ API Key configurada
- ✅ Project ID: 1
- ✅ SECRET temporal configurado (actualizar con el real del dashboard)

## 📋 Pasos para Iniciar

### 1. Iniciar el Servidor (Terminal 1)

```bash
bun run dev
```

El servidor iniciará en `http://localhost:3000`

**Nota**: Si necesitas puerto 80, usa:
```bash
sudo bun run dev
```

### 2. Exponer con ngrok (Terminal 2)

```bash
# Si el servidor está en puerto 3000
ngrok http 3000

# Si el servidor está en puerto 80
ngrok http 80
```

Copia la URL que te da ngrok, por ejemplo:
```
https://abc123-456-789.ngrok-free.app
```

### 3. Configurar en Wavy Node Dashboard

1. Ve a https://dashboard.wavynode.com
2. Navega a **Project Settings** o **Integration Settings**
3. Configura:
   - **Integration URL**: `https://tu-url.ngrok.io`
   - **Webhook URL**: `https://tu-url.ngrok.io/webhook`
4. Copia el **Integration SECRET** y actualiza tu `.env`:
   ```env
   SECRET="el-secret-real-del-dashboard"
   ```

### 4. Reiniciar el Servidor

Después de actualizar el SECRET, reinicia el servidor:
```bash
# Ctrl+C para detener
bun run dev
```

## 🧪 Probar la Integración

### Verificar que el servidor responde

```bash
# Localmente
curl http://localhost:3000/users/user-123

# Con ngrok
curl https://tu-url.ngrok.io/users/user-123
```

Deberías recibir:
```json
{
  "givenName": "Maria Guadalupe",
  "maternalSurname": "Sánchez",
  ...
}
```

### Simular una notificación

```bash
bun run examples/test-integration.ts
```

## 📊 Qué Esperar

### Cuando Wavy Node Necesite Datos del Usuario

Verás en los logs del servidor:
```
GET /users/user-123
```

Tu servidor responderá con los datos del usuario.

### Cuando Haya una Transacción

Verás en los logs:
```
POST /webhook
Nueva notificación recibida: {
  txHash: "0xabc...",
  userId: "user-123",
  amount: 15000,
  violations: 1
}
```

## 🔍 Monitorear

### Ver logs del servidor
Los logs aparecerán en la terminal donde ejecutaste `bun run dev`

### Ver solicitudes de ngrok
Abre en tu navegador:
```
http://127.0.0.1:4040
```

Aquí verás todas las solicitudes que llegan a tu servidor a través de ngrok.

## 📝 Endpoints Activos

### `GET /users/{userId}`
Devuelve datos del usuario para que Wavy Node genere reportes.

**Ejemplo**: `GET /users/user-123`

### `POST /webhook`
Recibe notificaciones de Wavy Node sobre transacciones y violaciones.

## ⚠️ Importante

1. **Mantén el servidor corriendo**: Debe estar activo 24/7 para recibir notificaciones
2. **Mantén ngrok corriendo**: Si se cierra, la URL cambia y debes actualizarla en el dashboard
3. **SECRET correcto**: Usa el SECRET real del dashboard, no el temporal

## 🎯 Flujo Completo

```
1. Usuario hace transacción en blockchain
   ↓
2. Wavy Node detecta la transacción
   ↓
3. Wavy Node llama a: GET https://tu-url.ngrok.io/users/user-123
   ↓
4. Tu servidor responde con datos del usuario
   ↓
5. Wavy Node genera reporte en su dashboard
   ↓
6. Si hay violaciones, Wavy Node envía: POST https://tu-url.ngrok.io/webhook
   ↓
7. Tu servidor procesa la notificación
```

## 🚀 Comandos Rápidos

```bash
# Terminal 1: Servidor
bun run dev

# Terminal 2: ngrok
ngrok http 3000

# Terminal 3: Ver logs en tiempo real
tail -f .output/server/logs/app.log

# Terminal 4: Probar endpoints
curl http://localhost:3000/users/user-123
```

## ✅ Checklist Final

- [ ] Servidor corriendo
- [ ] ngrok exponiendo el servidor
- [ ] URL de ngrok configurada en dashboard de Wavy Node
- [ ] SECRET real del dashboard en `.env`
- [ ] Servidor reiniciado con el SECRET correcto
- [ ] Endpoints probados y funcionando
- [ ] Listo para recibir notificaciones

¡Tu integración está lista! 🎉
