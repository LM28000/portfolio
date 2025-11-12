import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AdminProvider } from './contexts/AdminContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ExperiencePage from './pages/ExperiencePage';
import SkillsPage from './pages/SkillsPage';
import ProjectsPage from './pages/ProjectsPage';
import InterestsPage from './pages/InterestsPage';
import ContactPage from './pages/ContactPage';
import AdminRoute from './admin/AdminRoute';
import AdminDashboard from './admin/AdminDashboard';
import NotesPage from './pages/NotesPage';
import TodoPage from './pages/TodoPage';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AdminProvider>
          <Router>
            <Routes>
              {/* Portfolio pages avec layout */}
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="experience" element={<ExperiencePage />} />
                <Route path="skills" element={<SkillsPage />} />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="interests" element={<InterestsPage />} />
                <Route path="contact" element={<ContactPage />} />
              </Route>
              
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
              
              {/* Système de todos sécurisé */}
              <Route 
                path="/admin/todos" 
                element={
                  <AdminRoute>
                    <TodoPage />
                  </AdminRoute>
                } 
              />
              
              {/* Redirection vers l'accueil pour les routes non trouvées */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AdminProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;