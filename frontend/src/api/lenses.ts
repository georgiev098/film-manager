import api from "@/lib/axios";
import type { Lens, LensPayload } from "@/types";

export async function getLenses(): Promise<Lens[]> {
  const { data } = await api.get<Lens[]>("/lenses");
  return data;
}

export async function getLens(id: number): Promise<Lens> {
  const { data } = await api.get<Lens>(`/lenses/${id}`);
  return data;
}

export async function createLens(payload: LensPayload): Promise<Lens> {
  const { data } = await api.post<Lens>("/lenses", payload);
  return data;
}

export async function updateLens(id: number, payload: LensPayload): Promise<Lens> {
  const { data } = await api.put<Lens>(`/lenses/${id}`, payload);
  return data;
}

export async function deleteLens(id: number): Promise<void> {
  await api.delete(`/lenses/${id}`);
}
