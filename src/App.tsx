import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AdminProvider } from './contexts/AdminContext';
import Portfolio from './Portfolio';
import AdminRoute from './admin/AdminRoute';
import AdminDashboard from './admin/AdminDashboard';
import NotesPage from './pages/NotesPage';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AdminProvider>
          <Router>
            <Routes>
              {/* Portfolio principal */}
              <Route path="/" element={<Portfolio />} />
              
              {/* Administration sécurisée */}
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
              
              {/* Système de notes sécurisé */}
              <Route 
                path="/admin/notes" 
                element={
                  <AdminRoute>
                    <NotesPage />
                  </AdminRoute>
                } 
              />
              
              {/* Redirection vers l'accueil pour les routes non trouvées */}
              <Route path="*" element={<Portfolio />} />
            </Routes>
          </Router>
        </AdminProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;