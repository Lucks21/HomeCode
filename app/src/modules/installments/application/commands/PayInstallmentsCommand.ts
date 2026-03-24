export class PayInstallmentsCommand {
  constructor(
    public readonly installmentId: number,
    public readonly count: number,
  ) {}
}
