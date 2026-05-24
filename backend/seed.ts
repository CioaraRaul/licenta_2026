// eslint-disable-next-line @typescript-eslint/no-var-requires
const Database = require('better-sqlite3');
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
const scrypt = promisify(_scrypt);

const DB_PATH = 'database.sqlite';

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(8).toString('hex');
  const hash = (await scrypt(password, salt, 32)) as Buffer;
  return salt + '.' + hash.toString('hex');
}

const MAKES = [
  {
    make: 'BMW',
    models: [
      'M3',
      'M5',
      '3 Series',
      '5 Series',
      'X5',
      'X3',
      'M2',
      '7 Series',
      'X7',
      'i4',
      'iX',
      'M8',
      '1 Series',
      '2 Series',
      'Z4',
      '8 Series',
      'X6',
      'X1',
      'M4',
      'X4',
    ],
  },
  {
    make: 'Mercedes-Benz',
    models: [
      'C-Class',
      'E-Class',
      'S-Class',
      'GLE',
      'GLC',
      'AMG GT',
      'A-Class',
      'B-Class',
      'CLA',
      'GLA',
      'GLB',
      'GLS',
      'SL',
      'EQS',
      'EQE',
      'G-Class',
      'CLS',
      'SLC',
      'EQA',
      'EQB',
    ],
  },
  {
    make: 'Audi',
    models: [
      'A3',
      'A4',
      'A6',
      'A8',
      'Q3',
      'Q5',
      'Q7',
      'Q8',
      'RS6',
      'RS4',
      'TT',
      'R8',
      'e-tron',
      'Q4 e-tron',
      'S3',
      'S4',
      'S5',
      'SQ5',
      'SQ7',
      'A5',
    ],
  },
  {
    make: 'Toyota',
    models: [
      'Camry',
      'Corolla',
      'RAV4',
      'Land Cruiser',
      'Supra',
      'Yaris',
      'C-HR',
      'Highlander',
      'Prius',
      'bZ4X',
      'Hilux',
      'GR86',
      'Avalon',
      'Venza',
      'Tacoma',
      '4Runner',
      'Sequoia',
      'Tundra',
      'Sienna',
      'Mirai',
    ],
  },
  {
    make: 'Ford',
    models: [
      'Mustang',
      'F-150',
      'Explorer',
      'Focus',
      'Fiesta',
      'Puma',
      'Kuga',
      'Bronco',
      'Ranger',
      'Maverick',
      'Edge',
      'Escape',
      'EcoSport',
      'Galaxy',
      'S-Max',
      'Transit',
      'Mustang Mach-E',
      'F-250',
      'Expedition',
      'Lincoln',
    ],
  },
  {
    make: 'Volkswagen',
    models: [
      'Golf',
      'Passat',
      'Tiguan',
      'Touareg',
      'Polo',
      'T-Roc',
      'ID.3',
      'ID.4',
      'Arteon',
      'Touran',
      'Sharan',
      'Caddy',
      'T-Cross',
      'Taos',
      'Atlas',
      'Jetta',
      'Beetle',
      'Up',
      'ID.5',
      'Multivan',
    ],
  },
  {
    make: 'Porsche',
    models: [
      '911',
      'Cayenne',
      'Panamera',
      'Macan',
      'Taycan',
      'Boxster',
      'Cayman',
      '918',
      '911 GT3',
      '911 Turbo',
      'Cayenne GTS',
      'Cayenne Turbo',
      'Panamera 4S',
      'Macan S',
      'Taycan 4S',
      '911 Carrera',
      '911 Targa',
      'Panamera Sport Turismo',
      'Macan GTS',
      'Cayenne E-Hybrid',
    ],
  },
  {
    make: 'Tesla',
    models: [
      'Model 3',
      'Model S',
      'Model X',
      'Model Y',
      'Cybertruck',
      'Roadster',
      'Model 3 Long Range',
      'Model S Plaid',
      'Model X Plaid',
      'Model Y Performance',
      'Model 3 RWD',
      'Model Y Long Range',
      'Model S Long Range',
      'Model X Long Range',
      'Model 3 Performance',
      'Model Y RWD',
      'Semi',
      'Model S 60',
      'Model X 60D',
      'Model 3 SR+',
    ],
  },
  {
    make: 'Volvo',
    models: [
      'XC40',
      'XC60',
      'XC90',
      'V60',
      'V90',
      'S60',
      'S90',
      'C40 Recharge',
      'EX40',
      'EX90',
      'V60 Cross Country',
      'V90 Cross Country',
      'XC40 Recharge',
      'XC60 Recharge',
      'XC90 Recharge',
      'S60 Recharge',
      'S90 Recharge',
      'V60 T8',
      'XC40 B4',
      'XC60 B5',
    ],
  },
  {
    make: 'Honda',
    models: [
      'Civic',
      'Accord',
      'CR-V',
      'HR-V',
      'Pilot',
      'Ridgeline',
      'Odyssey',
      'Passport',
      'Insight',
      'Jazz',
      'e',
      'ZR-V',
      'Prologue',
      'Civic Type R',
      'Civic Si',
      'Accord Sport',
      'CR-V Hybrid',
      'Pilot TrailSport',
      'Odyssey Elite',
      'HR-V AWD',
    ],
  },
];

