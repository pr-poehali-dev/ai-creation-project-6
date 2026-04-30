import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

type Theme = "light" | "dark";
type Tab = "chat" | "settings";

type MsgType = "text" | "app_building" | "app_preview" | "app_exporting" | "app_done";

interface AppProject {
  name: string;
  color: string;
  icon: string;
  prompt: string;
}

interface Message {
  id: string;
  role: "user" | "ai";
  type: MsgType;
  text?: string;
  time: string;
  app?: AppProject;
  progress?: number;
}

const APP_KEYWORDS = ["создай приложение", "сделай приложение", "создать приложение", "сделать приложение", "напиши приложение", "разработай приложение", "create app", "build app"];

const GRADIENTS = [
  "from-violet-500 to-cyan-400",
  "from-orange-500 to-pink-500",
  "from-blue-500 to-emerald-400",
  "from-rose-500 to-orange-400",
  "from-green-500 to-teal-400",
];
const ICONS = ["🚀", "⚡", "✨", "🎯", "💎", "🌟", "🔥", "🎨"];

function getTime() {
  return new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

function detectAppRequest(text: string): boolean {
  return APP_KEYWORDS.some((kw) => text.toLowerCase().includes(kw));
}

function generateAppName(prompt: string): string {
  const words = prompt.toLowerCase();
  if (words.includes("магазин") || words.includes("shop")) return "ShopAI";
  if (words.includes("задач") || words.includes("task")) return "TaskFlow";
  if (words.includes("фитнес") || words.includes("трениров")) return "FitPro";
  if (words.includes("дневник") || words.includes("заметк")) return "NoteAI";
  if (words.includes("еда") || words.includes("ресторан")) return "FoodApp";
  if (words.includes("музык")) return "MusicAI";
  if (words.includes("финанс") || words.includes("деньг")) return "FinTrack";
  const names = ["MyApp", "QuickApp", "AiApp", "SmartApp", "FlowApp"];
  return names[Math.floor(Math.random() * names.length)];
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "ai",
    type: "text",
    text: "Привет! Я твой ИИ-ассистент 👋\n\nМогу отвечать на вопросы, помогать с задачами — и создавать мобильные приложения прямо здесь.\n\nПопробуй написать: «Создай приложение для трекинга привычек»",
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
  const [previewApp, setPreviewApp] = useState<AppProject | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, previewApp]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", type: "text", text, time: getTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    if (detectAppRequest(text)) {
      handleAppRequest(text);
    } else {
      setIsTyping(true);
      setTimeout(() => {
        const replies = [
          "Конечно, помогу! Расскажи подробнее?",
          "Хороший вопрос. Вот что я думаю по этому поводу...",
          "Понял. Для этой задачи есть несколько подходов — давай выберем лучший.",
          "Отличная идея! Уже анализирую варианты для тебя.",
          "Готово! Нужны подробности?",
        ];
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          role: "ai", type: "text",
          text: replies[Math.floor(Math.random() * replies.length)],
          time: getTime(),
        }]);
        setIsTyping(false);
      }, 1200 + Math.random() * 800);
    }
  };

  const handleAppRequest = (prompt: string) => {
    const appData: AppProject = {
      name: generateAppName(prompt),
      color: GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)],
      icon: ICONS[Math.floor(Math.random() * ICONS.length)],
      prompt,
    };

    // AI reply: "начинаю"
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        role: "ai", type: "text",
        text: `Принял! Создаю приложение «${appData.name}» по твоему описанию. Это займёт несколько секунд ⚙️`,
        time: getTime(),
      }]);
    }, 600);

    // building card появляется
    const buildId = (Date.now() + 10).toString();
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        id: buildId,
        role: "ai", type: "app_building",
        time: getTime(),
        app: appData,
        progress: 0,
      }]);
    }, 1400);

    // animate progress
    let prog = 0;
    const iv = setInterval(() => {
      prog += Math.random() * 14;
      if (prog >= 100) {
        prog = 100;
        clearInterval(iv);
        // replace card with preview
        setTimeout(() => {
          setMessages((prev) => prev.map((m) =>
            m.id === buildId
              ? { ...m, type: "app_preview", progress: 100 }
              : m
          ));
        }, 300);
      }
      setMessages((prev) => prev.map((m) =>
        m.id === buildId ? { ...m, progress: Math.min(prog, 100) } : m
      ));
    }, 220);
  };

  const handleExport = (msgId: string) => {
    setMessages((prev) => prev.map((m) =>
      m.id === msgId ? { ...m, type: "app_exporting", progress: 0 } : m
    ));
    let prog = 0;
    const iv = setInterval(() => {
      prog += Math.random() * 9;
      if (prog >= 100) {
        prog = 100;
        clearInterval(iv);
        setTimeout(() => {
          setMessages((prev) => prev.map((m) =>
            m.id === msgId ? { ...m, type: "app_done", progress: 100 } : m
          ));
        }, 400);
      }
      setMessages((prev) => prev.map((m) =>
        m.id === msgId ? { ...m, progress: Math.min(prog, 100) } : m
      ));
    }, 160);
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
          {tab === "chat" ? (
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
              onExport={handleExport}
              onPreview={(app) => setPreviewApp(app)}
            />
          ) : (
            <SettingsScreen
              theme={theme} setTheme={setTheme}
              notifications={notifications} setNotifications={setNotifications}
              soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled}
              fontSize={fontSize} setFontSize={setFontSize}
            />
          )}
        </div>

        {/* Bottom nav */}
        <div className="glass px-4 pb-6 pt-3 shrink-0 z-10">
          <div className="flex items-center justify-around">
            <NavButton icon="MessageCircle" label="Чат" active={tab === "chat"} onClick={() => setTab("chat")} />
            <NavButton icon="Settings2" label="Настройки" active={tab === "settings"} onClick={() => setTab("settings")} />
          </div>
        </div>
      </div>

      {/* App Preview Modal */}
      {previewApp && (
        <AppPreviewModal app={previewApp} onClose={() => setPreviewApp(null)} />
      )}
    </div>
  );
}

