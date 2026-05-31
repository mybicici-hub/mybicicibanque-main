import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: "info" | "success" | "warning";
}

interface NotifCtx {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: Omit<Notification, "id" | "date" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllRead: () => void;
  remove: (id: string) => void;
}

const Ctx = createContext<NotifCtx | null>(null);
const KEY = "mybicici_notifications";

const seed: Notification[] = [
  { id: "n1", title: "Bienvenue chez BICICI BANQUE", message: "Votre espace MyBICICI est activé. Profitez de tous nos services.", date: new Date().toISOString(), read: false, type: "success" },
  { id: "n2", title: "Sécurité renforcée", message: "Pensez à activer la double authentification dans Paramètres.", date: new Date(Date.now() - 3600_000).toISOString(), read: false, type: "info" },
  { id: "n3", title: "Nouveau service Investissement", message: "Découvrez nos opportunités de placement avec rendement garanti.", date: new Date(Date.now() - 86400_000).toISOString(), read: false, type: "info" },
];

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      setNotifications(raw ? JSON.parse(raw) : seed);
    } catch { setNotifications(seed); }
  }, []);

  const persist = (list: Notification[]) => {
    setNotifications(list);
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
  };

  const addNotification: NotifCtx["addNotification"] = (n) => {
    const item: Notification = { ...n, id: "n" + Date.now(), date: new Date().toISOString(), read: false };
    persist([item, ...notifications]);
  };
  const markAsRead = (id: string) => persist(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => persist(notifications.map(n => ({ ...n, read: true })));
  const remove = (id: string) => persist(notifications.filter(n => n.id !== id));

  const unreadCount = notifications.filter(n => !n.read).length;

  return <Ctx.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllRead, remove }}>{children}</Ctx.Provider>;
}

export function useNotifications() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useNotifications must be used within NotificationsProvider");
  return c;
}
