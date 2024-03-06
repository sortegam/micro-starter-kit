export function generateRandomString(length: number = 6, chars = '0123456789') {
  let result = '';
  for (let i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
