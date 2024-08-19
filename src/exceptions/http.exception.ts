class HttpException extends Error {
  status: number;
  constructor(status: number = 500, message: string = 'Something went wrong') {
    super(message);
    this.status = status;
  }
}

export { HttpException };