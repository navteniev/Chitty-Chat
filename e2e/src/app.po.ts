import { browser, by, element } from 'protractor';

export class AppPage {
  /**
   * navigates to browser url for protractor
   * @returns promise
   */
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }
  /**
   * gets title text from element 'app-root h1'
   * @returns promise
   */
  getTitleText() {
    return element(by.css('app-root h1')).getText() as Promise<string>;
  }
}
