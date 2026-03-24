'use client';

/**
 * Tarjeta de detalle de cuenta
 *
 * Muestra nombre, tipo, resumen financiero e hijos
 */

import React from 'react';
import { Badge } from '@/shared/presentation/components/ui/Badge';
import type { AccountDetail } from '../../domain/types';

const typeLabels: Record<string, string> = {
  MAIN: 'Principal',
  DEBT: 'Deuda',
  INSTALLMENT: 'Cuota',
};

function formatCLP(amount: number): string {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
}

interface AccountDetailCardProps {
  detail: AccountDetail;
}

export function AccountDetailCard({ detail }: AccountDetailCardProps) {
  return (
    <div className="space-y-6">
      {/* Informacion principal */}
      <div className="border-2 border-foreground rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-2xl font-bold">{detail.name}</h2>
          <Badge variant="outline">{typeLabels[detail.type] || detail.type}</Badge>
          {detail.archived && (
            <Badge variant="secondary">Archivada</Badge>
          )}
        </div>

        {/* Resumen financiero */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="border-2 border-foreground rounded-lg p-4">
            <p className="text-sm text-muted-foreground font-medium">Ingresos</p>
            <p className="text-xl font-bold text-green-600 mt-1">
              {formatCLP(detail.summary.income)}
            </p>
          </div>
          <div className="border-2 border-foreground rounded-lg p-4">
            <p className="text-sm text-muted-foreground font-medium">Gastos</p>
            <p className="text-xl font-bold text-red-600 mt-1">
              {formatCLP(detail.summary.expenses)}
            </p>
          </div>
          <div className="border-2 border-foreground rounded-lg p-4">
            <p className="text-sm text-muted-foreground font-medium">Balance</p>
            <p
              className={`text-xl font-bold mt-1 ${
                detail.summary.balance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {formatCLP(detail.summary.balance)}
            </p>
          </div>
        </div>
      </div>

      {/* Cuentas hijas */}
      {detail.children && detail.children.length > 0 && (
        <div className="border-2 border-foreground rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Subcuentas</h3>
          <div className="space-y-2">
            {detail.children.map((child) => (
              <div
                key={child.id}
                className="flex items-center justify-between py-2 px-4 border border-border rounded-md hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{child.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {typeLabels[child.type] || child.type}
                  </Badge>
                  {child.archived && (
                    <Badge variant="secondary" className="text-xs">
                      Archivada
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
