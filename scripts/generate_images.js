const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const outputDir = '/home/z/my-project/public/assets/characters';

// Ensure output directories exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const characters = {
  viktor: {
    description: "Viktor, a middle-aged maintenance worker with short graying hair and work uniform",
    states: {
      ui_idle: "Neutral expression, jaw slightly tense. Portrait, studio photography style, moody psychological thriller atmosphere, close-up face shot, dark background",
      ui_calm: "Relaxed expression, slight smile. Portrait, studio photography style, moody psychological thriller atmosphere, close-up face shot, dark background",
      ui_suspicious: "Narrowed eyes, tense jaw, expression of mistrust. Portrait, studio photography style, moody psychological thriller atmosphere, close-up face shot, dark background",
      ui_stressed: "Tense expression, jaw clenched, forehead furrowed. Portrait, studio photography style, moody psychological thriller atmosphere, close-up face shot, dark background",
      ui_afraid: "Frightened expression, wide eyes, pale skin. Portrait, studio photography style, moody psychological thriller atmosphere, close-up face shot, dark background",
      ui_panicked: "Panicked expression, mouth open, wild eyes. Portrait, studio photography style, moody psychological thriller atmosphere, close-up face shot, dark background with glitch effects",
      ui_angry: "Angry expression, bared teeth, intense glare. Portrait, studio photography style, moody psychological thriller atmosphere, close-up face shot, dark background",
      ui_half_aware: "Distant expression, unfocused eyes, dreamlike state. Portrait, studio photography style, moody psychological thriller atmosphere, close-up face shot, dark background with ethereal glow",
      ui_collapse: "Exhausted expression, eyes half-closed. Portrait, studio photography style, moody psychological thriller atmosphere, close-up face shot, dark background with minimal lighting",
      ui_broken: "Fragmented expression, twitching features. Portrait, studio photography style, moody psychological thriller atmosphere, close-up face shot, dark background with glitch artifacts",
      ui_glitch: "Corrupted appearance, face partially dissolved. Portrait, studio photography style, moody psychological thriller atmosphere, close-up face shot, dark background with heavy glitch effects"
    }
  },
  livia: {
    description: "Livia, an analyst with dark hair in professional bun, glasses",
    states: {
      ui_idle: "Neutral analytical expression behind glasses. Portrait, studio photography style, moody psychological thriller atmosphere, close-up face shot, dark background",
      ui_calm: "Relaxed analytical expression, slight knowing smile. Portrait, studio photography style, moody psychological thriller atmosphere, close-up face shot, dark background",
      ui_suspicious: "Narrowed eyes behind glasses, tight lips. Portrait, studio photography style, moody psychological thriller atmosphere, close-up face shot, dark background",
      ui_stressed: "Tense expression, jaw tight, fingers at temple. Portrait, studio photography style, moody psychological thriller atmosphere, close-up face shot, dark background",
      ui_afraid: "Frightened expression, wide eyes behind glasses, pale face. Portrait, studio photography style, moody psychological thriller atmosphere, close-up face shot, dark background",
      ui_panicked: "Panicked expression, glasses askew, mouth open. Portrait, studio photography style, moody psychological thriller atmosphere, close-up face shot, dark background with glitch effects",
      ui_angry: "Cold anger expression, sharp eyes, tight jaw. Portrait, studio photography style, moody psychological thriller atmosphere, close-up face shot, dark background",
      ui_half_aware: "Distant expression, unfocused eyes behind glasses. Portrait, studio photography style, moody psychological thriller atmosphere, close-up face shot, dark background with ethereal glow",
      ui_collapse: "Collapsed expression, eyes closed, face drawn. Portrait, studio photography style, moody psychological thriller atmosphere, close-up face shot, dark background with minimal lighting",
      ui_broken: "Fragmented expression, twitching features. Portrait, studio photography style, moody psychological thriller atmosphere, close-up face shot, dark background with glitch artifacts",
      ui_glitch: "Corrupted appearance, face partially dissolved. Portrait, studio photography style, moody psychological thriller atmosphere, close-up face shot, dark background with heavy glitch effects"
    }
  },
  mara: {
    description: "Mara, a perceptive woman with wild curly hair and eclectic clothing",
    states: {
      ui_idle: "Distant expression, eyes slightly unfocused. Portrait, studio photography style, moody psychological thriller atmosphere, close-up face shot, dark background",
      ui_calm: "Peaceful expression, gentle smile. Portrait, studio photography style, moody psychological thriller atmosphere, close-up face shot, dark background",
      ui_suspicious: "Sharp expression, narrowed eyes. Portrait, studio photography style, moody psychological thriller atmosphere, close-up face shot, dark background",
      ui_stressed: "Tense expression, jaw tight, eyes darting. Portrait, studio photography style, moody psychological thriller atmosphere, close-up face shot, dark background",
      ui_afraid: "Frightened expression, wide eyes, pale face. Portrait, studio photography style, moody psychological thriller atmosphere, close-up face shot, dark background",
      ui_panicked: "Panicked expression, mouth open, tears. Portrait, studio photography style, moody psychological thriller atmosphere, close-up face shot, dark background with glitch effects",
      ui_angry: "Furious expression, wild eyes, bared teeth. Portrait, studio photography style, moody psychological thriller atmosphere, close-up face shot, dark background",
      ui_half_aware: "Transcendent expression, eyes seeing beyond. Portrait, studio photography style, moody psychological thriller atmosphere, close-up face shot, dark background with ethereal glow",
      ui_collapse: "Broken expression, face slack. Portrait, studio photography style, moody psychological thriller atmosphere, close-up face shot, dark background with minimal lighting",
      ui_broken: "Fragmented expression, features twitching. Portrait, studio photography style, moody psychological thriller atmosphere, close-up face shot, dark background with glitch artifacts",
      ui_glitch: "Corrupted appearance, face dissolving. Portrait, studio photography style, moody psychological thriller atmosphere, close-up face shot, dark background with heavy glitch effects"
    }
  }
};

