const errorMessageList: { [key: number]: string } = {
    400: "Nieprawidłowe żądanie",
    401: "Brak autoryzacji",
    403: "Brak dostępu",
    404: "Nie znaleziono zasobu",
    409: "Konflikt danych",
    500: "Wewnętrzny błąd serwera",
  };
  
  export interface CustomError extends Error {
    status?: number;
  }
  
  const handleError = (
    status: number,
    message: string = errorMessageList[status] || "Nieznany błąd"
  ): CustomError => {
    const error: CustomError = new Error(message);
    error.status = status;
    return error;
  };
  
  export default handleError;
  