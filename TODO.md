# TODO: Lead Stage Dropdown and Convert Deal Enhancements

## Tasks
- [x] Update LeadDetailModal.tsx: Add confirmation modal to the "Convert to Deal" button using showConfirmation.
- [x] Update LeadCard.tsx: Optimize mobile view - position stage dropdown at bottom on mobile to avoid overflow, ensure texts are shortened.
- [x] Verify Supabase setup: Ensure stage column exists in leads table and RLS policies are applied.
- [x] Git commit and push changes to main branch.

## Notes
- Stage dropdown already exists in both components.
- Mobile optimization: Use Tailwind responsive classes and possibly DropdownMenu placement.
- Confirmation: Use the existing ConfirmationModal via showConfirmation from UIContext.
