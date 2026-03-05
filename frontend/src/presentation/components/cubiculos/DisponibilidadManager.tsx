import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Edit, Save, X, Clock, Calendar } from "lucide-react";
import { toast } from "react-hot-toast";
import { authAPI } from "../../../core/infraestructura/api/api";
import type { DiaSemana, DisponibilidadCreateRequestDTO } from "../../../core/dominio/tipos/api";

const DIAS: { value: DiaSemana; label: string }[] = [
  { value: "MONDAY",    label: "Lunes"     },
  { value: "TUESDAY",   label: "Martes"    },
  { value: "WEDNESDAY", label: "Miercoles" },
  { value: "THURSDAY",  label: "Jueves"    },
  { value: "FRIDAY",    label: "Viernes"   },
  { value: "SATURDAY",  label: "Sabado"    },
  { value: "SUNDAY",    label: "Domingo"   },
];

const DIA_COLORS: Record<DiaSemana, string> = {
  MONDAY:    "bg-blue-50 border-blue-200",
  TUESDAY:   "bg-purple-50 border-purple-200",
  WEDNESDAY: "bg-green-50 border-green-200",
  THURSDAY:  "bg-yellow-50 border-yellow-200",
  FRIDAY:    "bg-orange-50 border-orange-200",
  SATURDAY:  "bg-red-50 border-red-200",
  SUNDAY:    "bg-gray-50 border-gray-200",
};

const DIA_BADGE: Record<DiaSemana, string> = {
  MONDAY:    "bg-blue-100 text-blue-700",
  TUESDAY:   "bg-purple-100 text-purple-700",
  WEDNESDAY: "bg-green-100 text-green-700",
  THURSDAY:  "bg-yellow-100 text-yellow-700",
  FRIDAY:    "bg-orange-100 text-orange-700",
  SATURDAY:  "bg-red-100 text-red-700",
  SUNDAY:    "bg-gray-100 text-gray-700",
};

interface FormData { diaSemana: DiaSemana; horaInicio: string; horaFin: string; }

/** Devuelve true si los rangos [a1,a2) y [b1,b2) se superponen.
 *  Funciona correctamente porque input[type=time].value siempre devuelve "HH:mm" en 24h
 *  según el estándar W3C, independientemente del locale del navegador. */
function seSolapan(a1: string, a2: string, b1: string, b2: string): boolean {
  return a1 < b2 && a2 > b1;
}

/** Normaliza el valor de un input time a "HH:mm" en 24h por si el navegador añade segundos */
function normalizarHora(valor: string): string {
  return valor.substring(0, 5); // "HH:mm:ss" -> "HH:mm"
}

/** Convierte "HH:mm" (24h) a "h:mm AM/PM" (12h) para mostrar en la UI */
function formatear12h(hora: string): string {
  const [hStr, mStr] = hora.split(":");
  let h = parseInt(hStr, 10);
  const m = mStr ?? "00";
  const periodo = h >= 12 ? "PM" : "AM";
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return `${h}:${m} ${periodo}`;
}