function NavButton({ icon, label, active, onClick }: { icon: string; label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`nav-tab flex flex-col items-center gap-1 px-6 py-2 rounded-2xl ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
      <Icon name={icon} size={22} />
      <span className="text-[11px] font-medium">{label}</span>
      {active && <div className="w-1 h-1 rounded-full bg-primary" />}
    </button>
  );
}

function ChatScreen({ messages, isTyping, input, setInput, onSend, onKeyDown, inputRef, messagesEndRef, fontSizeClass, onExport, onPreview }: {
  messages: Message[]; isTyping: boolean; input: string; setInput: (v: string) => void;
  onSend: () => void; onKeyDown: (e: React.KeyboardEvent) => void;
  inputRef: React.RefObject<HTMLTextAreaElement>; messagesEndRef: React.RefObject<HTMLDivElement>;
  fontSizeClass: string; onExport: (id: string) => void; onPreview: (app: AppProject) => void;
}) {
  const suggestions = ["Создай приложение для задач", "Создай магазин одежды", "Создай фитнес-трекер"];

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
          <div className="text-xs text-emerald-500 font-medium">Онлайн · создаёт приложения</div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <MessageBubble key={msg.id} msg={msg} index={i} fontSizeClass={fontSizeClass} onExport={onExport} onPreview={onPreview} />
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

      {/* Suggestions */}
      <div className="px-4 pb-2 flex gap-2 overflow-x-auto shrink-0 scrollbar-hide">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => { /* set input */ }}
            className="shrink-0 text-[10px] text-primary bg-primary/10 border border-primary/20 px-2.5 py-1.5 rounded-full whitespace-nowrap hover:bg-primary/20 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 pb-3 shrink-0">
        <div className="glass rounded-2xl flex items-end gap-2 p-2 neon-glow">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Напишите или &quot;Создай приложение…&quot;"
            rows={1}
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground resize-none outline-none text-sm px-2 py-2 max-h-24 leading-relaxed"
            style={{ minHeight: "36px" }}
          />
          <button
            onClick={onSend}
            disabled={!input.trim()}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 ${
              input.trim() ? "bg-gradient-to-br from-violet-500 to-cyan-400 text-white shadow-lg hover:scale-105 active:scale-95" : "bg-muted text-muted-foreground"
            }`}
          >
            <Icon name="ArrowUp" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg, index, fontSizeClass, onExport, onPreview }: {
  msg: Message; index: number; fontSizeClass: string;
  onExport: (id: string) => void; onPreview: (app: AppProject) => void;
}) {
  if (msg.type === "app_building" || msg.type === "app_preview" || msg.type === "app_exporting" || msg.type === "app_done") {
    return (
      <div className="flex justify-start animate-fade-up" style={{ animationDelay: `${index * 0.03}s` }}>
        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center mr-2 mt-auto shrink-0">
          <span className="text-xs">✦</span>
        </div>
        <AppCard msg={msg} onExport={onExport} onPreview={onPreview} />
      </div>
    );
  }

  return (
    <div className={`flex animate-fade-up ${msg.role === "user" ? "justify-end" : "justify-start"}`} style={{ animationDelay: `${index * 0.03}s` }}>
      {msg.role === "ai" && (
        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center mr-2 mt-auto shrink-0">
          <span className="text-xs">✦</span>
        </div>
      )}
      <div className="max-w-[78%]">
        <div className={`px-4 py-3 ${fontSizeClass} leading-relaxed whitespace-pre-line ${msg.role === "user" ? "msg-bubble-user" : "msg-bubble-ai text-foreground"}`}>
          {msg.text}
        </div>
        <div className={`text-[10px] text-muted-foreground mt-1 px-1 ${msg.role === "user" ? "text-right" : "text-left"}`}>{msg.time}</div>
      </div>
    </div>
  );
}

