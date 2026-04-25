export const WILAYAS = [
  { code: "01", name: "Adrar", postalCode: "01000" },
  { code: "02", name: "Chlef", postalCode: "02000" },
  { code: "03", name: "Laghouat", postalCode: "03000" },
  { code: "04", name: "Oum El Bouaghi", postalCode: "04000" },
  { code: "05", name: "Batna", postalCode: "05000" },
  { code: "06", name: "Béjaïa", postalCode: "06000" },
  { code: "07", name: "Biskra", postalCode: "07000" },
  { code: "08", name: "Béchar", postalCode: "08000" },
  { code: "09", name: "Blida", postalCode: "09000" },
  { code: "10", name: "Bouira", postalCode: "10000" },
  { code: "11", name: "Tamanrasset", postalCode: "11000" },
  { code: "12", name: "Tébessa", postalCode: "12000" },
  { code: "13", name: "Tlemcen", postalCode: "13000" },
  { code: "14", name: "Tiaret", postalCode: "14000" },
  { code: "15", name: "Tizi Ouzou", postalCode: "15000" },
  { code: "16", name: "Algiers", postalCode: "16000" },
  { code: "17", name: "Djelfa", postalCode: "17000" },
  { code: "18", name: "Jijel", postalCode: "18000" },
  { code: "19", name: "Sétif", postalCode: "19000" },
  { code: "20", name: "Saïda", postalCode: "20000" },
  { code: "21", name: "Skikda", postalCode: "21000" },
  { code: "22", name: "Sidi Bel Abbès", postalCode: "22000" },
  { code: "23", name: "Annaba", postalCode: "23000" },
  { code: "24", name: "Guelma", postalCode: "24000" },
  { code: "25", name: "Constantine", postalCode: "25000" },
  { code: "26", name: "Médéa", postalCode: "26000" },
  { code: "27", name: "Mostaganem", postalCode: "27000" },
  { code: "28", name: "M'Sila", postalCode: "28000" },
  { code: "29", name: "Mascara", postalCode: "29000" },
  { code: "30", name: "Ouargla", postalCode: "30000" },
  { code: "31", name: "Oran", postalCode: "31000" },
  { code: "32", name: "El Bayadh", postalCode: "32000" },
  { code: "33", name: "Illizi", postalCode: "33000" },
  { code: "34", name: "Bordj Bou Arréridj", postalCode: "34000" },
  { code: "35", name: "Boumerdès", postalCode: "35000" },
  { code: "36", name: "El Tarf", postalCode: "36000" },
  { code: "37", name: "Tindouf", postalCode: "37000" },
  { code: "38", name: "Tissemsilt", postalCode: "38000" },
  { code: "39", name: "El Oued", postalCode: "39000" },
  { code: "40", name: "Khenchela", postalCode: "40000" },
  { code: "41", name: "Souk Ahras", postalCode: "41000" },
  { code: "42", name: "Tipaza", postalCode: "42000" },
  { code: "43", name: "Mila", postalCode: "43000" },
  { code: "44", name: "Aïn Defla", postalCode: "44000" },
  { code: "45", name: "Naâma", postalCode: "45000" },
  { code: "46", name: "Aïn Témouchent", postalCode: "46000" },
  { code: "47", name: "Ghardaïa", postalCode: "47000" },
  { code: "48", name: "Relizane", postalCode: "48000" },
  { code: "49", name: "Timimoun", postalCode: "49000" },
  { code: "50", name: "Bordj Badji Mokhtar", postalCode: "50000" },
  { code: "51", name: "Ouled Djellal", postalCode: "51000" },
  { code: "52", name: "Béni Abbès", postalCode: "52000" },
  { code: "53", name: "In Salah", postalCode: "53000" },
  { code: "54", name: "In Guezzam", postalCode: "54000" },
  { code: "55", name: "Touggourt", postalCode: "55000" },
  { code: "56", name: "Djanet", postalCode: "56000" },
  { code: "57", name: "El Meghaier", postalCode: "57000" },
  { code: "58", name: "El Meniaa", postalCode: "58000" },
  { code: "59", name: "Ain Bessem", postalCode: "59000" },
  { code: "60", name: "El Eulma", postalCode: "60000" },
  { code: "61", name: "Ain Oussera", postalCode: "61000" },
  { code: "62", name: "Draa El Mizan", postalCode: "62000" },
  { code: "63", name: "Bou Saada", postalCode: "63000" },
  { code: "64", name: "Chelghoum Laid", postalCode: "64000" },
  { code: "65", name: "El Khroub", postalCode: "65000" },
  { code: "66", name: "Ain El Melh", postalCode: "66000" },
  { code: "67", name: "Taher", postalCode: "67000" },
  { code: "68", name: "El Aouinet", postalCode: "68000" },
  { code: "69", name: "Baraki", postalCode: "69000" },
] as const;

export type Wilaya = (typeof WILAYAS)[number];

export function getPostalCodeByWilaya(wilayaName: string): string | undefined {
  return WILAYAS.find((w) => w.name === wilayaName)?.postalCode;
}

/** Returns the 2-digit code prefix for a wilaya (e.g. "13" for Tlemcen). */
export function getWilayaCode(wilayaName: string): string | undefined {
  return WILAYAS.find((w) => w.name === wilayaName)?.code;
}

export function getWilayaOptions() {
  return WILAYAS.map((w) => ({ label: w.name, value: w.name }));
}
