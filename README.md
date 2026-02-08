# Eye-Tracking con WebGazer + Heatmap

## Objetivo
Aplicar tecnicas de eye-tracking en un entorno web para analizar el comportamiento visual de los usuarios, interpretando zonas de atencion y evaluando la usabilidad de la interfaz.

## Diseno de la pagina
La pagina simula una plataforma educativa con un encabezado, un bloque principal de contenido y un boton CTA. El objetivo es guiar la atencion hacia el boton "Registrarme gratis" para evaluar si la jerarquia visual cumple la tarea.

## Solucion implementada
- `index.html`: estructura con encabezado, contenido principal y CTA.
- `styles.css`: estilo con jerarquia visual clara y contraste.
- `app.js`: integra WebGazer.js para capturar coordenadas y Heatmap.js para mostrar el mapa de calor.

### Flujo de uso
1. Abrir `index.html` en el navegador.
2. Permitir el acceso a la camara.
3. Realizar la calibracion mirando el centro y bordes.
4. Hacer clic en "Iniciar captura (45s)".
5. Ejecutar la tarea: "Encuentra y haz clic en el boton Registrarme gratis".
6. Al terminar, pulsar "Mostrar mapa".

## Analisis de atencion visual (observado)
- Zonas con mayor atencion: las areas con colores mas intensos en el mapa (rojo/amarillo/verde), especialmente cerca del encabezado, el titulo principal y el boton CTA "Registrarme gratis".
- Elementos menos atendidos: partes inferiores de la pagina (planes, soporte y FAQ) y algunos textos secundarios.
- La atencion coincide en general con la jerarquia visual esperada: el CTA y el titulo concentran la mirada, aunque hay dispersion en zonas laterales.

## Relacion con principios de usabilidad
- Visibilidad del estado del sistema: el panel indica estado de captura y botones deshabilitados segun la accion.
- Reconocimiento antes que recuerdo: el CTA esta visible sin necesidad de memorizar rutas.
- Diseno minimalista: el contenido reduce distracciones y concentra la mirada.

## Mejoras propuestas
1. Reforzar el bloque superior (titulo + CTA) con un subtitulo mas corto y directo para mantener la mirada en la accion principal.
2. Dar mayor protagonismo a la seccion de planes si se desea que reciba atencion (por ejemplo, moverla mas arriba o aumentar contraste).

## Evidencia
 carpeta `evidencia/`:
- Captura de calibracion de WebGazer.
- Captura con puntos de mirada.
- Captura con mapa de calor visible.
