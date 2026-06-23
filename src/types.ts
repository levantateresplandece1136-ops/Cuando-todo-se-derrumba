/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Movement =
  | 'intro'
  | 'mov1_detente'
  | 'pause1'
  | 'mov2_mochila'
  | 'pastoral_unpack'
  | 'pause2'
  | 'mov3_claridad'
  | 'pause3'
  | 'mov4_pastor'
  | 'mov5_reconstruye'
  | 'plan_final';

export interface BackpackState {
  precupa: string;
  duele: string;
  miedo: string;
  cambiar: string;
}

export type SheepType = 'herida' | 'temerosa' | 'perdida' | 'agotada' | 'cansada';

export type CoreNeed = 'descanso' | 'consuelo' | 'direccion' | 'fortaleza' | 'esperanza';

export interface HabitCategory {
  id: 'mente' | 'cuerpo' | 'relaciones' | 'comunion';
  title: string;
  description: string;
}

export interface HabitItem {
  id: string;
  text: string;
}

export interface RenovationPlan {
  priorities: string[];
  compromisos: string[];
  mainGrowthArea: string;
  verseGuide: string;
  prayer: string;
  verseReflection: string;
}
