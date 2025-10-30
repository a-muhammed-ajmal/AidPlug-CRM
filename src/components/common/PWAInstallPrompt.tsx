import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { BeforeInstallPromptEvent } from '../../types';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia(
      '(display-mode: standalone)'
    ).matches;
    const isInWebAppiOS =
      (window.navigator as { standalone?: boolean }).standalone === true;

    if (isStandalone || isInWebAppiOS) {
      console.log('[PWA] App is already installed');
      return;
    }

    const handler = (e: Event) => {
      console.log('[PWA] beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      // Delay showing the prompt to ensure the page is fully loaded
      setTimeout(() => {
        console.log('[PWA] Showing install prompt');
        setShowPrompt(true);
      }, 2000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if app is already installed
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App was installed');
      setIsInstallable(false);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    // Log for debugging
    console.log('[PWA] Install prompt listener registered');

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      console.warn('[PWA] No deferred prompt available');
      return;
    }

    try {
      console.log('[PWA] Showing install prompt to user');
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      console.log(`[PWA] User response: ${outcome}`);
      if (outcome === 'accepted') {
        console.log('[PWA] User accepted the install prompt');
      } else {
        console.log('[PWA] User dismissed the install prompt');
      }
    } catch (error) {
      console.error('[PWA] Error during installation:', error);
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    console.log('[PWA] User dismissed install banner');
    setShowPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Don't show if user dismissed in this session
  useEffect(() => {
    const dismissed = sessionStorage.getItem('pwa-prompt-dismissed');
    if (dismissed === 'true') {
      setShowPrompt(false);
    }
  }, []);

  if (!showPrompt || !isInstallable) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 bg-blue-600 text-white rounded-xl shadow-lg p-4 z-40 animate-slide-up">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 hover:bg-blue-700 rounded-full transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start space-x-3">
        <div className="bg-white text-blue-600 p-2 rounded-full mt-1 flex-shrink-0">
          <Download className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-1">Install AidPlug CRM</h3>
          <p className="text-sm text-blue-100 mb-3">
            For quick access and a better experience, install our app on your
            device.
          </p>
          <button
            onClick={handleInstall}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors"
          >
            Install Now
          </button>
        </div>
      </div>
    </div>
  );
}
