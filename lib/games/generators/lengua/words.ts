// Banco de palabras con dibujo para los juegos de Comunicación. Cada palabra
// lleva su separación en sílabas (escrita a mano, no calculada: el castellano
// tiene diptongos e hiatos que una regla simple separaría mal).

export type Word = { w: string; e: string; syl: string[] };

function W(e: string, syllables: string): Word {
  const syl = syllables.split("-");
  return { w: syl.join(""), e, syl };
}

export const WORDS: Word[] = [
  // animales
  W("🐱", "ga-to"), W("🦆", "pa-to"), W("🐶", "pe-rro"), W("🐸", "ra-na"), W("🐭", "ra-tón"),
  W("🦁", "le-ón"), W("🐻", "o-so"), W("🐒", "mo-no"), W("🐮", "va-ca"), W("🐷", "cer-do"),
  W("🐴", "ca-ba-llo"), W("🐑", "o-ve-ja"), W("🐐", "ca-bra"), W("🐰", "co-ne-jo"), W("🐟", "pez"),
  W("🐳", "ba-lle-na"), W("🦈", "ti-bu-rón"), W("🐙", "pul-po"), W("🐢", "tor-tu-ga"), W("🐍", "ser-pien-te"),
  W("🐝", "a-be-ja"), W("🕷️", "a-ra-ña"), W("🦋", "ma-ri-po-sa"), W("🐜", "hor-mi-ga"), W("🐌", "ca-ra-col"),
  W("🦉", "bú-ho"), W("🐧", "pin-güi-no"), W("🦜", "lo-ro"), W("🐔", "ga-lli-na"), W("🐥", "po-lli-to"),
  W("🦒", "ji-ra-fa"), W("🐘", "e-le-fan-te"), W("🐯", "ti-gre"), W("🦊", "zo-rro"), W("🐺", "lo-bo"),
  W("🐫", "ca-me-llo"), W("🐊", "co-co-dri-lo"), W("🦕", "di-no-sau-rio"), W("🦭", "fo-ca"), W("🦙", "lla-ma"),
  W("🐛", "gu-sa-no"), W("🦀", "can-gre-jo"), W("🦍", "go-ri-la"), W("🦓", "ce-bra"), W("🦃", "pa-vo"),
  W("🦗", "gri-llo"), W("🐉", "dra-gón"),
  // frutas y comida
  W("🍇", "u-va"), W("🍐", "pe-ra"), W("🍍", "pi-ña"), W("🍓", "fre-sa"), W("🍎", "man-za-na"),
  W("🍌", "plá-ta-no"), W("🍊", "na-ran-ja"), W("🍋", "li-món"), W("🍉", "san-dí-a"), W("🍒", "ce-re-za"),
  W("🍅", "to-ma-te"), W("🥔", "pa-pa"), W("🥕", "za-na-ho-ria"), W("🌽", "ma-íz"), W("🍞", "pan"),
  W("🧀", "que-so"), W("🥛", "le-che"), W("🥚", "hue-vo"), W("🍗", "po-llo"), W("🍦", "he-la-do"),
  W("🎂", "pas-tel"), W("🍪", "ga-lle-ta"), W("🍫", "cho-co-la-te"), W("☕", "ta-za"), W("🍲", "so-pa"),
  W("🍯", "miel"), W("🌮", "ta-co"), W("🧂", "sal"), W("🥝", "ki-wi"),
  // naturaleza
  W("☀️", "sol"), W("🌙", "lu-na"), W("🌳", "ár-bol"), W("🌸", "flor"), W("🌹", "ro-sa"),
  W("🍃", "ho-ja"), W("☁️", "nu-be"), W("⭐", "es-tre-lla"), W("🌧️", "llu-via"), W("❄️", "nie-ve"),
  W("🔥", "fue-go"), W("💧", "a-gua"), W("🌊", "mar"), W("⛰️", "mon-ta-ña"), W("🏖️", "pla-ya"),
  W("🌱", "plan-ta"), W("🧊", "hie-lo"), W("🪺", "ni-do"),
  // cuerpo
  W("✋", "ma-no"), W("🦶", "pie"), W("👁️", "o-jo"), W("👄", "bo-ca"), W("👃", "na-riz"), W("👂", "o-re-ja"),
  // objetos y transporte
  W("🏠", "ca-sa"), W("🚗", "co-che"), W("🚂", "tren"), W("✈️", "a-vión"), W("⛵", "bar-co"),
  W("🚲", "bi-ci-cle-ta"), W("🚚", "ca-mión"), W("🚀", "co-he-te"), W("🎈", "glo-bo"), W("⚽", "pe-lo-ta"),
  W("📖", "li-bro"), W("✏️", "lá-piz"), W("🔑", "lla-ve"), W("🔔", "cam-pa-na"), W("⌚", "re-loj"),
  W("🪑", "si-lla"), W("🛏️", "ca-ma"), W("🚪", "puer-ta"), W("🪟", "ven-ta-na"), W("✂️", "ti-je-ra"),
  W("🎁", "re-ga-lo"), W("👑", "co-ro-na"), W("👞", "za-pa-to"), W("👢", "bo-ta"), W("🧢", "go-rro"),
  W("👕", "ca-mi-sa"), W("👗", "ves-ti-do"), W("🎲", "da-do"), W("🎸", "gui-ta-rra"), W("🥁", "tam-bor"),
  W("🎹", "pia-no"), W("🎺", "trom-pe-ta"), W("🖌️", "bro-cha"), W("🥄", "cu-cha-ra"), W("🍽️", "pla-to"),
  W("🎩", "som-bre-ro"), W("⚓", "an-cla"), W("🧵", "hi-lo"), W("🪀", "yo-yo"), W("🗺️", "ma-pa"),
  W("🧤", "guan-te"), W("📓", "cua-der-no"), W("🦴", "hue-so"),
  // personas
  W("🤴", "rey"), W("👸", "rei-na"), W("🧚", "ha-da"), W("👶", "be-bé"), W("🤡", "pa-ya-so"),
  W("🧑‍🚒", "bom-be-ro"),
];

