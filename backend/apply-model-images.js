'use strict';
/**
 * Per-model image assignment for vehicles.
 *
 * - Curates Unsplash photo IDs per (make, model)
 * - HEAD-checks each URL, keeps only working ones
 * - Updates the `images` column on every vehicle whose model has a curated pool
 * - Vehicles not in the curated pool keep their existing per-make images
 */
const Database = require('better-sqlite3');
const https = require('https');
const { URL } = require('url');

const Q = '?auto=format&fit=crop&w=1200&q=80';
const u = (id) => `https://images.unsplash.com/photo-${id}${Q}`;

// Curated photo IDs gathered from unsplash.com/s/photos/<model>.
// Each model maps to up to 4 candidate IDs — HEAD check below keeps the good ones.
const RAW = {
  Audi: {
    Q3: ['1621349337628-d4f1c1a24114', '1655283176367-ee22be6cbcd4', '1655283188541-3336892f6bcc', '1592032857148-5658283bb67b'],
    Q5: ['1599912027806-cfec9f5944b6', '1710011115876-301113e1bb61', '1622701579527-dcd1bb5fbb9b'],
    Q7: ['1532974143451-8162d38a1257', '1622701579527-dcd1bb5fbb9b', '1590509278793-032529995158', '1632823468851-115e63d81694'],
    A3: ['1717711081688-985a7a3e6a9f', '1659031981099-00ecc60adf30', '1604969653994-c7406a23af58', '1656335889409-808b4119393f'],
    A4: ['1540066019607-e5f69323a8dc', '1597007030739-6d2e7172ee5b', '1726003536800-b9ec0888cf36'],
    A6: ['1540066019607-e5f69323a8dc', '1503507420689-7b961cc77da5', '1678047047743-77cc1d6ffaf5', '1657779912012-a5e59905ffdc'],
    RS6: ['1603584173870-7f23fdae1b7a', '1615715070496-d85daab3618d', '1608341089966-92c09e62214f', '1606152421802-db97b9c7a11b'],
  },
  BMW: {
    M3: ['1614026480209-cd9934144671', '1607853554439-0069ec0f29b6', '1617531653332-bd46c24f2068', '1724391114112-c83ad59f1d5f'],
    M5: ['1603189617530-6d32306f57c5', '1607853554439-0069ec0f29b6', '1724391114112-c83ad59f1d5f', '1699084165429-9cfac6c17032'],
    X3: ['1635089917414-6da790da8479', '1696294586764-6baffd088b71', '1653227158553-ddaa680cdd65', '1674996047492-6b5cdc2dcf0a'],
    X5: ['1635089917414-6da790da8479', '1696294586764-6baffd088b71'],
    X7: ['1701985470695-e430a8fdc8d6', '1731988666894-482242ceae2f', '1731988666860-b4b5e312ed82', '1731988666805-9a9992d7b946'],
    '3 Series': ['1693840248139-8e96774158a2', '1652890041546-2de2829c43b5', '1652890021312-19b10788919a', '1652890058094-a3fe8ead30fa'],
    '5 Series': ['1693840248139-8e96774158a2', '1652890041546-2de2829c43b5'],
  },
  'Mercedes-Benz': {
    'C-Class': ['1624085568108-36410cfe4d24', '1625690096555-a0a4d190901c', '1671332752309-259609d9801f', '1625690180114-5530b1304127'],
    'E-Class': ['1609703048009-d3576872b32c', '1652453822986-04f70788b118', '1602613893218-d059f21f4c02', '1662364518459-e79c3ad6935f'],
    'S-Class': ['1610099610040-ab19f3a5ec35', '1696294698346-a792de6be3bd', '1619221496652-7ee3d7406203', '1629019879059-2a0345f93aea'],
    GLE: ['1611168935847-4bf3f7291cde', '1669234226129-8ede05b40eff', '1577615792595-d38014354328', '1669221817458-63a3da4ddecb'],
    GLC: ['1619466548431-54ffb2fe2674', '1616874946938-69c1374f3e60', '1684239725236-5f3b6e9f02c3', '1684239845179-0bb0362dfd28'],
  },
  Porsche: {
    '911': ['1740940339304-651f421985b5', '1634673970798-a15ae56f6c65', '1729731322066-183911deb95b', '1580274455191-1c62238fa333'],
    Cayenne: ['1701806244887-391677f29718', '1699325974549-fd06639650aa', '1699325929994-b94ae0c8f552', '1654159866298-e3c8ee93e43b'],
    Macan: ['1627657252405-72ab8f850765', '1633348570573-2c70fe9129de', '1661914132349-095cd34f37aa', '1660209514955-032388bc33f7'],
    Taycan: ['1615125468484-088e3dfcabb6', '1503376780353-7e6692767b70', '1618213221550-c32da08997db', '1642911041553-297e5295276b'],
  },
  Tesla: {
    'Model 3': ['1560958089-b8a1929cea89', '1585011664466-b7bbe92f34ef', '1606016159991-dfe4f2746ad5', '1700411881984-971bc29083bd'],
    'Model Y': ['1676754568744-7852efc67c40', '1560958089-b8a1929cea89', '1561580125-028ee3bd62eb', '1617788138017-80ad40651399'],
    'Model S': ['1620891549027-942fdc95d3f5', '1560958089-b8a1929cea89', '1676856577533-1e8099932f7b', '1676945009341-4bb62b036653'],
  },
  Volvo: {
    XC60: ['1644189579276-23ef0268f169', '1629897048514-3dd7414fe72a', '1596704135285-689f255de50b', '1629897045592-3629125e0353'],
    XC90: ['1557323137-bd6bd20fe022', '1628569072305-b01a724d06e7', '1629897048514-3dd7414fe72a', '1642336011721-9dd962c38fb4'],
  },
  Volkswagen: {
    Golf: ['1572811298797-9eecadf6cb24', '1618767747322-64e376fd4826', '1571388429034-9ce53dbf0047', '1603615000279-f700d0d11824'],
    Tiguan: ['1655286182008-2a6578c7f487', '1655286536348-c6391c7ec45f', '1655286203099-916c6f36da48', '1655286167308-55817227e6c8'],
  },
  Ford: {
    Mustang: ['1625231334168-35067f8853ed', '1603553329474-99f95f35394f', '1547744152-14d985cb937f', '1591293835940-934a7c4f2d9b'],
  },
  Honda: {
    Civic: ['1570303278489-041bd897a873', '1594070319944-7c0cbebb6f58', '1636915860623-57b9b74133e6', '1623591457247-9dff667eae42'],
    'CR-V': ['1681697390363-1142eb46b76d', '1623597780975-38ccd5030c83', '1645099383164-319a0925f8bc', '1561823450-db08b67c8440'],
  },
  Toyota: {
    Camry: ['1621007947382-bb3c3994e3fb', '1581862142388-23e1c52ca091', '1657872737697-737a2d123ef2', '1624578571415-09e9b1991929'],
    RAV4: ['1617469767053-d3b523a0b982', '1622210642960-0f6a2cdbdc9f', '1706509234538-9831b1b33d66', '1654168441839-410635603c3d'],
    Corolla: ['1638618164682-12b986ec2a75', '1623869675781-80aa31012a5a', '1626072557464-90403d788e8d', '1619682817481-e994891cd1f5'],
  },
};

