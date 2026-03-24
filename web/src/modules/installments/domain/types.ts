export interface InstallmentPayment {
  id: number;
  installmentId: number;
  installmentNumber: number;
  amount: number;
  paid: boolean;
  paidDate: string | null;
}

export interface Installment {
  id: number;
  accountId: number;
  description: string;
  totalAmount: number;
  totalInstallments: number;
  installmentValue: number;
  startDate: string;
  archived: boolean;
  createdAt: string;
  payments?: InstallmentPayment[];
  paidCount?: number;
  pendingCount?: number;
  progressPercentage?: number;
}
