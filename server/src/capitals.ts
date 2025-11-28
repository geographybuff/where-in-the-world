// Map of country names to their capitals
export interface CapitalInfo {
  capital: string;
  country: string;
}

// Common country name variations and their capitals
export const COUNTRY_CAPITALS: Record<string, CapitalInfo> = {
  // A
  'afghanistan': { capital: 'Kabul', country: 'Afghanistan' },
  'albania': { capital: 'Tirana', country: 'Albania' },
  'algeria': { capital: 'Algiers', country: 'Algeria' },
  'andorra': { capital: 'Andorra la Vella', country: 'Andorra' },
  'angola': { capital: 'Luanda', country: 'Angola' },
  'argentina': { capital: 'Buenos Aires', country: 'Argentina' },
  'armenia': { capital: 'Yerevan', country: 'Armenia' },
  'australia': { capital: 'Canberra', country: 'Australia' },
  'austria': { capital: 'Vienna', country: 'Austria' },
  'azerbaijan': { capital: 'Baku', country: 'Azerbaijan' },
  
  // B
  'bahamas': { capital: 'Nassau', country: 'Bahamas' },
  'bahrain': { capital: 'Manama', country: 'Bahrain' },
  'bangladesh': { capital: 'Dhaka', country: 'Bangladesh' },
  'barbados': { capital: 'Bridgetown', country: 'Barbados' },
  'belarus': { capital: 'Minsk', country: 'Belarus' },
  'belgium': { capital: 'Brussels', country: 'Belgium' },
  'belize': { capital: 'Belmopan', country: 'Belize' },
  'benin': { capital: 'Porto-Novo', country: 'Benin' },
  'bhutan': { capital: 'Thimphu', country: 'Bhutan' },
  'bolivia': { capital: 'Sucre', country: 'Bolivia' },
  'bosnia': { capital: 'Sarajevo', country: 'Bosnia and Herzegovina' },
  'bosnia and herzegovina': { capital: 'Sarajevo', country: 'Bosnia and Herzegovina' },
  'botswana': { capital: 'Gaborone', country: 'Botswana' },
  'brazil': { capital: 'Brasília', country: 'Brazil' },
  'brunei': { capital: 'Bandar Seri Begawan', country: 'Brunei' },
  'bulgaria': { capital: 'Sofia', country: 'Bulgaria' },
  'burkina faso': { capital: 'Ouagadougou', country: 'Burkina Faso' },
  'burundi': { capital: 'Gitega', country: 'Burundi' },
  
  // C
  'cambodia': { capital: 'Phnom Penh', country: 'Cambodia' },
  'cameroon': { capital: 'Yaoundé', country: 'Cameroon' },
  'canada': { capital: 'Ottawa', country: 'Canada' },
  'cape verde': { capital: 'Praia', country: 'Cape Verde' },
  'central african republic': { capital: 'Bangui', country: 'Central African Republic' },
  'chad': { capital: "N'Djamena", country: 'Chad' },
  'chile': { capital: 'Santiago', country: 'Chile' },
  'china': { capital: 'Beijing', country: 'China' },
  'colombia': { capital: 'Bogotá', country: 'Colombia' },
  'comoros': { capital: 'Moroni', country: 'Comoros' },
  'congo': { capital: 'Brazzaville', country: 'Republic of the Congo' },
  'costa rica': { capital: 'San José', country: 'Costa Rica' },
  'croatia': { capital: 'Zagreb', country: 'Croatia' },
  'cuba': { capital: 'Havana', country: 'Cuba' },
  'cyprus': { capital: 'Nicosia', country: 'Cyprus' },
  'czech republic': { capital: 'Prague', country: 'Czech Republic' },
  'czechia': { capital: 'Prague', country: 'Czech Republic' },
  
  // D
  'denmark': { capital: 'Copenhagen', country: 'Denmark' },
  'djibouti': { capital: 'Djibouti', country: 'Djibouti' },
  'dominica': { capital: 'Roseau', country: 'Dominica' },
  'dominican republic': { capital: 'Santo Domingo', country: 'Dominican Republic' },
  
  // E
  'ecuador': { capital: 'Quito', country: 'Ecuador' },
  'egypt': { capital: 'Cairo', country: 'Egypt' },
  'el salvador': { capital: 'San Salvador', country: 'El Salvador' },
  'equatorial guinea': { capital: 'Malabo', country: 'Equatorial Guinea' },
  'eritrea': { capital: 'Asmara', country: 'Eritrea' },
  'estonia': { capital: 'Tallinn', country: 'Estonia' },
  'eswatini': { capital: 'Mbabane', country: 'Eswatini' },
  'ethiopia': { capital: 'Addis Ababa', country: 'Ethiopia' },
  
  // F
  'fiji': { capital: 'Suva', country: 'Fiji' },
  'finland': { capital: 'Helsinki', country: 'Finland' },
  'france': { capital: 'Paris', country: 'France' },
  
  // G
  'gabon': { capital: 'Libreville', country: 'Gabon' },
  'gambia': { capital: 'Banjul', country: 'Gambia' },
  'georgia': { capital: 'Tbilisi', country: 'Georgia' },
  'germany': { capital: 'Berlin', country: 'Germany' },
  'ghana': { capital: 'Accra', country: 'Ghana' },
  'greece': { capital: 'Athens', country: 'Greece' },
  'grenada': { capital: "St. George's", country: 'Grenada' },
  'guatemala': { capital: 'Guatemala City', country: 'Guatemala' },
  'guinea': { capital: 'Conakry', country: 'Guinea' },
  'guinea-bissau': { capital: 'Bissau', country: 'Guinea-Bissau' },
  'guyana': { capital: 'Georgetown', country: 'Guyana' },
  
  // H
  'haiti': { capital: 'Port-au-Prince', country: 'Haiti' },
  'honduras': { capital: 'Tegucigalpa', country: 'Honduras' },
  'hungary': { capital: 'Budapest', country: 'Hungary' },
  
  // I
  'iceland': { capital: 'Reykjavik', country: 'Iceland' },
  'india': { capital: 'New Delhi', country: 'India' },
  'indonesia': { capital: 'Jakarta', country: 'Indonesia' },
  'iran': { capital: 'Tehran', country: 'Iran' },
  'iraq': { capital: 'Baghdad', country: 'Iraq' },
  'ireland': { capital: 'Dublin', country: 'Ireland' },
  'israel': { capital: 'Jerusalem', country: 'Israel' },
  'italy': { capital: 'Rome', country: 'Italy' },
  'ivory coast': { capital: 'Yamoussoukro', country: 'Ivory Coast' },
  
  // J
  'jamaica': { capital: 'Kingston', country: 'Jamaica' },
  'japan': { capital: 'Tokyo', country: 'Japan' },
  'jordan': { capital: 'Amman', country: 'Jordan' },
  
  // K
  'kazakhstan': { capital: 'Astana', country: 'Kazakhstan' },
  'kenya': { capital: 'Nairobi', country: 'Kenya' },
  'kiribati': { capital: 'Tarawa', country: 'Kiribati' },
  'kosovo': { capital: 'Pristina', country: 'Kosovo' },
  'kuwait': { capital: 'Kuwait City', country: 'Kuwait' },
  'kyrgyzstan': { capital: 'Bishkek', country: 'Kyrgyzstan' },
  
  // L
  'laos': { capital: 'Vientiane', country: 'Laos' },
  'latvia': { capital: 'Riga', country: 'Latvia' },
  'lebanon': { capital: 'Beirut', country: 'Lebanon' },
  'lesotho': { capital: 'Maseru', country: 'Lesotho' },
  'liberia': { capital: 'Monrovia', country: 'Liberia' },
  'libya': { capital: 'Tripoli', country: 'Libya' },
  'liechtenstein': { capital: 'Vaduz', country: 'Liechtenstein' },
  'lithuania': { capital: 'Vilnius', country: 'Lithuania' },
  'luxembourg': { capital: 'Luxembourg City', country: 'Luxembourg' },
  
  // M
  'madagascar': { capital: 'Antananarivo', country: 'Madagascar' },
  'malawi': { capital: 'Lilongwe', country: 'Malawi' },
  'malaysia': { capital: 'Kuala Lumpur', country: 'Malaysia' },
  'maldives': { capital: 'Malé', country: 'Maldives' },
  'mali': { capital: 'Bamako', country: 'Mali' },
  'malta': { capital: 'Valletta', country: 'Malta' },
  'marshall islands': { capital: 'Majuro', country: 'Marshall Islands' },
  'mauritania': { capital: 'Nouakchott', country: 'Mauritania' },
  'mauritius': { capital: 'Port Louis', country: 'Mauritius' },
  'mexico': { capital: 'Mexico City', country: 'Mexico' },
  'micronesia': { capital: 'Palikir', country: 'Micronesia' },
  'moldova': { capital: 'Chișinău', country: 'Moldova' },
  'monaco': { capital: 'Monaco', country: 'Monaco' },
  'mongolia': { capital: 'Ulaanbaatar', country: 'Mongolia' },
  'montenegro': { capital: 'Podgorica', country: 'Montenegro' },
  'morocco': { capital: 'Rabat', country: 'Morocco' },
  'mozambique': { capital: 'Maputo', country: 'Mozambique' },
  'myanmar': { capital: 'Naypyidaw', country: 'Myanmar' },
  'burma': { capital: 'Naypyidaw', country: 'Myanmar' },
  
  // N
  'namibia': { capital: 'Windhoek', country: 'Namibia' },
  'nauru': { capital: 'Yaren', country: 'Nauru' },
  'nepal': { capital: 'Kathmandu', country: 'Nepal' },
  'netherlands': { capital: 'Amsterdam', country: 'Netherlands' },
  'holland': { capital: 'Amsterdam', country: 'Netherlands' },
  'new zealand': { capital: 'Wellington', country: 'New Zealand' },
  'nicaragua': { capital: 'Managua', country: 'Nicaragua' },
  'niger': { capital: 'Niamey', country: 'Niger' },
  'nigeria': { capital: 'Abuja', country: 'Nigeria' },
  'north korea': { capital: 'Pyongyang', country: 'North Korea' },
  'north macedonia': { capital: 'Skopje', country: 'North Macedonia' },
  'macedonia': { capital: 'Skopje', country: 'North Macedonia' },
  'norway': { capital: 'Oslo', country: 'Norway' },
  
  // O
  'oman': { capital: 'Muscat', country: 'Oman' },
  
  // P
  'pakistan': { capital: 'Islamabad', country: 'Pakistan' },
  'palau': { capital: 'Ngerulmud', country: 'Palau' },
  'panama': { capital: 'Panama City', country: 'Panama' },
  'papua new guinea': { capital: 'Port Moresby', country: 'Papua New Guinea' },
  'paraguay': { capital: 'Asunción', country: 'Paraguay' },
  'peru': { capital: 'Lima', country: 'Peru' },
  'philippines': { capital: 'Manila', country: 'Philippines' },
  'poland': { capital: 'Warsaw', country: 'Poland' },
  'portugal': { capital: 'Lisbon', country: 'Portugal' },
  
  // Q
  'qatar': { capital: 'Doha', country: 'Qatar' },
  
  // R
  'romania': { capital: 'Bucharest', country: 'Romania' },
  'russia': { capital: 'Moscow', country: 'Russia' },
  'rwanda': { capital: 'Kigali', country: 'Rwanda' },
  
  // S
  'saint kitts and nevis': { capital: 'Basseterre', country: 'Saint Kitts and Nevis' },
  'saint lucia': { capital: 'Castries', country: 'Saint Lucia' },
  'saint vincent and the grenadines': { capital: 'Kingstown', country: 'Saint Vincent and the Grenadines' },
  'samoa': { capital: 'Apia', country: 'Samoa' },
  'san marino': { capital: 'San Marino', country: 'San Marino' },
  'sao tome and principe': { capital: 'São Tomé', country: 'São Tomé and Príncipe' },
  'saudi arabia': { capital: 'Riyadh', country: 'Saudi Arabia' },
  'senegal': { capital: 'Dakar', country: 'Senegal' },
  'serbia': { capital: 'Belgrade', country: 'Serbia' },
  'seychelles': { capital: 'Victoria', country: 'Seychelles' },
  'sierra leone': { capital: 'Freetown', country: 'Sierra Leone' },
  'singapore': { capital: 'Singapore', country: 'Singapore' },
  'slovakia': { capital: 'Bratislava', country: 'Slovakia' },
  'slovenia': { capital: 'Ljubljana', country: 'Slovenia' },
  'solomon islands': { capital: 'Honiara', country: 'Solomon Islands' },
  'somalia': { capital: 'Mogadishu', country: 'Somalia' },
  'south africa': { capital: 'Pretoria', country: 'South Africa' },
  'south korea': { capital: 'Seoul', country: 'South Korea' },
  'korea': { capital: 'Seoul', country: 'South Korea' },
  'south sudan': { capital: 'Juba', country: 'South Sudan' },
  'spain': { capital: 'Madrid', country: 'Spain' },
  'sri lanka': { capital: 'Sri Jayawardenepura Kotte', country: 'Sri Lanka' },
  'sudan': { capital: 'Khartoum', country: 'Sudan' },
  'suriname': { capital: 'Paramaribo', country: 'Suriname' },
  'sweden': { capital: 'Stockholm', country: 'Sweden' },
  'switzerland': { capital: 'Bern', country: 'Switzerland' },
  'syria': { capital: 'Damascus', country: 'Syria' },
  
  // T
  'taiwan': { capital: 'Taipei', country: 'Taiwan' },
  'tajikistan': { capital: 'Dushanbe', country: 'Tajikistan' },
  'tanzania': { capital: 'Dodoma', country: 'Tanzania' },
  'thailand': { capital: 'Bangkok', country: 'Thailand' },
  'timor-leste': { capital: 'Dili', country: 'Timor-Leste' },
  'east timor': { capital: 'Dili', country: 'Timor-Leste' },
  'togo': { capital: 'Lomé', country: 'Togo' },
  'tonga': { capital: "Nuku'alofa", country: 'Tonga' },
  'trinidad and tobago': { capital: 'Port of Spain', country: 'Trinidad and Tobago' },
  'tunisia': { capital: 'Tunis', country: 'Tunisia' },
  'turkey': { capital: 'Ankara', country: 'Turkey' },
  'turkmenistan': { capital: 'Ashgabat', country: 'Turkmenistan' },
  'tuvalu': { capital: 'Funafuti', country: 'Tuvalu' },
  
  // U
  'uganda': { capital: 'Kampala', country: 'Uganda' },
  'ukraine': { capital: 'Kyiv', country: 'Ukraine' },
  'united arab emirates': { capital: 'Abu Dhabi', country: 'United Arab Emirates' },
  'uae': { capital: 'Abu Dhabi', country: 'United Arab Emirates' },
  'united kingdom': { capital: 'London', country: 'United Kingdom' },
  'uk': { capital: 'London', country: 'United Kingdom' },
  'england': { capital: 'London', country: 'United Kingdom' },
  'britain': { capital: 'London', country: 'United Kingdom' },
  'great britain': { capital: 'London', country: 'United Kingdom' },
  'united states': { capital: 'Washington, D.C.', country: 'United States' },
  'usa': { capital: 'Washington, D.C.', country: 'United States' },
  'us': { capital: 'Washington, D.C.', country: 'United States' },
  'america': { capital: 'Washington, D.C.', country: 'United States' },
  'uruguay': { capital: 'Montevideo', country: 'Uruguay' },
  'uzbekistan': { capital: 'Tashkent', country: 'Uzbekistan' },
  
  // V
  'vanuatu': { capital: 'Port Vila', country: 'Vanuatu' },
  'vatican city': { capital: 'Vatican City', country: 'Vatican City' },
  'vatican': { capital: 'Vatican City', country: 'Vatican City' },
  'venezuela': { capital: 'Caracas', country: 'Venezuela' },
  'vietnam': { capital: 'Hanoi', country: 'Vietnam' },
  
  // Y
  'yemen': { capital: "Sana'a", country: 'Yemen' },
  
  // Z
  'zambia': { capital: 'Lusaka', country: 'Zambia' },
  'zimbabwe': { capital: 'Harare', country: 'Zimbabwe' },
};

// Function to check if a search term matches a country
export function findCountryCapital(searchTerm: string): CapitalInfo | null {
  const normalized = searchTerm.toLowerCase().trim();
  return COUNTRY_CAPITALS[normalized] || null;
}

// Function to find all matching countries for a partial search
export function findMatchingCountries(searchTerm: string): CapitalInfo[] {
  const normalized = searchTerm.toLowerCase().trim();
  const matches: CapitalInfo[] = [];
  
  for (const [key, value] of Object.entries(COUNTRY_CAPITALS)) {
    if (key.includes(normalized) || value.country.toLowerCase().includes(normalized)) {
      // Avoid duplicates (e.g., 'usa' and 'united states' both map to same country)
      if (!matches.some(m => m.country === value.country)) {
        matches.push(value);
      }
    }
  }
  
  return matches;
}
