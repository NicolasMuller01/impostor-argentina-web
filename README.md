# Impostor Web (Replica)

Version web del proyecto "El Impostor Argento" con gameplay equivalente y base de monetizacion.

## Arranque

```bash
cd "C:/impostor argentina/impostor-web"
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Monetizacion incluida

- Slot de anuncios en pantalla (AdSense).
- Interstitial al finalizar partida (simulado, reemplazable por red publicitaria real).
- Modo Premium sin anuncios.
- Boton de checkout para Stripe.

## Variables de entorno

Crear `impostor-web/.env` con:

```bash
VITE_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
VITE_ADSENSE_SLOT_ID=1234567890
VITE_STRIPE_CHECKOUT_URL=https://buy.stripe.com/xxxxxxxxx
```

Si no seteas estas variables, la app muestra placeholders para que puedas integrarlo despues sin romper el flujo.
