// backend/scripts/seed_neo4j.js
import { neo4jDriver } from '../src/db.js';

const session = neo4jDriver.session({ defaultAccessMode: neo4jDriver.WRITE });

/* 1) purge complète (villes + relations) */
await session.run('MATCH (c:City) DETACH DELETE c');

/* 2) insertion / mise à jour des villes */
const cities = [
    { code: 'PAR', name: 'Paris', country: 'FR' },
    { code: 'TYO', name: 'Tokyo', country: 'JP' },
    { code: 'DXB', name: 'Dubai', country: 'AE' },
    { code: 'NYC', name: 'New York', country: 'US' },
    { code: 'LON', name: 'London', country: 'GB' },
    { code: 'SYD', name: 'Sydney', country: 'AU' },
    { code: 'BER', name: 'Berlin', country: 'DE' },
    { code: 'ROM', name: 'Rome', country: 'IT' },
    { code: 'MAD', name: 'Madrid', country: 'ES' },
    { code: 'BKK', name: 'Bangkok', country: 'TH' },
    { code: 'SIN', name: 'Singapore', country: 'SG' },
    { code: 'CAI', name: 'Cairo', country: 'EG' },
    { code: 'MOS', name: 'Moscow', country: 'RU' },
    { code: 'SAO', name: 'Sao Paulo', country: 'BR' },
    { code: 'TOR', name: 'Toronto', country: 'CA' },
    { code: 'HKG', name: 'Hong Kong', country: 'HK' },
    { code: 'IST', name: 'Istanbul', country: 'TR' },
    { code: 'KUL', name: 'Kuala Lumpur', country: 'MY' },
    { code: 'ZRH', name: 'Zurich', country: 'CH' },
    { code: 'VIE', name: 'Vienna', country: 'AT' },
    { code: 'BRU', name: 'Brussels', country: 'BE' },
    { code: 'AMS', name: 'Amsterdam', country: 'NL' },
    { code: 'PRG', name: 'Prague', country: 'CZ' },
    { code: 'WAR', name: 'Warsaw', country: 'PL' },
    { code: 'DUB', name: 'Dublin', country: 'IE' },
    { code: 'OSL', name: 'Oslo', country: 'NO' },
    { code: 'CPH', name: 'Copenhagen', country: 'DK' },
    { code: 'HEL', name: 'Helsinki', country: 'FI' },
    { code: 'BUD', name: 'Budapest', country: 'HU' },
    { code: 'ATH', name: 'Athens', country: 'GR' },
    { code: 'LIS', name: 'Lisbon', country: 'PT' },
    { code: 'STO', name: 'Stockholm', country: 'SE' },
    { code: 'MEX', name: 'Mexico City', country: 'MX' },
    { code: 'LIM', name: 'Lima', country: 'PE' },
    { code: 'BOG', name: 'Bogota', country: 'CO' },
    { code: 'SCL', name: 'Santiago', country: 'CL' },
    { code: 'LAX', name: 'Los Angeles', country: 'US' },
    { code: 'MIA', name: 'Miami', country: 'US' },
    { code: 'CHI', name: 'Chicago', country: 'US' },
    { code: 'DAL', name: 'Dallas', country: 'US' },
    { code: 'ATL', name: 'Atlanta', country: 'US' },
    { code: 'SEA', name: 'Seattle', country: 'US' },
    { code: 'BOS', name: 'Boston', country: 'US' },
    { code: 'WAS', name: 'Washington DC', country: 'US' },
    { code: 'HOU', name: 'Houston', country: 'US' },
    { code: 'PHX', name: 'Phoenix', country: 'US' },
    { code: 'SAN', name: 'San Diego', country: 'US' },
    { code: 'DET', name: 'Detroit', country: 'US' },
    { code: 'PHL', name: 'Philadelphia', country: 'US' },
    { code: 'MIN', name: 'Minneapolis', country: 'US' },
    { code: 'MPL', name: 'Montpellier', country: 'FR' },
    { code: 'LYO', name: 'Lyon', country: 'FR' },
    { code: 'NCE', name: 'Nice', country: 'FR' },
    { code: 'BOD', name: 'Bordeaux', country: 'FR' },
    { code: 'TLS', name: 'Toulouse', country: 'FR' },
    { code: 'LIL', name: 'Lille', country: 'FR' },
    { code: 'STR', name: 'Strasbourg', country: 'FR' },
    { code: 'NAN', name: 'Nantes', country: 'FR' },
    { code: 'RNO', name: 'Rennes', country: 'FR' },
    { code: 'AIX', name: 'Aix-en-Provence', country: 'FR' },
    { code: 'GVA', name: 'Geneva', country: 'CH' },
    { code: 'LUG', name: 'Lugano', country: 'CH' },
    { code: 'ZAG', name: 'Zagreb', country: 'HR' },
    { code: 'BEL', name: 'Belgrade', country: 'RS' },
    { code: 'SOF', name: 'Sofia', country: 'BG' },
    { code: 'BUD', name: 'Budapest', country: 'HU' },
    { code: 'KRA', name: 'Krakow', country: 'PL' },
    { code: 'WRO', name: 'Wroclaw', country: 'PL' },
    { code: 'GDN', name: 'Gdansk', country: 'PL' },
    { code: 'LJU', name: 'Ljubljana', country: 'SI' },
    { code: 'TIR', name: 'Tirana', country: 'AL' },
    { code: 'PRN', name: 'Pristina', country: 'XK' },
    { code: 'SKP', name: 'Skopje', country: 'MK' },
    { code: 'TBS', name: 'Tbilisi', country: 'GE' },
    { code: 'YER', name: 'Yerevan', country: 'AM' },
    { code: 'BAK', name: 'Baku', country: 'AZ' },
    { code: 'AST', name: 'Astana', country: 'KZ' },
    { code: 'ALM', name: 'Almaty', country: 'KZ' },
    { code: 'DUS', name: 'Dusseldorf', country: 'DE' },
    { code: 'HAM', name: 'Hamburg', country: 'DE' },
    { code: 'FRA', name: 'Frankfurt', country: 'DE' },
    { code: 'MUC', name: 'Munich', country: 'DE' },
    { code: 'STU', name: 'Stuttgart', country: 'DE' },
    { code: 'CGN', name: 'Cologne', country: 'DE' },
    { code: 'LEJ', name: 'Leipzig', country: 'DE' },
    { code: 'DRE', name: 'Dresden', country: 'DE' },
    { code: 'HAN', name: 'Hannover', country: 'DE' },
    { code: 'NUE', name: 'Nuremberg', country: 'DE' },
    { code: 'BIE', name: 'Bielefeld', country: 'DE' },
    { code: 'MUN', name: 'Munster', country: 'DE' },
    { code: 'AUG', name: 'Augsburg', country: 'DE' },
    { code: 'WUR', name: 'Wurzburg', country: 'DE' }
];
await session.run(
    `UNWIND $list AS c
   MERGE (x:City {code:c.code})
   SET   x.name = c.name,
         x.country = c.country`,
    { list: cities }
);

