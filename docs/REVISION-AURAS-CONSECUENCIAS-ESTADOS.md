# Auras, Consecuencias y Estados — listado para revisión

> **Corte de datos:** 27 de noviembre de 2026, tras el commit `13b9dcf9`.
> **Fuente:** `src/data/heroes/auras.js`, `src/data/heroes/consecuencias.js`, `src/data/heroes/estados.js`.
> **Objetivo:** comparar lo implementado con las cartas/libros originales.

## Cómo leer este documento

- **Expansión** = libro de origen declarado en `source.book`; es la referencia editorial de la carta.
- **Efecto / acción ES** = texto exacto que muestra hoy la aplicación en español.
- **Efecto / acción EN** = todos los textos ingleses están a `null` en los datos actuales; la app cae al español. No se ha inventado una traducción oficial.
- **Estado** = `Revisar` cuando `needsReview: true`; `Verificado` cuando el nombre inglés está marcado como `enVerified: true`.
- **EN verificado** = solo afecta a la revisión del nombre/término inglés, no al texto de la habilidad.

## Resumen

| Categoría | Total | Juego base | Mundo Sombrío | Desierto Avernal | Luccanor | Dragón No Muerto | Con texto EN |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Auras | 21 | 20 | 1 | 0 | 0 | 0 | 0 |
| Consecuencias | 15 | 15 | 0 | 0 | 0 | 0 | 0 |
| Estados | 63 | 56 | 1 | 1 | 3 | 2 | 0 |
| **Total** | **99** | **91** | **2** | **1** | **3** | **2** | **0** |

- **99 efectos** en total: **21 Auras**, **15 Consecuencias** y **63 Estados**.
- **48** marcados para revisar; **51** con nombre inglés verificado.
- **99 de 99** tienen `effect.en: null`. La interfaz inglesa muestra el texto español como fallback.
- **Aviso de filtrado:** las 99 entradas no declaran `campaign`; `withCampaign()` en `src/data/heroes/index.js` las asigna todas a `core`. Por eso hoy el filtro de campaña las trata como Juego base aunque varias provengan de expansiones. La expansión de la tabla es la de `source.book`, no el `campaign` exportado.
- **Auras de expansión:** solo `determinacion` (Mundo Sombrío). **Estados de expansión:** 7 en total (1 Mundo Sombrío, 1 Desierto Avernal, 3 Luccanor, 2 Dragón No Muerto). **Consecuencias:** todas de Juego base.

## Auras (21)

### Juego base / Core (20)

