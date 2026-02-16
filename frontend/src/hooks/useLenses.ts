import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLenses, getLens, createLens, updateLens, deleteLens } from "@/api/lenses";
import type { Lens, LensPayload } from "@/types";

const LENSES_KEY = ["lenses"];

// TODO: Remove dummy data when backend is connected
const DEV_DUMMY_DATA = true;

const dummyLenses: Lens[] = [
  {
    ID: 1,
    CreatedAt: "2025-09-20T12:00:00Z",
    UpdatedAt: "2025-09-20T12:00:00Z",
    manufacturer: "Nikon",
    lens_type: "analog",
    image_stabilization: false,
    min_focal_length: 50,
    max_focal_length: 50,
    min_aperture: "f/16",
    max_aperture: "f/1.4",
    mount: "F-mount",
    image_url: null,
    notes: "Nikkor 50mm f/1.4 AI-S. Razor sharp from f/4 onwards. Beautiful bokeh.",
    user_id: 1,
  },
  {
    ID: 2,
    CreatedAt: "2025-10-05T08:30:00Z",
    UpdatedAt: "2025-10-05T08:30:00Z",
    manufacturer: "Canon",
    lens_type: "analog",
    image_stabilization: false,
    min_focal_length: 28,
    max_focal_length: 28,
    min_aperture: "f/22",
    max_aperture: "f/2.8",
    mount: "FD-mount",
    image_url: null,
    notes: "Wide angle prime. Perfect street photography companion for the AE-1.",
    user_id: 1,
  },
  {
    ID: 3,
    CreatedAt: "2025-11-20T09:30:00Z",
    UpdatedAt: "2025-11-20T09:30:00Z",
    manufacturer: "Carl Zeiss",
    lens_type: "analog",
    image_stabilization: false,
    min_focal_length: 80,
    max_focal_length: 80,
    min_aperture: "f/22",
    max_aperture: "f/2.8",
    mount: "V-mount",
    image_url: null,
    notes: "Planar T* 80mm for Hasselblad. One of the sharpest medium format lenses ever made.",
    user_id: 1,
  },
  {
    ID: 4,
    CreatedAt: "2025-12-10T16:00:00Z",
    UpdatedAt: "2025-12-10T16:00:00Z",
    manufacturer: "Voigtlander",
    lens_type: "analog",
    image_stabilization: false,
    min_focal_length: 35,
    max_focal_length: 35,
    min_aperture: "f/16",
    max_aperture: "f/1.4",
    mount: "M-mount",
    image_url: null,
    notes: "Nokton Classic 35mm. My go-to walkaround lens on the Leica M6.",
    user_id: 1,
  },
  {
    ID: 5,
    CreatedAt: "2026-01-15T10:00:00Z",
    UpdatedAt: "2026-01-15T10:00:00Z",
    manufacturer: "Nikon",
    lens_type: "digital",
    image_stabilization: true,
    min_focal_length: 70,
    max_focal_length: 200,
    min_aperture: "f/22",
    max_aperture: "f/2.8",
    mount: "Z-mount",
    image_url: null,
    notes: "Nikkor Z 70-200mm f/2.8 VR S. Incredible autofocus and sharpness.",
    user_id: 1,
  },
  {
    ID: 6,
    CreatedAt: "2026-02-01T14:00:00Z",
    UpdatedAt: "2026-02-01T14:00:00Z",
    manufacturer: "Mamiya",
    lens_type: "analog",
    image_stabilization: false,
    min_focal_length: 127,
    max_focal_length: 127,
    min_aperture: "f/32",
    max_aperture: "f/3.8",
    mount: "RB67-mount",
    image_url: null,
    notes: "Sekor C 127mm. The portrait lens for medium format. Creamy out of focus rendering.",
    user_id: 1,
  },
];

export function useLenses() {
  return useQuery({
    queryKey: LENSES_KEY,
    queryFn: DEV_DUMMY_DATA ? () => Promise.resolve(dummyLenses) : getLenses,
  });
}

export function useLens(id: number) {
  return useQuery({
    queryKey: [...LENSES_KEY, id],
    queryFn: DEV_DUMMY_DATA
      ? () => {
          const found = dummyLenses.find((l) => l.ID === id);
          return found ? Promise.resolve(found) : Promise.reject(new Error("Lens not found"));
        }
      : () => getLens(id),
    enabled: !!id,
  });
}

export function useCreateLens() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LensPayload) => createLens(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LENSES_KEY });
    },
  });
}

export function useUpdateLens() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: LensPayload }) =>
      updateLens(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LENSES_KEY });
    },
  });
}

export function useDeleteLens() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteLens(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LENSES_KEY });
    },
  });
}
