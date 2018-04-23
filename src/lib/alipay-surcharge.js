function computeAlipaySurchargeTotal(rawAmount) {
    return Number((Math.ceil(1.001 * rawAmount * 100) / 100).toFixed(2))
}

export default computeAlipaySurchargeTotal