| ID | Nombre ES | Nombre EN | Pág. | Efecto / acción ES | Efecto / acción EN | Estado | EN verificado |
| --- | --- | --- | ---: | --- | --- | --- | --- |
| `conciencia_tranquila` | Conciencia tranquila | Clear Conscience | 7 | Otorga paz espiritual y bonificaciones narrativas/morales en la campaña. | — *sin implementar* | Revisar | No |
| `almas_gemelas_reunidas` | Almas gemelas reunidas | Soulmates Reunited | 19 | Sacar un 1 en el d20 cuenta como impacto crítico y ganas CONCENTRACIÓN 2. | — *sin implementar* | Verificado | Sí |
| `bendicion_de_gratitud` | Bendición de gratitud | Blessing of Gratitude | 84 | Al sufrir un cubo de Trauma o ganar otra Aura, obtienes PREVENIR X+1. | — *sin implementar* | Revisar | No |
| `bendicion_de_empatia` | Bendición de empatía | Blessing of Empathy | 85 | El Líder del grupo puede absorber 1 cubo de Trauma de un Héroe adyacente. | — *sin implementar* | Revisar | No |
| `desprecio` | Desprecio | Contempt | 85 | Al sufrir un cubo de Trauma u otra Aura, cada vez que hagas Recobrar sufres FATIGA 1. | — *sin implementar* | Revisar | No |
| `envenenamiento` | Envenenamiento | Poisoning | 93 | Cada vez que realizas una acción de Recobrar, sufres VENENO 4. | — *sin implementar* | Revisar | No |
| `buenas_intenciones` | Buenas intenciones | Good Intentions | 94 | Al usar un efecto de PURIFICACIÓN, ese Héroe puede Recobrar hasta 1 cubo de acción. | — *sin implementar* | Revisar | No |
| `ansia_asesina` | Ansia asesina | Killer Instinct | 99 | Tras eliminar a un Monstruo en tu turno, realizas 1 acción de cubo adicional (1 vez/turno). | — *sin implementar* | Revisar | No |
| `sed_de_sangre` | Sed de sangre | Bloodlust | 99 | Tras eliminar a un Monstruo en tu turno, realizas 1 acción de cubo adicional (1 vez/turno). | — *sin implementar* | Verificado | Sí |
| `bendicion_de_corazon` | Bendición de corazón | Blessing of Heart | 101 | Al consumir 1 CA por efecto distinto a FATIGA, ganas CONCENTRACIÓN 1. | — *sin implementar* | Revisar | No |
| `bendicion_del_guardian` | Bendición del guardián | Blessing of the Guardian | 101 | Al consumir 1 CA por efecto distinto a FATIGA, ganas ESCUDO 2. | — *sin implementar* | Verificado | Sí |
| `bendicion_de_buena_fortuna` | Bendición de buena fortuna | Blessing of Good Fortune | 102 | Al consumir 1 CA por efecto distinto a FATIGA, ganas Recobrar 1 cubo de acción. | — *sin implementar* | Verificado | Sí |
| `corazon_bravo` | Corazón bravo | Brave Heart | 103 | La Oscuridad te considera el Héroe más fuerte y no sufres daño de la Oscuridad. | — *sin implementar* | Verificado | Sí |
| `corazon_frio` | Corazón frío | Cold Heart | 103 | La Oscuridad te considera el Héroe más fuerte y tus Ataques con Arma/Hechizo hacen DAÑO +2. | — *sin implementar* | Verificado | Sí |
| `asomando_al_borde` | Asomando al borde | On the Brink | 110 | Cada vez que logres un impacto crítico en el d20, ganas: PERSONAL, CONCENTRACIÓN 1. | — *sin implementar* | Revisar | No |
| `camino_al_infierno` | Camino al infierno | Road to Hell | 110 | Al sacar un crítico, el ataque gana DAÑO +1 por cada cubo de Maldición que poseas. | — *sin implementar* | Revisar | No |
| `grandeza` | Grandeza | Greatness | 110 | Cada vez que logres un impacto crítico en el d20, ganas: PERSONAL, PURIFICACIÓN 2. | — *sin implementar* | Verificado | Sí |
| `hechizo_fallido` | Hechizo fallido | Failed Spell | 112 | Marca narrativa/mágica de un intento de conjuro frustrado en interacciones. | — *sin implementar* | Revisar | No |
| `liderazgo_inspirador` | Liderazgo inspirador | Inspiring Leadership | 113 | Permite compartir bonificaciones de movimiento y moral con el grupo. | — *sin implementar* | Verificado | Sí |
| `vinculo_de_amistad` | Vínculo de amistad | Bond of Friendship | 115 | Beneficio táctico moral derivado de apoyar a un aliado durante la aventura. | — *sin implementar* | Revisar | No |

### El Mundo Sombrío / The Shadow World (1)

| ID | Nombre ES | Nombre EN | Pág. | Efecto / acción ES | Efecto / acción EN | Estado | EN verificado |
| --- | --- | --- | ---: | --- | --- | --- | --- |
| `determinacion` | Determinación | Determination | 27 | El Héroe es completamente inmune a LENTITUD y ATURDIMIENTO. | — *sin implementar* | Verificado | Sí |

## Consecuencias (15)

### Juego base / Core (15)

