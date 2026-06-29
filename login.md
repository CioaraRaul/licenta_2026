# Test Accounts

All seeded accounts share the same password: **`Password123!`**

---

## Buyer

| Name                          | Email                          | Password             |
| ----------------------------- | ------------------------------ | -------------------- |
| testbuyer (main demo account) | `testbuyer@test.com`           | your signup password |
| Maria Barbu                   | `seed.buyer1@automarket.test`  | `   `                |
| Elena Dinu                    | `seed.buyer2@automarket.test`  | `Password123!`       |
| Andreea Marin                 | `seed.buyer3@automarket.test`  | `Password123!`       |
| Ioana Neagu                   | `seed.buyer4@automarket.test`  | `Password123!`       |
| Raluca Rusu                   | `seed.buyer5@automarket.test`  | `Password123!`       |
| Catalin Toma                  | `seed.buyer6@automarket.test`  | `Password123!`       |
| Stefan Ungureanu              | `seed.buyer7@automarket.test`  | `Password123!`       |
| Mihai Vasile                  | `seed.buyer8@automarket.test`  | `Password123!`       |
| Andrei Zamfir                 | `seed.buyer9@automarket.test`  | `Password123!`       |
| Vlad Niculescu                | `seed.buyer10@automarket.test` | `Password123!`       |

---

## Seller

| Name                | Email                           | Password       |
| ------------------- | ------------------------------- | -------------- |
| Alexandru Popescu   | `seed.seller1@automarket.test`  | `Password123!` |
| Bogdan Ionescu      | `seed.seller2@automarket.test`  | `Password123!` |
| Cristian Constantin | `seed.seller3@automarket.test`  | `Password123!` |
| Daniel Gheorghe     | `seed.seller4@automarket.test`  | `Password123!` |
| Emil Dumitru        | `seed.seller5@automarket.test`  | `Password123!` |
| Florin Stan         | `seed.seller6@automarket.test`  | `Password123!` |
| George Stoica       | `seed.seller7@automarket.test`  | `Password123!` |
| Horia Mihai         | `seed.seller8@automarket.test`  | `Password123!` |
| Ion Popa            | `seed.seller9@automarket.test`  | `Password123!` |
| Lucian Lazar        | `seed.seller10@automarket.test` | `Password123!` |

---

## Guest

| Name              | Email                          | Password       |
| ----------------- | ------------------------------ | -------------- |
| Radu Avram        | `seed.guest1@automarket.test`  | `Password123!` |
| Sorin Badea       | `seed.guest2@automarket.test`  | `Password123!` |
| Tudor Chivu       | `seed.guest3@automarket.test`  | `Password123!` |
| Valentin Draghici | `seed.guest4@automarket.test`  | `Password123!` |
| Gabriel Florescu  | `seed.guest5@automarket.test`  | `Password123!` |
| Razvan Grigorescu | `seed.guest6@automarket.test`  | `Password123!` |
| Ovidiu Hristea    | `seed.guest7@automarket.test`  | `Password123!` |
| Marius Iliescu    | `seed.guest8@automarket.test`  | `Password123!` |
| Cosmin Jinga      | `seed.guest9@automarket.test`  | `Password123!` |
| Adrian Kovacs     | `seed.guest10@automarket.test` | `Password123!` |

---

## Admin

| Name  | Email                 | Password     |
| ----- | --------------------- | ------------ |
| admin | `admin@autovault.com` | `Admin@1234` |

---

## Notes

- Run `seed.ts` to populate the database with all seeded accounts and 200 vehicle listings (20 per seller).
- Run `seed-app-data.js` after seeding to add wallet, bids, saved vehicles, and messages for the `testbuyer` account.
- The `testbuyer@test.com` account must be created manually via the register page before running `seed-app-data.js`.
