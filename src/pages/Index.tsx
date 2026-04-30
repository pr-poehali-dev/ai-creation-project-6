import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

// ─── Types ───────────────────────────────────────────────────────────────────
type Theme = "light" | "dark";
type Tab = "chat" | "settings";
type MsgType = "text" | "app_building" | "app_preview" | "app_exporting" | "app_done";
type Modal = null | "preview" | "code" | "export";

interface AppProject {
  name: string;
  color: string;
  icon: string;
  prompt: string;
  code: string;
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

// ─── Data ────────────────────────────────────────────────────────────────────
const APP_KEYWORDS = [
  "создай приложение","сделай приложение","создать приложение","сделать приложение",
  "напиши приложение","разработай приложение","create app","build app","напиши код",
];
const GRADIENTS = [
  "from-violet-500 to-cyan-400","from-orange-500 to-pink-500",
  "from-blue-500 to-emerald-400","from-rose-500 to-orange-400","from-green-500 to-teal-400",
];
const ICONS = ["🚀","⚡","✨","🎯","💎","🌟","🔥","🎨"];

const LANGUAGES = [
  { code:"ru", flag:"🇷🇺", name:"Русский" },
  { code:"en", flag:"🇺🇸", name:"English" },
  { code:"zh", flag:"🇨🇳", name:"中文" },
  { code:"es", flag:"🇪🇸", name:"Español" },
  { code:"fr", flag:"🇫🇷", name:"Français" },
  { code:"de", flag:"🇩🇪", name:"Deutsch" },
  { code:"ja", flag:"🇯🇵", name:"日本語" },
  { code:"ko", flag:"🇰🇷", name:"한국어" },
  { code:"ar", flag:"🇸🇦", name:"العربية" },
  { code:"pt", flag:"🇧🇷", name:"Português" },
  { code:"it", flag:"🇮🇹", name:"Italiano" },
  { code:"tr", flag:"🇹🇷", name:"Türkçe" },
  { code:"pl", flag:"🇵🇱", name:"Polski" },
  { code:"nl", flag:"🇳🇱", name:"Nederlands" },
  { code:"uk", flag:"🇺🇦", name:"Українська" },
  { code:"vi", flag:"🇻🇳", name:"Tiếng Việt" },
  { code:"th", flag:"🇹🇭", name:"ภาษาไทย" },
  { code:"hi", flag:"🇮🇳", name:"हिन्दी" },
  { code:"id", flag:"🇮🇩", name:"Bahasa Indonesia" },
  { code:"sv", flag:"🇸🇪", name:"Svenska" },
];

const SEARCH_ENGINES = [
  { id:"google",  flag:"🌐", name:"Google" },
  { id:"yandex",  flag:"🔍", name:"Yandex" },
  { id:"bing",    flag:"🟦", name:"Bing" },
  { id:"duckduck",flag:"🦆", name:"DuckDuckGo" },
  { id:"brave",   flag:"🦁", name:"Brave" },
  { id:"baidu",   flag:"🇨🇳", name:"Baidu" },
];

function getTime() {
  return new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}
function detectApp(text: string) {
  return APP_KEYWORDS.some((k) => text.toLowerCase().includes(k));
}
function genName(prompt: string) {
  const w = prompt.toLowerCase();
  if (w.includes("магазин")||w.includes("shop")) return "ShopAI";
  if (w.includes("задач")||w.includes("task")) return "TaskFlow";
  if (w.includes("фитнес")||w.includes("трениров")) return "FitPro";
  if (w.includes("дневник")||w.includes("заметк")) return "NoteAI";
  if (w.includes("еда")||w.includes("ресторан")) return "FoodApp";
  if (w.includes("музык")) return "MusicAI";
  if (w.includes("финанс")||w.includes("деньг")) return "FinTrack";
  if (w.includes("привычк")) return "HabitAI";
  return ["MyApp","QuickApp","AiApp","SmartApp","FlowApp"][Math.floor(Math.random()*5)];
}

function generateCode(app: Omit<AppProject,"code">): string {
return `import React, { useState } from 'react';

// ${app.name} — создано ИИ-ассистентом
// Описание: ${app.prompt}

const App = () => {
  const [tab, setTab] = useState('home');
  const [items, setItems] = useState([
    { id: 1, title: 'Элемент 1', done: false },
    { id: 2, title: 'Элемент 2', done: false },
    { id: 3, title: 'Элемент 3', done: true },
  ]);

  const toggle = (id) =>
    setItems(items.map(i => i.id === id ? { ...i, done: !i.done } : i));

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 400,
      margin: '0 auto', background: '#0f0f1a', minHeight: '100vh',
      color: '#fff', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
        padding: '20px 16px 28px' }}>
        <div style={{ fontSize: 28 }}>${app.icon}</div>
        <h1 style={{ margin: '8px 0 4px', fontSize: 22 }}>${app.name}</h1>
        <p style={{ margin: 0, opacity: 0.7, fontSize: 13 }}>
          ${app.prompt.slice(0, 60)}
        </p>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: 16 }}>
        {tab === 'home' && (
          <div>
            <h2 style={{ fontSize: 16, marginBottom: 12 }}>Главная</h2>
            {items.map(item => (
              <div key={item.id} onClick={() => toggle(item.id)}
                style={{ background: 'rgba(255,255,255,0.07)',
                  borderRadius: 12, padding: '12px 14px', marginBottom: 8,
                  display: 'flex', alignItems: 'center', gap: 10,
                  cursor: 'pointer', opacity: item.done ? 0.5 : 1 }}>
                <div style={{ width: 20, height: 20, borderRadius: 6,
                  background: item.done ? '#10B981' : 'transparent',
                  border: '2px solid ' + (item.done ? '#10B981' : '#555'),
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.done && <span style={{ fontSize: 12 }}>✓</span>}
                </div>
                <span style={{ textDecoration: item.done ? 'line-through' : 'none' }}>
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        )}
        {tab === 'profile' && (
          <div style={{ textAlign: 'center', paddingTop: 24 }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>${app.icon}</div>
            <h2 style={{ margin: '0 0 4px' }}>Пользователь</h2>
            <p style={{ opacity: 0.5, fontSize: 13 }}>user@app.com</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)',
        borderTop: '1px solid rgba(255,255,255,0.1)', padding: '8px 0 16px' }}>
        {[['home','🏠','Главная'],['profile','👤','Профиль']].map(([id, ic, lb]) => (
          <button key={id} onClick={() => setTab(id)}
            style={{ flex: 1, background: 'none', border: 'none', color: tab === id ? '#8B5CF6' : '#888',
              fontSize: 11, cursor: 'pointer', padding: '6px 0', display: 'flex',
              flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <span style={{ fontSize: 20 }}>{ic}</span>
            {lb}
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;`;
}

const INIT_MSGS: Message[] = [{
  id: "1", role: "ai", type: "text",
  text: "Привет! Я твой ИИ-ассистент 👋\n\nМогу отвечать на вопросы и создавать мобильные приложения прямо здесь — с живым кодом и превью.\n\nНапример: «Создай приложение для трекинга привычек»",
  time: getTime(),
}];

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function Index() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [tab, setTab] = useState<Tab>("chat");
  const [messages, setMessages] = useState<Message[]>(INIT_MSGS);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("ru");
  const [searchEngine, setSearchEngine] = useState("google");
  const [fontSize, setFontSize] = useState<"small"|"medium"|"large">("medium");
  const [modal, setModal] = useState<Modal>(null);
  const [modalApp, setModalApp] = useState<AppProject | null>(null);
  const [exportName, setExportName] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((p) => [...p, { id: Date.now().toString(), role: "user", type: "text", text, time: getTime() }]);
    setInput("");

