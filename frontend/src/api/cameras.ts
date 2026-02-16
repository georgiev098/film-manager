import api from "@/lib/axios";
import type { Camera, CameraPayload } from "@/types";

export async function getCameras(): Promise<Camera[]> {
  const { data } = await api.get<Camera[]>("/cameras");
  return data;
}

export async function getCamera(id: number): Promise<Camera> {
  const { data } = await api.get<Camera>(`/cameras/${id}`);
  return data;
}

export async function createCamera(payload: CameraPayload): Promise<Camera> {
  const { data } = await api.post<Camera>("/cameras", payload);
  return data;
}

export async function updateCamera(id: number, payload: CameraPayload): Promise<Camera> {
  const { data } = await api.put<Camera>(`/cameras/${id}`, payload);
  return data;
}

export async function deleteCamera(id: number): Promise<void> {
  await api.delete(`/cameras/${id}`);
}
