import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { BeforeInstallPromptEvent } from '../../types';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      // Delay showing the prompt to ensure the page is fully loaded
      setTimeout(() => setShowPrompt(true), 1000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if app is already installed
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      setIsInstallable(false);
      setShowPrompt(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', () => {});
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      console.log(`User response: ${outcome}`);
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
    } catch (error) {
      console.error('Error during PWA installation:', error);
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  if (!showPrompt || !isInstallable) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 bg-blue-600 text-white rounded-xl shadow-lg p-4 z-40 animate-slide-up">
      <button
        onClick={() => setShowPrompt(false)}
        className="absolute top-2 right-2 p-1 hover:bg-blue-700 rounded-full"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start space-x-3">
        <div className="bg-white text-blue-600 p-2 rounded-full mt-1">
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
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-50"
          >
            Install Now
          </button>
        </div>
      </div>
    </div>
  );
}
