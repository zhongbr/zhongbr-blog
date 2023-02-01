import { i as initMainThreadService, s as setSandboxPlugins, e as getPlugins, o as onIframeLoadingModule, a as iframeStyles, d as DefaultHtml, b as DefaultIndexCode, D as DefaultDemoCode, c as DefaultCssCode, g as getSandboxRefresher, f as getIframeHTML } from "./index-a8293c0c.js";
import { _, r } from "./index-a8293c0c.js";
import "./core/event/index.js";
import "./core/proxy/index.js";
import "./types-9fd137f3.js";
initMainThreadService();
class CodeSandbox extends HTMLElement {
  constructor() {
    super();
    this.initIframe();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.append(this.styleElement, this.iframe);
    setSandboxPlugins(this.iframe, getPlugins());
  }
  initIframe() {
    const [srcDoc] = getIframeHTML();
    this.iframe = document.createElement("iframe");
    this.iframe.srcdoc = srcDoc;
    this.iframe.setAttribute("sandbox", "allow-scripts");
    this.iframe.setAttribute("class", `code-sandbox-iframe ${this.getAttribute("class") || ""}`);
    this.iframe.setAttribute("style", this.getAttribute("style"));
    onIframeLoadingModule(this.iframe, (moduleName, extraInfo) => {
      this.dispatchEvent(new CustomEvent("loading-module", {
        detail: {
          moduleName,
          url: extraInfo
        }
      }));
    });
    this.styleElement = document.createElement("style");
    this.styleElement.innerText = iframeStyles;
  }
  static get observedAttributes() {
    return ["code", "css", "index", "html", "class", "style"];
  }
  async attributeChangedCallback(name, oldValue, newValue) {
    const html = this.getAttribute("html") || DefaultHtml;
    const index = this.getAttribute("index") || DefaultIndexCode;
    const code = this.getAttribute("code") || DefaultDemoCode;
    const css = this.getAttribute("css") || DefaultCssCode;
    const { refreshHtml, refreshApp, refreshIndex, refreshStyle } = getSandboxRefresher({
      iframe: this.iframe,
      html,
      index,
      code,
      css
    });
    const tasks = [];
    switch (name) {
      case "html": {
        tasks.push(refreshHtml());
        break;
      }
      case "code": {
        tasks.push(refreshApp());
        break;
      }
      case "index": {
        tasks.push(refreshIndex());
        break;
      }
      case "css": {
        tasks.push(refreshStyle());
        break;
      }
      default: {
        this.iframe.setAttribute(name, newValue);
      }
    }
    const res = Promise.all(tasks);
    this.dispatchEvent(new CustomEvent("ready"));
    return res;
  }
  async refresh() {
    const html = this.getAttribute("html") || DefaultHtml;
    const index = this.getAttribute("index") || DefaultIndexCode;
    const code = this.getAttribute("code") || DefaultDemoCode;
    const css = this.getAttribute("css") || DefaultCssCode;
    const { refreshHtml, refreshApp, refreshIndex, refreshStyle } = getSandboxRefresher({
      iframe: this.iframe,
      html,
      index,
      code,
      css
    });
    const tasks = [];
    tasks.push(refreshHtml());
    tasks.push(refreshApp());
    tasks.push(refreshIndex());
    tasks.push(refreshStyle());
    const res = Promise.all(tasks);
    this.dispatchEvent(new CustomEvent("ready"));
    return res;
  }
}
export {
  CodeSandbox,
  _ as DefaultCodes,
  r as registerPlugins
};
//# sourceMappingURL=webcomponent.js.map
