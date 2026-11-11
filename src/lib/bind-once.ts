export function bindOnce<T extends HTMLElement>(element: T | null, onBind: (element: T) => void) {
  if (!element || element.dataset.bound === 'true') return
  element.dataset.bound = 'true'
  onBind(element)
}
