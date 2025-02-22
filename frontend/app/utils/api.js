const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const loginUser = async (credentials) => {
  const res = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to login");
  }

  return res.json(); // Returns { message, email }
};

export const verifyOTP = async (otpData) => {
  const res = await fetch(`${BASE_URL}/users/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(otpData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "OTP verification failed");
  }

  return res.json(); // Returns { message, user, accessToken, refreshToken }
};
