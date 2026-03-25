'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  Wallet,
  FileText,
  GripVertical,
  Palette,
  EyeOff,
  Eye,
} from 'lucide-react';
import { accountsRepository } from '@/modules/accounts/infrastructure/repositories/AccountsHttpRepository';
import { formatCLP } from '@/shared/presentation/components/CurrencyDisplay';
import { useAuth } from '@/modules/auth/presentation/hooks/useAuth';
import type { Account } from '@/modules/accounts/domain/types';

const STATIC_CARD_IDS = ['ingresos', 'gastos', 'balance', 'deudas', 'cuotas'];
const STORAGE_KEY = 'dashboard_card_order';
const COLORS_KEY  = 'dashboard_card_colors';
const HIDDEN_KEY  = 'dashboard_card_hidden';

const CARD_LABELS: Record<string, string> = {
  ingresos: 'Ingresos del Mes',
  gastos:   'Gastos del Mes',
  balance:  'Balance del Mes',
  deudas:   'Deudas por Cobrar',
  cuotas:   'Cuotas Pendientes',
};

const PALETTE: { id: string; bg: string | null; preview: string }[] = [
  { id: 'default',  bg: null,                                               preview: '#1e293b' },
  { id: 'emerald',  bg: 'linear-gradient(135deg, #065f46, #047857)',        preview: '#047857' },
  { id: 'crimson',  bg: 'linear-gradient(135deg, #7f1d1d, #991b1b)',        preview: '#991b1b' },
  { id: 'ocean',    bg: 'linear-gradient(135deg, #1e3a5f, #2563eb)',        preview: '#2563eb' },
  { id: 'violet',   bg: 'linear-gradient(135deg, #3b1f6e, #7c3aed)',        preview: '#7c3aed' },
  { id: 'amber',    bg: 'linear-gradient(135deg, #78350f, #d97706)',        preview: '#d97706' },
  { id: 'teal',     bg: 'linear-gradient(135deg, #134e4a, #0d9488)',        preview: '#0d9488' },
  { id: 'rose',     bg: 'linear-gradient(135deg, #881337, #e11d48)',        preview: '#e11d48' },
];

type AccountSummary = { income: number; expenses: number; balance: number };
type PinnedEntry = { account: Account; summary: AccountSummary };

const typeIconMap: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  MAIN:        { icon: Wallet,   color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  DEBT:        { icon: FileText, color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
  INSTALLMENT: { icon: Calendar, color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
};

function loadInitialOrder(): string[] {
  if (typeof window === 'undefined') return STATIC_CARD_IDS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as string[];
      const missing = STATIC_CARD_IDS.filter((id) => !parsed.includes(id));
      return [...parsed, ...missing];
    }
  } catch {}
  return STATIC_CARD_IDS;
}

function loadInitialColors(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const saved = localStorage.getItem(COLORS_KEY);
    if (saved) return JSON.parse(saved) as Record<string, string>;
  } catch {}
  return {};
}

function loadInitialHidden(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(HIDDEN_KEY);
    if (saved) return JSON.parse(saved) as string[];
  } catch {}
  return [];
}