| ID | Nombre ES | Nombre EN | Pág. | Efecto / acción ES | Efecto / acción EN | Estado | EN verificado |
| --- | --- | --- | ---: | --- | --- | --- | --- |
| `humillacion` | Humillación | Humiliation | 15 | Derrota tras enfrentarse al Rey Redivivo en la Aventura 2. | — *sin implementar* | Revisar | No |
| `inquebrantable` | Inquebrantable | Unbreakable | 15 | Victoria contra el Rey Redivivo en la Aventura 2; abre opciones exclusivas. | — *sin implementar* | Revisar | No |
| `trabajo_de_mensajero` | Trabajo de mensajero | Courier Work | 19 | Decisión de quedarse el Relicario de oro para entregárselo a Tharmagar. | — *sin implementar* | Revisar | No |
| `maldicion_del_guardian` | Maldición del guardián | Guardian's Curse | 39 | Equipar la Pulsera maldita sin poseer el Estado 'Rompe Maldiciones'. | — *sin implementar* | Verificado | Sí |
| `la_peticion_de_un_enamorado` | La petición de un enamorado | A Lover's Request | 50 | Revelación del nombre e historia del Rey Redivivo en la Aventura 10. | — *sin implementar* | Revisar | No |
| `cuentacuentos` | Cuentacuentos | Storyteller | 54 | Registra vivencias y relatos profundos compartidos en el Reino Espiritual. | — *sin implementar* | Verificado | Sí |
| `sin_tiempo_para_despedidas` | Sin tiempo para despedidas | No Time for Goodbyes | 54 | Fracaso automático y precipitado al concluir la Aventura 12. | — *sin implementar* | Verificado | Sí |
| `amantes_reunidos` | Amantes reunidos | Lovers Reunited | 55 | Conclusión pacífica del reencuentro en el Reino Espiritual. | — *sin implementar* | Revisar | No |
| `inflexible` | Inflexible | Inflexible | 55 | Tomar decisiones severas o implacables durante las interacciones. | — *sin implementar* | Revisar | No |
| `heroe_corrupto` | Héroe corrupto | Corrupted Hero | 73 | Registrada en el Diario de Campaña si el Héroe de Daren cae derrotado. | — *sin implementar* | Verificado | Sí |
| `relevo` | Relevo | Changing of the Guard | 77 | Designación del nuevo líder tras la caída del héroe principal. | — *sin implementar* | Revisar | No |
| `sembrando_vientos` | Sembrando vientos | Sowing the Wind | 90 | Actuar con imprudencia o precipitada audacia en las interacciones. | — *sin implementar* | Revisar | No |
| `un_acto_repulsivo` | Un acto repulsivo | A Repulsive Act | 95 | Ejecutar o abandonar fríamente a un personaje acorralado. | — *sin implementar* | Revisar | No |
| `romperreliquias` | Romperreliquias | Relic Breaker | 102 | Destrucción deliberada o accidental de artefactos sagrados. | — *sin implementar* | Verificado | Sí |
| `duo_dinamico` | Dúo Dinámico | Dynamic Duo | 117 | Cooperar activamente con la figura del Héroe corrupto en la cripta. | — *sin implementar* | Verificado | Sí |

## Estados (63)

### Juego base / Core (56)

