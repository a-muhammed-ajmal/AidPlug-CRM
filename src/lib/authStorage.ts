// A singleton state to hold the user's persistence choice across the app.
// It defaults to false, meaning sessions are temporary unless specified otherwise.
let rememberMe = false;

/**
 * A custom storage implementation for the Supabase client.
 * It conforms to the { getItem, setItem, removeItem } interface.
 * This allows us to dynamically switch between localStorage and sessionStorage
 * based on the user's "Remember me" preference.
 */
export const authStorage = {
  /**
   * Sets the persistence preference. This is called from the AuthContext
   * just before the sign-in attempt.
   * @param {boolean} shouldRemember - True to use localStorage, false for sessionStorage.
   */
  setPersistence(shouldRemember: boolean) {
    rememberMe = shouldRemember;
  },

  /**
   * Retrieves an item from storage. It checks both localStorage and sessionStorage
   * to ensure a session can be recovered regardless of the persistence choice
   * made during the last login.
   * @param {string} key - The key of the item to retrieve.
   * @returns {string | null} The stored value or null if not found.
   */
  getItem(key: string): string | null {
    // Supabase might call getItem before the user has logged in and set a preference.
    // In such cases, we should check both to find any existing session.
    return localStorage.getItem(key) || sessionStorage.getItem(key);
  },

  /**
   * Stores an item. Based on the 'rememberMe' flag, it uses either
   * localStorage for persistent storage or sessionStorage for temporary storage.
   * It also clears the other storage medium to prevent conflicts.
   * @param {string} key - The key for the item.
   * @param {string} value - The value to store.
   */
  setItem(key: string, value: string) {
    if (rememberMe) {
      sessionStorage.removeItem(key);
      localStorage.setItem(key, value);
    } else {
      localStorage.removeItem(key);
      sessionStorage.setItem(key, value);
    }
  },

  /**
   * Removes an item from both storage types to ensure a clean slate,
   * especially during sign-out.
   * @param {string} key - The key of the item to remove.
   */
  removeItem(key: string) {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  },
};
