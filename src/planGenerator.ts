/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CoreNeed } from './types';

export interface DayPlan {
  day: number;
  citation: string;
  truth: string;
  action: string;
  surrender: string;
}

export const DAILY_PLANS: Record<CoreNeed, DayPlan[]> = {
  descanso: [
    {
      day: 1,
      citation: "Salmo 23:2 — «En lugares de delicados pastos me hará descansar; junto a aguas de reposo me pastoreará.»",
      truth: "El descanso no es un premio que ganas cuando terminas todo; es un regalo de gracia para empezar con fuerzas.",
      action: "Apaga toda pantalla 30 minutos antes de dormir y haz respiraciones lentas entregando tu día en oración.",
      surrender: "La falsa creencia de que si tú no sostienes las cosas, todo se va a desmoronar."
    },
    {
      day: 2,
      citation: "Mateo 11:28 — «Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.»",
      truth: "Jesús no te pide que resuelvas tus problemas para ir a Él; te invita a venir cansado para darte Su alivio.",
      action: "Escribe una lista con tus tres mayores fuentes de afán y dile: 'Señor Jesús, esto te lo entrego hoy'.",
      surrender: "La carga mental de resolver hoy los hipotéticos problemas de mañana."
    },
    {
      day: 3,
      citation: "Salmo 4:8 — «En paz me acostaré, y asimismo dormiré; porque solo tú, Jehová, me haces vivir confiado.»",
      truth: "El Pastor vela tus noches y sostiene tus días; puedes cerrar los ojos sabiendo que Dios cuida de ti.",
      action: "Antes de acostarte, declara en voz alta: 'Dios está al control, puedo descansar en paz'.",
      surrender: "El control de tus pensamientos nocturnos y la necesidad de anticipar dificultades."
    },
    {
      day: 4,
      citation: "Éxodo 33:14 — «Mi presencia irá contigo, y te daré descanso.»",
      truth: "Tu verdadero reposo no es la ausencia de problemas, sino la constante presencia del Pastor en tu caminar.",
      action: "Tómate una pausa de 5 minutos al mediodía para caminar despacio, contemplando la creación y respirando hondo.",
      surrender: "La prisa constante y la autocomplacencia por estar siempre hiperactivo."
    },
    {
      day: 5,
      citation: "Filipenses 4:6-7 — «Por nada estéis afanosos... y la paz de Dios guardará vuestros corazones...»",
      truth: "La paz de Dios actúa como un guardián celestial que protege tu mente cuando le rindes tus peticiones.",
      action: "Cuando asalte un pensamiento ansioso, susurra despacio: 'Jehová es mi pastor, nada me faltará'.",
      surrender: "Los escenarios catastróficos imaginarios que el miedo intenta proyectar en tu mente."
    },
    {
      day: 6,
      citation: "Isaías 26:3 — «Tú guardarás en completa paz a aquel cuyo pensamiento en ti persevera; porque en ti ha confiado.»",
      truth: "La quietud de tu mente depende enteramente de dónde decidas enfocar tu mirada y tus reflexiones.",
      action: "Escribe un versículo de consuelo en una tarjeta y ponlo en un lugar visible donde lo veas con frecuencia.",
      surrender: "La obsesión por las opiniones de los demás y por encajar en las expectativas ajenas."
    },
    {
      day: 7,
      citation: "Hebreos 4:9-10 — «Queda un reposo para el pueblo de Dios. Porque el que ha entrado en su reposo, también ha reposado de sus obras.»",
      truth: "Entrar en el reposo de Dios significa confiar plenamente en que la obra de Cristo es más que suficiente.",
      action: "Declara este día como un día libre de autoexigencia espiritual o laboral. Dedícate a disfrutar de Su gracia.",
      surrender: "La necesidad constante de justificar tu valor personal a través de tus logros o sacrificios."
    }
  ],
  consuelo: [
    {
      day: 1,
      citation: "Salmo 34:18 — «Cercano está Jehová a los quebrantados de corazón; y salva a los contritos de espíritu.»",
      truth: "Tu quebranto no aleja a Dios de tu lado; al contrario, es un imán que atrae Su presencia más tierna.",
      action: "Permítete un momento para orar con absoluta honestidad, expresando tu dolor o tristeza sin filtros.",
      surrender: "La máscara de aparente fortaleza y perfección que intentas sostener frente al mundo."
    },
    {
      day: 2,
      citation: "Isaías 40:11 — «Como pastor apacentará su rebaño; en su brazo llevará los corderos, y en su seno los llevará...»",
      truth: "En los días de mayor fragilidad física o mental, el Pastor te levanta con ternura para llevarte en Su regazo.",
      action: "Quédate en silencio durante 3 minutos, visualizándote sostenido por los brazos eternos y seguros del Padre.",
      surrender: "La culpa por no sentirte alegre o con energía espiritual en este momento."
    },
    {
      day: 3,
      citation: "2 Corintios 1:3-4 — «El Padre de misericordias y Dios de toda consolación, el cual nos consuela en todas nuestras tribulaciones...»",
      truth: "El consuelo divino no es un parche temporal, sino un bálsamo que restaura las heridas más íntimas de tu alma.",
      action: "Escribe una carta sincera a Dios hablándole detalladamente de la traición, pérdida o dolor que más te duele.",
      surrender: "La amargura y las preguntas infinitas de por qué ocurrieron las cosas."
    },
    {
      day: 4,
      citation: "Juan 14:27 — «La paz os dejo, mi paz os doy... No se turbe vuestro corazón, ni tenga miedo.»",
      truth: "La paz que Cristo te regala es inamovible porque está cimentada en Su victoria, no en tus circunstancias.",
      action: "Identifica un gesto de amor o misericordia de alguien en estos días y agradéceselo a Dios de corazón.",
      surrender: "El temor a que la felicidad no vuelva o a que el dolor sea permanente."
    },
    {
      day: 5,
      citation: "Apocalipsis 21:4 — «Enjugará Dios toda lágrima de los ojos de ellos; y ya no habrá muerte, ni habrá más llanto...»",
      truth: "Cada una de tus lágrimas es de gran valor para Dios. Él promete que todo dolor será plenamente redimido.",
      action: "Escucha una canción de adoración instrumental y deja que el Espíritu Santo hable quietud a tu espíritu.",
      surrender: "El resentment reprimido contra las personas que te decepcionaron en momentos difíciles."
    },
    {
      day: 6,
      citation: "Salmo 147:3 — «Él sana a los quebrantados de corazón, y venda sus heridas.»",
      truth: "El Médico divino venda tus heridas con infinita paciencia; respeta Tu propio proceso de sanidad.",
      action: "Haz un acto sencillo de compasión contigo mismo (prepara tu comida favorita, camina sin prisas, descansa).",
      surrender: "La prisa neurótica por sentirte bien de inmediato y el castigo mental por tus debilidades."
    },
    {
      day: 7,
      citation: "Salmo 23:4 — «Aunque ande en valle de sombra de muerte, no temeré mal alguno, porque tú estarás conmigo.»",
      truth: "El valle de sombra no es una residencia fija; es un camino de transición hacia un lugar de abundancia.",
      action: "Comparte una pequeña palabra de aliento o una nota de agradecimiento con alguien que también esté sufriendo.",
      surrender: "El miedo al futuro incierto y el temor a que el dolor defina el resto de tu vida."
    }
  ],
  direccion: [
    {
      day: 1,
      citation: "Isaías 30:21 — «Entonces tus oídos oirán a tus espaldas palabra que diga: Este es el camino, andad por él.»",
      truth: "Dios no desea que vivas en confusión. Al aquietar tus temores, Su voz se hace clara a tu espíritu.",
      action: "Dedica los primeros 10 minutos de la mañana al silencio absoluto, pidiendo dirección para tus decisiones.",
      surrender: "El afán impulsivo por tomar decisiones apresuradas bajo los efectos del pánico."
    },
    {
      day: 2,
      citation: "Salmo 32:8 — «Te haré entender, y te enseñaré el camino en que debes andar; sobre ti fijaré mis ojos.»",
      truth: "La mirada del Pastor está fija en ti con amor; Él guiará tus pasos si estás dispuesto a mirar atrás.",
      action: "Dibuja un mapa visual sencillo de tus opciones actuales y ora por sabiduría para distinguir la correcta.",
      surrender: "La necesidad de tener todas las garantías humanas resueltas antes de dar un paso de fe."
    },
    {
      day: 3,
      citation: "Proverbios 3:5-6 — «Fíate de Jehová de todo tu corazón, y no te apoyes en tu propia prudencia...»",
      truth: "Nuestra propia lógica es limitada; el discernimiento espiritual nace al rendir nuestros planes a Su sabiduría.",
      action: "Identifica qué consejo humano estás siguiendo y compáralo serenamente con los principios bíblicos.",
      surrender: "El orgullo de creer que sabes perfectamente lo que te conviene sin consultar a Dios."
    },
    {
      day: 4,
      citation: "Salmo 119:105 — «Lámpara es a mis pies tu palabra, y lumbrera a mi camino.»",
      truth: "La Palabra de Dios ilumina el paso inmediato que tienes delante, no necesariamente todo el horizonte.",
      action: "Lee atentamente un Salmo de sabiduría (como el Salmo 1 o 19) buscando principios para tu situación.",
      surrender: "La impaciencia de querer conocer el desenlace de los próximos cinco años hoy mismo."
    },
    {
      day: 5,
      citation: "Santiago 1:5 — «Y si alguno de vosotros tiene falta de sabiduría, pídala a Dios, el cual da a todos abundantemente...»",
      truth: "La sabiduría divina es un regalo que Dios otorga con generosidad y sin reproches a quien se la pide.",
      action: "Ora de rodillas pidiendo una mente clara y un discernimiento libre de egoísmos y ambiciones personales.",
      surrender: "Las motivaciones ocultas de querer aparentar éxito o evitar la incomodidad a toda costa."
    },
    {
      day: 6,
      citation: "Salmo 23:3 — «Comfortará mi alma; me guiará por sendas de justicia por amor de su nombre.»",
      truth: "El Pastor te guía por sendas correctas, no para alimentar tu ego, sino para glorificar Su Santo Nombre.",
      action: "Escribe en tu cuaderno: 'Señor, haz lo que sea mejor para Tu gloria, no solo para mi comodidad'.",
      surrender: "Tus propios planes de gloria personal, dinero, o seguridad puramente humana."
    },
    {
      day: 7,
      citation: "Juan 10:27 — «Mis ovejas oyen mi voz, y yo las conozco, y me siguen.»",
      truth: "Tu identidad como oveja te capacita para reconocer de manera natural y clara la voz de tu Creador.",
      action: "Toma la decisión de dar el primer paso pequeño en la dirección que Dios ha puesto en tu corazón.",
      surrender: "El miedo a cometer errores; recuerda que el Pastor está listo para corregir amablemente tu rumbo."
    }
  ],
  fortaleza: [
    {
      day: 1,
      citation: "Isaías 40:29 — «Él da esfuerzo al cansado, y multiplica las fuerzas al que no tiene ningunas.»",
      truth: "La verdadera fortaleza espiritual no se autogenera; se recibe cuando admitimos que no nos quedan fuerzas.",
      action: "Reconoce delante de Dios que estás cansado y pídele que infunda Su poder en tu debilidad.",
      surrender: "La mentira de que debes ser autosuficiente y fuerte por tus propios medios."
    },
    {
      day: 2,
      citation: "Filipenses 4:13 — «Todo lo puedo en Cristo que me fortalece.»",
      truth: "Tu capacidad para resistir la tormenta no depende de tu voluntad, sino de la savia divina de Cristo.",
      action: "Cuando sientas deseos de rendirte, repite en voz alta: 'Su gracia me basta, en Él soy fuerte'.",
      surrender: "El desánimo que produce mirar tus propias limitaciones en lugar de mirar al Señor."
    },
    {
      day: 3,
      citation: "Efesios 6:10 — «Por lo demás, hermanos míos, fortaleceos en el Señor, y en el poder de su fuerza.»",
      truth: "Estar fuerte implica vestirse espiritualmente cada día con las verdades eternas de la Palabra.",
      action: "Identifica qué mentira del enemigo te está debilitando y contrarréstala con una verdad de la Biblia.",
      surrender: "El hábito de quejarte de las circunstancias en lugar de declarar las promesas divinas."
    },
    {
      day: 4,
      citation: "Nehemías 8:10 — «No os entristezcáis, porque el gozo de Jehová es vuestra fuerza.»",
      truth: "El gozo del Señor es un escudo protector que te sostiene firme aun cuando las lágrimas caen.",
      action: "Pasa 5 minutos recordando tres victorias pasadas que Dios te concedió en medio de otras tormentas.",
      surrender: "El pesimismo crónico que asume que todo saldrá mal y que Dios te ha abandonado."
    },
    {
      day: 5,
      citation: "2 Corintios 12:9 — «Bástate mi gracia; porque mi poder se perfecciona en la debilidad.»",
      truth: "Tu vulnerabilidad es el escenario perfecto para que el poder glorioso de Dios sea visible.",
      action: "En lugar de ocultar tu debilidad, úsala como una oportunidad de adoración y dependencia total.",
      surrender: "La vergüenza por sentirte cansado o incapaz de lidiar con las presiones de la vida."
    },
    {
      day: 6,
      citation: "Salmo 27:1 — «Jehová es mi luz y mi salvación; ¿de quién temeré? Jehová es la fortaleza de mi vida...»",
      truth: "Cuando el Creador del universo protege tu vida, no hay amenaza humana que pueda destruirte.",
      action: "Lee el Salmo 27 completo en voz alta, personificando cada declaración de confianza en Dios.",
      surrender: "El pánico a las personas, a las deudas o a las consecuencias terrenas de la crisis."
    },
    {
      day: 7,
      citation: "Isaías 41:10 — «No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios...»",
      truth: "Dios promete sostenerte de la mano derecha con la justicia de Su diestra triunfante.",
      action: "Párate firme, respira hondo y da un paso adelante con valentía para enfrentar las tareas del día.",
      surrender: "La inercia de la pasividad y el miedo a tomar la iniciativa en las áreas bajo tu control."
    }
  ],
  esperanza: [
    {
      day: 1,
      citation: "Jeremías 29:11 — «Porque yo sé los pensamientos que tengo acerca de vosotros... pensamientos de paz, y no de mal...»",
      truth: "El plan de Dios para tu vida sigue en pie; la tormenta actual es un capítulo, no el final de tu historia.",
      action: "Escribe en una hoja: 'Mi futuro está seguro en las manos de Dios' y colócala en tu mesita de noche.",
      surrender: "La sospecha de que Dios tiene intenciones destructivas u hostiles hacia ti."
    },
    {
      day: 2,
      citation: "Romanos 15:13 — «Y el Dios de esperanza os llene de todo gozo y paz en el creer, para que abundéis en esperanza...»",
      truth: "La esperanza cristiana no es un optimismo ciego; es la certeza absoluta de la bondad futura de Dios.",
      action: "Dedica un tiempo a agradecer a Dios por lo que hará, aun antes de ver la respuesta a tus oraciones.",
      surrender: "El cinismo y la amargura que intentan blindarte contra futuras desilusiones."
    },
    {
      day: 3,
      citation: "Lamentaciones 3:22-23 — «Por la misericordia de Jehová no hemos sido consumidos, porque nunca decayeron sus misericordias...»",
      truth: "Cada mañana trae una nueva ración de misericordia adaptada para las necesidades específicas de ese día.",
      action: "Al despertar, da gracias por el nuevo día diciendo: 'Señor, confío en que Tu misericordia me sostendrá hoy'.",
      surrender: "Los errores y fracasos del pasado que insisten en definir tu valía actual."
    },
    {
      day: 4,
      citation: "Salmo 42:11 — «¿Por qué te abates, oh alma mía, y por qué te turbas dentro de mí? Espera en Dios; porque aún he de alabarle...»",
      truth: "Es saludable hablarle a tu propia alma y recordarle las razones que tiene para confiar en el Señor.",
      action: "Cuando sientas desánimo, pregúntate en voz alta: '¿Por qué dudar de Aquel que dio Su vida por mí?'.",
      surrender: "La autocompasión paralizante y los discursos internos de derrota."
    },
    {
      day: 5,
      citation: "Hebreos 6:19 — «La cual tenemos como segura y firme ancla del alma, y que penetra hasta dentro del velo.»",
      truth: "Tu esperanza está anclada en el santuario celestial; ninguna tormenta terrenal puede soltar esa amarra.",
      action: "Dibuja un ancla sencilla o busca una imagen para recordar que tu alma está firmemente sujeta al trono de gracia.",
      surrender: "La inestabilidad emocional causada por los cambios diarios en tus circunstancias o noticias."
    },
    {
      day: 6,
      citation: "Salmo 130:5 — «Esperé yo a Jehová, esperó mi alma; en su palabra he esperado.»",
      truth: "Esperar en Dios no es perder el tiempo; es una postura activa de confianza en la soberanía de Su tiempo.",
      action: "Decide no tomar atajos dudosos para resolver tus problemas y confía pacientemente en el obrar del Señor.",
      surrender: "La urgencia carnal por forzar las puertas que Dios ha cerrado de manera soberana."
    },
    {
      day: 7,
      citation: "Romanos 8:28 — «Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien...»",
      truth: "Dios tiene la asombrosa capacidad de tomar incluso lo malo o doloroso y transformarlo en bendición eterna.",
      action: "Haz una lista de tres situaciones difíciles de tu pasado que Dios terminó usando para formarte o bendecirte.",
      surrender: "El resentimiento por las pérdidas sufridas, creyendo que todo ha sido en vano."
    }
  ]
};

