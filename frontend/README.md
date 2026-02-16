src/
├── api/                    # Raw HTTP functions
│   ├── auth.ts             # login, register, logout, getMe
│   ├── cameras.ts          # CRUD for cameras
│   └── lenses.ts           # CRUD for lenses
├── hooks/                  # React Query hooks
│   ├── useAuth.ts          # Re-exports from auth context
│   ├── useCameras.ts       # useCameras, useCreateCamera, useDeleteCamera, etc.
│   └── useLenses.ts        # useLenses, useCreateLens, useDeleteLens, etc.
├── pages/                  # Route-level pages
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx
│   ├── CamerasPage.tsx
│   ├── LensesPage.tsx
│   ├── AddCameraPage.tsx
│   └── AddLensPage.tsx
├── components/             # Reusable UI
│   ├── Navbar.tsx          # Responsive nav with mobile menu
│   ├── CameraCard.tsx      # Camera display card
│   ├── LensCard.tsx        # Lens display card
│   ├── EmptyState.tsx      # Empty collection state
│   └── ProtectedRoute.tsx  # Auth guard
├── layouts/                # Layout wrappers
│   ├── MainLayout.tsx      # App shell with Navbar
│   └── AuthLayout.tsx      # Split-panel auth layout
├── router/                 # Router config
│   └── index.tsx           # All routes defined here
├── lib/                    # Helpers
│   ├── axios.ts            # Configured axios instance with cookie auth + 401 interceptor
│   ├── auth-context.tsx    # AuthProvider + useAuth context
│   └── utils.ts            # cn(), formatDate(), focalLengthDisplay()
├── types/
│   └── index.ts            # Camera, Lens, User, and payload types (matching your Go models)
├── index.css               # Dark photography theme with amber/orange accent
└── main.tsx                # Entry: QueryClientProvider + BrowserRouter + AuthProvider + DevTools