async function request(url, options) {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) {
    const errorMsg = data.message || data.error || 'Something went wrong';
    console.error("Request failed:", errorMsg, "Full response:", data);
    throw new Error(errorMsg);
  }
  return data;
}

export async function loginUser(credentials) {
  return request('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
}

export async function registerUser(userInfo) {
  const { email, username, password, role } = userInfo;

  // Create Supabase auth
  const authResponse = await request('/api/auth/register-local', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const auth_uid = authResponse.auth_uid;

  // Create database user
  const userResponse = await request('/api/auth/create-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ auth_uid, username, role }),
  });
  return userResponse;
}
