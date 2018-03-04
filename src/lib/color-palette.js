function generateHue(n) {
    const step = Math.floor(360 / (n + 1))
    return [...Array(n)].map((_, idx) => idx * step)
}

export { generateHue }