| ID | Nombre ES | Nombre EN | Pág. | Efecto / acción ES | Efecto / acción EN | Estado | EN verificado |
| --- | --- | --- | ---: | --- | --- | --- | --- |
| `el_mejor_amigo_del_hombre` | El mejor amigo del hombre | Man's Best Friend | 42 | Permite invocar y utilizar las acciones tácticas del perro compañero. | — *sin implementar* | Revisar | No |
| `certeza` | Certeza | Certainty | 53 | Contador acumulable de convicción espiritual en las aventuras del Reino Espiritual. | — *sin implementar* | Verificado | Sí |
| `curiosidad` | Curiosidad | Curiosity | 54 | Contador de indagación; al juntar 3 activa 'Una reunión inesperada'. | — *sin implementar* | Verificado | Sí |
| `fuente_bendita` | Fuente bendita | Blessed Font | 85 | Evita recibir cubos de Maldición al realizar la acción de Recobrar. | — *sin implementar* | Revisar | No |
| `rubi_de_fuego` | Rubí de fuego | Fire Ruby | 85 | Ataques con Hechizo/Arma ganan QUEMADURA 2 con tiradas de 16+. | — *sin implementar* | Verificado | Sí |
| `barrera_rota_infierno` | Barrera rota: Infierno | Broken Barrier: Hell | 86 | Resolución del puzzle de la barrera elemental de fuego. | — *sin implementar* | Revisar | No |
| `barrera_rota_trueno` | Barrera rota: Trueno | Broken Barrier: Thunder | 86 | Resolución del puzzle de la barrera elemental de electricidad. | — *sin implementar* | Revisar | No |
| `descansa_en_paz` | Descansa en paz | Rest in Peace | 87 | Conclusión piadosa de una investigación o tumba profanada. | — *sin implementar* | Verificado | Sí |
| `desvelando_el_misterio` | Desvelando el misterio | Unveiling the Mystery | 87 | Permite consumir CA para cancelar la invocación de Esbirros. | — *sin implementar* | Revisar | No |
| `juego_sucio` | Juego sucio | Foul Play | 87 | Al hacer Recobrar, el Héroe sufre VENENO 2 como penalización. | — *sin implementar* | Verificado | Sí |
| `verguenza` | Vergüenza | Shame | 88 | Penalización social tras perder retos de taberna o duelos. | — *sin implementar* | Verificado | Sí |
| `anda_con_cuidado` | Anda con cuidado | Watch Your Step | 89 | Estado de vigilancia en las calles de la ciudad de Umbrall. | — *sin implementar* | Verificado | Sí |
| `heroe_del_pueblo` | Héroe del pueblo | Hero of the People | 89 | Al retirar un cubo de Maldición de tu hoja, ganas: PERSONAL, SANAR 2. | — *sin implementar* | Revisar | No |
| `matones` | Matones | Thugs | 89 | Sacar 5 o menos en la tirada de d20 se considera una pifia. | — *sin implementar* | Revisar | No |
| `buscar_la_verdad` | Buscar la verdad | Seek the Truth | 90 | Al retirar un cubo de Maldición, ganas: PERSONAL, ESCUDO 2. | — *sin implementar* | Verificado | Sí |
| `medicina_de_batalla` | Medicina de batalla | Battlefield Medicine | 91 | Consumir 1 CA para retirar un cubo de Trauma a un Héroe adyacente. | — *sin implementar* | Revisar | No |
| `saludos` | Saludos | Greetings | 91 | Desbloquea diálogos amistosos con la guardia y milicianos de la ciudad. | — *sin implementar* | Verificado | Sí |
| `bendicion_de_la_esmeralda` | Bendición de la esmeralda | Emerald Blessing | 93 | Tus Hechizos ganan VENENO 2 y tus Armas ganan 'Si sacas 16+: VENENO 2'. | — *sin implementar* | Verificado | Sí |
| `conviccion` | Convicción | Conviction | 93 | Disposición moral para superar retos de habilidad o daño. | — *sin implementar* | Revisar | No |
| `humilde` | Humilde | Humble | 93 | Disposición moral humilde para superar retos de habilidad. | — *sin implementar* | Verificado | Sí |
| `orgullo` | Orgullo | Pride | 93 | Disposición moral de orgullo para resolver retos de habilidad o daño. | — *sin implementar* | Verificado | Sí |
| `practico` | Práctico | Practical | 93 | Disposición pragmática para la resolución de dilemas. | — *sin implementar* | Verificado | Sí |
| `cosechando_tempestades` | Cosechando tempestades | Reaping the Storm | 95 | Ganas PERSONAL, MALDICIÓN 1 para habilitar un cubo de acción guardado. | — *sin implementar* | Revisar | No |
| `invencible` | Invencible | Invincible | 95 | Ganas PERSONAL y retiras 1 Trauma para que tu ataque haga daño doble. | — *sin implementar* | Verificado | Sí |
| `un_enfoque_amistoso` | Un enfoque amistoso | A Friendly Approach | 96 | Permite elegir a un personaje adyacente como objetivo al usar capacidades personales. | — *sin implementar* | Verificado | Sí |
| `un_enfoque_cooperativo` | Un enfoque cooperativo | A Cooperative Approach | 96 | Al robar cartas de Cofre, robas 1 extra y te quedas con la que prefieras. | — *sin implementar* | Verificado | Sí |
| `un_enfoque_suspicaz` | Un enfoque suspicaz | A Suspicious Approach | 96 | Los Cofres se consideran seguros y no requieren tirada de Trampa. | — *sin implementar* | Verificado | Sí |
| `una_decision_justa` | Una decisión justa | A Fair Decision | 99 | Infliges impacto crítico siempre que saques 4 o 16 en el d20. | — *sin implementar* | Revisar | No |
| `hacerse_el_tonto` | Hacerse el tonto | Playing Dumb | 101 | Puedes optar por no recibir ningún cubo de Maldición al hacer Recobrar. | — *sin implementar* | Revisar | No |
| `un_gesto_honrado` | Un gesto honrado | An Honorable Gesture | 101 | Al realizar una acción de Recobrar, ganas también CONCENTRACIÓN 1. | — *sin implementar* | Revisar | No |
| `inspiracion` | Inspiración | Inspiration | 102 | Una vez por turno, el Héroe puede volver a tirar 1 dado d20. | — *sin implementar* | Revisar | No |
| `advertencia` | Advertencia | Warning | 104 | Marca que impide usar por segunda vez la capacidad de evitar noqueo de Precaución. | — *sin implementar* | Revisar | No |
| `moderacion` | Moderación | Moderation | 104 | Permite usar cubos verdes como azules/amarillos y da Alcance ilimitado. | — *sin implementar* | Revisar | No |
| `precaucion` | Precaución | Caution | 104 | Evita el noqueo de un Héroe 1 vez dejándolo a Salud 1. | — *sin implementar* | Verificado | Sí |
| `sinceridad` | Sinceridad | Sincerity | 104 | Aumenta en 2 el límite máximo de cubos de Maldición del tablero del Héroe. | — *sin implementar* | Revisar | No |
| `amo_de_la_no_muerte` | Amo de la no muerte | Master of Undeath | 105 | Permite controlar el turno de una Aparición pequeña al realizar Recobrar. | — *sin implementar* | Verificado | Sí |
| `comprension_profunda` | Comprensión profunda | Deep Understanding | 105 | Cancela una opción de interacción para elegir otra (1 vez por interacción). | — *sin implementar* | Verificado | Sí |
| `por_primera_vez` | Por primera vez | For the First Time | 105 | Bonificación ganada tras consultar por primera vez archivos o bibliotecas. | — *sin implementar* | Verificado | Sí |
| `surcanieblas` | Surcanieblas | Mistwalker | 105 | Usas MALDICIÓN 1 para transportarte a casillas reveladas. | — *sin implementar* | Verificado | Sí |
| `ayudate_tu` | Ayúdate tú | Help Yourself | 106 | Resolución individualista en encuentros secundarios con mercaderes. | — *sin implementar* | Verificado | Sí |
| `comprobacion` | Comprobación | Checking | 106 | Verificación de mecanismos o trampas en cofres. | — *sin implementar* | Revisar | No |
| `raton_de_biblioteca` | Ratón de biblioteca | Bookworm | 106 | Bonificación por la investigación profunda de tomos mágicos. | — *sin implementar* | Verificado | Sí |
| `truco_o_trato` | Truco o trato | Trick or Treat | 106 | Interacción especial en encuentros con mercaderes o bromistas. | — *sin implementar* | Verificado | Sí |
| `enfoque_agresivo` | Enfoque agresivo | Aggressive Approach | 107 | Disposición de combate directo ante encuentros con PNJ. | — *sin implementar* | Verificado | Sí |
| `apatia` | Apatía | Apathy | 108 | Actitud moral tras decisiones frías ante montaraces o rivales vencidos. | — *sin implementar* | Revisar | No |
| `misericordia` | Misericordia | Mercy | 108 | Actitud piadosa mostrada hacia enemigos o montaraces vencidos. | — *sin implementar* | Verificado | Sí |
| `cantico_de_cigarra` | Cántico de cigarra | Cicada's Song | 109 | Permite describir los augurios del vidente en la bruma. | — *sin implementar* | Revisar | No |
| `decapitado` | Decapitado | Beheaded | 111 | Resultado narrativo/físico en la exploración de restos óseos. | — *sin implementar* | Verificado | Sí |
| `un_clic_misterioso` | Un clic misterioso | A Mysterious Click | 111 | Registro del accionamiento de un resorte o trampa oculta. | — *sin implementar* | Verificado | Sí |
| `dedos_delatores` | Dedos delatores | Tell-Tale Fingers | 114 | Consecuencia de ser descubierto durante un intento de robo o infiltración. | — *sin implementar* | Revisar | No |
| `indefenso` | Indefenso | Defenseless | 114 | Estado físico temporal de vulnerabilidad en prisión o combate. | — *sin implementar* | Verificado | Sí |
| `inofensivo` | Inofensivo | Harmless | 114 | Actitud proyectada para no ser considerado una amenaza por los guardias. | — *sin implementar* | Verificado | Sí |
| `sangre_de_heroe` | Sangre de héroe | Hero's Blood | 114 | Registro de sacrificio o heridas de combate en eventos narrativos. | — *sin implementar* | Revisar | No |
| `centrarse_en_la_mision` | Centrarse en la misión | Focus on the Mission | 117 | Los impactos críticos en el d20 otorgan CONCENTRACIÓN 1. | — *sin implementar* | Revisar | No |
| `desafio_singular` | Desafío singular | Singular Challenge | 118 | Estado de combate, duelo o provocación directa en tabernas/arenas. | — *sin implementar* | Revisar | No |
| `salvaguarda` | Salvaguarda | Safeguard | 118 | Permite colocar escudos preventivos durante la preparación del combate. | — *sin implementar* | Verificado | Sí |

