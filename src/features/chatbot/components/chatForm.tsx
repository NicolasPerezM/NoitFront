import { useMutation } from '@tanstack/react-query';
import { businessIdea } from '@/lib/api/businessIdea';
import { queryClient } from '@/lib/api/queryClient';
import { useState } from 'react';

export const ChatForm = () => {
  const [title, setTitle] = useState(''); // <--- Nuevo estado para el título
  const [message, setMessage] = useState('');

  const mutation = useMutation(
    {
      mutationFn: businessIdea,
      onSuccess: (data) => {
        console.log('✅ Session ID:', data.id);
        alert('Chat iniciado correctamente');
      },
      onError: (error: Error) => {
        alert('❌ Hay un error: ' + error.message);
      },
    },
    queryClient
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim() || !title.trim()) { // <--- Validar también el título
        alert('Por favor, ingresa un título y una descripción.');
        return;
    }

    mutation.mutate({
      title: title, // <--- Enviar el título
      description: message,
    });

    setTitle(''); // <--- Limpiar el título
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-10">
      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          Título de la Idea
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: App de Meditación Guiada"
          className="w-full border rounded px-4 py-2 mt-1"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium">
          Descripción de la Idea
        </label>
        <input
          type="text"
          id="message" // Asegúrate que los IDs coincidan con htmlFor
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ej: Quiero lanzar una marca de skincare vegano"
          className="w-full border rounded px-4 py-2 mt-1"
        />
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        {mutation.isPending ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  );
};