/**
 * Generates a complete 30-day plan derived from the selected spiritual/emotional need.
 * Follows a progressive developmental path through 5 strategic weeks.
 */
export function generate30DayPlan(need: CoreNeed): DayPlan[] {
  const basePlans = DAILY_PLANS[need] || DAILY_PLANS['descanso'];
  const fullPlan: DayPlan[] = [];

  // Weekly focus subtitles/modifications
  const focusByNeed: Record<CoreNeed, { w2: string; w3: string; w4: string }> = {
    descanso: {
      w2: "Silencio de la Mente (Romper el runrún mental)",
      w3: "Fronteras Sagradas (Establecer límites sanos)",
      w4: "Hábito del Santuario (Consistencia en la paz)"
    },
    consuelo: {
      w2: "Sanidad del Quebranto (Mirar la herida con Dios)",
      w3: "Abrazo de Gracia (Aceptación plena de tu vulnerabilidad)",
      w4: "Esperanza Restauradora (Bálsamo para el dolor)"
    },
    direccion: {
      w2: "Aclarando el Rumbo (Aquietar voces externas)",
      w3: "Pasos de Obediencia (Fe activa en lo pequeño)",
      w4: "Certeza en la Niebla (Confianza firme a largo plazo)"
    },
    fortaleza: {
      w2: "Renovación Interna (Fuerza espiritual en debilidad)",
      w3: "Coraza de Verdad (Desarraigar mentiras debilitantes)",
      w4: "Poder de Firmeza (Sostenerse firme en la victoria)"
    },
    esperanza: {
      w2: "Visión del Futuro (La promesa divina es mayor que la crisis)",
      w3: "Ancla del Alma (Seguridad inquebrantable)",
      w4: "Promesas de Gloria (Victoria eterna sobre lo temporal)"
    }
  };

  const focus = focusByNeed[need] || focusByNeed['descanso'];

  for (let d = 1; d <= 30; d++) {
    // Ultimate days based on Salmo 23:5 & 6 to provide an elegant culmination to the 30-day journey
    if (d === 29) {
      fullPlan.push({
        day: 29,
        citation: "Salmo 23:5 — «Aderezas mesa delante de mí en presencia de mis angustiadores; unges mi cabeza con aceite; mi copa está rebosante.»",
        truth: `Consagración del Alma: La provisión abundante de Dios ocurre en el mismo campo de batalla. No necesitas que tus aflicciones o angustias de ${need.toUpperCase()} desaparezcan primero para experimentar una copa rebosante de Su gracia ungiendo tu mente.`,
        action: "Prepara un tiempo devocional de adoración y celebra la fidelidad de Dios. Tu gozo delante de los problemas es tu mayor acto de victoria de fe.",
        surrender: "La vana expectativa de que tu vida esté perfectamente ordenada y libre de conflictos terrenales antes de dar gracias al Señor."
      });
      continue;
    }
    if (d === 30) {
      fullPlan.push({
        day: 30,
        citation: "Salmo 23:6 — «Ciertamente el bien y la misericordia me seguirán todos los días de mi vida, y en la casa de Jehová moraré por largos días.»",
        truth: `Victoria Absoluta: ¡La bondad y la gracia divina te persiguen de manera implacable e incondicional! No tienes que mendigar la presencia de Dios; Su amor inagotable es tu residencia fija para siempre, sosteniendo tu proceso de ${need.toUpperCase()}.`,
        action: "Escribe tu propio salmo o diario recapitulando estos 30 días de fe, y comprométete a mantener un altar diario de silencio, respiración y rendición sagrada.",
        surrender: "Tu vida entera, tu futuro completo, tus seres queridos y el desenlace final de cada una de tus preocupaciones en las manos tiernas de tu Buen Pastor."
      });
      continue;
    }

    const baseIndex = (d - 1) % 7;
    const base = basePlans[baseIndex];

    // Determine Week
    if (d <= 7) {
      // Week 1 (Days 1-7): Foundations of Grace (Original text)
      fullPlan.push({
        day: d,
        citation: base.citation,
        truth: `Semana 1 (Cimiento): ${base.truth}`,
        action: base.action,
        surrender: base.surrender
      });
    } else if (d <= 14) {
      // Week 2 (Days 8-14): Rooting out barriers
      fullPlan.push({
        day: d,
        citation: `${base.citation.replace("—", `(Día ${d}) —`)}`,
        truth: `Semana 2 (${focus.w2}): ${base.truth} Reconoce la pauta oculta que sabotea tu paz.`,
        action: `Diario de Sanidad: Acompaña tu práctica diaria escribiendo con honestidad: ¿Qué temor o mentira enraizada te impide abrazar esta promesa hoy?`,
        surrender: `Tus viejos patrones de defensa personal, el desgaste del pasado y ${base.surrender.toLowerCase()}`
      });
    } else if (d <= 21) {
      // Week 3 (Days 15-21): Setting boundaries & physical/social action
      fullPlan.push({
        day: d,
        citation: `${base.citation.replace("—", `(Día ${d}) —`)}`,
        truth: `Semana 3 (${focus.w3}): ${base.truth} Dios te da el discernimiento para proteger tu santuario mental.`,
        action: `Frontera de Fe: Di un 'no' amoroso pero firme a una demanda externa extenuante. Haz la acción original: ${base.action}`,
        surrender: `La complacencia complaciente con el entorno que desgasta tu mente, y ${base.surrender.toLowerCase()}`
      });
    } else {
      // Week 4 (Days 22-28): Long-term surrender habits
      fullPlan.push({
        day: d,
        citation: `${base.citation.replace("—", `(Día ${d}) —`)}`,
        truth: `Semana 4 (${focus.w4}): ${base.truth} Tu obediencia fiel y cotidiana construye un altar de descanso duradero.`,
        action: `Sello del Hábito: Practica la acción espiritual: ${base.action} Comparte con un hermano o mentor tu compromiso para caminar bajo cuentas claras.`,
        surrender: `La impaciencia egoísta por ver resultados mágicos e inmediatos, y ${base.surrender.toLowerCase()}`
      });
    }
  }

  return fullPlan;
}
