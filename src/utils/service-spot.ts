class ServiceSpotUtil {
  calculatePrice(distance: number) {
    if (distance <= 0) {
      return 0
    } else if (distance <= 1.1) {
      return 15
    } else if (distance <= 1.5) {
      return 20
    } else if (distance <= 2) {
      return 25
    } else if (distance <= 5) {
      return Math.round((distance - 2) * 5 + 25)
    } else if (distance <= 10) {
      return Math.round((distance - 5) * 10 + 40)
    } else {
      return 90
    }
  }
  getDistanceText = (distance: number) => {
    if (distance < 1000) {
      return `${Math.floor(distance)} เมตร`
    }
    return `${Math.round(distance / 1000)} กม.`
  }
}

export const serviceSpotUtil = new ServiceSpotUtil()