const FUEL_TYPES = [
  'gasoline',
  'diesel',
  'electric',
  'hybrid',
  'plugin_hybrid',
];
const TRANSMISSIONS = ['manual', 'automatic', 'semi_automatic'];
const DRIVE_TYPES = ['fwd', 'rwd', 'awd', '4wd'];
const CONDITIONS = ['new', 'used', 'certified_pre_owned'];
const VEHICLE_TYPES = ['car', 'suv', 'truck', 'van', 'sports_car'];
const COLORS = [
  'Black',
  'White',
  'Silver',
  'Gray',
  'Blue',
  'Red',
  'Green',
  'Brown',
  'Orange',
  'Yellow',
];
const CITIES = [
  'Bucharest',
  'Cluj-Napoca',
  'Timisoara',
  'Iasi',
  'Constanta',
  'Brasov',
  'Craiova',
  'Galati',
  'Ploiesti',
  'Oradea',
];
const ENGINE_TYPES = [
  'V6',
  'V8',
  'Inline-4',
  'Inline-6',
  'V12',
  'Flat-4',
  'Flat-6',
  'Electric',
  'Inline-3',
];

function pick<T>(arr: T[], index: number): T {
  return arr[index % arr.length];
}

function vehicleType(make: string, model: string): string {
  const suv = [
    'X5',
    'X3',
    'X7',
    'X6',
    'X1',
    'X4',
    'GLE',
    'GLC',
    'GLA',
    'GLB',
    'GLS',
    'Q3',
    'Q5',
    'Q7',
    'Q8',
    'SQ5',
    'SQ7',
    'RAV4',
    'Land Cruiser',
    'C-HR',
    'Highlander',
    'bZ4X',
    '4Runner',
    'Sequoia',
    'Venza',
    'Explorer',
    'Bronco',
    'Edge',
    'Escape',
    'EcoSport',
    'Puma',
    'Kuga',
    'Tiguan',
    'Touareg',
    'T-Roc',
    'T-Cross',
    'ID.4',
    'Taos',
    'Atlas',
    'Cayenne',
    'Macan',
    'XC40',
    'XC60',
    'XC90',
    'CR-V',
    'HR-V',
    'Pilot',
    'Passport',
    'ZR-V',
    'Prologue',
    'Model X',
    'Cybertruck',
    'EX90',
  ];
  const sports = [
    'M3',
    'M5',
    'M2',
    'M8',
    'Z4',
    '8 Series',
    'AMG GT',
    'TT',
    'R8',
    'RS6',
    'RS4',
    'Supra',
    'GR86',
    '911',
    'Boxster',
    'Cayman',
    '918',
    'Mustang',
    'Roadster',
    'Civic Type R',
    'Civic Si',
  ];
  const truck = [
    'F-150',
    'F-250',
    'Hilux',
    'Ranger',
    'Maverick',
    'Ridgeline',
    'Tacoma',
    'Tundra',
    'Cybertruck',
    'Semi',
  ];
  const van = [
    'Sienna',
    'Transit',
    'Galaxy',
    'S-Max',
    'Touran',
    'Sharan',
    'Caddy',
    'Multivan',
    'Odyssey',
  ];
  if (truck.some((t) => model.includes(t))) return 'truck';
  if (van.some((v) => model.includes(v))) return 'van';
  if (sports.some((s) => model.includes(s))) return 'sports_car';
  if (suv.some((s) => model.includes(s))) return 'suv';
  return 'car';
}