    if (detectApp(text)) {
      handleAppRequest(text);
    } else {
      setIsTyping(true);
      const replies = [
        "Конечно, помогу! Расскажи подробнее?",
        "Хороший вопрос. Вот что думаю...",
        "Понял. Давай разберём по шагам.",
        "Отличная идея! Уже анализирую.",
        "Готово! Нужны подробности?",
      ];
      setTimeout(() => {
        setMessages((p) => [...p, {
          id: (Date.now()+1).toString(), role: "ai", type: "text",
          text: replies[Math.floor(Math.random()*replies.length)], time: getTime(),
        }]);
        setIsTyping(false);
      }, 1200 + Math.random() * 800);
    }
  };

  const handleAppRequest = (prompt: string) => {
    const partial = { name: genName(prompt), color: GRADIENTS[Math.floor(Math.random()*GRADIENTS.length)], icon: ICONS[Math.floor(Math.random()*ICONS.length)], prompt };
    const app: AppProject = { ...partial, code: generateCode(partial) };

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((p) => [...p, {
        id: Date.now().toString(), role: "ai", type: "text",
        text: `Принял! Создаю «${app.name}» ⚙️`,
        time: getTime(),
      }]);
    }, 800);

    const buildId = (Date.now() + 20).toString();
    setTimeout(() => {
      setMessages((p) => [...p, { id: buildId, role: "ai", type: "app_building", time: getTime(), app, progress: 0 }]);
    }, 1600);

    let prog = 0;
    const iv = setInterval(() => {
      prog += Math.random() * 13;
      if (prog >= 100) {
        prog = 100; clearInterval(iv);
        setTimeout(() => {
          setMessages((p) => p.map((m) => m.id === buildId ? { ...m, type: "app_preview", progress: 100 } : m));
        }, 300);
      }
      setMessages((p) => p.map((m) => m.id === buildId ? { ...m, progress: Math.min(prog, 100) } : m));
    }, 220);
  };

  const handleExportStart = (app: AppProject) => {
    setModalApp(app);
    setExportName(app.name);
    setModal("export");
  };

  const handleExportConfirm = (msgId: string) => {
    setModal(null);
    setMessages((p) => p.map((m) => m.id === msgId ? { ...m, type: "app_exporting", progress: 0, app: { ...m.app!, name: exportName || m.app!.name } } : m));
    let prog = 0;
    const iv = setInterval(() => {
      prog += Math.random() * 9;
      if (prog >= 100) {
        prog = 100; clearInterval(iv);
        setTimeout(() => {
          setMessages((p) => p.map((m) => m.id === msgId ? { ...m, type: "app_done", progress: 100 } : m));
        }, 400);
      }
      setMessages((p) => p.map((m) => m.id === msgId ? { ...m, progress: Math.min(prog, 100) } : m));
    }, 160);
  };

  const openPreview = (app: AppProject) => { setModalApp(app); setModal("preview"); };
  const openCode = (app: AppProject) => { setModalApp(app); setModal("code"); };

  const fontSizeClass = fontSize === "small" ? "text-sm" : fontSize === "large" ? "text-lg" : "text-base";

  return (
    <div className="min-h-screen bg-background bg-mesh flex items-center justify-center p-4 transition-colors duration-500">
      <div className="w-full max-w-sm h-[812px] flex flex-col rounded-[40px] overflow-hidden shadow-2xl neon-glow border border-border/50">
        {/* Status bar */}
        <div className="glass px-6 pt-4 pb-2 flex items-center justify-between shrink-0">
          <span className="text-xs font-mono text-muted-foreground">9:41</span>
          <div className="flex items-center gap-1">
            <Icon name="Signal" size={13} className="text-muted-foreground" />
            <Icon name="Wifi" size={13} className="text-muted-foreground" />
            <Icon name="Battery" size={13} className="text-muted-foreground" />
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {tab === "chat"
            ? <ChatScreen messages={messages} isTyping={isTyping} input={input} setInput={setInput}
                onSend={sendMessage} inputRef={inputRef} messagesEndRef={messagesEndRef}
                fontSizeClass={fontSizeClass} onPreview={openPreview} onCode={openCode}
                onExport={handleExportStart} exportMsgId={(msgId, app) => { setModalApp(app); setExportName(app.name); setModal("export"); }}
                allMessages={messages} setMessages={setMessages} />
            : <SettingsScreen theme={theme} setTheme={setTheme} notifications={notifications}
                setNotifications={setNotifications} language={language} setLanguage={setLanguage}
                searchEngine={searchEngine} setSearchEngine={setSearchEngine}
                fontSize={fontSize} setFontSize={setFontSize} />
          }
        </div>

        {/* Nav */}
        <div className="glass px-4 pb-6 pt-3 shrink-0 flex items-center justify-around">
          <NavBtn icon="MessageCircle" label="Чат" active={tab==="chat"} onClick={() => setTab("chat")} />
          <NavBtn icon="Settings2" label="Настройки" active={tab==="settings"} onClick={() => setTab("settings")} />
        </div>
      </div>

      {/* Modals */}
      {modal === "preview" && modalApp && <PreviewModal app={modalApp} onClose={() => setModal(null)} />}
      {modal === "code" && modalApp && <CodeModal app={modalApp} onClose={() => setModal(null)} />}
      {modal === "export" && modalApp && (
        <ExportModal app={modalApp} name={exportName} setName={setExportName}
          onClose={() => setModal(null)}
          onConfirm={() => {
            const msg = messages.find((m) => m.app?.prompt === modalApp.prompt && (m.type === "app_preview" || m.type === "app_done"));
            if (msg) handleExportConfirm(msg.id);
            else setModal(null);
          }} />
      )}
    </div>
  );
}

