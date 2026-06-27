import { BASE_URL } from "./API_handler";
export const isAUTH = async () => {
  try {
    // 1. Hit your newly finished backend route
    // CRITICAL: { credentials: 'include' } tells the browser to actually send the HTTP cookies along with the request
    const response = await fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', 
    });

    // 2. If the server returned 401 Unauthorized or any other error status
    if (!response.ok) {
      return { authenticated: false, user: null };
    }

    // 3. If successful (200 OK), parse the data containing user payload
    const data = await response.json();
    return {
      authenticated: data.authenticated,
      user: data.user
    };

  } catch (error) {
    console.error(`Failed to request user AUTH please try again later: ${error}`);
    // Fallback safely to unauthenticated state if network fails entirely
    return { authenticated: false, user: null };
  }
};