function fuelTypeForMake(make: string, idx: number): string {
  if (make === 'Tesla') return 'electric';
  if (make === 'Volvo' && idx % 3 === 0) return 'plugin_hybrid';
  if (make === 'Toyota' && idx % 4 === 0) return 'hybrid';
  return pick(FUEL_TYPES.slice(0, 3), idx);
}

function engineForFuel(
  fuel: string,
  idx: number,
): {
  engineSize: number;
  engineType: string;
  horsepower: number;
  torque: number;
} {
  if (fuel === 'electric')
    return {
      engineSize: 0,
      engineType: 'Electric',
      horsepower: pick(
        [300, 400, 450, 500, 670, 750, 800, 1000, 350, 250],
        idx,
      ),
      torque: pick([400, 500, 600, 750, 900, 1000, 650, 550, 450, 350], idx),
    };
  const sizes = [1.4, 1.5, 1.6, 2.0, 2.5, 3.0, 3.5, 4.0, 4.4, 5.0, 6.2];
  const engTypes = [
    'Inline-4',
    'V6',
    'V8',
    'Inline-6',
    'V12',
    'Flat-6',
    'Inline-3',
  ];
  const sz = sizes[idx % sizes.length];
  const et = engTypes[idx % engTypes.length];
  const hp = Math.round(100 + idx * 17 + sz * 40);
  const tq = Math.round(200 + idx * 12 + sz * 30);
  return { engineSize: sz, engineType: et, horsepower: hp, torque: tq };
}

function generateVin(sellerIdx: number, carIdx: number): string {
  const chars = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';
  const base = `SEED${String(sellerIdx).padStart(2, '0')}${String(carIdx).padStart(2, '0')}`;
  let suffix = '';
  for (let i = 0; i < 17 - base.length; i++) {
    suffix += chars[(sellerIdx * 37 + carIdx * 13 + i * 7) % chars.length];
  }
  return base + suffix;
}

function featureList(idx: number): string {
  const all = [
    'Sunroof',
    'Leather Seats',
    'Navigation',
    'Bluetooth',
    'Backup Camera',
    'Heated Seats',
    'Apple CarPlay',
    'Android Auto',
    'Keyless Entry',
    'Push Start',
    'Lane Assist',
    'Adaptive Cruise',
    'Parking Sensors',
    'Panoramic Roof',
    'Ventilated Seats',
    'Head-Up Display',
    'Night Vision',
    'Massage Seats',
    '360 Camera',
    'Ambient Lighting',
  ];
  const safety = [
    'ABS',
    'Airbags',
    'ESP',
    'TPMS',
    'Forward Collision',
    'Blind Spot Monitor',
    'Rear Cross Traffic',
    'Auto Emergency Braking',
    'Pedestrian Detection',
    'Lane Departure Warning',
  ];
  const count = 4 + (idx % 7);
  const f = all.filter((_, i) => (i + idx) % 3 !== 0).slice(0, count);
  const s = safety.filter((_, i) => (i + idx) % 2 === 0).slice(0, 4);
  return JSON.stringify({ features: f, safety: s });
}

