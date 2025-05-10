import type { APIRoute } from 'astro';

// Interface defining the expected response from noit login endpoint
interface noitLoginResponse {
  token: string;
}

// POST endpoint handler for user login
export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Extract email and password from form data
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');

    // Validate required fields
    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: 'Email y contraseña son requeridos' }), 
        { status: 400 }
      );
    }

    // Call backend API to authenticate user
    const backendApiResponse = await fetch(`${import.meta.env.PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    // Handle unsuccessful login attempts
    if (!backendApiResponse.ok) {
      const errorData = await backendApiResponse.json()
        .catch(() => ({ message: 'Error de login en backend' }));
      return new Response(JSON.stringify(errorData), { status: backendApiResponse.status });
    }

    // Extract token and user data from successful response
    const { token } = await backendApiResponse.json() as noitLoginResponse;

    // Set session cookie with authentication token
    cookies.set('astro_session_token', token, {
      httpOnly: true, // Prevent JavaScript access to cookie
      secure: import.meta.env.PROD, // Only send over HTTPS in production
      path: '/', // Cookie available across all paths
      maxAge: 60 * 60 * 24 * 7, // Cookie expires in 7 days
      sameSite: 'lax', // Moderate CSRF protection
    });

    // Return success response with token and user data
    return new Response(
      JSON.stringify({ 
        message: 'Login exitoso', 
        token 
      }), 
      { status: 200 }
    );

  } catch (error) {
    // Log and handle unexpected errors
    console.error('Error en /api/auth/login:', error);
    return new Response(
      JSON.stringify({ message: 'Error interno del servidor' }), 
      { status: 500 }
    );
  }
};