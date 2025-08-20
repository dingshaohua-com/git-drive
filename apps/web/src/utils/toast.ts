export function info(msg: string, duration?: number) {
  (window as any).toast?.info(msg, duration);
}
export function success(msg: string, duration?: number) {
  (window as any).toast?.success(msg, duration);
}
export function error(msg: string, duration?: number) {
  (window as any).toast?.error(msg, duration);
} 

export default {
  info,
  success,
  error,
};