function check(url) {
  return new Promise((resolve) => {
    try {
      const p = new URL(url);
      const req = https.request(
        { method: 'HEAD', hostname: p.hostname, path: p.pathname + p.search, headers: { 'User-Agent': 'image-check/1.0' }, timeout: 6000 },
        (res) => { resolve({ url, ok: res.statusCode === 200 }); res.resume(); },
      );
      req.on('error', () => resolve({ url, ok: false }));
      req.on('timeout', () => { req.destroy(); resolve({ url, ok: false }); });
      req.end();
    } catch { resolve({ url, ok: false }); }
  });
}

(async () => {
  // 1. Verify every curated URL
  console.log('Verifying URLs...');
  const verified = {}; // make → model → [URLs]
  let totalIds = 0;
  for (const [make, models] of Object.entries(RAW)) totalIds += Object.values(models).flat().length;
  let done = 0;

  for (const [make, models] of Object.entries(RAW)) {
    verified[make] = {};
    for (const [model, ids] of Object.entries(models)) {
      const urls = ids.map(u);
      const results = await Promise.all(urls.map(check));
      const good = results.filter((r) => r.ok).map((r) => r.url);
      verified[make][model] = good;
      done += urls.length;
      process.stdout.write(`  ${done}/${totalIds}\r`);
    }
  }
  console.log('\n');

  // 2. Report
  let modelsWithImages = 0;
  let modelsEmpty = 0;
  for (const [make, models] of Object.entries(verified)) {
    for (const [model, urls] of Object.entries(models)) {
      if (urls.length === 0) {
        modelsEmpty++;
        console.log(`  ✗ ${make} ${model}: 0 working URLs (will keep make-level)`);
      } else {
        modelsWithImages++;
      }
    }
  }
  console.log(`\n${modelsWithImages} models with model-specific images, ${modelsEmpty} fell back to make-level\n`);

  // 3. Apply to DB
  const db = new Database('/app/database.sqlite');
  db.pragma('journal_mode = WAL');
  const update = db.prepare('UPDATE vehicles SET images = ? WHERE id = ?');
  const vehicles = db.prepare('SELECT id, make, model FROM vehicles').all();

  // Each vehicle gets a SINGLE image — different cars in a gallery would mislead
  // (a green Q3 next to a black Q3 looks like the same listing has two cars).
  // For uncurated models we also collapse to a single image taken from the
  // existing images column so non-curated vehicles still show something coherent.
  let updatedCurated = 0;
  let collapsedExisting = 0;
  let untouched = 0;

  const tx = db.transaction(() => {
    for (const v of vehicles) {
      const pool = verified[v.make]?.[v.model];
      if (pool && pool.length > 0) {
        const pick = pool[v.id % pool.length];
        update.run(pick, v.id);
        updatedCurated++;
        continue;
      }
      // Non-curated model — keep only the first existing image
      const current = db.prepare('SELECT images FROM vehicles WHERE id = ?').get(v.id);
      const list = (current.images || '').split(',').map((s) => s.trim()).filter(Boolean);
      if (list.length > 1) {
        update.run(list[0], v.id);
        collapsedExisting++;
      } else {
        untouched++;
      }
    }
  });
  tx();
  db.pragma('wal_checkpoint(TRUNCATE)');

  console.log(`Curated model-specific (1 image):       ${updatedCurated}`);
  console.log(`Collapsed multi-image to single:        ${collapsedExisting}`);
  console.log(`Already single image, untouched:        ${untouched}`);
  db.close();
})();
