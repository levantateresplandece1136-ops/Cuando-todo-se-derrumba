/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HabitItem, SheepType, CoreNeed } from './types';

export const HABIT_PRESETS: Record<string, HabitItem[]> = {
  mente: [
    { id: 'm1', text: 'Practicar 10 minutos de completo silencio al despertar, entregando el control del día a Cristo.' },
    { id: 'm2', text: 'Apagar toda pantalla 1 hora antes de dormir y leer un libro de edificación o meditar.' },
    { id: 'm3', text: 'Escribir cada noche 3 agradecimientos específicos a Dios para reconfigurar mi enfoque.' }
  ],
  cuerpo: [
    { id: 'c1', text: 'Realizar un estiramiento pausado de 5 minutos por la mañana para liberar tensión muscular.' },
    { id: 'c2', text: 'Beber al menos 8 vasos de agua al día, cuidando conscientemente el templo del Espíritu Santo.' },
    { id: 'c3', text: 'Salir a caminar 15 minutos al aire libre sin distracciones, contemplando la creación.' }
  ],
  relaciones: [
    { id: 'r1', text: 'Enviar un mensaje inesperado de afecto sincero o gratitud a un familiar o amigo.' },
    { id: 'r2', text: 'Tener una cena sin móviles en la mesa, escuchando atentamente a mi cónyuge, hijo o amigo.' },
    { id: 'r3', text: 'Pedir ayuda con humildad a un confidente espiritual, admitiendo que no puedo con todo solo.' }
  ],
  comunion: [
    { id: 'd1', text: 'Leer un Salmo completo cada mañana antes de revisar cualquier red social o correo.' },
    { id: 'd2', text: 'Iniciar el día arrodillado por 5 minutos, rindiendo mis planes y anhelos delante de Dios.' },
    { id: 'd3', text: 'Tomar una pausa de oración al mediodía para recordar que mi suficiencia viene de Cristo.' }
  ]
};

export const MICROPAUSES = {
  pause1: {
    title: "Un respiro para tu alma",
    subtitle: "Pausa número uno",
    instruction: "Suelta los hombros... relaja el cuello. Cierra los ojos por un instante y ora silenciosamente: 'Señor, aquí estoy Señor. Ayúdame a detenerme'.",
    actionText: "He tomado el respiro",
    bgColor: "bg-emerald-50/50"
  },
  pause2: {
    title: "El agua aclara el andar",
    subtitle: "Pausa número dos",
    instruction: "Si te es posible, ponte de pie de forma pausada y bebe un trago de agua. Al hacerlo, recuerda que Cristo es tu agua viva y que Su gracia sacia por completo tu alma sedienta.",
    actionText: "He bebido agua",
    bgColor: "bg-blue-50/50"
  },
  pause3: {
    title: "Una semilla de gratitud",
    subtitle: "Pausa número tres",
    instruction: "Piensa en algo pequeño que no se esté derrumbando hoy. Un rayo de sol, el latido de tu corazón, o alguien que te ama profundamente. Agradéceselo a Dios en un susurro.",
    actionText: "He dado gracias de corazón",
    bgColor: "bg-amber-50/30"
  }
};

