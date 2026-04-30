import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

type Theme = "light" | "dark";
type Tab = "chat" | "builder" | "settings";
type BuildStep = "idle" | "prompt" | "generating" | "preview" | "exporting" | "done";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
  time: string;
}

interface AppProject {
  name: string;
  description: string;
  color: string;
  icon: string;
  screens: string[];
}

const AI_REPLIES = [
  "Конечно, я помогу тебе с этим! Расскажи подробнее, что именно нужно сделать?",
  "Отличный вопрос! Давай разберём это вместе. Вот что я думаю по этому поводу...",
  "Понял тебя. Для этой задачи есть несколько подходов — давай выберем лучший.",
  "Интересная идея! Я уже анализирую варианты решения для тебя.",
  "Готово! Вот что удалось найти по твоему запросу. Нужны подробности?",
];

const APP_TEMPLATES = [
  { icon: "🛒", name: "Магазин", color: "from-orange-500 to-pink-500", desc: "Интернет-магазин с каталогом и корзиной" },
  { icon: "📋", name: "Задачи", color: "from-blue-500 to-cyan-400", desc: "Менеджер задач и проектов" },
  { icon: "💪", name: "Фитнес", color: "from-green-500 to-emerald-400", desc: "Трекер тренировок и питания" },
  { icon: "📖", name: "Дневник", color: "from-violet-500 to-purple-400", desc: "Личный дневник с заметками" },
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
  const [buildStep, setBuildStep] = useState<BuildStep>("idle");
  const [appPrompt, setAppPrompt] = useState("");
  const [appProject, setAppProject] = useState<AppProject | null>(null);
  const [buildProgress, setBuildProgress] = useState(0);
  const [exportProgress, setExportProgress] = useState(0);
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
    const userMsg: Message = { id: Date.now().toString(), role: "user", text, time: getTime() };
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

  const startGeneration = (prompt: string) => {
    setBuildStep("generating");
    setBuildProgress(0);
    const interval = setInterval(() => {
      setBuildProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          const names = ["МойМагазин", "TaskFlow", "FitPro", "NoteAI", "QuickApp"];
          const icons = ["🚀", "⚡", "✨", "🎯", "💎"];
          setAppProject({
            name: names[Math.floor(Math.random() * names.length)],
            description: prompt,
            color: APP_TEMPLATES[Math.floor(Math.random() * APP_TEMPLATES.length)].color,
            icon: icons[Math.floor(Math.random() * icons.length)],
            screens: ["Главная", "Каталог", "Профиль", "Настройки"],
          });
          setBuildStep("preview");
          return 100;
        }
        return p + Math.random() * 12;
      });
    }, 200);
  };

  const startExport = () => {
    setBuildStep("exporting");
    setExportProgress(0);
    const steps = [
      { label: "Компиляция кода", end: 25 },
      { label: "Сборка ресурсов", end: 50 },
      { label: "Подпись APK", end: 75 },
      { label: "Финальная упаковка", end: 100 },
    ];
    let current = 0;
    const interval = setInterval(() => {
      setExportProgress((p) => {
        const next = p + Math.random() * 8;
        if (next >= 100) {
          clearInterval(interval);
          setBuildStep("done");
          return 100;
        }
        current = steps.findIndex((s) => next < s.end);
        return Math.min(next, 99);
      });
    }, 150);
  };

  const resetBuilder = () => {
    setBuildStep("idle");
    setAppPrompt("");
    setAppProject(null);
    setBuildProgress(0);
    setExportProgress(0);
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
          {tab === "builder" && (
            <BuilderScreen
              buildStep={buildStep}
              setBuildStep={setBuildStep}
              appPrompt={appPrompt}
              setAppPrompt={setAppPrompt}
              appProject={appProject}
              buildProgress={buildProgress}
              exportProgress={exportProgress}
              onGenerate={startGeneration}
              onExport={startExport}
              onReset={resetBuilder}
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
            <NavButton icon="MessageCircle" label="Чат" active={tab === "chat"} onClick={() => setTab("chat")} />
            <NavButton icon="Layers" label="Создать" active={tab === "builder"} onClick={() => setTab("builder")} badge={buildStep === "done"} />
            <NavButton icon="Settings2" label="Настройки" active={tab === "settings"} onClick={() => setTab("settings")} />
          </div>
        </div>
      </div>
    </div>
  );
}

function NavButton({ icon, label, active, onClick, badge }: {
  icon: string; label: string; active: boolean; onClick: () => void; badge?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`nav-tab flex flex-col items-center gap-1 px-5 py-2 rounded-2xl relative ${
        active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon name={icon} size={22} />
      <span className="text-[11px] font-medium">{label}</span>
      {active && <div className="w-1 h-1 rounded-full bg-primary" />}
      {badge && !active && (
        <div className="absolute top-1 right-3 w-2 h-2 rounded-full bg-emerald-400" />
      )}
    </button>
  );
}

function ChatScreen({ messages, isTyping, input, setInput, onSend, onKeyDown, inputRef, messagesEndRef, fontSizeClass }: {
  messages: Message[]; isTyping: boolean; input: string; setInput: (v: string) => void;
  onSend: () => void; onKeyDown: (e: React.KeyboardEvent) => void;
  inputRef: React.RefObject<HTMLTextAreaElement>; messagesEndRef: React.RefObject<HTMLDivElement>;
  fontSizeClass: string;
}) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
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

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={msg.id} className={`flex animate-fade-up ${msg.role === "user" ? "justify-end" : "justify-start"}`} style={{ animationDelay: `${i * 0.05}s` }}>
            {msg.role === "ai" && (
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center mr-2 mt-auto shrink-0">
                <span className="text-xs">✦</span>
              </div>
            )}
            <div className="max-w-[75%]">
              <div className={`px-4 py-3 ${fontSizeClass} leading-relaxed ${msg.role === "user" ? "msg-bubble-user" : "msg-bubble-ai text-foreground"}`}>
                {msg.text}
              </div>
              <div className={`text-[10px] text-muted-foreground mt-1 ${msg.role === "user" ? "text-right" : "text-left"} px-1`}>{msg.time}</div>
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

function BuilderScreen({ buildStep, setBuildStep, appPrompt, setAppPrompt, appProject, buildProgress, exportProgress, onGenerate, onExport, onReset }: {
  buildStep: BuildStep; setBuildStep: (s: BuildStep) => void;
  appPrompt: string; setAppPrompt: (v: string) => void;
  appProject: AppProject | null; buildProgress: number; exportProgress: number;
  onGenerate: (p: string) => void; onExport: () => void; onReset: () => void;
}) {
  const [previewScreen, setPreviewScreen] = useState(0);

  if (buildStep === "idle") {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="glass px-5 py-4 border-b border-border/30">
          <h1 className="text-lg font-bold text-foreground">Создать приложение</h1>
          <p className="text-xs text-muted-foreground mt-0.5">ИИ соберёт APK за несколько минут</p>
        </div>
        <div className="px-4 py-5 space-y-4">
          {/* Hero */}
          <div className="relative glass rounded-3xl p-5 overflow-hidden neon-glow">
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-400/20 blur-xl" />
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center mb-3">
                <Icon name="Wand2" size={22} className="text-white" />
              </div>
              <div className="font-bold text-foreground text-base mb-1">ИИ-генератор APK</div>
              <p className="text-xs text-muted-foreground leading-relaxed">Опиши идею своего приложения — ИИ создаст его и экспортирует в APK-файл для Android</p>
            </div>
          </div>

          {/* Templates */}
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Шаблоны</div>
            <div className="grid grid-cols-2 gap-2">
              {APP_TEMPLATES.map((t) => (
                <button
                  key={t.name}
                  onClick={() => { setAppPrompt(t.desc); setBuildStep("prompt"); }}
                  className="glass rounded-2xl p-3 text-left hover:scale-[1.02] transition-transform active:scale-95"
                >
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-lg mb-2`}>{t.icon}</div>
                  <div className="text-sm font-semibold text-foreground">{t.name}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setBuildStep("prompt")}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-400 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
          >
            <Icon name="Plus" size={18} />
            Создать своё приложение
          </button>
        </div>
      </div>
    );
  }

  if (buildStep === "prompt") {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="glass px-5 py-3 border-b border-border/30 flex items-center gap-3 shrink-0">
          <button onClick={onReset} className="w-8 h-8 rounded-xl bg-muted/50 flex items-center justify-center">
            <Icon name="ArrowLeft" size={16} className="text-muted-foreground" />
          </button>
          <h1 className="text-base font-bold text-foreground">Опиши приложение</h1>
        </div>
        <div className="flex-1 px-4 py-5 flex flex-col gap-4 overflow-y-auto">
          <div className="glass rounded-2xl p-1">
            <textarea
              value={appPrompt}
              onChange={(e) => setAppPrompt(e.target.value)}
              placeholder="Например: приложение-трекер привычек с напоминаниями, статистикой и тёмной темой..."
              className="w-full bg-transparent text-foreground placeholder:text-muted-foreground resize-none outline-none text-sm px-3 py-3 leading-relaxed"
              rows={5}
            />
          </div>
          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Быстрые подсказки</div>
            {["Добавь авторизацию", "Нужны push-уведомления", "Тёмная тема", "Работает офлайн"].map((hint) => (
              <button
                key={hint}
                onClick={() => setAppPrompt((p) => p ? `${p}, ${hint.toLowerCase()}` : hint)}
                className="mr-2 mb-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-xs text-foreground hover:bg-primary/10 transition-colors"
              >
                <Icon name="Plus" size={10} className="text-primary" />
                {hint}
              </button>
            ))}
          </div>
          <button
            onClick={() => onGenerate(appPrompt || "Мобильное приложение")}
            disabled={!appPrompt.trim()}
            className={`w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
              appPrompt.trim()
                ? "bg-gradient-to-r from-violet-500 to-cyan-400 text-white hover:opacity-90 active:scale-95"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <Icon name="Wand2" size={18} />
            Создать приложение
          </button>
        </div>
      </div>
    );
  }

  if (buildStep === "generating") {
    const stages = [
      { label: "Анализ идеи", icon: "Brain", end: 20 },
      { label: "Генерация кода", icon: "Code2", end: 50 },
      { label: "Создание UI", icon: "Layers", end: 75 },
      { label: "Компиляция", icon: "Package", end: 100 },
    ];
    const currentStage = stages.findIndex((s) => buildProgress < s.end);
    const activeStage = currentStage === -1 ? stages.length - 1 : currentStage;

    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-6">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500 to-cyan-400 animate-pulse-ring flex items-center justify-center">
            <Icon name="Wand2" size={36} className="text-white" />
          </div>
        </div>
        <div className="text-center">
          <div className="font-bold text-foreground text-lg">ИИ создаёт приложение</div>
          <div className="text-sm text-muted-foreground mt-1">{Math.round(buildProgress)}% завершено</div>
        </div>
        <div className="w-full glass rounded-2xl p-1 h-2 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-300"
            style={{ width: `${buildProgress}%` }}
          />
        </div>
        <div className="w-full space-y-2">
          {stages.map((stage, i) => (
            <div key={stage.label} className={`flex items-center gap-3 py-2 px-3 rounded-xl transition-all ${i === activeStage ? "bg-primary/10" : ""}`}>
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                i < activeStage ? "bg-emerald-500" : i === activeStage ? "bg-gradient-to-br from-violet-500 to-cyan-400" : "bg-muted"
              }`}>
                {i < activeStage
                  ? <Icon name="Check" size={14} className="text-white" />
                  : <Icon name={stage.icon} size={14} className={i === activeStage ? "text-white" : "text-muted-foreground"} />
                }
              </div>
              <span className={`text-sm ${i === activeStage ? "text-foreground font-medium" : i < activeStage ? "text-muted-foreground line-through" : "text-muted-foreground"}`}>
                {stage.label}
              </span>
              {i === activeStage && (
                <div className="ml-auto flex gap-0.5">
                  <div className="typing-dot w-1.5 h-1.5 rounded-full bg-primary" />
                  <div className="typing-dot w-1.5 h-1.5 rounded-full bg-primary" />
                  <div className="typing-dot w-1.5 h-1.5 rounded-full bg-primary" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (buildStep === "preview" && appProject) {
    const screens = [
      {
        label: "Главная",
        content: (
          <div className="flex flex-col h-full">
            <div className={`bg-gradient-to-br ${appProject.color} px-4 pt-6 pb-8`}>
              <div className="text-white/70 text-xs mb-1">Добро пожаловать</div>
              <div className="text-white font-bold text-xl">{appProject.name}</div>
            </div>
            <div className="flex-1 bg-background px-3 py-3 space-y-2 -mt-4">
              {["Раздел 1", "Раздел 2", "Раздел 3"].map((s) => (
                <div key={s} className="glass rounded-xl p-3 flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${appProject.color} opacity-80`} />
                  <span className="text-xs text-foreground">{s}</span>
                  <Icon name="ChevronRight" size={12} className="ml-auto text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
        )
      },
      {
        label: "Каталог",
        content: (
          <div className="flex flex-col h-full bg-background px-3 py-3">
            <div className="text-foreground font-bold text-sm mb-3">Каталог</div>
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className={`aspect-square rounded-xl bg-gradient-to-br ${appProject.color} opacity-${70 + n * 5} flex items-center justify-center`}>
                  <span className="text-white text-xs font-medium">#{n}</span>
                </div>
              ))}
            </div>
          </div>
        )
      },
      {
        label: "Профиль",
        content: (
          <div className="flex flex-col h-full bg-background px-3 py-3 items-center">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${appProject.color} flex items-center justify-center text-2xl mt-4`}>{appProject.icon}</div>
            <div className="font-bold text-foreground text-sm mt-2">Пользователь</div>
            <div className="text-xs text-muted-foreground">user@email.com</div>
            <div className="w-full mt-4 space-y-2">
              {["Мои данные", "Безопасность", "Выход"].map((item) => (
                <div key={item} className="glass rounded-xl px-3 py-2.5 flex items-center justify-between">
                  <span className="text-xs text-foreground">{item}</span>
                  <Icon name="ChevronRight" size={12} className="text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
        )
      },
    ];

    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="glass px-5 py-3 border-b border-border/30 flex items-center gap-3 shrink-0">
          <button onClick={onReset} className="w-8 h-8 rounded-xl bg-muted/50 flex items-center justify-center">
            <Icon name="ArrowLeft" size={16} className="text-muted-foreground" />
          </button>
          <div className="flex-1">
            <div className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <span>{appProject.icon}</span>
              {appProject.name}
            </div>
          </div>
          <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-medium px-2 py-1 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Готово
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col px-4 py-3 gap-3">
          {/* Mini phone preview */}
          <div className="flex justify-center">
            <div className="w-[160px] h-[280px] rounded-[20px] border-2 border-border/50 overflow-hidden shadow-xl bg-background relative">
              <div className="absolute inset-0 overflow-hidden">
                {screens[previewScreen].content}
              </div>
              {/* Mini nav */}
              <div className="absolute bottom-0 inset-x-0 h-8 glass flex items-center justify-around px-2 border-t border-border/20">
                {screens.map((s, i) => (
                  <button key={s.label} onClick={() => setPreviewScreen(i)} className={`text-[8px] font-medium transition-colors ${i === previewScreen ? "text-primary" : "text-muted-foreground"}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Screen tabs */}
          <div className="flex gap-1.5">
            {screens.map((s, i) => (
              <button
                key={s.label}
                onClick={() => setPreviewScreen(i)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  i === previewScreen ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Info */}
          <div className="glass rounded-2xl p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Экранов</span>
              <span className="text-foreground font-medium">{screens.length}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Платформа</span>
              <span className="text-foreground font-medium">Android 8.0+</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Размер APK</span>
              <span className="text-foreground font-medium">~4.2 МБ</span>
            </div>
          </div>

          <button
            onClick={onExport}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-400 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
          >
            <Icon name="Download" size={18} />
            Экспортировать APK
          </button>
        </div>
      </div>
    );
  }

  if (buildStep === "exporting") {
    const exportStages = [
      { label: "Компиляция кода", end: 25 },
      { label: "Сборка ресурсов", end: 50 },
      { label: "Подпись APK", end: 75 },
      { label: "Финальная упаковка", end: 100 },
    ];
    const currentStage = exportStages.findIndex((s) => exportProgress < s.end);
    const activeStage = currentStage === -1 ? exportStages.length - 1 : currentStage;

    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center animate-pulse-ring">
          <Icon name="Package" size={32} className="text-white" />
        </div>
        <div className="text-center">
          <div className="font-bold text-foreground text-lg">Сборка APK</div>
          <div className="text-sm text-muted-foreground mt-1">{Math.round(exportProgress)}%</div>
        </div>
        <div className="w-full glass rounded-2xl p-1 h-2.5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-300"
            style={{ width: `${exportProgress}%` }}
          />
        </div>
        <div className="w-full space-y-2">
          {exportStages.map((stage, i) => (
            <div key={stage.label} className={`flex items-center gap-3 py-1.5 px-3 rounded-xl ${i === activeStage ? "bg-primary/10" : ""}`}>
              <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${
                i < activeStage ? "bg-emerald-500" : i === activeStage ? "bg-primary" : "bg-muted"
              }`}>
                {i < activeStage
                  ? <Icon name="Check" size={10} className="text-white" />
                  : <Icon name="Minus" size={10} className={i === activeStage ? "text-white" : "text-muted-foreground"} />
                }
              </div>
              <span className={`text-xs ${i < activeStage ? "text-muted-foreground line-through" : i === activeStage ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {stage.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (buildStep === "done" && appProject) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-5">
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center shadow-xl">
            <Icon name="CheckCircle2" size={44} className="text-white" />
          </div>
          <div className="absolute -top-2 -right-2 text-2xl animate-bounce">🎉</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-foreground text-xl">APK готов!</div>
          <div className="text-sm text-muted-foreground mt-1">{appProject.icon} {appProject.name}.apk</div>
        </div>

        <div className="w-full glass rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Файл</span>
            <span className="text-foreground font-mono text-xs">{appProject.name}.apk</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Размер</span>
            <span className="text-foreground font-medium">4.2 МБ</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Версия</span>
            <span className="text-foreground font-medium">1.0.0</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Android</span>
            <span className="text-foreground font-medium">8.0+</span>
          </div>
        </div>

        <button className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-400 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all">
          <Icon name="Download" size={18} />
          Скачать APK
        </button>
        <button
          onClick={onReset}
          className="w-full py-3 rounded-2xl glass text-foreground text-sm font-medium flex items-center justify-center gap-2 hover:bg-muted/30 transition-colors"
        >
          <Icon name="Plus" size={16} />
          Создать новое приложение
        </button>
      </div>
    );
  }

  return null;
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
              <Icon name="Zap" size={10} />
              <span>Pro план</span>
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
            {[{ icon: "Info", label: "Версия", value: "1.0.0" }, { icon: "Shield", label: "Политика конфиденциальности", value: "" }, { icon: "FileText", label: "Условия использования", value: "" }].map((item) => (
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

function ToggleRow({ icon, label, description, value, onChange }: {
  icon: string; label: string; description: string; value: boolean; onChange: (v: boolean) => void;
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
      <button onClick={() => onChange(!value)} className={`w-12 h-6 rounded-full transition-all duration-300 relative shrink-0 ${value ? "bg-primary" : "bg-muted"}`}>
        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${value ? "left-6" : "left-0.5"}`} />
      </button>
    </div>
  );
}
