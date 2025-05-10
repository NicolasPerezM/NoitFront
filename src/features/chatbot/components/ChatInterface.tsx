"use client"

import { useState } from "react"
import { ChatInput } from "./chatInput"
import { WelcomeMessage } from "./WelcomeMessage"
import { PastProjectsSection } from "./PastProjectsSection"

export function ChatInterface() {
  const [message, setMessage] = useState("")

  const handleSendMessage = (msg: string) => {
    console.log("Mensaje enviado:", msg)
    setMessage("")
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-12">
      <div className="gradient-top-primary" />
      <WelcomeMessage />
      <ChatInput message={message} onMessageChange={setMessage} onSubmit={handleSendMessage} />
      <PastProjectsSection />
    </div>
  )
}