export const SHEEP_DETAILS: Record<SheepType, { label: string; description: string; pastoralWord: string }> = {
  herida: {
    label: "Herida (por traiciones, pérdidas o palabras duras)",
    description: "Cargas con marcas visibles o invisibles que han dejado tu corazón con miedo a volver a confiar o avanzar.",
    pastoralWord: "El Buen Pastor no tiene prisa con la oveja herida; no la empuja para que corra al ritmo del rebaño. Al contrario, Él se arrodilla a tu lado, limpia tus llagas con aceite fresco, venda tu corazón y te sostiene en Sus brazos con una paciencia infinita. Tus heridas hoy no anulan tu propósito; son el lugar donde Su consuelo sobrenatural se hará más palpable."
  },
  temerosa: {
    label: "Temerosa (ante la incertidumbre de lo que vendrá mañana)",
    description: "Sientes que el futuro es un abismo incierto y el miedo a dar un paso en falso paraliza tu presente.",
    pastoralWord: "Cuando asedia el temor de que todo colapse, recuerda que el pastor camina delante de ti. El Pastor no te pide que conozcas el camino de mañana, te pide simplemente que des un paso hoy y confíes en Su voz. Aún en el valle de sombra, la vara y el cayado de nuestro Padre están listos para ahuyentar tus temores y restaurar tu quietud."
  },
  perdida: {
    label: "Perdida (sin rumbo claro, sintiendo confusión espiritual)",
    description: "Sientes que te has desviado del propósito, que tus decisiones te alejaron o que no sabes cuál es tu norte.",
    pastoralWord: "Una oveja perdida no es una oveja olvidada. El Pastor no espera molesto a que regreses por tu cuenta; de hecho, deja las noventa y nueve y sale a buscarte activamente por los montes. Su amor no depende de tu capacidad para orientarte. Su voz te llama por tu nombre hoy: 'Vuelve a casa, te he encontrado'."
  },
  agotada: {
    label: "Agotada (por intentar llevar el control de todo tú solo)",
    description: "Tu mente no descansa intentando encajar piezas sueltas que no dependen de ti.",
    pastoralWord: "Has corrido tanto intentando sostener estructuras que solo Dios puede sostener. Es momento de rendir la ilusión de soberanía. La invitación que te hace hoy es a recostarte en verdes pastos, a suspirar hondo y comprender con humildad que Él es Dios y tú no. Suelta el timón; descansa, que Él sigue vigilando las olas por ti."
  },
  cansada: {
    label: "Cansada (por un largo periodo de desierto espiritual o físico)",
    description: "Llevas meses batallando con desiertos cotidianos, problemas financieros, familiares o de salud.",
    pastoralWord: "El cansancio prolongado desgasta el escudo de la fe, pero Cristo conoce el polvo del que fuimos formados. Él no se siente decepcionado por tu falta de fuerzas; al contrario, Su poder se perfecciona exactamente en tu flaqueza. Hoy, deja que sea Su Santo Espíritu el que ore por ti con suspiros indecibles. Puedes rendirte a dormir hoy en paz, Dios no duerme."
  }
};

export const NEED_DETAILS: Record<CoreNeed, { label: string; verse: string; reflection: string }> = {
  descanso: {
    label: "Descanso profundo para mi mente",
    verse: "Mateo 11:28 — «Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.»",
    reflection: "No un descanso físico pasajero, sino el reposo de saber que tus problemas y afanes ya no residen únicamente en tus hombros. Has sido llamado a intercambiar tu pesada carga por el yugo suave del único que puede sostener el universo."
  },
  consuelo: {
    label: "Consuelo para mi corazón adolorido",
    verse: "Salmo 34:18 — «Cercano está Jehová a los quebrantados de corazón; y salva a los contritos de espíritu.»",
    reflection: "El dolor tiene una tendencia a hacernos sentir aislados o desamparados. Sin embargo, la verdad bíblica revela que el quebrantamiento es un imán para la tierna presencia de Dios. Él no te mira con reproche, junta cada una de tus lágrimas en Su redoma y susurra consuelo eterno."
  },
  direccion: {
    label: "Dirección y claridad sobre qué decisión tomar",
    verse: "Isaías 30:21 — «Entonces tus oídos oirán a tus espaldas palabra que diga: Este es el camino, andad por él...»",
    reflection: "La confusión distorsiona la senda, pero la Biblia recuerda que Dios no es autor de confusión sino de paz. Al detenerte hoy y soltar el pánico del apuro, tus oídos percibirán la directriz del Pastor, quien te mostrará paso a paso las huellas en que debes pisar."
  },
  fortaleza: {
    label: "Fortaleza interior para resistir la tormenta",
    verse: "Filipenses 4:13 — «Todo lo puedo en Cristo que me fortalece.»",
    reflection: "Esta fortaleza no proviene de un esfuerzo mental para resistir, ni de una psicología positiva artificial. Viene directamente de una savia celestial conectada a tu alma herida: Su propia fuerza divina infundida en tu fragilidad."
  },
  esperanza: {
    label: "Esperanza viva ante el presentimiento de derrota",
    verse: "Romanos 15:13 — «Y el Dios de esperanza os llene de todo gozo y paz en el creer...»",
    reflection: "Ante la perspectiva humana del fracaso, la esperanza cristocéntrica se levanta victoriosa porque está anclada en una tumba que quedó vacía. Nada está perdido mientras Dios siga sentado en el trono."
  }
};
