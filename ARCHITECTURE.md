# Architecture du Projet

Ce document décrit l'architecture technique du portfolio.

## 🏗️ Vue d'ensemble

```
┌─────────────────────────────────────────────────────────┐
│                     UTILISATEUR                         │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   FRONTEND (React)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   Public    │  │    Admin    │  │   Contexts  │    │
│  │   Routes    │  │   Routes    │  │  (State)    │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │ Components  │  │   Services  │  │    Hooks    │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   BACKEND / API                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │  API PHP    │  │ Node.js API │  │  External   │    │
│  │  (Files)    │  │  (Optional) │  │   APIs      │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
│                                                          │
│  • EmailJS      • Google Analytics  • Supabase          │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│               INFRASTRUCTURE                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   Docker    │  │    Nginx    │  │   Storage   │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## 🎨 Frontend Architecture

### Structure des dossiers

```
src/
├── admin/              # Composants d'administration
│   ├── AdminAuth.tsx       # Authentification admin
│   ├── AdminDashboard.tsx  # Dashboard principal
│   ├── AdminRoute.tsx      # Route protégée
│   └── CustomPDFViewer.tsx # Visionneuse PDF
│
├── components/         # Composants UI réutilisables
│   ├── Header.tsx          # En-tête de navigation
│   ├── Hero.tsx            # Section hero
│   ├── About.tsx           # Section à propos
│   ├── Skills.tsx          # Graphiques de compétences
│   ├── Projects.tsx        # Showcase de projets
│   └── ...
│
├── contexts/           # Contextes React (State Management)
│   ├── LanguageContext.tsx # Gestion multilingue
│   ├── ThemeContext.tsx    # Mode clair/sombre
│   └── AdminContext.tsx    # État d'authentification
│
├── hooks/              # Hooks personnalisés
│   ├── useScrollAnimation.ts      # Animation au scroll
│   ├── useIntersectionObserver.ts # Détection de visibilité
│   └── useAdvancedAnimations.ts   # Animations complexes
│
├── pages/              # Composants de page
│   ├── HomePage.tsx
│   ├── ProjectsPage.tsx
│   ├── ContactPage.tsx
│   └── ...
│
├── services/           # Services & API clients
│   ├── adminFilesService.ts # Gestion de fichiers
│   ├── todoService.ts       # Service de todos
│   └── ...
│
├── types/              # Définitions TypeScript
│   ├── Note.ts
│   ├── Project.ts
│   ├── Experience.ts
│   └── ...
│
├── utils/              # Fonctions utilitaires
│   ├── analytics.ts        # Google Analytics
│   ├── adminFileService.ts # Helpers fichiers
│   └── ...
│
├── data/               # Données statiques
│   ├── experiences.ts
│   ├── projects.ts
│   ├── skills.ts
│   └── certifications.ts
│
├── App.tsx             # Composant racine avec routing
├── main.tsx            # Point d'entrée
└── index.css           # Styles globaux
```

### Flux de données

```
┌──────────────┐
│   User       │
│   Action     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Component  │◄──────┐
└──────┬───────┘       │
       │               │
       ▼               │
┌──────────────┐       │
│   Hook/      │       │
│   Service    │       │
└──────┬───────┘       │
       │               │
       ▼               │
┌──────────────┐       │
│   Context    │───────┘
│   Update     │
└──────────────┘
```

## 🎭 Gestion d'état

### Contextes React

1. **LanguageContext**
   - Gestion de la langue (FR/EN)
   - Persistance dans localStorage
   - Traductions dynamiques

2. **ThemeContext**
   - Mode clair/sombre
   - Persistance dans localStorage
   - Application des classes CSS

3. **AdminContext**
   - État d'authentification
   - Token management
   - Routes protégées

### Pattern de contexte

```typescript
// Définition du contexte
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr');

  // Logique...

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook personnalisé
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
```

## 🔌 Backend & API

### API PHP (Gestion de fichiers)

```
api/
├── config.php      # Configuration
├── files.php       # CRUD fichiers
├── download.php    # Téléchargement
└── preview.php     # Prévisualisation
```

**Endpoints** :
- `GET /api/files.php` - Liste des fichiers
- `POST /api/files.php` - Upload fichier
- `DELETE /api/files.php` - Suppression fichier
- `GET /api/download.php?file=xxx` - Téléchargement
- `GET /api/preview.php?file=xxx` - Prévisualisation

### API Node.js (Optionnelle)

```
api-server/
├── server.js       # Serveur Express
└── package.json
```

**Endpoints** :
- `GET /api/health` - Health check
- `POST /api/contact` - Formulaire de contact
- `GET /api/files` - Liste des fichiers

### Services externes

1. **EmailJS**
   - Envoi d'emails depuis le frontend
   - Configuration via variables d'environnement
   - Pas de backend nécessaire

2. **Google Analytics**
   - Tracking des pages vues
   - Événements personnalisés
   - Configuration gtag.js

3. **Supabase (Optionnel)**
   - Backend as a Service
   - Base de données
   - Authentification
   - Storage

## 🚀 Routing

### Structure des routes

```typescript
<Routes>
  {/* Routes publiques */}
  <Route path="/" element={<HomePage />} />
  <Route path="/projects" element={<ProjectsPage />} />
  <Route path="/experience" element={<ExperiencePage />} />
  <Route path="/contact" element={<ContactPage />} />

  {/* Routes admin protégées */}
  <Route path="/admin" element={<AdminAuth />} />
  <Route
    path="/admin/dashboard"
    element={
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    }
  />