// ─── Nav Button ───────────────────────────────────────────────────────────────
function NavBtn({ icon, label, active, onClick }: { icon:string; label:string; active:boolean; onClick:()=>void }) {
  return (
    <button onClick={onClick} className={`nav-tab flex flex-col items-center gap-1 px-8 py-2 rounded-2xl ${active ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}>
      <Icon name={icon} size={22} />
      <span className="text-[11px] font-medium">{label}</span>
      {active && <div className="w-1 h-1 rounded-full bg-primary" />}
    </button>
  );
}

// ─── Chat Screen ──────────────────────────────────────────────────────────────
function ChatScreen({ messages, isTyping, input, setInput, onSend, inputRef, messagesEndRef, fontSizeClass, onPreview, onCode, onExport, exportMsgId, allMessages, setMessages }: {
  messages: Message[]; isTyping: boolean; input: string; setInput:(v:string)=>void;
  onSend:()=>void; inputRef:React.RefObject<HTMLTextAreaElement>; messagesEndRef:React.RefObject<HTMLDivElement>;
  fontSizeClass:string; onPreview:(a:AppProject)=>void; onCode:(a:AppProject)=>void;
  onExport:(a:AppProject)=>void; exportMsgId:(id:string,a:AppProject)=>void;
  allMessages:Message[]; setMessages:React.Dispatch<React.SetStateAction<Message[]>>;
}) {
  const suggestions = ["Создай трекер привычек", "Создай магазин одежды", "Создай фитнес-приложение"];

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
          <MsgBubble key={msg.id} msg={msg} idx={i} fontSizeClass={fontSizeClass}
            onPreview={onPreview} onCode={onCode}
            onExport={(msgId, app) => exportMsgId(msgId, app)} />
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-end gap-2 animate-fade-up">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center shrink-0">
              <span className="text-xs">✦</span>
            </div>
            <div className="msg-bubble-ai px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Пишет</span>
                <div className="flex gap-0.5 items-center">
                  <div className="typing-dot w-1.5 h-1.5 rounded-full bg-primary" />
                  <div className="typing-dot w-1.5 h-1.5 rounded-full bg-primary" />
                  <div className="typing-dot w-1.5 h-1.5 rounded-full bg-primary" />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick suggestions */}
      <div className="px-4 pb-2 flex gap-2 overflow-x-auto shrink-0 no-scrollbar">
        {suggestions.map((s) => (
          <button key={s} onClick={() => setInput(s)}
            className="shrink-0 text-[10px] text-primary bg-primary/10 border border-primary/20 px-2.5 py-1.5 rounded-full whitespace-nowrap hover:bg-primary/20 transition-colors">
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 pb-3 shrink-0">
        <div className="glass rounded-2xl flex items-end gap-2 p-2 neon-glow">
          <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); onSend(); } }}
            placeholder="Сообщение или «Создай приложение…»"
            rows={1} className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground resize-none outline-none text-sm px-2 py-2 max-h-24 leading-relaxed"
            style={{ minHeight:"36px" }} />
          <button onClick={onSend} disabled={!input.trim()}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 ${input.trim() ? "bg-gradient-to-br from-violet-500 to-cyan-400 text-white hover:scale-105 active:scale-95" : "bg-muted text-muted-foreground"}`}>
            <Icon name="ArrowUp" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────
function MsgBubble({ msg, idx, fontSizeClass, onPreview, onCode, onExport }: {
  msg:Message; idx:number; fontSizeClass:string;
  onPreview:(a:AppProject)=>void; onCode:(a:AppProject)=>void; onExport:(id:string,a:AppProject)=>void;
}) {
  const isApp = ["app_building","app_preview","app_exporting","app_done"].includes(msg.type);

  if (isApp) return (
    <div className="flex justify-start animate-fade-up" style={{ animationDelay:`${idx*0.03}s` }}>
      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center mr-2 mt-auto shrink-0">
        <span className="text-xs">✦</span>
      </div>
      <AppCard msg={msg} onPreview={onPreview} onCode={onCode} onExport={onExport} />
    </div>
  );

  return (
    <div className={`flex animate-fade-up ${msg.role==="user" ? "justify-end" : "justify-start"}`} style={{ animationDelay:`${idx*0.03}s` }}>
      {msg.role==="ai" && (
        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center mr-2 mt-auto shrink-0">
          <span className="text-xs">✦</span>
        </div>
      )}
      <div className="max-w-[78%]">
        <div className={`px-4 py-3 ${fontSizeClass} leading-relaxed whitespace-pre-line ${msg.role==="user" ? "msg-bubble-user" : "msg-bubble-ai text-foreground"}`}>
          {msg.text}
        </div>
        <div className={`text-[10px] text-muted-foreground mt-1 px-1 ${msg.role==="user" ? "text-right" : "text-left"}`}>{msg.time}</div>
      </div>
    </div>
  );
}

// ─── App Card ─────────────────────────────────────────────────────────────────
function AppCard({ msg, onPreview, onCode, onExport }: {
  msg:Message; onPreview:(a:AppProject)=>void; onCode:(a:AppProject)=>void; onExport:(id:string,a:AppProject)=>void;
}) {
  const app = msg.app!;
  const prog = msg.progress ?? 0;

  const buildStages = ["Анализ","Генерация кода","Сборка UI","Компиляция"];
  const exportStages = ["Компиляция","Подпись APK","Упаковка","Готово"];

  if (msg.type === "app_building") return (
    <div className="msg-bubble-ai rounded-2xl p-4 w-64 space-y-3">
      <div className="flex items-center gap-2.5">
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center text-base shrink-0`}>{app.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-foreground truncate">{app.name}</div>
          <div className="flex items-center gap-1 text-[10px] text-primary font-medium">
            <span>{buildStages[Math.min(Math.floor(prog/25),3)]}</span>
            <div className="flex gap-0.5">
              <div className="typing-dot w-1 h-1 rounded-full bg-primary" />
              <div className="typing-dot w-1 h-1 rounded-full bg-primary" />
              <div className="typing-dot w-1 h-1 rounded-full bg-primary" />
            </div>
          </div>
        </div>
        <span className="text-xs text-muted-foreground shrink-0">{Math.round(prog)}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full bg-gradient-to-r ${app.color} transition-all duration-300`} style={{ width:`${prog}%` }} />
      </div>
      <div className="grid grid-cols-2 gap-1">
        {buildStages.map((s,i) => (
          <div key={s} className={`flex items-center gap-1 text-[9px] ${prog>=(i+1)*25 ? "text-emerald-500" : i===Math.floor(prog/25) ? "text-primary" : "text-muted-foreground"}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${prog>=(i+1)*25 ? "bg-emerald-500" : i===Math.floor(prog/25) ? "bg-primary animate-pulse" : "bg-muted"}`} />
            {s}
          </div>
        ))}
      </div>
    </div>
  );

  if (msg.type === "app_preview") return (
    <div className="msg-bubble-ai rounded-2xl overflow-hidden w-64">
      <div className={`bg-gradient-to-r ${app.color} p-3 flex items-center gap-2`}>
        <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-base">{app.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="text-white font-bold text-sm truncate">{app.name}</div>
          <div className="text-white/70 text-[10px]">Готово · Android 8.0+</div>
        </div>
        <div className="w-5 h-5 rounded-full bg-emerald-400 flex items-center justify-center shrink-0">
          <Icon name="Check" size={11} className="text-white" />
        </div>
      </div>
      <div className="p-3 space-y-2">
        {/* mini preview */}
        <div className="h-28 rounded-xl bg-muted/30 overflow-hidden border border-border/30">
          <MiniPreview app={app} />
        </div>
        <div className="grid grid-cols-3 gap-1">
          {["3 экрана","~4 МБ","8.0+"].map((s,i) => (
            <div key={i} className="bg-muted/30 rounded-lg py-1.5 text-center">
              <div className="text-xs font-bold text-foreground">{s}</div>
            </div>
          ))}
        </div>
        {/* 3 кнопки */}
        <div className="flex gap-1.5">
          <button onClick={() => onPreview(app)}
            className="flex-1 py-2 rounded-xl bg-muted/50 text-foreground text-[11px] font-medium flex items-center justify-center gap-1 hover:bg-muted transition-colors">
            <Icon name="Play" size={11} /> Запуск
          </button>
          <button onClick={() => onCode(app)}
            className="flex-1 py-2 rounded-xl bg-muted/50 text-foreground text-[11px] font-medium flex items-center justify-center gap-1 hover:bg-muted transition-colors">
            <Icon name="Code2" size={11} /> Код
          </button>
          <button onClick={() => onExport(msg.id, app)}
            className={`flex-1 py-2 rounded-xl text-white text-[11px] font-medium flex items-center justify-center gap-1 bg-gradient-to-r ${app.color} hover:opacity-90`}>
            <Icon name="Download" size={11} /> APK
          </button>
        </div>
      </div>
    </div>
  );

  if (msg.type === "app_exporting") return (
    <div className="msg-bubble-ai rounded-2xl p-4 w-64 space-y-3">
      <div className="flex items-center gap-2.5">
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center text-base shrink-0`}>{app.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-foreground truncate">{app.name}.apk</div>
          <div className="flex items-center gap-1 text-[10px] text-primary">
            <span>{exportStages[Math.min(Math.floor(prog/25),3)]}</span>
            <div className="flex gap-0.5">
              <div className="typing-dot w-1 h-1 rounded-full bg-primary" />
              <div className="typing-dot w-1 h-1 rounded-full bg-primary" />
              <div className="typing-dot w-1 h-1 rounded-full bg-primary" />
            </div>
          </div>
        </div>
        <span className="text-xs text-muted-foreground shrink-0">{Math.round(prog)}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full bg-gradient-to-r ${app.color} transition-all duration-200`} style={{ width:`${prog}%` }} />
      </div>
      <div className="space-y-1">
        {exportStages.map((s,i) => (
          <div key={s} className={`flex items-center gap-2 text-[10px] ${prog>=(i+1)*25 ? "text-emerald-500" : i===Math.floor(prog/25) ? "text-foreground font-medium" : "text-muted-foreground"}`}>
            <div className={`w-3 h-3 rounded-full flex items-center justify-center shrink-0 ${prog>=(i+1)*25 ? "bg-emerald-500" : i===Math.floor(prog/25) ? "bg-primary" : "bg-muted"}`}>
              {prog>=(i+1)*25 && <Icon name="Check" size={8} className="text-white" />}
            </div>
            {s}
          </div>
        ))}
      </div>
    </div>
  );

  if (msg.type === "app_done") return (
    <div className="msg-bubble-ai rounded-2xl overflow-hidden w-64">
      <div className="bg-gradient-to-r from-emerald-500 to-cyan-400 p-3 flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-base">{app.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="text-white font-bold text-sm truncate">{app.name}.apk</div>
          <div className="text-white/80 text-[10px]">Готов к установке 🎉</div>
        </div>
        <span className="text-xl">✅</span>
      </div>
      <div className="p-3 space-y-2">
        <div className="grid grid-cols-2 gap-1">
          {[["Размер","4.2 МБ"],["Версия","1.0.0"],["Android","8.0+"],["Экранов","3"]].map(([k,v]) => (
            <div key={k} className="bg-muted/30 rounded-lg px-2 py-1.5 flex justify-between text-[10px]">
              <span className="text-muted-foreground">{k}</span>
              <span className="text-foreground font-medium">{v}</span>
            </div>
          ))}
        </div>
        <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-400 text-white text-xs font-semibold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all">
          <Icon name="Download" size={14} /> Скачать APK
        </button>
      </div>
    </div>
  );

  return null;
}

// ─── Mini Preview ─────────────────────────────────────────────────────────────
function MiniPreview({ app }: { app: AppProject }) {
  return (
    <div className="w-full h-full flex flex-col">
      <div className={`bg-gradient-to-r ${app.color} px-2 py-1.5 flex items-center gap-1.5`}>
        <span className="text-sm">{app.icon}</span>
        <span className="text-white text-[9px] font-bold">{app.name}</span>
      </div>
      <div className="flex-1 bg-background p-1.5 space-y-1">
        {["Элемент 1","Элемент 2","Элемент 3"].map((s) => (
          <div key={s} className="flex items-center gap-1.5 bg-muted/40 rounded-md px-2 py-1">
            <div className={`w-3 h-3 rounded bg-gradient-to-br ${app.color} opacity-70 shrink-0`} />
            <span className="text-[8px] text-foreground">{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Preview Modal ────────────────────────────────────────────────────────────
function PreviewModal({ app, onClose }: { app: AppProject; onClose: () => void }) {
  const [screen, setScreen] = useState(0);
  const screens = [
    { label:"Главная", icon:"Home" },
    { label:"Каталог", icon:"Grid3x3" },
    { label:"Профиль", icon:"User" },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="w-full max-w-xs" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="text-white font-bold text-sm flex items-center gap-2">
            <span>{app.icon}</span>{app.name} — Превью
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
            <Icon name="X" size={15} className="text-white" />
          </button>
        </div>
        <div className="w-full h-[540px] rounded-[28px] overflow-hidden border-2 border-white/20 shadow-2xl bg-background flex flex-col">
          <div className="glass px-5 pt-3 pb-1.5 flex justify-between shrink-0">
            <span className="text-[10px] font-mono text-muted-foreground">9:41</span>
            <div className="flex gap-1"><Icon name="Wifi" size={11} className="text-muted-foreground" /><Icon name="Battery" size={11} className="text-muted-foreground" /></div>
          </div>
          <div className="flex-1 overflow-hidden bg-background">
            {screen === 0 && <AppHomeScreen app={app} />}
            {screen === 1 && <AppCatalogScreen app={app} />}
            {screen === 2 && <AppProfileScreen app={app} />}
          </div>
          <div className="glass px-3 pb-4 pt-2 flex justify-around border-t border-border/20">
            {screens.map((s,i) => (
              <button key={s.label} onClick={() => setScreen(i)} className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[10px] font-medium ${i===screen ? "text-primary bg-primary/10" : "text-muted-foreground"}`}>
                <Icon name={s.icon} size={16} />{s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Code Modal ───────────────────────────────────────────────────────────────
function CodeModal({ app, onClose }: { app: AppProject; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(app.code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end justify-center z-50" onClick={onClose}>
      <div className="w-full max-w-sm bg-[#0d1117] rounded-t-3xl border border-white/10 overflow-hidden" style={{ maxHeight:"85vh" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${app.color} flex items-center justify-center text-xs`}>{app.icon}</div>
            <span className="text-white text-sm font-bold">{app.name} — Исходный код</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={copy} className={`text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors ${copied ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-white/70 hover:bg-white/20"}`}>
              <Icon name={copied ? "Check" : "Copy"} size={12} />
              {copied ? "Скопировано" : "Копировать"}
            </button>
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
              <Icon name="X" size={14} className="text-white/70" />
            </button>
          </div>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight:"calc(85vh - 60px)" }}>
          <pre className="text-[11px] text-green-300/90 p-4 font-mono leading-relaxed overflow-x-auto whitespace-pre">
            {app.code}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ─── Export Modal ─────────────────────────────────────────────────────────────
function ExportModal({ app, name, setName, onClose, onConfirm }: {
  app: AppProject; name: string; setName:(v:string)=>void; onClose:()=>void; onConfirm:()=>void;
}) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end justify-center z-50" onClick={onClose}>
      <div className="w-full max-w-sm glass rounded-t-3xl border border-border/50 p-5 space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div className="font-bold text-foreground text-base">Экспорт APK</div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
            <Icon name="X" size={14} className="text-muted-foreground" />
          </button>
        </div>
        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-2xl">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center text-lg shrink-0`}>{app.icon}</div>
          <div>
            <div className="text-sm font-semibold text-foreground">{app.name}</div>
            <div className="text-xs text-muted-foreground">Android 8.0+</div>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Название APK-файла</label>
          <div className="glass rounded-xl flex items-center gap-2 px-3 py-2.5">
            <Icon name="Package" size={15} className="text-muted-foreground shrink-0" />
            <input value={name} onChange={(e) => setName(e.target.value)}
              className="flex-1 bg-transparent text-foreground text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Название файла" />
            <span className="text-xs text-muted-foreground shrink-0">.apk</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-center">
          {[["Версия","1.0.0"],["Android","8.0+"],["Размер","~4 МБ"],["Экранов","3"]].map(([k,v]) => (
            <div key={k} className="bg-muted/30 rounded-xl py-2">
              <div className="text-muted-foreground">{k}</div>
              <div className="text-foreground font-semibold">{v}</div>
            </div>
          ))}
        </div>
        <button onClick={onConfirm} className={`w-full py-3.5 rounded-2xl text-white font-semibold text-sm flex items-center justify-center gap-2 bg-gradient-to-r ${app.color} hover:opacity-90 active:scale-95 transition-all`}>
          <Icon name="Download" size={18} /> Собрать и скачать APK
        </button>
      </div>
    </div>
  );
}

// ─── App Screens ──────────────────────────────────────────────────────────────
function AppHomeScreen({ app }: { app: AppProject }) {
  return (
    <div className="h-full flex flex-col">
      <div className={`bg-gradient-to-br ${app.color} px-4 pt-4 pb-8`}>
        <div className="text-white/70 text-xs">Добро пожаловать</div>
        <div className="text-white font-bold text-xl mt-1">{app.name}</div>
      </div>
      <div className="flex-1 px-3 py-3 -mt-4 space-y-2 overflow-y-auto">
        {["Главный раздел","Мои данные","Активность","История"].map((s) => (
          <div key={s} className="glass rounded-xl px-3 py-2.5 flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${app.color} opacity-80 flex items-center justify-center text-xs`}>{app.icon}</div>
            <span className="text-sm text-foreground flex-1">{s}</span>
            <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
          </div>
        ))}
      </div>
    </div>
  );
}
function AppCatalogScreen({ app }: { app: AppProject }) {
  return (
    <div className="h-full flex flex-col bg-background">
      <div className="px-4 pt-3 pb-2 shrink-0">
        <div className="font-bold text-foreground">Каталог</div>
        <div className="mt-2 h-8 glass rounded-xl flex items-center px-3 gap-2">
          <Icon name="Search" size={13} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Поиск...</span>
        </div>
      </div>
      <div className="flex-1 px-3 pb-2 overflow-y-auto grid grid-cols-2 gap-2 content-start">
        {[1,2,3,4,5,6].map((n) => (
          <div key={n} className="glass rounded-xl overflow-hidden">
            <div className={`aspect-video bg-gradient-to-br ${app.color} flex items-center justify-center text-2xl`} style={{ opacity: 0.6+n*0.06 }}>{app.icon}</div>
            <div className="p-2"><div className="text-xs font-medium text-foreground">Элемент {n}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}
function AppProfileScreen({ app }: { app: AppProject }) {
  return (
    <div className="h-full bg-background px-3 py-4 overflow-y-auto">
      <div className="flex flex-col items-center mb-4">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center text-2xl`}>{app.icon}</div>
        <div className="font-bold text-foreground text-sm mt-2">Пользователь</div>
        <div className="text-xs text-muted-foreground">user@email.com</div>
      </div>
      <div className="space-y-1.5">
        {["Редактировать","Уведомления","Безопасность","Выйти"].map((item) => (
          <button key={item} className="w-full glass rounded-xl px-3 py-2.5 flex items-center justify-between">
            <span className="text-xs text-foreground">{item}</span>
            <Icon name="ChevronRight" size={13} className="text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Settings Screen ──────────────────────────────────────────────────────────
function SettingsScreen({ theme, setTheme, notifications, setNotifications, language, setLanguage, searchEngine, setSearchEngine, fontSize, setFontSize }: {
  theme:Theme; setTheme:(t:Theme)=>void; notifications:boolean; setNotifications:(v:boolean)=>void;
  language:string; setLanguage:(v:string)=>void; searchEngine:string; setSearchEngine:(v:string)=>void;
  fontSize:"small"|"medium"|"large"; setFontSize:(v:"small"|"medium"|"large")=>void;
}) {
  const [langSearch, setLangSearch] = useState("");
  const filtered = LANGUAGES.filter((l) =>
    l.name.toLowerCase().includes(langSearch.toLowerCase()) ||
    l.code.toLowerCase().includes(langSearch.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="glass px-5 py-4 border-b border-border/30">
        <h1 className="text-lg font-bold text-foreground">Настройки</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Персонализируй приложение</p>
      </div>
      <div className="px-4 py-4 space-y-4">

        {/* Theme */}
        <div className="glass rounded-3xl p-4">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Тема оформления</div>
          <div className="flex gap-2">
            {(["light","dark"] as Theme[]).map((t) => (
              <button key={t} onClick={() => setTheme(t)}
                className={`flex-1 py-4 rounded-2xl flex flex-col items-center gap-2 transition-all duration-200 ${theme===t ? "bg-primary text-primary-foreground shadow-lg scale-[1.02]" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}>
                <Icon name={t==="light" ? "Sun" : "Moon"} size={22} />
                <span className="text-xs font-semibold">{t==="light" ? "Светлая" : "Тёмная"}</span>
                {theme===t && <div className="w-4 h-1 rounded-full bg-white/40" />}
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="glass rounded-3xl p-4">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Язык интерфейса</div>
          <div className="glass rounded-xl flex items-center gap-2 px-3 py-2 mb-3">
            <Icon name="Search" size={13} className="text-muted-foreground shrink-0" />
            <input value={langSearch} onChange={(e) => setLangSearch(e.target.value)}
              placeholder="Поиск языка..."
              className="flex-1 bg-transparent text-foreground text-xs outline-none placeholder:text-muted-foreground" />
          </div>
          <div className="grid grid-cols-2 gap-1.5 max-h-44 overflow-y-auto pr-1">
            {filtered.map((l) => (
              <button key={l.code} onClick={() => setLanguage(l.code)}
                className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs transition-all ${language===l.code ? "bg-primary text-primary-foreground font-semibold" : "bg-muted/40 text-foreground hover:bg-muted"}`}>
                <span className="text-base leading-none">{l.flag}</span>
                <span className="truncate">{l.name}</span>
                {language===l.code && <Icon name="Check" size={11} className="ml-auto shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Search Engine */}
        <div className="glass rounded-3xl p-4">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Поисковая система</div>
          <div className="grid grid-cols-2 gap-2">
            {SEARCH_ENGINES.map((se) => (
              <button key={se.id} onClick={() => setSearchEngine(se.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs transition-all ${searchEngine===se.id ? "bg-primary text-primary-foreground font-semibold" : "bg-muted/40 text-foreground hover:bg-muted"}`}>
                <span className="text-base leading-none">{se.flag}</span>
                <span>{se.name}</span>
                {searchEngine===se.id && <Icon name="Check" size={11} className="ml-auto" />}
              </button>
            ))}
          </div>
        </div>

        {/* Font size */}
        <div className="glass rounded-3xl p-4">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Размер текста</div>
          <div className="flex gap-2">
            {(["small","medium","large"] as const).map((size) => (
              <button key={size} onClick={() => setFontSize(size)}
                className={`flex-1 py-2.5 rounded-xl transition-all ${fontSize===size ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}>
                <div className={`font-bold ${size==="small" ? "text-sm" : size==="large" ? "text-xl" : "text-base"}`}>А</div>
                <div className="text-[9px] mt-0.5 opacity-70">{size==="small" ? "Мелкий" : size==="medium" ? "Средний" : "Крупный"}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="glass rounded-3xl p-4">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Уведомления</div>
          <ToggleRow icon="Bell" label="Push-уведомления" description="Получать уведомления" value={notifications} onChange={setNotifications} />
        </div>

        {/* About */}
        <div className="glass rounded-3xl p-4">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">О приложении</div>
          {[{icon:"Info",label:"Версия",value:"1.0.0"},{icon:"Shield",label:"Конфиденциальность",value:""},{icon:"FileText",label:"Условия",value:""}].map((item) => (
            <button key={item.label} className="w-full flex items-center gap-3 py-2 px-1 rounded-xl hover:bg-muted/30 transition-colors">
              <div className="w-8 h-8 rounded-xl bg-muted/50 flex items-center justify-center">
                <Icon name={item.icon} size={15} className="text-muted-foreground" />
              </div>
              <span className="flex-1 text-sm text-foreground text-left">{item.label}</span>
              {item.value ? <span className="text-xs text-muted-foreground font-mono">{item.value}</span> : <Icon name="ChevronRight" size={14} className="text-muted-foreground" />}
            </button>
          ))}
        </div>
        <div className="h-4" />
      </div>
    </div>
  );
}

function ToggleRow({ icon, label, description, value, onChange }: { icon:string; label:string; description:string; value:boolean; onChange:(v:boolean)=>void }) {
  return (
    <div className="flex items-center gap-3 py-1 px-1">
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
