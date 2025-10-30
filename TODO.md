# TODO: Fix Fast Refresh Issue by Separating useAuth Hook

## Steps to Complete:
- [ ] Create new file `src/hooks/useAuth.ts` to export the `useAuth` hook
- [ ] Update `src/contexts/AuthContext.tsx` to export the AuthContext and remove useAuth export
- [ ] Update imports in the following files to import useAuth from `src/hooks/useAuth`:
  - [ ] src/hooks/useUserProfile.ts
  - [ ] src/hooks/useUserPreferences.ts
  - [ ] src/hooks/useTasks.ts
  - [ ] src/hooks/useSalesCycle.ts
  - [ ] src/hooks/useDeals.ts
  - [ ] src/hooks/createCrudHooks.ts
  - [ ] src/contexts/UIContext.tsx
  - [ ] src/components/tasks/AddTaskModal.tsx
  - [ ] src/components/leads/AddLeadModal.tsx
  - [ ] src/components/deals/DealsPage.tsx
  - [ ] src/components/clients/AddClientModal.tsx
  - [ ] src/components/auth/ProtectedRoute.tsx
  - [ ] src/components/auth/SignupPage.tsx
  - [ ] src/components/auth/ResetPasswordPage.tsx
  - [ ] src/components/account/EditProfilePage.tsx
  - [ ] src/components/auth/LoginPage.tsx
  - [ ] src/components/account/AccountPage.tsx
  - [ ] src/components/auth/ForgotPasswordPage.tsx
  - [ ] src/components/account/AccountModal.tsx
  - [ ] src/components/auth/EmailConfirmationPage.tsx
  - [ ] src/components/auth/AuthCallbackHandler.tsx
- [ ] Verify that all changes are correct and Fast Refresh works
