import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCameras, getCamera, createCamera, updateCamera, deleteCamera } from "@/api/cameras";
import type { Camera, CameraPayload } from "@/types";

const CAMERAS_KEY = ["cameras"];

// TODO: Remove dummy data when backend is connected
const DEV_DUMMY_DATA = true;

const dummyCameras: Camera[] = [
  {
    ID: 1,
    CreatedAt: "2025-09-15T10:00:00Z",
    UpdatedAt: "2025-09-15T10:00:00Z",
    brand: "Nikon",
    camera_model: "FM2",
    camera_format: "35mm",
    year: 1982,
    serial_number: "N8205412",
    notes: "Fully mechanical, works without battery. Titanium shutter. My daily shooter.",
    image_url: null,
    user_id: 1,
  },
  {
    ID: 2,
    CreatedAt: "2025-10-02T14:30:00Z",
    UpdatedAt: "2025-10-02T14:30:00Z",
    brand: "Canon",
    camera_model: "AE-1 Program",
    camera_format: "35mm",
    year: 1981,
    serial_number: null,
    notes: "Classic beginner film camera. Aperture priority and program mode.",
    image_url: null,
    user_id: 1,
  },
  {
    ID: 3,
    CreatedAt: "2025-11-20T09:15:00Z",
    UpdatedAt: "2025-11-20T09:15:00Z",
    brand: "Hasselblad",
    camera_model: "500C/M",
    camera_format: "120mm",
    year: 1970,
    serial_number: "UH41982",
    notes: "Medium format workhorse. Paired with Planar 80mm f/2.8.",
    image_url: null,
    user_id: 1,
  },
  {
    ID: 4,
    CreatedAt: "2025-12-05T18:45:00Z",
    UpdatedAt: "2025-12-05T18:45:00Z",
    brand: "Leica",
    camera_model: "M6",
    camera_format: "35mm",
    year: 1984,
    serial_number: "L1740625",
    notes: "Brass top plate version with 0.72x viewfinder. Built-in light meter.",
    image_url: null,
    user_id: 1,
  },
  {
    ID: 5,
    CreatedAt: "2026-01-10T11:00:00Z",
    UpdatedAt: "2026-01-10T11:00:00Z",
    brand: "Mamiya",
    camera_model: "RB67 Pro S",
    camera_format: "120mm",
    year: 1974,
    serial_number: null,
    notes: "Rotating back design. Amazing for portraits in 6x7 format.",
    image_url: null,
    user_id: 1,
  },
];

export function useCameras() {
  return useQuery({
    queryKey: CAMERAS_KEY,
    queryFn: DEV_DUMMY_DATA ? () => Promise.resolve(dummyCameras) : getCameras,
  });
}

export function useCamera(id: number) {
  return useQuery({
    queryKey: [...CAMERAS_KEY, id],
    queryFn: DEV_DUMMY_DATA
      ? () => {
          const found = dummyCameras.find((c) => c.ID === id);
          return found ? Promise.resolve(found) : Promise.reject(new Error("Camera not found"));
        }
      : () => getCamera(id),
    enabled: !!id,
  });
}

export function useCreateCamera() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CameraPayload) => createCamera(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMERAS_KEY });
    },
  });
}

export function useUpdateCamera() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CameraPayload }) =>
      updateCamera(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMERAS_KEY });
    },
  });
}

export function useDeleteCamera() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCamera(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMERAS_KEY });
    },
  });
}
