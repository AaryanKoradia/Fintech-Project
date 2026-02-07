# Asset Placeholders

Create these image files in the `assets` directory to complete the app setup:

## Required Assets

1. **icon.png** (1024x1024)
   - App icon for iOS and Android
   - Should be square with no transparency for Android
   - Use the Sakhi logo with #2596be primary color

2. **splash.png** (2048x2048)
   - Splash screen shown when app loads
   - Background color: #2596be (set in app.json)
   - Center the Sakhi logo

3. **adaptive-icon.png** (1024x1024)
   - Android adaptive icon foreground
   - Should work on circular, rounded square, and square masks
   - Keep important elements in center 66%

4. **favicon.png** (48x48)
   - Web favicon (if running on web)

## Quick Setup

If you don't have assets ready, you can:

1. **Use placeholder images temporarily:**
   - Download any 1024x1024 PNG for icon.png
   - Use the same image for splash.png and adaptive-icon.png
   - Create a 48x48 version for favicon.png

2. **Create proper assets later:**
   - Design your logo in Figma/Photoshop
   - Export at required dimensions
   - Replace placeholder files

## Expo Asset Requirements

- **icon.png**: Must be exactly 1024x1024px, PNG format
- **splash.png**: Recommended 2048x2048px or larger, PNG format
- **adaptive-icon.png**: Must be exactly 1024x1024px, PNG format
- **favicon.png**: Any size (48x48 recommended), PNG or ICO format

## Color Guidelines

Primary Color: #2596be (Sakhi Blue)
- Use this color consistently in your assets
- Splash screen background is set to this color in app.json
- Android adaptive icon background is set to this color

## Notes

- The app will still run without these assets, but will use Expo defaults
- You'll see warnings in the console about missing assets
- Assets can be added later without code changes
- Just drop the files in the `assets/` folder and restart Expo
