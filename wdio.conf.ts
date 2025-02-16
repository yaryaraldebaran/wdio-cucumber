import { addAttachment } from '@wdio/allure-reporter';
import utils from './utils/utils';
import Page from './features/pageobjects/page';
import type { Options } from '@wdio/types';
import type { Pickle, HookFunctionExtension } from '@wdio/cucumber-framework';

const page = new Page();

export const config: Options.Testrunner = {
  runner: "local",
  specs: ["./features/**/*.feature"],
  exclude: [],

  maxInstances: 1,

  capabilities: [
    {
      browserName: "firefox",
      'moz:firefoxOptions': {
        prefs: {
          'network.cookie.lifetimePolicy': 2,
          'browser.cache.disk.enable': false,
          'browser.cache.memory.enable': false,
          'privacy.clearOnShutdown.cookies': true,
          'privacy.clearOnShutdown.cache': true,
          'privacy.clearOnShutdown.history': true
        },
        args: ['--no-remote']
      }
    }
  ],

  logLevel: "warn",
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: ["visual"],

  framework: "cucumber",

  reporters: [
    [
      "allure",
      {
        outputDir: "allure-results",
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: true,
        useCucumberStepReporter: true
      }
    ]
  ],

  cucumberOpts: {
    require: [
      "./features/step-definitions/01.menu.steps.ts",
      "./features/step-definitions/02.hotel.steps.ts",
    ],
    backtrace: false,
    requireModule: [],
    dryRun: false,
    failFast: false,
    name: [],
    snippets: true,
    source: true,
    strict: true,
    tagExpression: "",
    timeout: 60000,
    ignoreUndefinedDefinitions: false,
  },

  beforeScenario: async function (world: Pickle) {
    console.log('========= BEFORE SCENARIO START =========');
    console.log(`Running scenario: ${world.name}`);
    console.log('========= BEFORE SCENARIO END =========');
  },

  beforeStep: function (step) {
    console.log(`Start Step: ${step.keyword} ${step.text}`);
  },

  afterStep: function (step, scenario, result) {
    console.log(`After Step: ${step.keyword} ${step.text}`);
  },

  afterScenario: async function (world: Pickle, result: { passed: boolean }) {
    console.log('========= AFTER SCENARIO START =========');

    if (!result.passed) {
      console.log("Scenario failed. Capturing screenshot...");
      await utils.takeScreenshot();
    } else {
      console.log(`SCENARIO -> ${world.name} PASSED`);
    }

    await page.open('logout');
    
    const logoutSuccess = await $("//h4[text()='Logout Successful']");
    await logoutSuccess.waitForDisplayed({ timeout: 5000 });

    await browser.url('https://phptravels.net/');
    await browser.waitUntil(
      async () => (await browser.execute(() => document.readyState)) === 'complete',
      { timeout: 10000, timeoutMsg: 'Page did not load completely' }
    );

    await expect(browser).toHaveUrl('https://phptravels.net/');
    console.log("Logout Success!");
    console.log(`Finished scenario: ${world.name}`);
    console.log('========= AFTER SCENARIO END =========');
  }
};
