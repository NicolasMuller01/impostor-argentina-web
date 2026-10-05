// Genera las guías estáticas de /public con el mismo encabezado y pie.
// Uso: node scripts/pages.mjs
import { writeFileSync } from 'node:fs';

const nav = `<header class="site-header"><div class="site-header-inner"><a class="brand" href="/">El Impostor Argentino</a><nav class="site-nav" aria-label="Principal"><a href="/">Jugar</a><a href="/como-jugar.html">Reglas</a><a href="/palabras.html">Palabras</a><a href="/estrategias.html">Estrategias</a><a href="/guias.html">Guías</a></nav></div></header>`;
const footer = `<footer class="site-footer"><nav class="footer-links" aria-label="Información del sitio"><a href="/guias.html">Guías</a><a href="/sobre-el-juego.html">Sobre el juego</a><a href="/contacto.html">Contacto</a><a href="/privacidad.html">Privacidad</a><a href="/terminos.html">Términos</a></nav></footer>`;

function page({ file, title, description, eyebrow, body, schema = 'Article' }) {
  const ld = { '@context': 'https://schema.org', '@type': schema, headline: title, description, inLanguage: 'es-AR', dateModified: '2026-10-05', author: { '@type': 'Organization', name: 'El Impostor Argentino' }, mainEntityOfPage: `https://elimpostorargentina.com/${file}` };
  const html = `<!doctype html><html lang="es-AR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | El Impostor Argentino</title><meta name="description" content="${description}"><link rel="canonical" href="https://elimpostorargentina.com/${file}"><link rel="icon" href="/android-icon.png"><link rel="stylesheet" href="/site.css"><script type="application/ld+json">${JSON.stringify(ld)}</script></head><body>${nav}<main class="site-main"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="lead">${description}</p>
${body.trim()}
<p><small>Última actualización: 5 de octubre de 2026.</small></p><a class="back-link" href="/">Preparar una partida</a></main>${footer}</body></html>`;
  writeFileSync(new URL(`../public/${file}`, import.meta.url), html);
}

