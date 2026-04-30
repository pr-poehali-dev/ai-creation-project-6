import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

type Theme = "light" | "dark";
type Tab = "chat" | "settings";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
  time: string;
}

const AI_REPLIES = [
  "Конечно, я помогу тебе с этим! Расскажи подробнее, что именно нужно сделать?",
  "Отличный вопрос! Давай разберём это вместе. Вот что я думаю по этому поводу...",
  "Понял тебя. Для этой задачи есть несколько подходов — давай выберем лучший.",
  "Интересная идея! Я уже анализирую варианты решения для тебя.",
  "Готово! Вот что удалось найти по твоему запросу. Нужны подробности?",
];

function getTime() {
  return new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "ai",
    text: "Привет! Я твой личный ИИ-ассистент. Спрашивай всё что угодно — помогу с задачами, ответами, идеями и многим другим ✨",
    time: getTime(),
  },
];

export default function Index() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [tab, setTab] = useState<Tab>("chat");
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text,
      time: getTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: AI_REPLIES[Math.floor(Math.random() * AI_REPLIES.length)],
        time: getTime(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const fontSizeClass = fontSize === "small" ? "text-sm" : fontSize === "large" ? "text-lg" : "text-base";

  return (
    <div className="min-h-screen bg-background bg-mesh flex items-center justify-center p-4 transition-colors duration-500">
      <div className="w-full max-w-sm h-[812px] flex flex-col rounded-[40px] overflow-hidden shadow-2xl neon-glow relative border border-border/50">
        
        {/* Status bar */}
        <div className="glass px-6 pt-4 pb-2 flex items-center justify-between shrink-0 z-10">
          <span className="text-xs font-mono text-muted-foreground">9:41</span>
          <div className="flex items-center gap-1">
            <Icon name="Signal" size={14} className="text-muted-foreground" />
            <Icon name="Wifi" size={14} className="text-muted-foreground" />
            <Icon name="Battery" size={14} className="text-muted-foreground" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {tab === "chat" && (
            <ChatScreen
              messages={messages}
              isTyping={isTyping}
              input={input}
              setInput={setInput}
              onSend={sendMessage}
              onKeyDown={handleKeyDown}
              inputRef={inputRef}
              messagesEndRef={messagesEndRef}
              fontSizeClass={fontSizeClass}
            />
          )}
          {tab === "settings" && (
            <SettingsScreen
              theme={theme}
              setTheme={setTheme}
              notifications={notifications}
              setNotifications={setNotifications}
              soundEnabled={soundEnabled}
              setSoundEnabled={setSoundEnabled}
              fontSize={fontSize}
              setFontSize={setFontSize}
            />
          )}
        </div>

        {/* Bottom nav */}
        <div className="glass px-4 pb-6 pt-3 shrink-0 z-10">
          <div className="flex items-center justify-around">
            <NavButton
              icon="MessageCircle"
              label="Чат"
              active={tab === "chat"}
              onClick={() => setTab("chat")}
            />
            <NavButton
              icon="Settings2"
              label="Настройки"
              active={tab === "settings"}
              onClick={() => setTab("settings")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function NavButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`nav-tab flex flex-col items-center gap-1 px-6 py-2 rounded-2xl ${
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon name={icon} size={22} />
      <span className="text-[11px] font-medium">{label}</span>
      {active && (
        <div className="w-1 h-1 rounded-full bg-primary" />
      )}
    </button>
  );
}

function ChatScreen({
  messages,
  isTyping,
  input,
  setInput,
  onSend,
  onKeyDown,
  inputRef,
  messagesEndRef,
  fontSizeClass,
}: {
  messages: Message[];
  isTyping: boolean;
  input: string;
  setInput: (v: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  fontSizeClass: string;
}) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="glass px-5 py-3 flex items-center gap-3 border-b border-border/30 shrink-0">
        <div className="relative">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center animate-pulse-ring">
            <span className="text-lg">✦</span>
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-background" />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm text-foreground">ИИ Ассистент</div>
          <div className="text-xs text-emerald-500 font-medium">Онлайн · всегда готов помочь</div>
        </div>
        <button className="w-8 h-8 rounded-xl bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors">
          <Icon name="MoreHorizontal" size={16} className="text-muted-foreground" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={msg.id}
            className={`flex animate-fade-up ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {msg.role === "ai" && (
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center mr-2 mt-auto shrink-0">
                <span className="text-xs">✦</span>
              </div>
            )}
            <div className="max-w-[75%]">
              <div
                className={`px-4 py-3 ${fontSizeClass} leading-relaxed ${
                  msg.role === "user" ? "msg-bubble-user" : "msg-bubble-ai text-foreground"
                }`}
              >
                {msg.text}
              </div>
              <div className={`text-[10px] text-muted-foreground mt-1 ${msg.role === "user" ? "text-right" : "text-left"} px-1`}>
                {msg.time}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-end gap-2 animate-fade-up">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center shrink-0">
              <span className="text-xs">✦</span>
            </div>
            <div className="msg-bubble-ai px-4 py-3">
              <div className="flex gap-1 items-center h-4">
                <div className="typing-dot w-2 h-2 rounded-full bg-primary" />
                <div className="typing-dot w-2 h-2 rounded-full bg-primary" />
                <div className="typing-dot w-2 h-2 rounded-full bg-primary" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-3 shrink-0">
        <div className="glass rounded-2xl flex items-end gap-2 p-2 neon-glow">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Напишите сообщение..."
            rows={1}
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground resize-none outline-none text-sm px-2 py-2 max-h-24 leading-relaxed"
            style={{ minHeight: "36px" }}
          />
          <button
            onClick={onSend}
            disabled={!input.trim()}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 ${
              input.trim()
                ? "bg-gradient-to-br from-violet-500 to-cyan-400 text-white shadow-lg hover:scale-105 active:scale-95"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <Icon name="ArrowUp" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsScreen({
  theme,
  setTheme,
  notifications,
  setNotifications,
  soundEnabled,
  setSoundEnabled,
  fontSize,
  setFontSize,
}: {
  theme: Theme;
  setTheme: (t: Theme) => void;
  notifications: boolean;
  setNotifications: (v: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (v: boolean) => void;
  fontSize: "small" | "medium" | "large";
  setFontSize: (v: "small" | "medium" | "large") => void;
}) {
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="glass px-5 py-4 border-b border-border/30">
        <h1 className="text-lg font-bold text-foreground">Настройки</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Персонализируй приложение</p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Profile card */}
        <div className="glass rounded-3xl p-4 flex items-center gap-4 neon-glow">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-cyan-400 flex items-center justify-center text-2xl shadow-lg">
            👤
          </div>
          <div className="flex-1">
            <div className="font-bold text-foreground">Мой профиль</div>
            <div className="text-sm text-muted-foreground">Пользователь</div>
            <div className="mt-2 inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
              <Icon name="Zap" size={10} />
              <span>Pro план</span>
            </div>
          </div>
          <Icon name="ChevronRight" size={18} className="text-muted-foreground" />
        </div>

        {/* Theme */}
        <div className="glass rounded-3xl p-4 space-y-1">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-3">Оформление</div>
          <div className="flex gap-2">
            {(["light", "dark"] as Theme[]).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`flex-1 py-3 rounded-2xl flex flex-col items-center gap-2 transition-all duration-200 ${
                  theme === t
                    ? "bg-primary text-primary-foreground shadow-lg scale-[1.02]"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                <Icon name={t === "light" ? "Sun" : "Moon"} size={20} />
                <span className="text-xs font-medium">{t === "light" ? "Светлая" : "Тёмная"}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Font size */}
        <div className="glass rounded-3xl p-4">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-3">Размер текста</div>
          <div className="flex gap-2">
            {(["small", "medium", "large"] as const).map((size) => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`flex-1 py-2.5 rounded-xl transition-all duration-200 ${
                  fontSize === size
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                <div className={`font-bold ${size === "small" ? "text-sm" : size === "large" ? "text-xl" : "text-base"}`}>А</div>
                <div className="text-[9px] mt-0.5 opacity-70">
                  {size === "small" ? "Мелкий" : size === "medium" ? "Средний" : "Крупный"}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="glass rounded-3xl p-4 space-y-1">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-3">Уведомления</div>
          <ToggleRow
            icon="Bell"
            label="Push-уведомления"
            description="Получать уведомления"
            value={notifications}
            onChange={setNotifications}
          />
          <div className="h-px bg-border/40 mx-1" />
          <ToggleRow
            icon="Volume2"
            label="Звуки"
            description="Звук при сообщениях"
            value={soundEnabled}
            onChange={setSoundEnabled}
          />
        </div>

        {/* About */}
        <div className="glass rounded-3xl p-4">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-3">О приложении</div>
          <div className="space-y-2">
            {[
              { icon: "Info", label: "Версия", value: "1.0.0" },
              { icon: "Shield", label: "Политика конфиденциальности", value: "" },
              { icon: "FileText", label: "Условия использования", value: "" },
            ].map((item) => (
              <button key={item.label} className="w-full flex items-center gap-3 py-2 px-1 rounded-xl hover:bg-muted/30 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-muted/50 flex items-center justify-center">
                  <Icon name={item.icon} size={15} className="text-muted-foreground" />
                </div>
                <span className="flex-1 text-sm text-foreground text-left">{item.label}</span>
                {item.value ? (
                  <span className="text-xs text-muted-foreground font-mono">{item.value}</span>
                ) : (
                  <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="h-4" />
      </div>
    </div>
  );
}

function ToggleRow({
  icon,
  label,
  description,
  value,
  onChange,
}: {
  icon: string;
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 py-2 px-1">
      <div className="w-8 h-8 rounded-xl bg-muted/50 flex items-center justify-center shrink-0">
        <Icon name={icon} size={15} className="text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-12 h-6 rounded-full transition-all duration-300 relative shrink-0 ${
          value ? "bg-primary" : "bg-muted"
        }`}
      >
        <div
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${
            value ? "left-6" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}
