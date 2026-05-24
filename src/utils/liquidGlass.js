// Liquid glass SVG filter generator — adapted from nikdelvin/liquid-glass
// Uses feDisplacementMap with a gradient-based lens displacement map
// Applied via backdrop-filter: url('#id') for refraction effect in Chrome/Edge
// Safari/Firefox fall back to pure CSS glassmorphism

function buildDisplacementMap(width, height, radius, depth) {
  // Encodes the displacement texture as percent-encoded SVG
  // R channel = horizontal displacement (X gradient: red→black)
  // G channel = vertical displacement (Y gradient: green→black)
  // Navy rect creates the lens shape; gradients give directional distortion
  const d = depth
  const w = width - 2 * d
  const h = height - 2 * d
  return (
    `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>` +
    `<defs>` +
    `<linearGradient id='X' x1='0' y1='0' x2='1' y2='0'>` +
    `<stop offset='0%25' stop-color='%23ff0000'/>` +
    `<stop offset='100%25' stop-color='%23000000'/>` +
    `</linearGradient>` +
    `<linearGradient id='Y' x1='0' y1='0' x2='0' y2='1'>` +
    `<stop offset='0%25' stop-color='%2300ff00'/>` +
    `<stop offset='100%25' stop-color='%23000000'/>` +
    `</linearGradient>` +
    `</defs>` +
    `<rect width='${width}' height='${height}' fill='%23808080'/>` +
    `<g style='filter:blur(${d}px)'>` +
    `<rect fill='%23000080' x='${d}' y='${d}' width='${w}' height='${h}' rx='${radius}'/>` +
    `<rect fill='url(%23X)' x='${d}' y='${d}' width='${w}' height='${h}' rx='${radius}' style='mix-blend-mode:screen'/>` +
    `<rect fill='url(%23Y)' x='${d}' y='${d}' width='${w}' height='${h}' rx='${radius}' style='mix-blend-mode:screen'/>` +
    `</g></svg>`
  )
}

export function buildLiquidGlassFilter({
  filterId = 'lg-filter',
  width = 380,
  height = 72,
  radius = 24,
  depth = 10,
  strength = 22,
  chromaticAberration = 3,
} = {}) {
  const mapURI = `data:image/svg+xml,${buildDisplacementMap(width, height, radius, depth)}`
  const rScale = strength + chromaticAberration * 2
  const gScale = strength + chromaticAberration
  const bScale = strength

  // Returned as JSX-ready props for the <filter> element
  return {
    filterId,
    mapURI,
    rScale,
    gScale,
    bScale,
  }
}
