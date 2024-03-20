class CommonUtil {
  formatCurrency(value: number) {
    const nf = new Intl.NumberFormat('th-TH', {
      currency: 'THB',
      style: 'currency',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
    return nf.format(value)
  }
}

export const commonUtil = new CommonUtil()