async function main() {
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  const PASSWORD = 'Password123!';
  const pwHash = await hashPassword(PASSWORD);

  console.log('Seeding users...');

  const insertUser = db.prepare(`
    INSERT INTO users (username, firstName, lastName, email, password, role, isActive, isEmailVerified, createdAt, updatedAt)
    VALUES (@username, @firstName, @lastName, @email, @password, @role, 1, 1, @createdAt, @updatedAt)
  `);

  const insertSeller = db.prepare(`
    INSERT INTO sellers (userId, walletBalance, currency, isWalletVerified, totalEarnings, pendingBalance, totalCarsSold, sellerRating, totalReviews, isVerifiedSeller, commissionRate)
    VALUES (@userId, 0, 'RON', 0, 0, 0, 0, 0, 0, 1, 5.0)
  `);

  const insertBuyer = db.prepare(`
    INSERT INTO buyers (userId, walletBalance, currency, isWalletVerified, totalSpent, totalCarsBought, receiveCarAlerts)
    VALUES (@userId, 5000, 'EUR', 0, 0, 0, 1)
  `);

  const insertGuest = db.prepare(`
    INSERT INTO guests (userId, browsingHistory)
    VALUES (@userId, 0)
  `);

  const insertVehicle = db.prepare(`
    INSERT INTO vehicles (
      make, model, year, type, condition, trim,
      price, originalPrice, negotiable,
      mileage, city, country, zipCode,
      engineSize, engineType, horsepower, torque, fuelType, transmission, driveType,
      exteriorColor, interiorColor, doors, seats,
      vin, features, safetyFeatures,
      description, images,
      previousOwners, accidentHistory, serviceHistory, warrantyAvailable,
      status, isActive, isFeatured,
      viewsCount, savesCount, contactsCount,
      sellerId, createdAt, updatedAt
    ) VALUES (
      @make, @model, @year, @type, @condition, @trim,
      @price, @originalPrice, @negotiable,
      @mileage, @city, @country, @zipCode,
      @engineSize, @engineType, @horsepower, @torque, @fuelType, @transmission, @driveType,
      @exteriorColor, @interiorColor, @doors, @seats,
      @vin, @features, @safetyFeatures,
      @description, @images,
      @previousOwners, @accidentHistory, @serviceHistory, @warrantyAvailable,
      @status, 1, @isFeatured,
      @viewsCount, @savesCount, @contactsCount,
      @sellerId, @createdAt, @updatedAt
    )
  `);

  const sellerFirstNames = [
    'Alexandru',
    'Bogdan',
    'Cristian',
    'Daniel',
    'Emil',
    'Florin',
    'George',
    'Horia',
    'Ion',
    'Lucian',
  ];
  const sellerLastNames = [
    'Popescu',
    'Ionescu',
    'Constantin',
    'Gheorghe',
    'Dumitru',
    'Stan',
    'Stoica',
    'Mihai',
    'Popa',
    'Lazar',
  ];
  const buyerFirstNames = [
    'Maria',
    'Elena',
    'Andreea',
    'Ioana',
    'Raluca',
    'Catalin',
    'Stefan',
    'Mihai',
    'Andrei',
    'Vlad',
  ];
  const buyerLastNames = [
    'Barbu',
    'Dinu',
    'Marin',
    'Neagu',
    'Rusu',
    'Toma',
    'Ungureanu',
    'Vasile',
    'Zamfir',
    'Niculescu',
  ];
  const guestFirstNames = [
    'Radu',
    'Sorin',
    'Tudor',
    'Valentin',
    'Gabriel',
    'Razvan',
    'Ovidiu',
    'Marius',
    'Cosmin',
    'Adrian',
  ];
  const guestLastNames = [
    'Avram',
    'Badea',
    'Chivu',
    'Draghici',
    'Florescu',
    'Grigorescu',
    'Hristea',
    'Iliescu',
    'Jinga',
    'Kovacs',
  ];

  const now = new Date().toISOString();
  const sellerIds: number[] = [];

  // Insert 10 sellers
  const insertSeedData = db.transaction(() => {
    for (let i = 0; i < 10; i++) {
      const fn = sellerFirstNames[i];
      const ln = sellerLastNames[i];
      const result = insertUser.run({
        username: `seller_${fn.toLowerCase()}${i + 1}`,
        firstName: fn,
        lastName: ln,
        email: `seed.seller${i + 1}@automarket.test`,
        password: pwHash,
        role: 'seller',
        createdAt: now,
        updatedAt: now,
      });
      const userId = result.lastInsertRowid as number;
      sellerIds.push(userId);
      insertSeller.run({ userId });
    }

    // Insert 10 buyers
    for (let i = 0; i < 10; i++) {
      const fn = buyerFirstNames[i];
      const ln = buyerLastNames[i];
      const result = insertUser.run({
        username: `buyer_${fn.toLowerCase()}${i + 1}`,
        firstName: fn,
        lastName: ln,
        email: `seed.buyer${i + 1}@automarket.test`,
        password: pwHash,
        role: 'buyer',
        createdAt: now,
        updatedAt: now,
      });
      insertBuyer.run({ userId: result.lastInsertRowid });
    }

    // Insert 10 guests
    for (let i = 0; i < 10; i++) {
      const fn = guestFirstNames[i];
      const ln = guestLastNames[i];
      const result = insertUser.run({
        username: `guest_${fn.toLowerCase()}${i + 1}`,
        firstName: fn,
        lastName: ln,
        email: `seed.guest${i + 1}@automarket.test`,
        password: pwHash,
        role: 'guest',
        createdAt: now,
        updatedAt: now,
      });
      insertGuest.run({ userId: result.lastInsertRowid });
    }

    // Insert 20 vehicles per seller
    for (let s = 0; s < 10; s++) {
      const sellerId = sellerIds[s];
      const { make, models } = MAKES[s];

      for (let c = 0; c < 20; c++) {
        const globalIdx = s * 20 + c;
        const model = models[c];
        const year = 2018 + (c % 7);
        const condition = pick(CONDITIONS, c);
        const fuel = fuelTypeForMake(make, c);
        const { engineSize, engineType, horsepower, torque } = engineForFuel(
          fuel,
          globalIdx,
        );
        const transmission =
          fuel === 'electric' ? 'automatic' : pick(TRANSMISSIONS, c + s);
        const driveType = pick(DRIVE_TYPES, c + s + 2);
        const color = pick(COLORS, c + s);
        const interiorColors = [
          'Black',
          'Beige',
          'Gray',
          'Brown',
          'Red',
          'White',
        ];
        const city = pick(CITIES, c + s);
        const vtype = vehicleType(make, model);
        const basePrice = 8000 + s * 3500 + c * 1200 + (horsepower || 0) * 15;
        const price = Math.round(basePrice / 100) * 100;
        const origPrice =
          condition === 'new'
            ? null
            : Math.round((price * (1.1 + (c % 5) * 0.05)) / 100) * 100;
        const mileage = condition === 'new' ? 0 : 5000 + c * 4500 + s * 2000;
        const feats = featureList(globalIdx);
        const featsObj = JSON.parse(feats);
        const doors = ['motorcycle'].includes(vtype)
          ? 0
          : vtype === 'sports_car'
            ? 2
            : 4;
        const seats =
          vtype === 'van'
            ? 7
            : vtype === 'truck'
              ? 5
              : vtype === 'sports_car'
                ? 2
                : 5;

        insertVehicle.run({
          make,
          model,
          year,
          type: vtype,
          condition,
          trim:
            c % 3 === 0
              ? `${model} Sport`
              : c % 3 === 1
                ? `${model} Premium`
                : null,
          price,
          originalPrice: origPrice,
          negotiable: c % 4 === 0 ? 1 : 0,
          mileage,
          city,
          country: 'Romania',
          zipCode: `${400000 + (s * 1000 + c * 100)}`,
          engineSize,
          engineType,
          horsepower,
          torque,
          fuelType: fuel,
          transmission,
          driveType,
          exteriorColor: color,
          interiorColor: pick(interiorColors, c + s + 1),
          doors,
          seats,
          vin: generateVin(s, c),
          features: featsObj.features.join(','),
          safetyFeatures: featsObj.safety.join(','),
          description: `${year} ${make} ${model} in excellent condition. ${condition === 'new' ? 'Brand new vehicle, never driven.' : `${mileage.toLocaleString()} km on the clock.`} Equipped with ${featsObj.features.slice(0, 3).join(', ')} and more. Located in ${city}, Romania.`,
          images:
            'https://via.placeholder.com/800x600.png?text=' +
            encodeURIComponent(`${make}+${model}`),
          previousOwners: condition === 'new' ? 0 : 1 + (c % 3),
          accidentHistory: c % 8 === 0 ? 1 : 0,
          serviceHistory:
            condition === 'certified_pre_owned'
              ? 'Full dealer service history available.'
              : null,
          warrantyAvailable: condition === 'new' ? 1 : c % 5 === 0 ? 1 : 0,
          status: 'available',
          isFeatured: c % 10 === 0 ? 1 : 0,
          viewsCount: Math.floor(globalIdx * 7 + 10),
          savesCount: Math.floor(globalIdx * 2),
          contactsCount: Math.floor(globalIdx * 0.5),
          sellerId,
          createdAt: now,
          updatedAt: now,
        });
      }
    }
  });

  try {
    insertSeedData();
    console.log('✓ Inserted 10 sellers');
    console.log('✓ Inserted 10 buyers');
    console.log('✓ Inserted 10 guests');
    console.log('✓ Inserted 200 vehicles (20 per seller)');
    console.log(`\nAll users have password: ${PASSWORD}`);
    console.log('Email pattern:');
    console.log(
      '  seed.seller1@automarket.test ... seed.seller10@automarket.test',
    );
    console.log(
      '  seed.buyer1@automarket.test  ... seed.buyer10@automarket.test',
    );
    console.log(
      '  seed.guest1@automarket.test  ... seed.guest10@automarket.test',
    );
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  } finally {
    db.close();
  }
}

main();
