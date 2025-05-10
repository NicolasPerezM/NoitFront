"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { EmailInput } from "../login/EmailInput";
import { PasswordInput } from "../login/PasswordInput";
import { Header } from "../login/LoginHeader";
import { TermsFooter } from "../login/TermsFooter";
import { RegisterTitle } from "./RegisterTitle";
import { RegisterSubtitle } from "./RegisterSubtitle";
import { GoogleSignInButton } from "../login/GoogleSignInButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoginRedirect = () => {
    window.location.href = "/login";
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Registrando usuario con:", formData);
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 md:gap-8 w-full">
          <div className="grid w-full gap-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <EmailInput
            email={formData.email}
            setEmail={(email) => setFormData(prev => ({ ...prev, email }))}
            isValid={isEmailValid}
          />

          <PasswordInput 
            password={formData.password}
            setPassword={(password) => setFormData(prev => ({ ...prev, password }))}
          />

          <div className="flex flex-col gap-3 sm:gap-4">
            <Button
              type="submit"
              className="w-full text-sm sm:text-base"
            >
              REGISTRARSE
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full text-sm sm:text-base"
              onClick={handleLoginRedirect}
            >
              ¿Ya tienes cuenta? Iniciar Sesión
            </Button>
          </div>

          <div className="relative flex items-center justify-center w-full">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative z-10 bg-background px-4 text-sm text-muted-foreground">
              ó
            </div>
          </div>

          <GoogleSignInButton/>
        </form>
        <TermsFooter />
      </div>
    </div>
  );
}
