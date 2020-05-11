class RequestValidator {
  validate(request) {
    const { account_id, url } = request;
    const isValidObjectId = account_id && this.isValidObjectId(account_id);
    const isValidUrl = url && this.isValidUrl(url);
    return isValidUrl && isValidObjectId;
  }

  isValidObjectId(objectId) {
    return /^[a-fA-F0-9]{24}$/.test(objectId);
  }

  isValidUrl(url) {
    return /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm.test(url);
  }
}

module.exports = RequestValidator;