page({
  file: 'organizar-partida.html',
  eyebrow: 'Guía práctica',
  title: 'Cómo organizar una partida del Impostor',
  description: 'Cuántos impostores usar, cómo ordenar los turnos y qué ajustar según el tamaño del grupo, el lugar y el tiempo disponible.',
  body: `
<h2>Antes de empezar: tres decisiones</h2><p>Casi todos los problemas de una partida aparecen en los primeros cinco minutos, cuando alguien no entendió su rol o el grupo no acordó cómo se vota. Conviene resolver tres cosas en voz alta antes de repartir el celular: cuántos impostores habrá, qué categorías de palabras se van a usar y cuánto se permite hablar en cada pista. Con eso claro, el resto de la ronda fluye solo.</p>
<h2>Cuántos impostores según el grupo</h2><ul><li><strong>3 o 4 personas:</strong> un impostor y, si el grupo es nuevo, la pista para el impostor activada. Con pocas voces cada pista pesa mucho y el impostor queda expuesto rápido.</li><li><strong>5 a 7 personas:</strong> un impostor. Es el rango ideal: hay suficientes pistas para que el impostor se oriente, y suficientes sospechosos para que el debate valga la pena.</li><li><strong>8 a 11 personas:</strong> dos impostores. Si hay uno solo, el grupo suele tener tantas pistas correctas que el que desentona salta a la vista.</li><li><strong>12 o más:</strong> dos o tres impostores, y consideren dividirse en dos mesas. Las rondas con muchísima gente se hacen largas y los últimos en hablar se aburren.</li></ul>
<h2>El orden de los turnos</h2><p>La app propone un orden, pero lo importante es que nadie quede siempre al principio o siempre al final. Quien arranca tiene la tarea más difícil porque no escuchó ninguna pista; quien cierra tiene mucha información. Si juegan varias rondas, roten quién empieza. Un truco simple: en la ronda siguiente empieza la persona que estaba a la izquierda de quien arrancó antes.</p><p>Si el impostor sale primero, no lo cambien: es parte del juego. Tiene que decir algo lo bastante genérico para no comprometerse, y eso también da pistas al resto.</p>
<h2>Elegir categorías con criterio</h2><p>No todas las categorías funcionan igual en cualquier mesa. «Comida» y «Lugares» son las más universales: todos tienen algo que decir. «Personajes» y «Fútbol» generan debates divertidos pero pueden dejar afuera a quien no sigue esos temas, y un ciudadano que no conoce la palabra parece impostor sin serlo. Si el grupo es mixto en edades o intereses, arranquen con categorías amplias y sumen las específicas cuando todos estén entrados en calor.</p>
<h2>Cuánto dura y cuándo cortar</h2><p>Una ronda típica lleva entre tres y ocho minutos. Para una previa o un cumpleaños, cinco o seis rondas suelen ser el punto justo antes de que el entusiasmo baje. Si notan que los debates se estiran sin avanzar, acuerden un límite: por ejemplo, dos minutos de discusión después de la última pista y luego se vota sí o sí. No hace falta un cronómetro; alcanza con que alguien avise.</p>
<h2>Juntadas grandes: cumpleaños, previas y viajes</h2><h3>En una mesa larga</h3><p>Si el grupo no está en ronda, el celular tarda en circular. Designen a una persona que lo acerque a cada jugador para el reparto de roles, siempre con la pantalla hacia abajo.</p><h3>Con ruido de fondo</h3><p>En un bar o con música, pidan que cada pista se diga una vez fuerte y clara, y que quien no la escuchó pregunte en el momento. Repetir pistas al final del turno ayuda a que nadie vote con información incompleta.</p><h3>En un viaje en auto</h3><p>El conductor no juega con el celular, pero puede participar de oído si el grupo usa una variante sin tarjeta: el que maneja solo vota. Por seguridad, nunca le pasen el teléfono.</p>
<h2>Cuidar el clima del grupo</h2><p>El Impostor es un juego de mentiras inofensivas, y eso puede incomodar a alguien que no le gusta ser acusado. Expliquen desde el principio que sospechar de alguien es parte de la mecánica, no un juicio personal. Si una persona quedó muy expuesta en una ronda, que en la siguiente arranque otro. Y si alguien prefiere mirar una o dos rondas antes de sumarse, también vale.</p>
<h2>Lista rápida antes de la primera ronda</h2><ol class="steps"><li><strong>Celular con batería</strong> y brillo alto, con el sonido bajo para no delatar nada.</li><li><strong>Nombres cargados</strong> en el orden en que están sentados.</li><li><strong>Impostores</strong> definidos según la tabla de arriba.</li><li><strong>Categorías</strong> que todos conozcan.</li><li><strong>Regla de votación</strong> acordada: a mano alzada, señalando a la cuenta de tres o con la app.</li></ol>
<p>Para ideas que cambian la dinámica una vez que dominan lo básico, mirá <a href="/variantes.html">Variantes para jugar</a>.</p>`,
});