/* 3) relations NEAR pondérées */
const near = [
    ['PAR', 'LON', 0.9],
    ['PAR', 'TYO', 0.7],
    ['PAR', 'DXB', 0.6],
    ['NYC', 'LON', 0.8],
    ['NYC', 'PAR', 0.7],
    ['NYC', 'DXB', 0.5],
    ['LON', 'DXB', 0.6],
    ['LON', 'TYO', 0.4],
    ['DXB', 'TYO', 0.5],
    ['PAR', 'SYD', 0.3],
    ['NYC', 'SYD', 0.2],
    ['LON', 'SYD', 0.1],
    ['DXB', 'SYD', 0.2],
    ['PAR', 'BER', 0.8],
    ['PAR', 'ROM', 0.7],
    ['PAR', 'MAD', 0.6],
    ['PAR', 'BKK', 0.4],
    ['PAR', 'SIN', 0.3],
    ['PAR', 'CAI', 0.5],
    ['PAR', 'MOS', 0.4],
    ['PAR', 'SAO', 0.2],
    ['PAR', 'TOR', 0.3]
];
await session.run(
    `UNWIND $rels AS r
   MATCH (a:City {code:r[0]}), (b:City {code:r[1]})
   MERGE (a)-[rel:NEAR]->(b)
   SET rel.weight = r[2]`,
    { rels: near }
);

await session.close();
await neo4jDriver.close();
console.log('Seed Neo4j terminé (5 villes + relations)');
