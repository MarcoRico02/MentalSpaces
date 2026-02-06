import React, { useMemo, useState } from "react";
import { Search, Send, Shield } from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader";
import { Badge, Button, Card, CardContent, Input } from "../../components/ui";

type ConversationRow = {
  id: string;
  userLabel: string;
  lastMessage: string;
  updatedAt: string;
  unread?: boolean;
};

type MessageRow = {
  id: string;
  from: "me" | "other";
  text: string;
  time: string;
};

export const ChatPage: React.FC = () => {
  // Solo UI: selector de "rol" para vista diferenciada.
  const [mode, setMode] = useState<"user" | "admin">("user");
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState("c-1");

  const conversations: ConversationRow[] = [
    {
      id: "c-1",
      userLabel: "María López (maria@sati.mx)",
      lastMessage: "Hola, necesito apoyo con un pago.",
      updatedAt: "Hoy 10:22",
      unread: true,
    },
    {
      id: "c-2",
      userLabel: "Juan Pérez (juan@sati.mx)",
      lastMessage: "¿Dónde subo mi documentación?",
      updatedAt: "Ayer 19:10",
    },
  ];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(
      (c) =>
        c.userLabel.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q),
    );
  }, [search]);

  const messages: MessageRow[] = [
    { id: "m1", from: "other", text: "Hola, ¿me ayudas?", time: "10:20" },
    {
      id: "m2",
      from: "me",
      text: "Claro, dime qué necesitas.\n\n(Interfaz en tiempo real por WebSocket - demo)",
      time: "10:21",
    },
    {
      id: "m3",
      from: "other",
      text: "No puedo completar un pago pendiente.",
      time: "10:22",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mensajería Interna"
        description="Chat en tiempo real entre usuarios y administradores (maqueta)."
        right={
          <div className="flex gap-2">
            <Button
              variant={mode === "user" ? "primary" : "secondary"}
              onClick={() => setMode("user")}
            >
              Vista usuario
            </Button>
            <Button
              variant={mode === "admin" ? "primary" : "secondary"}
              onClick={() => setMode("admin")}
            >
              <Shield className="h-4 w-4 mr-2" />
              Vista admin
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Inbox (solo admin) */}
        {mode === "admin" ? (
          <Card className="lg:col-span-1">
            <CardContent className="p-4 space-y-3">
              <div className="relative">
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar conversaciones..."
                  className="pl-9"
                />
              </div>

              <div className="space-y-2">
                {filtered.map((c) => {
                  const active = c.id === activeId;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setActiveId(c.id)}
                      className={`w-full text-left rounded-md border p-3 transition-colors ${
                        active
                          ? "border-blue-200 bg-blue-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-medium text-gray-900">
                          {c.userLabel}
                        </div>
                        {c.unread && <Badge variant="warning">Nuevo</Badge>}
                      </div>
                      <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {c.lastMessage}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {c.updatedAt}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Chat thread */}
        <Card className={mode === "admin" ? "lg:col-span-2" : "lg:col-span-3"}>
          <CardContent className="p-0">
            <div className="border-b border-gray-100 p-4">
              <div className="font-semibold text-gray-900">
                {mode === "admin"
                  ? "Conversación activa (usuario seleccionado)"
                  : "Tu conversación con el administrador"}
              </div>
              <div className="text-sm text-gray-600">
                Indicador “escribiendo...” · WebSocket: chat:nuevoMensaje (demo)
              </div>
            </div>

            <div className="p-4 h-[420px] overflow-y-auto space-y-3 bg-gray-50">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm shadow-sm ${
                      m.from === "me"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-900 border border-gray-200"
                    }`}
                  >
                    <div className="whitespace-pre-line">{m.text}</div>
                    <div
                      className={`mt-1 text-[11px] ${
                        m.from === "me" ? "text-white/80" : "text-gray-500"
                      }`}
                    >
                      {m.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 p-4 bg-white">
              <div className="flex gap-2">
                <Input placeholder="Escribe un mensaje..." />
                <Button className="shrink-0">
                  <Send className="h-4 w-4 mr-2" />
                  Enviar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