function AppCard({ msg, onExport, onPreview }: { msg: Message; onExport: (id: string) => void; onPreview: (app: AppProject) => void }) {
  const app = msg.app!;
  const prog = msg.progress ?? 0;

  const buildStages = ["Анализ запроса", "Генерация кода", "Сборка UI", "Компиляция"];
  const exportStages = ["Компиляция", "Подпись APK", "Упаковка", "Готово"];
  const getBuildStage = (p: number) => buildStages[Math.min(Math.floor(p / 25), 3)];
  const getExportStage = (p: number) => exportStages[Math.min(Math.floor(p / 25), 3)];

  if (msg.type === "app_building") {
    return (
      <div className="msg-bubble-ai rounded-2xl p-4 w-64 space-y-3">
        <div className="flex items-center gap-2">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center text-base`}>{app.icon}</div>
          <div>
            <div className="text-sm font-bold text-foreground">{app.name}</div>
            <div className="text-[10px] text-primary font-medium">{getBuildStage(prog)}</div>
          </div>
          <div className="ml-auto flex gap-0.5">
            <div className="typing-dot w-1.5 h-1.5 rounded-full bg-primary" />
            <div className="typing-dot w-1.5 h-1.5 rounded-full bg-primary" />
            <div className="typing-dot w-1.5 h-1.5 rounded-full bg-primary" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Создание приложения</span>
            <span>{Math.round(prog)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div className={`h-full rounded-full bg-gradient-to-r ${app.color} transition-all duration-300`} style={{ width: `${prog}%` }} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1">
          {buildStages.map((s, i) => (
            <div key={s} className={`flex items-center gap-1 text-[9px] ${prog >= (i + 1) * 25 ? "text-emerald-500" : i === Math.floor(prog / 25) ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${prog >= (i + 1) * 25 ? "bg-emerald-500" : i === Math.floor(prog / 25) ? "bg-primary animate-pulse" : "bg-muted"}`} />
              {s}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (msg.type === "app_preview") {
    return (
      <div className="msg-bubble-ai rounded-2xl overflow-hidden w-64">
        {/* Preview header */}
        <div className={`bg-gradient-to-r ${app.color} p-3 flex items-center gap-2`}>
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-base">{app.icon}</div>
          <div>
            <div className="text-white font-bold text-sm">{app.name}</div>
            <div className="text-white/70 text-[10px]">Готово · Android 8.0+</div>
          </div>
          <div className="ml-auto w-5 h-5 rounded-full bg-emerald-400 flex items-center justify-center">
            <Icon name="Check" size={12} className="text-white" />
          </div>
        </div>

        {/* Mini app preview */}
        <div className="p-3 space-y-2">
          <div className="h-28 rounded-xl bg-muted/50 overflow-hidden relative border border-border/30">
            <MiniAppPreview app={app} />
          </div>

          <div className="grid grid-cols-3 gap-1 text-center">
            {["3 экрана", "~4 МБ", "8.0+"].map((stat, i) => (
              <div key={i} className="bg-muted/30 rounded-lg py-1.5">
                <div className="text-xs font-bold text-foreground">{stat}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onPreview(app)}
              className="flex-1 py-2 rounded-xl bg-muted/50 text-foreground text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-muted transition-colors"
            >
              <Icon name="Maximize2" size={12} />
              Просмотр
            </button>
            <button
              onClick={() => onExport(msg.id)}
              className={`flex-1 py-2 rounded-xl text-white text-xs font-medium flex items-center justify-center gap-1.5 bg-gradient-to-r ${app.color} hover:opacity-90 transition-opacity`}
            >
              <Icon name="Download" size={12} />
              APK
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (msg.type === "app_exporting") {
    return (
      <div className="msg-bubble-ai rounded-2xl p-4 w-64 space-y-3">
        <div className="flex items-center gap-2">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center text-base`}>{app.icon}</div>
          <div>
            <div className="text-sm font-bold text-foreground">{app.name}.apk</div>
            <div className="text-[10px] text-primary font-medium">{getExportStage(prog)}</div>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Сборка APK</span>
            <span>{Math.round(prog)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div className={`h-full rounded-full bg-gradient-to-r ${app.color} transition-all duration-200`} style={{ width: `${prog}%` }} />
          </div>
        </div>
        <div className="space-y-1">
          {exportStages.map((s, i) => (
            <div key={s} className={`flex items-center gap-2 text-[10px] py-0.5 ${prog >= (i + 1) * 25 ? "text-emerald-500" : i === Math.floor(prog / 25) ? "text-foreground font-medium" : "text-muted-foreground"}`}>
              <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${prog >= (i + 1) * 25 ? "bg-emerald-500" : i === Math.floor(prog / 25) ? "bg-primary" : "bg-muted"}`}>
                {prog >= (i + 1) * 25 && <Icon name="Check" size={8} className="text-white" />}
              </div>
              {s}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (msg.type === "app_done") {
    return (
      <div className="msg-bubble-ai rounded-2xl overflow-hidden w-64">
        <div className="bg-gradient-to-r from-emerald-500 to-cyan-400 p-3 flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-base">{app.icon}</div>
          <div>
            <div className="text-white font-bold text-sm">{app.name}.apk</div>
            <div className="text-white/80 text-[10px]">Готов к установке 🎉</div>
          </div>
          <div className="ml-auto text-xl">✅</div>
        </div>
        <div className="p-3 space-y-2">
          <div className="grid grid-cols-2 gap-1 text-[10px]">
            {[["Размер", "4.2 МБ"], ["Версия", "1.0.0"], ["Android", "8.0+"], ["Экранов", "3"]].map(([k, v]) => (
              <div key={k} className="bg-muted/30 rounded-lg px-2 py-1.5 flex justify-between">
                <span className="text-muted-foreground">{k}</span>
                <span className="text-foreground font-medium">{v}</span>
              </div>
            ))}
          </div>
          <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-400 text-white text-xs font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity active:scale-95">
            <Icon name="Download" size={14} />
            Скачать APK
          </button>
        </div>
      </div>
    );
  }

  return null;
}

function MiniAppPreview({ app }: { app: AppProject }) {
  return (
    <div className="w-full h-full flex flex-col">
      <div className={`bg-gradient-to-r ${app.color} px-2 py-1.5 flex items-center gap-1.5`}>
        <span className="text-sm">{app.icon}</span>
        <span className="text-white text-[9px] font-bold">{app.name}</span>
      </div>
      <div className="flex-1 bg-background p-1.5 space-y-1">
        {["Раздел 1", "Раздел 2", "Раздел 3"].map((s) => (
          <div key={s} className="flex items-center gap-1.5 bg-muted/40 rounded-md px-2 py-1">
            <div className={`w-3 h-3 rounded bg-gradient-to-br ${app.color} opacity-70 shrink-0`} />
            <span className="text-[8px] text-foreground">{s}</span>
            <Icon name="ChevronRight" size={8} className="ml-auto text-muted-foreground" />
          </div>
        ))}
      </div>
    </div>
  );
}

function AppPreviewModal({ app, onClose }: { app: AppProject; onClose: () => void }) {
  const [screen, setScreen] = useState(0);
  const screens = [
    { label: "Главная", content: <HomeScreen app={app} /> },
    { label: "Каталог", content: <CatalogScreen app={app} /> },
    { label: "Профиль", content: <ProfileScreen app={app} /> },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="w-full max-w-xs" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="text-white font-bold flex items-center gap-2 text-sm">
            <span>{app.icon}</span> {app.name} — Превью
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <Icon name="X" size={16} className="text-white" />
          </button>
        </div>

        {/* Phone frame */}
        <div className="w-full h-[560px] rounded-[32px] overflow-hidden border-2 border-white/20 shadow-2xl bg-background flex flex-col">
          {/* Status */}
          <div className="glass px-5 pt-3 pb-1.5 flex items-center justify-between shrink-0">
            <span className="text-[10px] font-mono text-muted-foreground">9:41</span>
            <div className="flex items-center gap-1">
              <Icon name="Wifi" size={11} className="text-muted-foreground" />
              <Icon name="Battery" size={11} className="text-muted-foreground" />
            </div>
          </div>

          {/* Screen */}
          <div className="flex-1 overflow-hidden">
            {screens[screen].content}
          </div>

          {/* Nav */}
          <div className="glass px-4 pb-4 pt-2 shrink-0 flex items-center justify-around border-t border-border/20">
            {screens.map((s, i) => (
              <button key={s.label} onClick={() => setScreen(i)} className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl text-[10px] font-medium transition-all ${i === screen ? "text-primary bg-primary/10" : "text-muted-foreground"}`}>
                <Icon name={i === 0 ? "Home" : i === 1 ? "Grid3x3" : "User"} size={16} />
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function HomeScreen({ app }: { app: AppProject }) {
  return (
    <div className="h-full flex flex-col bg-background">
      <div className={`bg-gradient-to-br ${app.color} px-4 pt-4 pb-8`}>
        <div className="text-white/70 text-xs">Добро пожаловать</div>
        <div className="text-white font-bold text-xl mt-1">{app.name}</div>
        <div className="text-white/60 text-xs mt-0.5">Создано ИИ-ассистентом</div>
      </div>
      <div className="flex-1 px-3 py-3 -mt-4 space-y-2 overflow-y-auto">
        {["Главный раздел", "Мои данные", "Активность", "История"].map((s) => (
          <div key={s} className="glass rounded-xl px-3 py-2.5 flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${app.color} opacity-80 flex items-center justify-center`}>
              <span className="text-xs">{app.icon}</span>
            </div>
            <span className="text-sm text-foreground flex-1">{s}</span>
            <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
          </div>
        ))}
      </div>
    </div>
  );
}

function CatalogScreen({ app }: { app: AppProject }) {
  return (
    <div className="h-full flex flex-col bg-background">
      <div className="px-4 pt-4 pb-2 shrink-0">
        <div className="font-bold text-foreground text-base">Каталог</div>
        <div className="mt-2 h-8 glass rounded-xl flex items-center px-3 gap-2">
          <Icon name="Search" size={13} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Поиск...</span>
        </div>
      </div>
      <div className="flex-1 px-3 pb-3 overflow-y-auto">
        <div className="grid grid-cols-2 gap-2 mt-1">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="glass rounded-xl overflow-hidden">
              <div className={`aspect-video bg-gradient-to-br ${app.color} opacity-${60 + n * 5} flex items-center justify-center`}>
                <span className="text-2xl">{app.icon}</span>
              </div>
              <div className="p-2">
                <div className="text-xs font-medium text-foreground">Элемент {n}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Описание</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileScreen({ app }: { app: AppProject }) {
  return (
    <div className="h-full flex flex-col bg-background px-3 py-4 overflow-y-auto">
      <div className="flex flex-col items-center mb-4">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center text-2xl shadow-lg`}>{app.icon}</div>
        <div className="font-bold text-foreground text-sm mt-2">Пользователь</div>
        <div className="text-xs text-muted-foreground">user@email.com</div>
        <div className="mt-2 inline-flex items-center gap-1 bg-primary/10 text-primary text-[10px] px-2 py-1 rounded-full">
          <Icon name="Zap" size={9} />
          Pro план
        </div>
      </div>
      <div className="space-y-1.5">
        {["Редактировать профиль", "Уведомления", "Безопасность", "Поддержка", "Выйти"].map((item) => (
          <button key={item} className="w-full glass rounded-xl px-3 py-2.5 flex items-center justify-between">
            <span className="text-xs text-foreground">{item}</span>
            <Icon name="ChevronRight" size={13} className="text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
}

function SettingsScreen({ theme, setTheme, notifications, setNotifications, soundEnabled, setSoundEnabled, fontSize, setFontSize }: {
  theme: Theme; setTheme: (t: Theme) => void;
  notifications: boolean; setNotifications: (v: boolean) => void;
  soundEnabled: boolean; setSoundEnabled: (v: boolean) => void;
  fontSize: "small" | "medium" | "large"; setFontSize: (v: "small" | "medium" | "large") => void;
}) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="glass px-5 py-4 border-b border-border/30">
        <h1 className="text-lg font-bold text-foreground">Настройки</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Персонализируй приложение</p>
      </div>
      <div className="px-4 py-4 space-y-4">
        <div className="glass rounded-3xl p-4 flex items-center gap-4 neon-glow">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-cyan-400 flex items-center justify-center text-2xl shadow-lg">👤</div>
          <div className="flex-1">
            <div className="font-bold text-foreground">Мой профиль</div>
            <div className="text-sm text-muted-foreground">Пользователь</div>
            <div className="mt-2 inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
              <Icon name="Zap" size={10} /><span>Pro план</span>
            </div>
          </div>
          <Icon name="ChevronRight" size={18} className="text-muted-foreground" />
        </div>

        <div className="glass rounded-3xl p-4">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-3">Оформление</div>
          <div className="flex gap-2">
            {(["light", "dark"] as Theme[]).map((t) => (
              <button key={t} onClick={() => setTheme(t)} className={`flex-1 py-3 rounded-2xl flex flex-col items-center gap-2 transition-all duration-200 ${theme === t ? "bg-primary text-primary-foreground shadow-lg scale-[1.02]" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}>
                <Icon name={t === "light" ? "Sun" : "Moon"} size={20} />
                <span className="text-xs font-medium">{t === "light" ? "Светлая" : "Тёмная"}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="glass rounded-3xl p-4">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-3">Размер текста</div>
          <div className="flex gap-2">
            {(["small", "medium", "large"] as const).map((size) => (
              <button key={size} onClick={() => setFontSize(size)} className={`flex-1 py-2.5 rounded-xl transition-all duration-200 ${fontSize === size ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}>
                <div className={`font-bold ${size === "small" ? "text-sm" : size === "large" ? "text-xl" : "text-base"}`}>А</div>
                <div className="text-[9px] mt-0.5 opacity-70">{size === "small" ? "Мелкий" : size === "medium" ? "Средний" : "Крупный"}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="glass rounded-3xl p-4 space-y-1">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-3">Уведомления</div>
          <ToggleRow icon="Bell" label="Push-уведомления" description="Получать уведомления" value={notifications} onChange={setNotifications} />
          <div className="h-px bg-border/40 mx-1" />
          <ToggleRow icon="Volume2" label="Звуки" description="Звук при сообщениях" value={soundEnabled} onChange={setSoundEnabled} />
        </div>

        <div className="glass rounded-3xl p-4">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-3">О приложении</div>
          <div className="space-y-2">
            {[{ icon: "Info", label: "Версия", value: "1.0.0" }, { icon: "Shield", label: "Конфиденциальность", value: "" }, { icon: "FileText", label: "Условия", value: "" }].map((item) => (
              <button key={item.label} className="w-full flex items-center gap-3 py-2 px-1 rounded-xl hover:bg-muted/30 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-muted/50 flex items-center justify-center">
                  <Icon name={item.icon} size={15} className="text-muted-foreground" />
                </div>
                <span className="flex-1 text-sm text-foreground text-left">{item.label}</span>
                {item.value ? <span className="text-xs text-muted-foreground font-mono">{item.value}</span> : <Icon name="ChevronRight" size={14} className="text-muted-foreground" />}
              </button>
            ))}
          </div>
        </div>
        <div className="h-4" />
      </div>
    </div>
  );
}

function ToggleRow({ icon, label, description, value, onChange }: { icon: string; label: string; description: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-3 py-2 px-1">
      <div className="w-8 h-8 rounded-xl bg-muted/50 flex items-center justify-center shrink-0">
        <Icon name={icon} size={15} className="text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
      <button onClick={() => onChange(!value)} className={`w-12 h-6 rounded-full transition-all duration-300 relative shrink-0 ${value ? "bg-primary" : "bg-muted"}`}>
        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${value ? "left-6" : "left-0.5"}`} />
      </button>
    </div>
  );
}