page({
  file: 'jugar-en-familia.html',
  eyebrow: 'Familias y docentes',
  title: 'El Impostor en familia y en el aula',
  description: 'Cómo adaptar el juego para chicos, abuelos y grupos escolares: categorías recomendadas, reglas simplificadas y actividades para trabajar vocabulario.',
  body: `
<h2>Por qué funciona con chicos</h2><p>El Impostor obliga a pensar en relaciones entre palabras: qué tiene que ver «mate» con «termo», o «pingüino» con «frío». Esa búsqueda de asociaciones es un ejercicio de vocabulario y de razonamiento que los chicos hacen casi sin darse cuenta. Además, cada uno tiene que escuchar a los demás para poder participar, y eso entrena la atención mejor que muchos juegos de pantalla individual.</p>
<h2>Desde qué edad</h2><p>A partir de los siete u ocho años, cuando ya leen con soltura, los chicos pueden jugar la versión estándar con ayuda. Entre los cinco y los siete conviene que un adulto lea la tarjeta en voz baja a quien todavía no lee, o que juegue en pareja con el chico. Lo importante es que la palabra se mantenga en secreto: si el adulto la dice en voz alta por error, la ronda se repite sin drama.</p>
<h2>Ajustes recomendados para la familia</h2><ul><li><strong>Activen la pista para el impostor.</strong> Un chico que no tiene idea de qué decir se frustra; con una pista general puede participar igual.</li><li><strong>Elijan categorías concretas</strong> como animales, comida y objetos de la casa. Las palabras abstractas o los personajes de otra generación generan desventaja.</li><li><strong>Permitan pistas de dos o tres palabras.</strong> Con los más chicos, pedir una sola palabra es demasiado restrictivo.</li><li><strong>Nada de eliminación.</strong> Si alguien es votado, sigue jugando la ronda siguiente. Nadie se queda mirando.</li></ul>
<h2>Cuando juegan abuelos y nietos</h2><p>Las partidas intergeneracionales son de las más divertidas porque las asociaciones cambian mucho. Para un abuelo, «colectivo» puede evocar boletos de cartón; para un nieto, la tarjeta SUBE. Esa diferencia es interesante, pero hace que un ciudadano parezca impostor. Una regla útil: cuando alguien da una pista rara, se le permite explicar brevemente su relación antes de votar. Así el juego se convierte también en una charla sobre cómo cambiaron las cosas.</p>
<h2>En el aula: propuestas para docentes</h2><p>El juego entra bien en una hora de clase y no requiere más que un celular o la pantalla del aula. Algunas formas de usarlo:</p><h3>Vocabulario temático</h3><p>Antes de jugar, el docente elige una categoría ligada al tema de la unidad (animales autóctonos en Ciencias Naturales, lugares en Geografía) y el grupo arma una lista de palabras en el pizarrón. Después se juega con esa categoría. Los chicos repasan el contenido mientras buscan pistas.</p><h3>Argumentación oral</h3><p>Al votar, cada estudiante tiene que justificar su sospecha con una frase completa: «Sospecho de Juan porque su pista no tiene relación con las demás». Es una práctica breve de argumentación con un objetivo claro y motivador.</p><h3>Grupos grandes</h3><p>Con 25 o 30 estudiantes, dividan el curso en mesas de seis u ocho con un celular cada una, o jueguen en plenario con un solo dispositivo y tres impostores. En plenario, pidan que las pistas se escriban en el pizarrón para que todos puedan compararlas.</p>
<h2>Cuidados importantes</h2><p>En la escuela, recuerden que la app no pide ni guarda datos personales, y los nombres que se cargan no salen del dispositivo; igual, usen nombres de pila o apodos. Revisen antes las categorías elegidas para asegurarse de que sean adecuadas para la edad del grupo. Y si algún chico se angustia por ser acusado, conviene volver a explicar que mentir en el juego es parte de las reglas y que el impostor también puede ganar.</p>
<h2>Una ronda de práctica</h2><p>Antes de la primera partida, hagan una ronda con la palabra a la vista de todos, por ejemplo «helado». Cada uno dice su pista y el grupo comenta si fue demasiado obvia, demasiado lejana o justa. Después se juega en serio. Este ensayo de dos minutos evita la mayoría de las confusiones.</p>
<p>Para las reglas completas, mirá <a href="/como-jugar.html">Cómo jugar</a>, y para ideas de pistas, <a href="/estrategias.html">Estrategias</a>.</p>`,
});

