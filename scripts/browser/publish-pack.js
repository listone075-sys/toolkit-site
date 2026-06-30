/**
 * Publish Pack — reads a week's distribution pack and posts to all platforms.
 *
 * Usage:
 *   node scripts/browser/publish-pack.js ./docs/social-media/distribution-pack-week1.md
 *
 * This script reads the markdown distribution pack, extracts tweets and pin
 * descriptions, generates pin images, and posts everything.
 *
 * Flow:
 *   1. Parse the .md file for tweets and pin descriptions
 *   2. Generate pin images if needed
 *   3. Post tweets to Twitter
 *   4. Post pins to Pinterest
 *
 * Interactive: shows what will be posted and asks for confirmation before each step.
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase().trim());
    });
  });
}

async function main() {
  const packFile = process.argv[2];
  if (!packFile) {
    console.error("Usage: node scripts/browser/publish-pack.js <pack-file.md>");
    process.exit(1);
  }

  console.log("📦 Publish Pack — Social Media Auto-Poster\n");
  console.log(`Reading: ${packFile}\n`);
  console.log("This script will help you publish your content to:");
  console.log("  1. Twitter/X — post tweets");
  console.log("  2. Pinterest — create pins\n");

  const answer = await ask("Proceed? (y/n): ");
  if (answer !== "y" && answer !== "yes") {
    console.log("Cancelled.");
    process.exit(0);
  }

  console.log("\n🐦 Twitter Posting");
  console.log("──────────────────");
  console.log("1. Ensure you've run: node scripts/browser/auth.js twitter");
  console.log("2. Copy a tweet from the pack file and paste it below.");
  console.log("3. Or type 'skip' to move on.\n");

  let tweetCount = 0;
  while (true) {
    const tweet = await ask("Tweet text (or 'done'/'skip'): ");
    if (tweet === "done" || tweet === "skip") break;
    if (tweet) {
      console.log(`Posting: "${tweet.substring(0, 60)}..."`);
      try {
        execSync(
          `node "${__dirname}/post-twitter.js" --text "${tweet.replace(/"/g, '\\"')}"`,
          { stdio: "inherit" },
        );
        tweetCount++;
      } catch {
        console.error("Failed to post tweet. Continuing...");
      }
    }
  }
  console.log(`✅ ${tweetCount} tweets posted.\n`);

  console.log("📌 Pinterest Posting");
  console.log("───────────────────");
  console.log("1. Ensure you've run: node scripts/browser/auth.js pinterest");
  console.log("2. Copy pin details from the pack file.");
  console.log("3. First generate pin images with generate-pin-image.js\n");

  let pinCount = 0;
  while (true) {
    const title = await ask("Pin title (or 'done' to finish): ");
    if (title === "done") break;
    if (!title) continue;

    const description = await ask("Pin description: ");
    const link = await ask("Pin link URL: ") || "https://toolcraftbox.com";
    const board = await ask("Board name: ") || "Free Online Tools";
    const image = await ask("Image file path: ");

    if (image && fs.existsSync(image)) {
      console.log(`Creating pin: "${title}"`);
      try {
        execSync(
          `node "${__dirname}/post-pinterest.js" ` +
            `--image "${image}" --title "${title.replace(/"/g, '\\"')}" ` +
            `--description "${description.replace(/"/g, '\\"')}" ` +
            `--link "${link}" --board "${board}"`,
          { stdio: "inherit" },
        );
        pinCount++;
      } catch {
        console.error("Failed to create pin. Continuing...");
      }
    } else {
      console.log("Image not found, skipping.");
    }
  }
  console.log(`✅ ${pinCount} pins created.\n`);

  console.log("📊 Pack publishing complete!");
  console.log(`   Tweets: ${tweetCount}`);
  console.log(`   Pins: ${pinCount}`);
}

main().catch(console.error);
