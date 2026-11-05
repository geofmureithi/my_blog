const fadeIn = {
  name: 'site-page-in',
  duration: '0.48s',
  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
  fillMode: 'both',
}

const fadeOut = {
  name: 'site-page-out',
  duration: '0.24s',
  easing: 'ease-out',
  fillMode: 'both',
}

export const pageTransition = {
  forwards: { old: fadeOut, new: fadeIn },
  backwards: { old: fadeOut, new: fadeIn },
}