// Palabras con dibujo que se agregan desde 2.°. Van aparte: los juegos de 1.°
// eligen al azar dentro de WORDS y, si esa lista cambiara, las preguntas ya
// guardadas (que se regeneran desde su semilla) dejarían de coincidir.
export const MORE_WORDS: Word[] = [
  W("🚕", "ta-xi"), W("📦", "pa-que-te"), W("🎾", "ra-que-ta"), W("🦟", "mos-qui-to"), W("🦅", "á-gui-la"),
  W("🧸", "ju-gue-te"), W("🐆", "gue-par-do"), W("🍔", "ham-bur-gue-sa"), W("🌻", "gi-ra-sol"), W("🦢", "cis-ne"),
  W("🦌", "cier-vo"), W("💎", "ge-ma"), W("🧞", "ge-nio"), W("📏", "re-gla"), W("🔌", "ca-ble"),
  W("🏘️", "pue-blo"), W("🌫️", "nie-bla"), W("🛕", "tem-plo"), W("🧑‍🚀", "as-tro-nau-ta"), W("💃", "bai-le"),
  W("6️⃣", "seis"), W("🐂", "buey"), W("🌲", "bos-que"), W("🌋", "vol-cán"), W("🌵", "cac-tus"),
  W("🏰", "cas-ti-llo"), W("🌉", "puen-te"), W("🏙️", "ciu-dad"), W("🧑‍⚕️", "mé-di-co"), W("👩‍🏫", "ma-es-tra"),
  W("🏴‍☠️", "pi-ra-ta"), W("👻", "fan-tas-ma"), W("🤖", "ro-bot"), W("🏆", "tro-fe-o"), W("🏅", "me-da-lla"),
  W("☂️", "pa-ra-guas"), W("🎒", "mo-chi-la"), W("📱", "te-lé-fo-no"), W("📷", "cá-ma-ra"), W("🔨", "mar-ti-llo"),
  W("🕯️", "ve-la"), W("🧼", "ja-bón"), W("🥦", "bró-co-li"), W("🍑", "du-raz-no"), W("🥥", "co-co"),
  W("🥑", "pal-ta"), W("🍚", "a-rroz"), W("🐾", "hue-lla"), W("🦇", "mur-cié-la-go"), W("🐬", "del-fín"),
  W("🦘", "can-gu-ro"), W("🐿️", "ar-di-lla"), W("🦔", "e-ri-zo"), W("🦩", "fla-men-co"), W("🐨", "ko-a-la"),
  W("💡", "fo-co"), W("🧲", "i-mán"),
];

export function word(w: string): Word {
  const found = WORDS.find((x) => x.w === w) ?? MORE_WORDS.find((x) => x.w === w);
  if (!found) throw new Error(`Palabra sin dibujo en el banco: ${w}`);
  return found;
}

export function words(list: string): Word[] {
  return list.split(" ").map(word);
}

export const VOWELS = ["a", "e", "i", "o", "u"];

// Vocal base de una letra (á → a), para contar y comparar vocales.
export function baseVowel(ch: string) {
  const base = ch.normalize("NFD").replace(/[̀-ͯ]/g, "");
  return VOWELS.includes(base) ? base : null;
}

export const label = (x: Word) => `${x.e} ${x.w}`;
