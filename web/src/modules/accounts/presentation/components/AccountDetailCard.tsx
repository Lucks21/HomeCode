'use client';

/**
 * Tarjeta de detalle de cuenta
 *
 * Muestra nombre, tipo, resumen financiero e hijos
 */

import React from 'react';
import type { AccountDetail } from '../../domain/types';

const typeLabels: Record<string, string> = {
  MAIN: 'Principal',
  DEBT: 'Deuda',
  INSTALLMENT: 'Cuota',
};

const typeStyles: Record<string, { background: string; color: string }> = {
  MAIN: { background: 'rgba(59,130,246,0.15)', color: '#3b82f6' },
  DEBT: { background: 'rgba(239,68,68,0.15)', color: '#ef4444' },
  INSTALLMENT: { background: 'rgba(251,191,36,0.15)', color: '#fbbf24' },
};

function formatCLP(amount: number): string {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
}

interface AccountDetailCardProps {
  detail: AccountDetail;
}

export function AccountDetailCard({ detail }: AccountDetailCardProps) {
  const typeStyle = typeStyles[detail.type] ?? typeStyles.MAIN;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Informacion principal */}
      <div
        style={{
          background: '#111827',
          border: '1px solid #1e293b',
          borderRadius: 16,
          padding: 24,
        }}
      >
        {/* Header: nombre + badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
            {detail.name}
          </h2>
          <span
            style={{
              background: typeStyle.background,
              color: typeStyle.color,
              padding: '4px 14px',
              borderRadius: 9999,
              fontSize: 12,
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            {typeLabels[detail.type] || detail.type}
          </span>
          {detail.archived && (
            <span
              style={{
                background: 'rgba(100,116,139,0.15)',
                color: '#94a3b8',
                padding: '4px 14px',
                borderRadius: 9999,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Archivada
            </span>
          )}
        </div>

        {/* Balance grande */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ color: '#94a3b8', fontSize: 13, margin: 0, marginBottom: 4 }}>Balance</p>
          <p
            style={{
              fontSize: 32,
              fontWeight: 700,
              margin: 0,
              color: detail.summary.balance >= 0 ? '#10b981' : '#ef4444',
            }}
          >
            {formatCLP(detail.summary.balance)}
          </p>
        </div>

        {/* Resumen financiero: Ingresos / Gastos */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div
            style={{
              background: '#0b0f19',
              border: '1px solid #1e293b',
              borderRadius: 12,
              padding: 16,
            }}
          >
            <p style={{ color: '#94a3b8', fontSize: 13, margin: 0, marginBottom: 4 }}>Ingresos</p>
            <p style={{ color: '#10b981', fontSize: 20, fontWeight: 700, margin: 0 }}>
              {formatCLP(detail.summary.income)}
            </p>
          </div>
          <div
            style={{
              background: '#0b0f19',
              border: '1px solid #1e293b',
              borderRadius: 12,
              padding: 16,
            }}
          >
            <p style={{ color: '#94a3b8', fontSize: 13, margin: 0, marginBottom: 4 }}>Gastos</p>
            <p style={{ color: '#ef4444', fontSize: 20, fontWeight: 700, margin: 0 }}>
              {formatCLP(detail.summary.expenses)}
            </p>
          </div>
        </div>
      </div>

      {/* Cuentas hijas */}
      {detail.children && detail.children.length > 0 && (
        <div
          style={{
            background: '#111827',
            border: '1px solid #1e293b',
            borderRadius: 16,
            padding: 24,
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', margin: 0, marginBottom: 16 }}>
            Subcuentas
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {detail.children.map((child) => {
              const childTypeStyle = typeStyles[child.type] ?? typeStyles.MAIN;
              return (
                <div
                  key={child.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: '#0b0f19',
                    borderRadius: 10,
                    border: '1px solid #1e293b',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 500, fontSize: 14, color: '#e2e8f0' }}>
                      {child.name}
                    </span>
                    <span
                      style={{
                        background: childTypeStyle.background,
                        color: childTypeStyle.color,
                        padding: '2px 10px',
                        borderRadius: 9999,
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {typeLabels[child.type] || child.type}
                    </span>
                    {child.archived && (
                      <span
                        style={{
                          background: 'rgba(100,116,139,0.15)',
                          color: '#94a3b8',
                          padding: '2px 10px',
                          borderRadius: 9999,
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        Archivada
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
