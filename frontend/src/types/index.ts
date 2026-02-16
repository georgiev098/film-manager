// ─── Auth ───────────────────────────────────────────

export interface BaseModel {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface User extends BaseModel {
  username: string;
  email: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
}

// ─── Camera ─────────────────────────────────────────
export type CameraFormat = "35mm" | "120mm";

export interface Camera extends BaseModel {
  brand: string;
  camera_model: string;
  camera_format: CameraFormat;
  year?: number | null;
  serial_number?: string | null;
  notes?: string | null;
  image_url?: string | null;
  user_id: number;
}

export interface CameraPayload {
  brand: string;
  camera_model: string;
  camera_format: CameraFormat;
  year?: number | null;
  serial_number?: string | null;
  notes?: string | null;
  image_url?: string | null;
}

// ─── Lens ───────────────────────────────────────────
export type LensType = "analog" | "digital";

export interface Lens extends BaseModel {
  manufacturer: string;
  lens_type: LensType;
  image_stabilization: boolean;
  min_focal_length: number;
  max_focal_length: number;
  min_aperture: string;
  max_aperture: string;
  mount: string;
  image_url?: string | null;
  notes?: string | null;
  user_id: number;
}

export interface LensPayload {
  manufacturer: string;
  lens_type: LensType;
  image_stabilization: boolean;
  min_focal_length: number;
  max_focal_length: number;
  min_aperture: string;
  max_aperture: string;
  mount: string;
  image_url?: string | null;
  notes?: string | null;
}
