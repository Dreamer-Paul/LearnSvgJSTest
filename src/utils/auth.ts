const TOKEN_KEY = "auth_token";

let token: string | undefined = localStorage.getItem(TOKEN_KEY) || undefined;

/**
 * 设置 token
 * @param newToken 新的 token
 */
export function setToken(newToken: string) {
  token = newToken;
  localStorage.setItem(TOKEN_KEY, newToken);
}

/**
 * 获取 token
 * @returns 当前的 token
 */
export function getToken() {
  return token;
}

/**
 * 清除 token
 */
export function clearToken() {
  token = undefined;
  localStorage.removeItem(TOKEN_KEY);
}
