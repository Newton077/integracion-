# 🌐 Configurar ngrok para Recibir Notificaciones de Wavy Node

## ¿Por Qué Necesitas ngrok?

Wavy Node necesita enviar notificaciones a tu servidor cuando detecte transacciones. Para desarrollo local, ngrok crea un túnel público que permite que Wavy Node llegue a tu servidor local.

## 📋 Pasos para Configurar

### 1. Iniciar tu Servidor Local

Primero, inicia tu servidor en el puerto 80:

```bash
sudo bun run dev
```

> **Nota**: Necesitas `sudo` porque el puerto 80 requiere permisos de administrador.

El servidor estará corriendo en `http://localhost:80`

### 2. Iniciar ngrok

En otra terminal, ejecuta:

```bash
ngrok http 80
```

Verás algo como esto:

```
ngrok

Session Status                online
Account                       tu-cuenta
Version                       3.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok.io -> http://localhost:80

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**Tu URL pública será**: `https://abc123.ngrok.io`

### 3. Configurar la URL en Wavy Node Dashboard

1. Ve a https://dashboard.wavynode.com
2. Navega a **Project Settings** o **Integration Settings**
3. Configura tu **Webhook URL**:
   ```
   https://abc123.ngrok.io/webhook
   ```
4. Configura tu **User Data URL** (si es necesario):
   ```
   https://abc123.ngrok.io/users/{userId}
   ```
5. Guarda los cambios

### 4. Verificar que Funciona

Puedes verificar que tu servidor está accesible:

```bash
# Desde otra terminal
curl https://abc123.ngrok.io/users/user-123
```

Deberías recibir los datos del usuario.

## 🔍 Monitorear Solicitudes

ngrok incluye una interfaz web para ver todas las solicitudes:

```
http://127.0.0.1:4040
```

Abre esa URL en tu navegador para ver:
- Todas las solicitudes entrantes
- Headers
- Body de las solicitudes
- Respuestas de tu servidor

## 📊 Generar Reportes

Tu servidor ya está configurado para:

1. **Recibir notificaciones** en `POST /webhook`
2. **Guardar transacciones** (implementa `saveNotification` en `server/utils/database.ts`)
3. **Generar alertas** cuando hay violaciones

### Ejemplo de Notificación que Recibirás

```json
{
  "type": "notification",
  "data": {
    "txHash": "0xabc123...",
    "address": {
      "userId": "user-123",
      "address": "0x33a8CeDfd6c123cCdB3D81A1cdA5F28AeC5832B6"
    },
    "amount": {
      "usd": 15000
    },
    "inflictedLaws": [
      {
        "name": "Límite de transacción excedido",
        "risk": "warn"
      }
    ]
  }
}
```

## 🚀 Comandos Rápidos

### Terminal 1: Servidor
```bash
sudo bun run dev
```

### Terminal 2: ngrok
```bash
ngrok http 80
```

### Terminal 3: Monitorear Logs
```bash
# Ver logs del servidor en tiempo real
tail -f .output/server/logs/app.log
```

## ⚠️ Importante

1. **ngrok URL cambia**: Cada vez que reinicias ngrok, obtienes una nueva URL. Debes actualizarla en el dashboard de Wavy Node.

2. **ngrok gratuito**: La versión gratuita de ngrok tiene límites. Para producción, considera:
   - ngrok Pro (URLs permanentes)
   - Desplegar en un servidor real (AWS, DigitalOcean, etc.)

3. **Mantener el servidor activo**: Tu servidor debe estar corriendo 24/7 para recibir notificaciones. Para desarrollo, está bien iniciarlo cuando lo necesites.

## 🔐 Seguridad

Tu servidor ya valida automáticamente:
- ✅ Firma HMAC en cada solicitud
- ✅ Timestamp para prevenir replay attacks
- ✅ Solo acepta solicitudes de Wavy Node

## 📝 Logs y Debugging

Para ver qué está pasando en tu servidor:

```bash
# Ver todas las notificaciones recibidas
grep "Nueva notificación" .output/server/logs/app.log

# Ver violaciones detectadas
grep "Violaciones detectadas" .output/server/logs/app.log
```

## 🎯 Próximos Pasos

1. ✅ Inicia tu servidor: `sudo bun run dev`
2. ✅ Inicia ngrok: `ngrok http 80`
3. ✅ Copia la URL de ngrok (ej: `https://abc123.ngrok.io`)
4. ⏳ Configura la URL en el dashboard de Wavy Node
5. ⏳ Espera a que haya una transacción en la wallet
6. ⏳ Verás la notificación en tu servidor

## 🧪 Probar sin Esperar Transacciones Reales

Puedes simular una notificación de Wavy Node:

```bash
bun run examples/test-integration.ts
```

Esto enviará una notificación de prueba a tu servidor local.

## 📞 Troubleshooting

### Error: "Permission denied" al iniciar en puerto 80
```bash
# Usa sudo
sudo bun run dev
```

### ngrok no conecta
```bash
# Verifica que el servidor esté corriendo primero
curl http://localhost:80/users/user-123

# Luego inicia ngrok
ngrok http 80
```

### No llegan notificaciones
1. Verifica que la URL en el dashboard sea correcta
2. Verifica que ngrok esté corriendo
3. Revisa los logs en http://127.0.0.1:4040
4. Verifica que el SECRET en .env sea el correcto del dashboard
