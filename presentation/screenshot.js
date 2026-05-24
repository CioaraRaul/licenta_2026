const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const API = 'http://localhost:3000';
const FE = 'http://localhost:5173';
const OUT = path.join(__dirname, 'screenshots');

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

async function loginApi(email, password) {
  const res = await fetch(`${API}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(`Login failed: ${res.status}`);
  return res.json();
}

async function setAuthInPage(page, data) {
  const state = {
    state: {
      user: data.user,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      isAuthenticated: true,
    },
    version: 0,
  };
  await page.addInitScript((s) => {
    localStorage.setItem('auth-storage', s);
  }, JSON.stringify(state));
}

async function setCompareIds(page, ids) {
  const state = { state: { vehicleIds: ids }, version: 0 };
  await page.addInitScript((s) => {
    localStorage.setItem('compare-storage', s);
  }, JSON.stringify(state));
}

async function fetchJson(url, token) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

async function shoot(page, url, file, opts = {}) {
  console.log(`-> ${file}  (${url})`);
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  } catch (e) {
    console.log(`   timeout, continuing: ${e.message.slice(0, 80)}`);
  }
  await page.waitForTimeout(opts.wait || 1200);
  await page.screenshot({ path: path.join(OUT, file), fullPage: opts.fullPage !== false });
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  // ---- Logged-out auth pages ----
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await shoot(page, `${FE}/auth/login`, '01-login.png');
    await shoot(page, `${FE}/auth/register`, '02-register.png');
    await shoot(page, `${FE}/auth/forgot-password`, '03-forgot-password.png');
    await shoot(page, `${FE}/auth/privacy-policy`, '04-privacy.png');
    await shoot(page, `${FE}/auth/terms`, '05-terms.png');
    await ctx.close();
  }

  // ---- Buyer-logged-in ----
  {
    console.log('Logging in as buyer...');
    const buyer = await loginApi('seed.buyer1@automarket.test', 'Password123!');
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await setAuthInPage(page, buyer);

    await shoot(page, `${FE}/dashboard`, '10-buyer-dashboard.png', { wait: 2000 });
    await shoot(page, `${FE}/find-vehicle`, '11-find-vehicle.png', { wait: 2500 });

    // Pick first vehicle from listing
    try {
      const firstHref = await page.locator('a[href^="/find-vehicle/"]').first().getAttribute('href');
      if (firstHref) {
        await shoot(page, `${FE}${firstHref}`, '12-vehicle-detail.png', { wait: 2500 });
      }
    } catch (e) {
      console.log('   could not pick first vehicle:', e.message);
    }

    await shoot(page, `${FE}/saved`, '13-saved.png', { wait: 1800 });
    await ctx.close();
  }

  // ---- Buyer with compare list populated ----
  {
    const buyer = await loginApi('seed.buyer1@automarket.test', 'Password123!');
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await setAuthInPage(page, buyer);
    // Populate compare with 3 vehicle IDs that exist in seed
    await setCompareIds(page, [11, 31, 51]);
    await shoot(page, `${FE}/compare`, '14-compare.png', { wait: 2500 });
    await ctx.close();
  }

  // ---- Continue buyer screenshots + message thread ----
  {
    const buyer = await loginApi('seed.buyer1@automarket.test', 'Password123!');
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await setAuthInPage(page, buyer);

    await shoot(page, `${FE}/bids`, '15-bids.png', { wait: 1800 });
    await shoot(page, `${FE}/messages`, '16-messages.png', { wait: 1800 });

    // Fetch the first conversation to get the seller ID
    try {
      const convs = await fetchJson(`${API}/messages`, buyer.accessToken);
      const list = Array.isArray(convs) ? convs : (convs.data || []);
      if (list.length > 0) {
        const c = list[0];
        // Determine the other user's id (we are buyer)
        const otherId = c.sellerId || c.seller?.id || c.otherUserId;
        if (otherId) {
          await shoot(page, `${FE}/messages/${otherId}`, '16b-messages-thread.png', { wait: 2500 });
        }
      }
    } catch (e) {
      console.log('   could not fetch conv thread:', e.message);
    }

    await shoot(page, `${FE}/wallet`, '17-wallet.png', { wait: 1800 });
    await shoot(page, `${FE}/settings`, '18-settings.png', { wait: 1800 });
    await shoot(page, `${FE}/help-support`, '19-help-support.png', { wait: 1500 });

    await ctx.close();
  }

  // ---- Seller-logged-in ----
  {
    console.log('Logging in as seller...');
    const seller = await loginApi('seed.seller1@automarket.test', 'Password123!');
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await setAuthInPage(page, seller);

    await shoot(page, `${FE}/dashboard`, '20-seller-dashboard.png', { wait: 2000 });
    await shoot(page, `${FE}/my-listings`, '21-my-listings.png', { wait: 2000 });
    await shoot(page, `${FE}/my-listings/new`, '22-new-listing.png', { wait: 1500 });
    await shoot(page, `${FE}/wallet`, '23-seller-wallet.png', { wait: 1500 });
    await shoot(page, `${FE}/messages`, '24-seller-messages.png', { wait: 1500 });

    await ctx.close();
  }

  await browser.close();
  console.log('Done.');
})().catch((e) => {
  console.error('ERROR:', e);
  process.exit(1);
});
