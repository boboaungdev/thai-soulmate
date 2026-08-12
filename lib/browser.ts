import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export async function launchBrowser() {
  return puppeteer.launch({
    args: await puppeteer.defaultArgs({
      args: chromium.args,
      headless: "shell",
    }),
    executablePath: await chromium.executablePath(),
    headless: "shell",
  });
}