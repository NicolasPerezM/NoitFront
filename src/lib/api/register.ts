export const registerUser = async ({email, password}: {
  email: string;
  password: string;
}) => {
  try {
    const res = await fetch('https://noit.com.co/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email, password}),
    });

    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || 'Error al registrar usuario');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error inesperado al registrar usuario');
  }
};
  

  