const RowForm: React.FC<{
  initial?: FormData;
  existingSlots?: { diaSemana: DiaSemana; horaInicio: string; horaFin: string }[];
  excludeId?: number;
  onSave: (d: FormData) => void;
  onCancel: () => void;
  isSaving: boolean;
}> =
  ({ initial, existingSlots = [], excludeId, onSave, onCancel, isSaving }) => {
    const [form, setForm] = useState<FormData>(initial ?? { diaSemana: "MONDAY", horaInicio: "09:00", horaFin: "17:00" });
    const [err, setErr] = useState<string | null>(null);

    const save = () => {
      if (form.horaInicio >= form.horaFin) { setErr("La hora de inicio debe ser menor que la hora de fin"); return; }

      const slotsDelDia = existingSlots.filter(s => s.diaSemana === form.diaSemana);
      const conflicto = slotsDelDia.find(s => {
        if (excludeId !== undefined && (s as any).id === excludeId) return false;
        return seSolapan(form.horaInicio, form.horaFin, s.horaInicio, s.horaFin);
      });
      if (conflicto) {
        setErr(`Se superpone con el horario existente ${formatear12h(conflicto.horaInicio)}–${formatear12h(conflicto.horaFin)}. Usa un rango de horas diferente (p. ej. mañana y tarde sin solaparse).`);
        return;
      }

      setErr(null); onSave(form);
    };
    return (
      <div className="border border-blue-200 rounded-lg p-3 bg-blue-50 space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Dia</label>
            <select value={form.diaSemana} onChange={e => setForm({ ...form, diaSemana: e.target.value as DiaSemana })}
              className="w-full h-9 px-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500">
              {DIAS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Inicio</label>
            <input type="time" lang="es-MX" value={form.horaInicio}
              onChange={e => setForm({ ...form, horaInicio: normalizarHora(e.target.value) })}
              className="w-full h-9 px-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Fin</label>
            <input type="time" lang="es-MX" value={form.horaFin}
              onChange={e => setForm({ ...form, horaFin: normalizarHora(e.target.value) })}
              className="w-full h-9 px-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
        </div>
        {err && <p className="text-xs text-red-600">{err}</p>}
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={onCancel}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-600 bg-white hover:bg-gray-50">
            <X className="h-3.5 w-3.5" />Cancelar
          </button>
          <button type="button" onClick={save} disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
            <Save className="h-3.5 w-3.5" />{isSaving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    );
  };

interface Slot { id?: number; idx?: number; diaSemana: DiaSemana; horaInicio: string; horaFin: string; }

const DiaBlock: React.FC<{
  dia: DiaSemana; label: string; slots: Slot[]; allSlots: Slot[]; editingKey: string | null;
  onEdit: (k: string, s: Slot) => void; onDelete: (s: Slot) => void;
  onSaveEdit: (k: string, d: FormData) => void; onCancelEdit: () => void; isSaving: boolean;
}> = ({ dia, label, slots, allSlots, editingKey, onEdit, onDelete, onSaveEdit, onCancelEdit, isSaving }) => (
  <div className={`border rounded-lg overflow-hidden ${DIA_COLORS[dia]}`}>
    <div className="px-3 py-2 flex items-center gap-2">
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DIA_BADGE[dia]}`}>{label}</span>
      <span className="text-xs text-gray-500">{slots.length} horario{slots.length !== 1 ? "s" : ""}</span>
    </div>
    <div className="px-3 pb-3 space-y-2">
      {slots.map(slot => {
        const key = slot.id != null ? `id-${slot.id}` : `idx-${slot.idx}`;
        return editingKey === key ? (
          <RowForm key={key}
            initial={{ diaSemana: slot.diaSemana, horaInicio: slot.horaInicio, horaFin: slot.horaFin }}
            existingSlots={allSlots}
            excludeId={slot.id}
            onSave={d => onSaveEdit(key, d)} onCancel={onCancelEdit} isSaving={isSaving} />
        ) : (
          <div key={key} className="flex items-center justify-between bg-white rounded-md px-3 py-2 border border-gray-200">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-3.5 w-3.5 text-gray-400 shrink-0" />
              <span className="font-medium text-gray-800">{formatear12h(slot.horaInicio)} - {formatear12h(slot.horaFin)}</span>
            </div>
            <div className="flex gap-1">
              <button type="button" onClick={() => onEdit(key, slot)}
                className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-600" title="Editar">
                <Edit className="h-3.5 w-3.5" />
              </button>
              <button type="button" onClick={() => onDelete(slot)}
                className="p-1.5 rounded hover:bg-red-50 text-gray-500 hover:text-red-600" title="Eliminar">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export const DisponibilidadManager: React.FC<{ cubiculoId: number }> = ({ cubiculoId }) => {
  const qc = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [editKey, setEditKey] = useState<string | null>(null);
  const qKey = ["disponibilidades", cubiculoId];

  const { data: disps = [], isLoading } = useQuery({
    queryKey: qKey,
    queryFn: () => authAPI.disponibilidades.getByCubiculo(cubiculoId).then(r => r.data),
  });

  const createM = useMutation({
    mutationFn: (d: DisponibilidadCreateRequestDTO[]) => authAPI.disponibilidades.create(cubiculoId, d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: qKey }); setShowAdd(false); toast.success("Disponibilidad agregada"); },
    onError: (e: any) => toast.error(e.response?.data?.message ?? "Error al agregar"),
  });

  const updateM = useMutation({
    mutationFn: ({ id, data }: { id: number; data: DisponibilidadCreateRequestDTO }) =>
      authAPI.disponibilidades.update(cubiculoId, id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: qKey }); setEditKey(null); toast.success("Disponibilidad actualizada"); },
    onError: (e: any) => toast.error(e.response?.data?.message ?? "Error al actualizar"),
  });

  const deleteM = useMutation({
    mutationFn: (id: number) => authAPI.disponibilidades.delete(cubiculoId, id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: qKey }); toast.success("Eliminada"); },
    onError: (e: any) => toast.error(e.response?.data?.message ?? "Error al eliminar"),
  });

  const deleteAllM = useMutation({
    mutationFn: () => authAPI.disponibilidades.deleteAll(cubiculoId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: qKey }); toast.success("Todos los horarios eliminados"); },
    onError: (e: any) => toast.error(e.response?.data?.message ?? "Error"),
  });

  const porDia = DIAS.map(d => ({
    ...d,
    slots: disps.map(s => ({ id: s.id, diaSemana: s.diaSemana, horaInicio: s.horaInicio, horaFin: s.horaFin }))
      .filter(s => s.diaSemana === d.value),
  })).filter(d => d.slots.length > 0);

  if (isLoading) return (
    <div className="py-6 flex items-center justify-center gap-2 text-gray-500 text-sm">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />Cargando...
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Calendar className="h-4 w-4 text-blue-600" />
          <span>{disps.length > 0 ? `${disps.length} horario${disps.length !== 1 ? "s" : ""} configurado${disps.length !== 1 ? "s" : ""}` : "Sin horarios"}</span>
        </div>
        <div className="flex gap-2">
          {disps.length > 0 && (
            <button type="button" onClick={() => { if (confirm("Eliminar todos?")) deleteAllM.mutate(); }}
              disabled={deleteAllM.isPending}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-red-200 rounded-md text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50">
              <Trash2 className="h-3.5 w-3.5" />Limpiar todo
            </button>
          )}
          <button type="button" onClick={() => { setShowAdd(true); setEditKey(null); }}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-blue-300 rounded-md text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100">
            <Plus className="h-3.5 w-3.5" />Agregar horario
          </button>
        </div>
      </div>

      {showAdd && <RowForm onSave={d => createM.mutate([d])} existingSlots={disps} onCancel={() => setShowAdd(false)} isSaving={createM.isPending} />}

      {disps.length === 0 && !showAdd ? (
        <div className="py-8 text-center border border-dashed border-gray-200 rounded-lg">
          <Clock className="mx-auto h-8 w-8 text-gray-300 mb-2" />
          <p className="text-sm text-gray-500">No hay horarios configurados</p>
          <button type="button" onClick={() => setShowAdd(true)} className="mt-2 text-xs text-blue-600 hover:underline">
            Agregar el primer horario
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {porDia.map(({ value: dia, label, slots }) => (
            <DiaBlock key={dia} dia={dia} label={label} slots={slots} allSlots={disps} editingKey={editKey}
              onEdit={key => { setEditKey(key); setShowAdd(false); }}
              onDelete={slot => { if (slot.id != null) deleteM.mutate(slot.id); }}
              onSaveEdit={(_, data) => { const s = slots.find(x => `id-${x.id}` === editKey); if (s?.id != null) updateM.mutate({ id: s.id, data }); }}
              onCancelEdit={() => setEditKey(null)}
              isSaving={updateM.isPending} />
          ))}
        </div>
      )}
    </div>
  );
};

export const DisponibilidadInlineEditor: React.FC<{
  value: DisponibilidadCreateRequestDTO[];
  onChange: (v: DisponibilidadCreateRequestDTO[]) => void;
}> = ({ value, onChange }) => {
  const [showForm, setShowForm] = useState(false);
  const [editKey, setEditKey] = useState<string | null>(null);

  const porDia = DIAS.map(d => ({
    ...d,
    slots: value.map((s, idx) => ({ ...s, idx })).filter(s => s.diaSemana === d.value),
  })).filter(d => d.slots.length > 0);

  const add = (d: FormData) => { onChange([...value, d]); setShowForm(false); };
  const update = (idx: number, d: FormData) => { const n = [...value]; n[idx] = d; onChange(n); setEditKey(null); };
  const del = (idx: number) => onChange(value.filter((_, i) => i !== idx));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Calendar className="h-4 w-4 text-blue-600" />
          <span>{value.length > 0 ? `${value.length} horario${value.length !== 1 ? "s" : ""}` : "Sin horarios (opcional)"}</span>
        </div>
        <button type="button" onClick={() => { setShowForm(true); setEditKey(null); }}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-blue-300 rounded-md text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100">
          <Plus className="h-3.5 w-3.5" />Agregar
        </button>
      </div>

      {showForm && <RowForm onSave={add} existingSlots={value} onCancel={() => setShowForm(false)} isSaving={false} />}

      {value.length === 0 && !showForm ? (
        <div className="py-4 text-center border border-dashed border-gray-200 rounded-lg">
          <Clock className="mx-auto h-6 w-6 text-gray-300 mb-1" />
          <p className="text-xs text-gray-400">Puedes agregar horarios despues de crear el cubiculo</p>
        </div>
      ) : (
        <div className="space-y-2">
          {porDia.map(({ value: dia, label, slots }) => (
            <DiaBlock key={dia} dia={dia} label={label} slots={slots} allSlots={value.map((s, idx) => ({ ...s, idx }))} editingKey={editKey}
              onEdit={key => { setEditKey(key); setShowForm(false); }}
              onDelete={slot => { if (slot.idx != null) del(slot.idx); }}
              onSaveEdit={(_, data) => { const s = slots.find(x => `idx-${x.idx}` === editKey); if (s?.idx != null) update(s.idx, data); }}
              onCancelEdit={() => setEditKey(null)}
              isSaving={false} />
          ))}
        </div>
      )}
    </div>
  );
};
