export const publicRoutes = [/^\/$/, /^\/\(public\).*/];
export const verificationCodeLength = 5;
// Max number of failed logins before deleting the auth code from db.
// This prevents brute force attacks on auth code.
export const maxNumberOfFailedLogins = 3;
export const initialPathForLoggedUsers = '/dashboard/';
