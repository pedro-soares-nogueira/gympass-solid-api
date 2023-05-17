export class LateCheckInValidationError extends Error {
  constructor() {
    super(
      "The check-in can onlu be validated intil 20 minutos of this creation"
    )
  }
}
