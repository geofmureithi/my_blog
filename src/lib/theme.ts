import { bindOnce } from './bind-once'

export type ThemeName = 'light' | 'dark'

export const themeStorageKey = 'theme'
export const themeSwitcherId = 'theme-switcher'

export const themeSurface: Record<ThemeName, string> = {
  light: '#ffffff',
  dark: '#171717',
}

export function resolveTheme(): ThemeName {
  try {
    const saved = localStorage.getItem(themeStorageKey)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // Storage can be blocked. Fall through to the system preference.
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyThemeClass(root: HTMLElement, theme: ThemeName = resolveTheme()) {
  root.classList.toggle('dark', theme === 'dark')
}

export function giscusThemeUrl(theme: ThemeName) {
  return `${location.origin}/giscus-${theme}.css`
}

export function paintGiscusFrame(
  frame: HTMLIFrameElement | null,
  theme: ThemeName = resolveTheme(),
  force = false
) {
  if (!frame?.contentWindow) return
  frame.style.colorScheme = theme
  frame.style.background = themeSurface[theme]
  if (!force && frame.dataset.theme === theme) return
  frame.dataset.theme = theme
  frame.contentWindow.postMessage(
    { giscus: { setConfig: { theme: giscusThemeUrl(theme) } } },
    'https://giscus.app'
  )
}

export function syncThemeSwitcher(theme: ThemeName = resolveTheme()) {
  document.querySelectorAll<HTMLElement>(`#${themeSwitcherId}`).forEach((button) => {
    button.setAttribute('aria-checked', String(theme === 'dark'))
  })
}

export function storeTheme(theme: ThemeName) {
  localStorage.setItem(themeStorageKey, theme)
  applyThemeClass(document.documentElement, theme)
  syncThemeSwitcher(theme)
  paintGiscusFrame(document.querySelector('iframe.giscus-frame'), theme, true)
}

export function toggleTheme() {
  storeTheme(resolveTheme() === 'dark' ? 'light' : 'dark')
}

export function bindThemeSwitcher() {
  const themeSwitcher = document.getElementById(themeSwitcherId)
  if (!(themeSwitcher instanceof HTMLElement)) return

  bindOnce(themeSwitcher, (button) => {
    button.addEventListener('click', toggleTheme)
    syncThemeSwitcher()
  })
}

// Inlined in <head> so the class is set before paint. The same string is the
// only copy of the pre-paint rules, shared by the site layout and the 404 page.
export const themeHeadScript = `(function () {
  var key = ${JSON.stringify(themeStorageKey)};
  var resolveTheme = function () {
    try {
      var saved = localStorage.getItem(key);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (error) {}
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };
  var apply = function (root) {
    root.classList.toggle('dark', resolveTheme() === 'dark');
  };
  apply(document.documentElement);
  if (window.themePersistBound) return;
  window.themePersistBound = true;
  document.addEventListener('astro:before-swap', function (event) {
    apply(event.newDocument.documentElement);
  });
  document.addEventListener('astro:after-swap', function () {
    var theme = resolveTheme();
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.querySelectorAll(${JSON.stringify('#' + themeSwitcherId)}).forEach(function (button) {
      button.setAttribute('aria-checked', String(theme === 'dark'));
    });
  });
})();`
