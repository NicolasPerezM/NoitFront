type BusinessIdeaInput = {
    title?: string;
    description: string;
    website_url?: string;
  };
  type BusinessIdeaResponse = {
    title: string,
    description: string,
    website_url: string,
    id: string,
    user_id: string,
    created_at: string,
    updated_at: string,
  };
  
  export async function businessIdea(input: BusinessIdeaInput): Promise<BusinessIdeaResponse> {
    const response = await fetch('/api/chat/businessIdea', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al iniciar el chat');
    }
  
    return await response.json();
  }
  