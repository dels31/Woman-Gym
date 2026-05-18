# Firebase Security Specification

## Data Invariants
1. A schedule can only be created, updated, or deleted by an Admin.
2. Admins are defined in the `/admins/{uid}` collection.
3. Anyone can read the schedules list to see the class schedule.

## The Dirty Dozen Payloads
1. Creation with invalid schema: `uid` adding ghost field.
2. Update with invalid type: `time != string`.
3. Not admin trying to create.
4. Not admin trying to delete.
5. Not admin trying to update.
6. Admin updating `createdAt` during update.
7. Creation with invalid duration string size.
8. Creation missing fields.
9. ID poisoning during update (long ID).
10. Spoofing admin check (without actual doc).

## Helper definitions
- `isAdmin()`
- `isValidSchedule()`
