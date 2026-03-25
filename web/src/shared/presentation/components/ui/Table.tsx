import React, { useState } from 'react';

export function Table({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ width: '100%', overflowX: 'auto', ...style }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: 14,
        }}
      >
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <thead
      style={{
        background: '#0b0f19',
      }}
    >
      {children}
    </thead>
  );
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TableRow({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <tr
      style={{
        borderBottom: '1px solid #1e293b',
        color: '#e2e8f0',
        background: hovered ? 'rgba(255,255,255,0.03)' : 'transparent',
        transition: 'background 0.1s',
        ...style,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </tr>
  );
}

export function TableHead({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <th
      style={{
        height: 48,
        padding: '0 16px',
        textAlign: 'left',
        verticalAlign: 'middle',
        fontWeight: 500,
        color: '#94a3b8',
        borderBottom: '1px solid #1e293b',
        ...style,
      }}
    >
      {children}
    </th>
  );
}

export function TableCell({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <td
      style={{
        padding: 16,
        verticalAlign: 'middle',
        color: '#e2e8f0',
        ...style,
      }}
    >
      {children}
    </td>
  );
}