### El Mundo Sombrío / The Shadow World (1)

| ID | Nombre ES | Nombre EN | Pág. | Efecto / acción ES | Efecto / acción EN | Estado | EN verificado |
| --- | --- | --- | ---: | --- | --- | --- | --- |
| `llamas_azules` | Llamas azules | Blue Flames | 26 | Protege al Héroe de sufrir daño por la Oscuridad. | — *sin implementar* | Revisar | No |

### Desierto Avernal / Desert of Hellscar (1)

| ID | Nombre ES | Nombre EN | Pág. | Efecto / acción ES | Efecto / acción EN | Estado | EN verificado |
| --- | --- | --- | ---: | --- | --- | --- | --- |
| `proteccion_de_la_ciudadela_llave` | Protección de la Ciudadela / Llave | Citadel Protection / Key | 28 | Permite activar los mecanismos ancestrales del desierto. | — *sin implementar* | Revisar | No |

### La Ruina de Luccanor / The Ruin of Luccanor (3)

| ID | Nombre ES | Nombre EN | Pág. | Efecto / acción ES | Efecto / acción EN | Estado | EN verificado |
| --- | --- | --- | ---: | --- | --- | --- | --- |
| `ruido` | Ruido | Noise | 14 | Alteración acústica que modifica la alerta y generación de enemigos. | — *sin implementar* | Verificado | Sí |
| `pasaje_secreto` | Pasaje secreto | Secret Passage | 25 | Hallazgo e identificación de atajos y pasajes ocultos. | — *sin implementar* | Verificado | Sí |
| `fragmento_de_llave` | Fragmento de llave | Key Fragment | 30 | Registra el acople parcial de los mecanismos de cerradura. | — *sin implementar* | Revisar | No |

