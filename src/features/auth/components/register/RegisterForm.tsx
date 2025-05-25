// src/components/RegisterForm.tsx
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/lib/api/register";
import { queryClient } from "@/lib/api/queryClient";
import { Button } from "@/components/ui/button";
import { Header } from "../login/LoginHeader";
import { TermsFooter } from "../login/TermsFooter";
import { RegisterTitle } from "./RegisterTitle";
import { RegisterSubtitle } from "./RegisterSubtitle";
import { GoogleSignInButton } from "../login/GoogleSignInButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const RegisterForm = () => {
  const mutation = useMutation(
    {
      mutationFn: registerUser,
      onSuccess: (data) => {
        window.location.href = "/";
        console.log(data);
      },
      onError: (error: any) => {
        alert("Hay un error: " + error.message);
      },
    },
    queryClient
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    mutation.mutate({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
  };

  return (
    <div className="relative flex flex-col min-h-[550px] w-full max-w-[95%] md:max-w-md mx-auto justify-between p-4 sm:p-6 md:p-8 bg-background rounded-lg my-4 sm:my-6 md:my-auto font-montreal">
      <div className="gradient-top-left-primary" />
      <div className="relative z-10 flex flex-col justify-between w-full h-full gap-6">
        <div className="flex flex-col gap-4">
          <Header />
          <RegisterTitle />
          <RegisterSubtitle />
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 md:gap-8 w-full"
        >
          <div className="flex flex-col space-y-2 w-full">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" name="name" type="text" required />
          </div>

          <div className="flex flex-col space-y-2 w-full">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>

          <div className="flex flex-col space-y-2 w-full">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" name="password" type="password" required />
          </div>

          <div className="flex flex-col gap-3 sm:gap-4">
            <Button
              type="submit"
              className="w-full text-sm sm:text-base"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Registrando..." : "REGISTRARSE"}
            </Button>
            <a href="/login">
              <Button
                type="button"
                variant="outline"
                className="w-full text-sm sm:text-base"
              >
                ¿Ya tienes cuenta? Iniciar Sesión
              </Button>
            </a>
          </div>

          <div className="relative flex items-center justify-center w-full">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative z-10 bg-background px-4 text-sm text-muted-foreground">
              ó
            </div>
          </div>

          <GoogleSignInButton />
        </form>
        <TermsFooter />
      </div>
    </div>
  );
};

export default RegisterForm;
