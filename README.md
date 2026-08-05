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

- Script de AdSense en el documento principal para verificar el sitio.
- `ads.txt` con el editor declarado.
- No se muestran unidades publicitarias dentro de la partida por defecto: se deben agregar con un ID de bloque
  real y respetando la separacion recomendada para juegos.

## Variables de entorno

Crear `impostor-web/.env` con:

```bash
VITE_ADSENSE_SLOT_ID=1234567890
```

La unidad se renderiza solo cuando existe `VITE_ADSENSE_SLOT_ID`; si no lo configuras, no se muestra ningun
placeholder. El ID de editor debe coincidir con el que aparece en `index.html` y `public/ads.txt`.

## Checklist para AdSense

El proyecto incluye contenido visible de ayuda, una pagina sobre el juego, privacidad, terminos, contacto,
`ads.txt`, `robots.txt` y `sitemap.xml`. Eso ayuda a que el sitio sea comprensible y verificable, pero Google
decide la aprobacion despues de revisar el dominio publicado.

Antes de solicitar otra revision:

1. Publica el sitio en el dominio que aparece en `index.html` y comprueba que las rutas de informacion abran sin
   errores.
2. Cambia `contacto@elimpostorargentina.com` por un correo real que revises, si ese no es el correo del proyecto.
3. Confirma que `https://elimpostorargentina.com/ads.txt` muestre tu ID de editor. No uses el ID de otra cuenta.
4. No pongas anuncios sobre las tarjetas, botones de juego, votacion ni pantallas de comunicacion privada. Si
   agregas unidades, separalas del juego y usa un `VITE_ADSENSE_SLOT_ID` real creado en tu cuenta.
5. Si recibes visitas del Espacio Economico Europeo, Reino Unido o Suiza, configura un CMP certificado por Google
   antes de servir anuncios personalizados.
6. Revisa el sitio publicado en Search Console, espera a que las paginas sean accesibles para Google y despues
   solicita la revision desde AdSense.

Referencias oficiales: [requisitos para participar](https://support.google.com/adsense/answer/9724?hl=es),
[politicas para editores](https://support.google.com/adsense/answer/10502938?hl=es) y
[anuncios en paginas para jugar](https://support.google.com/adsense/answer/2768340?hl=es).