console.log('=== ELEVATOR.EXE - IMAGE GENERATION ===\n');

let totalGenerated = 0;
let totalErrors = 0;

for (const [charName, charData] of Object.entries(characters)) {
  const charDir = path.join(outputDir, charName);
  if (!fs.existsSync(charDir)) {
    fs.mkdirSync(charDir, { recursive: true });
  }

  console.log(`\nGenerating images for ${charName.toUpperCase()}...`);
  console.log(`Character: ${charData.description}`);

  for (const [stateName, statePrompt] of Object.entries(charData.states)) {
    const outputPath = path.join(charDir, `${stateName}.png`);
    
    const fullPrompt = `${statePrompt}, transparent background, PNG format, head and shoulders portrait, moody lighting, psychological horror atmosphere`;
    
    console.log(`  Generating: ${stateName}...`);
    
    try {
      execSync(`z-ai-generate -p "${fullPrompt}" -o "${outputPath}" -s 1024x1024`, {
        stdio: 'pipe',
        encoding: 'utf-8',
        timeout: 120000
      });
      
      if (fs.existsSync(outputPath)) {
        const stats = fs.statSync(outputPath);
        if (stats.size > 1000) {
          totalGenerated++;
          console.log(`    ✓ Generated successfully (${stats.size} bytes)`);
        } else {
          totalErrors++;
          console.log(`    ✗ Error: File too small (${stats.size} bytes)`);
          fs.unlinkSync(outputPath);
        }
      } else {
        totalErrors++;
        console.log(`    ✗ Error: File not created`);
      }
    } catch (error) {
      totalErrors++;
      console.log(`    ✗ Error: ${error.message}`);
    }
  }
}

console.log('\n=== GENERATION COMPLETE ===');
console.log(`Total generated: ${totalGenerated}/33`);
console.log(`Errors: ${totalErrors}`);
console.log(`Images saved to: ${outputDir}`);