### El Ascenso del Dragón No Muerto / Rise of the Undead Dragon (2)

| ID | Nombre ES | Nombre EN | Pág. | Efecto / acción ES | Efecto / acción EN | Estado | EN verificado |
| --- | --- | --- | ---: | --- | --- | --- | --- |
| `llave` | Llave | Key | 29 | Permite activar los mecanismos ancestrales. | — *sin implementar* | Verificado | Sí |
| `maldicion` | Maldición | Curse | 30 | Estado que impone penalizaciones mágicas tras investigar al guardián. | — *sin implementar* | Verificado | Sí |

## Observaciones para la revisión

1. **No hay texto inglés implementado** para ninguna de las 99 entradas. Los nombres sí están en inglés; las descripciones no.
2. **La campaña exportada está mal clasificada:** todas las entradas quedan en `core` porque la fuente no trae `campaign`. Si se quiere filtrar por expansión, hay que derivar la campaña desde `source.book` o añadir `campaign` a cada entrada.
3. **`needsReview` no distingue nombre de efecto:** marca la ficha completa. La columna `EN verificado` solo refleja `enVerified`.
4. **Páginas:** son las declaradas en `source.page` y sirven para localizar la carta en el libro correspondiente.
5. **Texto de efecto:** se ha copiado literalmente del dato actual, sin normalizar erratas ni añadir aclaraciones.

## Criterio de traducción pendiente

Para completar la columna inglesa conviene revisar cada carta en su libro original y decidir si se usa la terminología oficial inglesa del juego (por ejemplo, *Bleed*, *Intimidate*, *Shield*) o una traducción funcional. Hasta entonces, la app mantiene el fallback al español para no mostrar textos inventados.
