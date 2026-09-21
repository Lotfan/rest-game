# Cozy Cafe 🥐

A cozy bakery/cafe game. Bake food, serve customers, unlock recipes, decorate your cafe.
Built with Expo (React Native). Progress saves automatically on the phone.

## Run it on your phone (Expo Go)
1. Install Node.js (LTS) from nodejs.org if you don't have it.
2. In Terminal: `cd` into this folder, then `npm install`, then `npx expo start`
3. Open the Camera app on your iPhone, scan the QR code, tap the link (Expo Go must be up to date).

## Where to change things
- `src/data.js`   recipes, prices, decorations, customers, oven costs (add a line = add content)
- `src/game.js`   the rules (tips, patience, spawning, levels)
- `src/theme.js`  colours
- `app.json`      app name, icon, bundle id (change `com.sana.cozycafe` if Xcode says it's taken)

## Put it on your iPhone for free (needs Mac + Xcode, lasts 7 days)
1. `npx expo prebuild --platform ios`
2. `open ios/*.xcworkspace`
3. In Xcode: click the top blue project icon > Signing & Capabilities > tick "Automatically manage signing" > pick your Personal Team.
4. Plug in the iPhone. Product > Scheme > Edit Scheme > Run > set Build Configuration to Release.
5. Pick your iPhone at the top, press Run (▶).
6. On the phone: Settings > General > VPN & Device Management > trust your Apple ID.

## Play in a browser (free hosting)
`npx expo export --platform web` then drag the `dist` folder onto https://app.netlify.com/drop

## Use your own PNG art (food + customers)
1. Food: put PNGs in `assets/food/`. File name must be the recipe id + .png:
   coffee, croissant, cookie, tea, cupcake, donut, pie, cake, pancakes, boba, bday (e.g. `assets/food/coffee.png`)
2. Customers: put any PNGs in `assets/characters/` (any names, any amount). Each customer picks one at random.
3. In Terminal, in the project folder, run `npm run images`
4. Restart with `npx expo start -c`
Anything without a PNG keeps its emoji. Use square PNGs with a transparent background, about 256x256.
