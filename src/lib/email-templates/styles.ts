import type { Properties } from 'csstype';

const fontFamily =
  '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif';

export const section: Properties = {
  backgroundColor: '#ffffff',
};

export const container: Properties = {
  margin: '0 auto',
  padding: '20px 0 48px',
};

export const button: Properties = {
  fontFamily,
  backgroundColor: '#22C55E',
  fontWeight: 'bold' as const,
  borderRadius: '4px',
  padding: '8px 16px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
};

export const text: Properties = {
  fontFamily,
  fontSize: '16px',
  lineHeight: '26px',
};

export const hr: Properties = {
  borderColor: '#cccccc',
  margin: '20px 0',
};

export const footer: Properties = {
  fontFamily,
  color: '#8898aa',
  fontSize: '12px',
};

export const verificationCode: Properties = {
  fontFamily,
  backgroundColor: '#eeeeee',
  border: '1px solid #dddddd',
  fontSize: '32px',
  fontWeight: 'bold' as const,
  maxWidth: '200px',
  textAlign: 'center' as const,
  padding: '16px',
  color: '#000000',
  letterSpacing: '8px',
};
