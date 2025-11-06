import { createContext, useContext, useMemo, useState } from "react";
import React from "react";
const NotificationsContext = createContext();
export const useNotifications = () => useContext(NotificationsContext);

export default function NotificationsProvider({ children }) {
  const [items, setItems] = useState([
    { id: 1, text: "New recipe: Shrimp Tacos", read: false },
    { id: 2, text: "Chef Sophia posted Healthy Lunches", read: false },
    { id: 3, text: "Your meal plan for next week is ready", read: true }
  ]);

  const unread = useMemo(() => items.filter(i => !i.read).length, [items]);

  const markAllRead = () =>
    setItems(prev => prev.map(n => ({ ...n, read: true })));

  const add = text =>
    setItems(prev => [{ id: Date.now(), text, read: false }, ...prev]);

  return (
    <NotificationsContext.Provider value={{ items, unread, markAllRead, add }}>
      {children}
    </NotificationsContext.Provider>
  );
}