page({
  file: 'preguntas-frecuentes.html',
  eyebrow: 'Ayuda',
  schema: 'WebPage',
  title: 'Preguntas frecuentes',
  description: 'Respuestas a las dudas más comunes sobre reglas, cantidad de jugadores, empates, palabras y el funcionamiento de la app.',
  body: `
<dl>
<dt>¿Cuántas personas se necesitan para jugar?</dt><dd>Como mínimo tres. Con tres el juego es más rápido y exigente para el impostor; entre cinco y diez es donde mejor funciona el debate. En <a href="/organizar-partida.html">Cómo organizar una partida</a> hay una tabla de impostores recomendados por cantidad de jugadores.</dd>
<dt>¿Hace falta un celular por persona?</dt><dd>No. El juego está pensado para un solo dispositivo que pasa de mano en mano. Cada persona mira su rol en privado y tapa la tarjeta antes de pasarlo.</dd>
<dt>¿Tengo que registrarme o descargar algo?</dt><dd>No. Se juega desde el navegador, sin cuentas ni instalación. Si querés tenerlo a mano, podés agregar la página a la pantalla de inicio desde el menú del navegador.</dd>
<dt>¿Qué pasa si el impostor adivina la palabra?</dt><dd>Depende de cómo lo acuerde el grupo. Una regla popular: si el impostor es votado, tiene una última oportunidad de decir la palabra; si acierta, gana igual. Eso premia al impostor que escuchó con atención. Si prefieren algo más simple, ignoren esa regla.</dd>
<dt>¿Cómo se resuelve un empate en la votación?</dt><dd>Las dos personas empatadas hacen una defensa de una frase cada una y se vuelve a votar solo entre ellas. Si vuelve a empatar, gana el impostor: la duda lo favorece.</dd>
<dt>¿Puede haber más de un impostor?</dt><dd>Sí, la app permite elegir la cantidad. Los impostores no saben quiénes son los otros, así que pueden terminar acusándose entre sí, lo que suele dar rondas muy divertidas.</dd>
<dt>¿Qué significa la pista para el impostor?</dt><dd>Es una referencia general a la palabra secreta que solo ve el impostor, por ejemplo la categoría o un concepto amplio. Sirve para grupos nuevos o con chicos, donde un impostor sin ninguna orientación pierde demasiado rápido.</dd>
<dt>¿Qué es el modo Dato Random?</dt><dd>Una variante en la que los ciudadanos reciben datos curiosos distintos en lugar de una palabra, y el impostor recibe un dato falso o ninguno. El grupo debe descubrir quién está inventando. Más detalles en <a href="/variantes.html">Variantes</a>.</dd>
<dt>¿De dónde salen las palabras?</dt><dd>Las seleccionamos a mano pensando en referencias conocidas en Argentina: comidas, lugares, objetos cotidianos, animales, fútbol y cultura popular. Descartamos términos ofensivos o demasiado rebuscados. Podés ver las categorías en <a href="/palabras.html">Palabras</a> y sugerir nuevas desde <a href="/contacto.html">Contacto</a>.</dd>
<dt>¿Se repiten las palabras?</dt><dd>Cada ronda elige una palabra al azar entre las categorías activas, así que con cientos de opciones las repeticiones son raras. Si juegan muchas rondas con una sola categoría chica, puede volver a salir alguna; en ese caso, sumen categorías.</dd>
<dt>¿Funciona sin internet?</dt><dd>Hace falta conexión para abrir la página. Una vez cargada, la partida no necesita enviar nada a un servidor, así que una conexión inestable no corta el juego.</dd>
<dt>¿Guardan mis datos?</dt><dd>Los nombres de jugadores y la configuración no se envían a ningún servidor: viven solo mientras la página está abierta. Usamos medición de visitas anónima y, si corresponde, publicidad de terceros; todo está detallado en la <a href="/privacidad.html">Política de privacidad</a>.</dd>
<dt>¿Es apto para chicos?</dt><dd>Sí, con algunos ajustes. En <a href="/jugar-en-familia.html">El Impostor en familia y en el aula</a> explicamos qué categorías elegir y cómo simplificar las reglas.</dd>
<dt>Encontré un error o tengo una idea, ¿dónde la mando?</dt><dd>Escribinos desde la página de <a href="/contacto.html">Contacto</a>. Leemos todos los mensajes y muchas mejoras del juego salieron de sugerencias de jugadores.</dd>
</dl>`,
});

page({
  file: 'guias.html',
  eyebrow: 'Biblioteca',
  schema: 'CollectionPage',
  title: 'Guías de El Impostor Argentino',
  description: 'Todas las guías del sitio en un solo lugar: reglas, estrategias, variantes, organización de partidas, juego en familia y preguntas frecuentes.',
  body: `
<p>Escribimos estas guías a partir de partidas reales con amigos, familias y grupos escolares. Están ordenadas de lo más básico a lo más avanzado: si es tu primera vez, empezá por las reglas.</p>
<h2>Para empezar</h2><ul><li><a href="/como-jugar.html">Cómo jugar</a>: roles, reparto, turnos de pistas, votación y desempates.</li><li><a href="/organizar-partida.html">Cómo organizar una partida</a>: cuántos impostores usar, orden de turnos y consejos para juntadas grandes.</li><li><a href="/preguntas-frecuentes.html">Preguntas frecuentes</a>: dudas rápidas sobre reglas y la app.</li></ul>
<h2>Para jugar mejor</h2><ul><li><a href="/estrategias.html">Cómo dar pistas y detectar al impostor</a>: ejemplos concretos y errores comunes.</li><li><a href="/palabras.html">Palabras y categorías</a>: qué tipo de palabras hay y cómo elegir categorías.</li><li><a href="/variantes.html">Variantes para jugar</a>: formas de cambiar el juego cuando ya lo dominan.</li></ul>
<h2>Para grupos especiales</h2><ul><li><a href="/jugar-en-familia.html">El Impostor en familia y en el aula</a>: ajustes para chicos, partidas intergeneracionales y propuestas para docentes.</li></ul>
<h2>Sobre el proyecto</h2><ul><li><a href="/sobre-el-juego.html">Sobre el juego</a>: quién lo hace y con qué criterios.</li><li><a href="/contacto.html">Contacto</a>: sugerencias, errores y propuestas de palabras.</li></ul>`,
});
