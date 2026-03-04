class Response {
  constructor(message, data, statusCode = 200) {
    this.success = statusCode >= 200 && statusCode < 300;
    this.code = statusCode;
    this.message = message;
    this.data = data;
  }
}

export default Response;
