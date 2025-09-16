import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { AdminAuthUtils } from '../utils/adminAuth';

const AdminAuth: React.FC = () => {
  const { login } = useAdmin();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);

  // Vérifier si l'utilisateur est bloqué
  useEffect(() => {
    const blockData = localStorage.getItem('admin-login-block');
    if (blockData) {
      const { blockedUntil, attempts: storedAttempts } = JSON.parse(blockData);
      const now = Date.now();
      
      if (now < blockedUntil) {
        setIsBlocked(true);
        setBlockTimeRemaining(Math.ceil((blockedUntil - now) / 1000));
        setAttempts(storedAttempts);
      } else {
        // Débloquer
        localStorage.removeItem('admin-login-block');
      }
    }
  }, []);

  // Compte à rebours pour le déblocage
  useEffect(() => {
    if (isBlocked && blockTimeRemaining > 0) {
      const timer = setInterval(() => {
        setBlockTimeRemaining(prev => {
          if (prev <= 1) {
            setIsBlocked(false);
            setAttempts(0);
            localStorage.removeItem('admin-login-block');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isBlocked, blockTimeRemaining]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isBlocked) {
      setError(`Accès bloqué. Réessayez dans ${blockTimeRemaining} secondes.`);
      return;
    }

    if (!password.trim()) {
      setError('Veuillez saisir un mot de passe');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await login(password);
      
      if (success) {
        // Connexion réussie
        AdminAuthUtils.logSecurityEvent('login_success', 'Connexion admin réussie');
        localStorage.removeItem('admin-login-block');
        setAttempts(0);
      } else {
        // Échec de connexion
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        AdminAuthUtils.logSecurityEvent('login_failed', `Tentative ${newAttempts}/5`);
        
        if (newAttempts >= 5) {
          // Bloquer pour 15 minutes après 5 tentatives
          const blockedUntil = Date.now() + (15 * 60 * 1000);
          localStorage.setItem('admin-login-block', JSON.stringify({
            blockedUntil,
            attempts: newAttempts
          }));
          setIsBlocked(true);
          setBlockTimeRemaining(15 * 60);
          setError('Trop de tentatives échouées. Accès bloqué pour 15 minutes.');
        } else {
          setError(`Mot de passe incorrect. ${5 - newAttempts} tentatives restantes.`);
        }
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
      setPassword('');
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
      {/* Particules d'arrière-plan */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-600/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-600/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Header sécurisé */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Administration Sécurisée</h1>
          <p className="text-gray-400 text-sm">Accès restreint - Louis-Marie uniquement</p>
        </div>

        {/* Formulaire de connexion */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Mot de passe administrateur
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading || isBlocked}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-600 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  placeholder="Saisissez votre mot de passe"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading || isBlocked}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Messages d'erreur */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Informations de blocage */}
            {isBlocked && (
              <div className="flex items-center gap-2 p-3 bg-orange-900/30 border border-orange-700 rounded-lg text-orange-300 text-sm">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>Accès bloqué pour {formatTime(blockTimeRemaining)}</span>
              </div>
            )}

            {/* Tentatives restantes */}
            {attempts > 0 && !isBlocked && (
              <div className="text-center text-sm text-gray-400">
                {attempts}/5 tentatives utilisées
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || isBlocked || !password.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Vérification...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Accéder à l'administration</span>
                </>
              )}
            </button>
          </form>

          {/* Informations de sécurité */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Session sécurisée (2h max)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Chiffrement des données sensibles</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Logs de sécurité activés</span>
              </div>
            </div>
          </div>
        </div>

        {/* Warning sécurité */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>⚠️ Zone d'administration privée</p>
          <p>Toute tentative d'accès non autorisée est enregistrée</p>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;