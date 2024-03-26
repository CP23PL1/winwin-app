class ServiceSpotUtil {
  getDistanceText = (distance: number) => {
    if (distance < 1000) {
      return `${Math.floor(distance)} เมตร`
    }
    return `${Math.round(distance / 1000)} กม.`
  }
}

export const serviceSpotUtil = new ServiceSpotUtil()