// --- SortableCard wrapper ---
function SortableCard({
  id,
  currentBg,
  onColorChange,
  onHide,
  children,
}: {
  id: string;
  currentBg: string | null;
  onColorChange: (colorId: string) => void;
  onHide: () => void;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        position: 'relative',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPickerOpen(false); }}
    >
      {/* Hide button */}
      <button
        type="button"
        title="Ocultar tarjeta"
        onClick={(e) => { e.stopPropagation(); onHide(); }}
        style={{
          position: 'absolute',
          top: 8,
          right: 64,
          zIndex: 10,
          cursor: 'pointer',
          color: hovered ? '#94a3b8' : 'transparent',
          transition: 'color 0.15s',
          width: 24,
          height: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 4,
          background: 'none',
          border: 'none',
          padding: 0,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = hovered ? '#94a3b8' : 'transparent'; }}
      >
        <EyeOff size={14} />
      </button>

      {/* Palette button */}
      <button
        type="button"
        title="Color"
        onClick={(e) => { e.stopPropagation(); setPickerOpen((p) => !p); }}
        style={{
          position: 'absolute',
          top: 8,
          right: 36,
          zIndex: 10,
          cursor: 'pointer',
          color: pickerOpen ? '#94a3b8' : hovered ? '#94a3b8' : 'transparent',
          transition: 'color 0.15s',
          width: 24,
          height: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 4,
          background: 'none',
          border: 'none',
          padding: 0,
        }}
      >
        <Palette size={14} />
      </button>

      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        title="Mover"
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 10,
          cursor: isDragging ? 'grabbing' : 'grab',
          color: hovered ? '#94a3b8' : 'transparent',
          transition: 'color 0.15s',
          width: 24,
          height: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 4,
        }}
      >
        <GripVertical size={14} />
      </div>

      {/* Color picker popup */}
      {pickerOpen && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 40 }}
            onClick={() => setPickerOpen(false)}
          />
          <div
            style={{
              position: 'absolute',
              top: 36,
              right: 8,
              zIndex: 50,
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: 10,
              padding: '10px 12px',
              display: 'flex',
              gap: 8,
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}
          >
            {PALETTE.map((c) => {
              const isSelected = c.id === 'default' ? !currentBg : c.bg === currentBg;
              return (
                <button
                  key={c.id}
                  type="button"
                  title={c.id === 'default' ? 'Por defecto' : c.id}
                  onClick={() => { onColorChange(c.id); setPickerOpen(false); }}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    border: isSelected ? '2px solid #f1f5f9' : '2px solid transparent',
                    cursor: 'pointer',
                    background: c.id === 'default'
                      ? 'linear-gradient(135deg, #334155, #1e293b)'
                      : (c.bg ?? '#1e293b'),
                    padding: 0,
                    flexShrink: 0,
                    transition: 'transform 0.1s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.2)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                />
              );
            })}
          </div>
        </>
      )}

      {children}
    </div>
  );
}