</Routes>
```

### Protection des routes

```typescript
function AdminRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAdmin();

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
```

## 🎨 Styling Architecture

### TailwindCSS

**Configuration** : `tailwind.config.js`

```javascript
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { /* ... */ },
        secondary: { /* ... */ },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
      }
    }
  }
}
```

**Approche** :
- Utility-first avec TailwindCSS
- Classes personnalisées dans `index.css`
- Composants stylisés avec classes Tailwind
- Mode sombre via classe `dark:`

### Structure CSS

```css
/* index.css */

/* 1. Directives Tailwind */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 2. Styles globaux */
@layer base {
  body {
    @apply bg-white dark:bg-gray-900;
  }
}

/* 3. Composants personnalisés */
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-600 text-white rounded-lg;
  }
}

/* 4. Utilitaires personnalisés */
@layer utilities {
  .text-gradient {
    @apply bg-clip-text text-transparent bg-gradient-to-r;
  }
}
```

## 🔄 Build & Bundling

### Vite Configuration

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],

  // Optimisations
  optimizeDeps: {
    exclude: ['lucide-react'],
  },

  // Build
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
  },
});
```

### Build Process

```
Source Code
     │
     ▼
TypeScript Compilation
     │
     ▼
JSX → JavaScript
     │
     ▼
CSS Processing (Tailwind)
     │
     ▼
Tree Shaking
     │
     ▼
Code Splitting
     │
     ▼
Minification
     │
     ▼
dist/ folder
```

## 🐳 Infrastructure

### Docker Architecture

```
┌─────────────────────────────────────┐
│         Docker Compose              │
├─────────────────────────────────────┤
│                                     │
│  ┌──────────────┐  ┌─────────────┐│
│  │    Nginx     │  │  React App  ││
│  │  (Reverse    │◄─┤  (Static    ││
│  │   Proxy)     │  │   Files)    ││
│  └──────┬───────┘  └─────────────┘│
│         │                          │
│         ▼                          │
│  ┌──────────────┐                 │
│  │  PHP-FPM     │                 │
│  │  (API)       │                 │
│  └──────────────┘                 │
│                                     │
│  ┌──────────────┐                 │
│  │  Volumes     │                 │
│  │  (Files)     │                 │
│  └──────────────┘                 │
└─────────────────────────────────────┘
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;

    # React App (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API PHP
    location /api {
        fastcgi_pass php:9000;
        include fastcgi_params;
    }

    # Static files
    location /admin-files {
        alias /var/www/admin-files;
    }
}
```

## 🔒 Sécurité

### Architecture de sécurité

```
┌─────────────────────────────────────┐
│        Client (Browser)             │
└────────────┬────────────────────────┘
             │ HTTPS
             ▼
┌─────────────────────────────────────┐
│          Nginx (Reverse Proxy)      │
│  • Rate Limiting                    │
│  • CORS Headers                     │
│  • Security Headers                 │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│        Application Layer            │
│  • Token Validation                 │
│  • Input Sanitization               │
│  • File Type Validation             │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│          Storage / API              │
│  • Secure File Storage              │
│  • Access Control                   │
└─────────────────────────────────────┘
```

### Flux d'authentification Admin

```
User → Login Form
         │
         ▼
     Token Input
         │
         ▼
   Validate Token (Frontend)
         │
         ├─ Valid → Store in Context + Navigate to Dashboard
         │
         └─ Invalid → Show Error
```

## 📊 Performance

### Optimisations

1. **Code Splitting**
   ```typescript
   const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
   ```

2. **Image Optimization**
   - Lazy loading
   - Responsive images
   - WebP format

3. **Caching**
   - Service Worker
   - Browser caching
   - CDN

4. **Bundle Optimization**
   - Tree shaking
   - Minification
   - Compression (gzip/brotli)

## 🧪 Testing Strategy

```
┌─────────────────────────────────────┐
│          Unit Tests                 │
│  • Components                       │
│  • Hooks                            │
│  • Utils                            │
└─────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│      Integration Tests              │
│  • Context Providers                │
│  • Services                         │
│  • API Calls                        │
└─────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│         E2E Tests                   │
│  • User Flows                       │
│  • Navigation                       │
│  • Forms                            │
└─────────────────────────────────────┘
```

## 📱 Responsive Design

### Breakpoints

```
┌──────────────┬─────────────────────┐
│   Mobile     │      < 640px        │
├──────────────┼─────────────────────┤
│   Tablet     │   640px - 1024px    │
├──────────────┼─────────────────────┤
│   Desktop    │   1024px - 1280px   │
├──────────────┼─────────────────────┤
│   Large      │      > 1280px       │
└──────────────┴─────────────────────┘
```

### Mobile-First Approach

```typescript
<div className="
  w-full          // Mobile
  md:w-1/2        // Tablet
  lg:w-1/3        // Desktop
  xl:w-1/4        // Large
">
```

---

**Cette architecture évolue avec le projet. Dernière mise à jour : Janvier 2026**