// --- Individual card renderers ---
function IngresosCard({ value, loading, bg }: { value: number; loading: boolean; bg: string | null }) {
  return (
    <div style={{ borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 12, background: bg ?? 'linear-gradient(135deg, #065f46, #047857)', height: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: '#a7f3d0', fontSize: '0.85rem', fontWeight: 500 }}>Ingresos del Mes</span>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <TrendingUp size={18} color="#a7f3d0" />
        </div>
      </div>
      <span style={{ fontSize: 'clamp(1.1rem, 5vw, 1.8rem)', fontWeight: 700, color: '#ffffff', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
        {loading ? '...' : formatCLP(value)}
      </span>
    </div>
  );
}

function GastosCard({ value, loading, bg }: { value: number; loading: boolean; bg: string | null }) {
  return (
    <div style={{ borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 12, background: bg ?? 'linear-gradient(135deg, #7f1d1d, #991b1b)', height: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: '#fca5a5', fontSize: '0.85rem', fontWeight: 500 }}>Gastos del Mes</span>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <TrendingDown size={18} color="#fca5a5" />
        </div>
      </div>
      <span style={{ fontSize: 'clamp(1.1rem, 5vw, 1.8rem)', fontWeight: 700, color: '#ffffff', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
        {loading ? '...' : formatCLP(value)}
      </span>
    </div>
  );
}

function BalanceCard({ value, loading, bg }: { value: number; loading: boolean; bg: string | null }) {
  return (
    <div style={{ borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 12, background: bg ?? 'linear-gradient(135deg, #1e3a5f, #2563eb)', height: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: '#93c5fd', fontSize: '0.85rem', fontWeight: 500 }}>Balance del Mes</span>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <DollarSign size={18} color="#93c5fd" />
        </div>
      </div>
      <span style={{ fontSize: 'clamp(1.1rem, 5vw, 1.8rem)', fontWeight: 700, color: '#ffffff', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
        {loading ? '...' : formatCLP(value)}
      </span>
    </div>
  );
}

function DeudasCard({ bg }: { bg: string | null }) {
  const labelColor = bg ? 'rgba(255,255,255,0.75)' : '#94a3b8';
  const descColor  = bg ? 'rgba(255,255,255,0.5)'  : '#64748b';
  return (
    <div style={{ borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 12, background: bg ?? '#111827', border: '1px solid #1e293b', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: labelColor, fontSize: '0.85rem', fontWeight: 500 }}>Deudas por Cobrar</span>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(251,191,36,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Users size={18} color="#fbbf24" />
        </div>
      </div>
      <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff' }}>Ver deudas</span>
      <p style={{ color: descColor, fontSize: '0.8rem', margin: 0 }}>Gestiona las deudas que te deben</p>
    </div>
  );
}

function CuotasCard({ bg }: { bg: string | null }) {
  const labelColor = bg ? 'rgba(255,255,255,0.75)' : '#94a3b8';
  const descColor  = bg ? 'rgba(255,255,255,0.5)'  : '#64748b';
  return (
    <div style={{ borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 12, background: bg ?? '#111827', border: '1px solid #1e293b', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: labelColor, fontSize: '0.85rem', fontWeight: 500 }}>Cuotas Pendientes</span>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Calendar size={18} color="#8b5cf6" />
        </div>
      </div>
      <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff' }}>Ver cuotas</span>
      <p style={{ color: descColor, fontSize: '0.8rem', margin: 0 }}>Controla tus planes de cuotas</p>
    </div>
  );
}

function PinnedAccountCard({ account, summary, bg }: { account: Account; summary: AccountSummary; bg: string | null }) {
  const typeConf = typeIconMap[account.type] || typeIconMap.MAIN;
  const IconComp = typeConf.icon;
  const balanceColor   = summary.balance > 0 ? '#10b981' : summary.balance < 0 ? '#ef4444' : '#94a3b8';
  const nameColor      = bg ? 'rgba(255,255,255,0.8)' : '#94a3b8';
  const secondaryColor = bg ? 'rgba(255,255,255,0.5)' : '#475569';
  return (
    <div style={{ borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 8, background: bg ?? '#111827', border: '1px solid #1e293b', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: typeConf.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <IconComp size={16} color={typeConf.color} />
        </div>
        <span style={{ color: nameColor, fontSize: '0.8rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {account.name}
        </span>
      </div>
      <span style={{ fontSize: '1.4rem', fontWeight: 700, color: balanceColor }}>
        {formatCLP(summary.balance)}
      </span>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: secondaryColor }}>
        <span>+{formatCLP(summary.income)}</span>
        <span>-{formatCLP(summary.expenses)}</span>
      </div>
    </div>
  );
}

// --- Main page ---
export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<AccountSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pinnedAccounts, setPinnedAccounts] = useState<PinnedEntry[]>([]);
  const [cardOrder, setCardOrder] = useState<string[]>(loadInitialOrder);
  const [cardColors, setCardColors] = useState<Record<string, string>>(loadInitialColors);
  const [hiddenCards, setHiddenCards] = useState<string[]>(loadInitialHidden);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  // Monthly summary
  useEffect(() => {
    const now = new Date();
    accountsRepository
      .getMonthlySummary(now.getFullYear(), now.getMonth() + 1)
      .then(setSummary)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  // Pinned accounts
  useEffect(() => {
    const loadPinned = async () => {
      try {
        const all = await accountsRepository.getAll();
        const pinned = all.filter((a) => a.showInDashboard && !a.archived);
        const withSummaries = await Promise.all(
          pinned.map(async (account) => ({
            account,
            summary: await accountsRepository.getSummary(account.id),
          })),
        );
        setPinnedAccounts(withSummaries);

        setCardOrder((prev) => {
          const validIds = pinned.map((a) => `account-${a.id}`);
          const filtered = prev.filter(
            (id) => !id.startsWith('account-') || validIds.includes(id),
          );
          const newIds = validIds.filter((id) => !filtered.includes(id));
          const merged = [...filtered, ...newIds];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          return merged;
        });
      } catch (err) {
        console.error('Error loading pinned accounts:', err);
      }
    };
    loadPinned();
  }, []);

  const handleDragEnd = useCallback(({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    setCardOrder((prev) => {
      const oldIndex = prev.indexOf(active.id as string);
      const newIndex = prev.indexOf(over.id as string);
      const newOrder = arrayMove(prev, oldIndex, newIndex);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newOrder));
      return newOrder;
    });
  }, []);

  const handleColorChange = useCallback((id: string, colorId: string) => {
    const entry = PALETTE.find((c) => c.id === colorId);
    setCardColors((prev) => {
      const updated = { ...prev };
      if (!entry || entry.bg === null) {
        delete updated[id];
      } else {
        updated[id] = entry.bg;
      }
      localStorage.setItem(COLORS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleHideCard = useCallback((id: string) => {
    setHiddenCards((prev) => {
      const updated = [...prev, id];
      localStorage.setItem(HIDDEN_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleShowCard = useCallback((id: string) => {
    setHiddenCards((prev) => {
      const updated = prev.filter((h) => h !== id);
      localStorage.setItem(HIDDEN_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getCardLabel = (id: string): string => {
    if (CARD_LABELS[id]) return CARD_LABELS[id];
    if (id.startsWith('account-')) {
      const accountId = parseInt(id.replace('account-', ''));
      const entry = pinnedAccounts.find((p) => p.account.id === accountId);
      return entry ? entry.account.name : id;
    }
    return id;
  };

  const renderCard = (id: string) => {
    const bg = cardColors[id] ?? null;
    if (id === 'ingresos') return <IngresosCard value={summary?.income ?? 0} loading={isLoading} bg={bg} />;
    if (id === 'gastos')   return <GastosCard   value={summary?.expenses ?? 0} loading={isLoading} bg={bg} />;
    if (id === 'balance')  return <BalanceCard  value={summary?.balance ?? 0} loading={isLoading} bg={bg} />;
    if (id === 'deudas')   return <DeudasCard bg={bg} />;
    if (id === 'cuotas')   return <CuotasCard bg={bg} />;
    if (id.startsWith('account-')) {
      const accountId = parseInt(id.replace('account-', ''));
      const entry = pinnedAccounts.find((p) => p.account.id === accountId);
      if (entry) return <PinnedAccountCard account={entry.account} summary={entry.summary} bg={bg} />;
    }
    return null;
  };

  const visibleCards = cardOrder.filter((id) => !hiddenCards.includes(id));

  return (
    <div>
      {/* Welcome */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
          Bienvenido, {user?.name?.split(' ')[0] || 'Usuario'}
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>
          Aqui tienes un resumen de tu actividad financiera
        </p>
      </div>

      {/* Sortable grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={visibleCards} strategy={rectSortingStrategy}>
          <div className="grid-cards-3">

            {visibleCards.map((id) => {
              const content = renderCard(id);
              if (!content) return null;
              return (
                <SortableCard
                  key={id}
                  id={id}
                  currentBg={cardColors[id] ?? null}
                  onColorChange={(colorId) => handleColorChange(id, colorId)}
                  onHide={() => handleHideCard(id)}
                >
                  {content}
                </SortableCard>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>

      {/* Hidden cards */}
      {hiddenCards.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <p style={{ color: '#475569', fontSize: '0.8rem', fontWeight: 500, marginBottom: 10, marginTop: 0 }}>
            Tarjetas ocultas ({hiddenCards.length})
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {hiddenCards.map((id) => (
              <div
                key={id}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 12px',
                  borderRadius: 20,
                  background: '#111827',
                  border: '1px solid #1e293b',
                }}
              >
                <span style={{ color: '#64748b', fontSize: '0.8rem' }}>
                  {getCardLabel(id)}
                </span>
                <button
                  type="button"
                  title="Mostrar tarjeta"
                  onClick={() => handleShowCard(id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    border: 'none',
                    background: 'rgba(148,163,184,0.1)',
                    color: '#64748b',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'background 0.15s, color 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(16,185,129,0.15)';
                    e.currentTarget.style.color = '#10b981';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(148,163,184,0.1)';
                    e.currentTarget.style.color = '#64748b';
                  }}
                >
                  <Eye size={11} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
