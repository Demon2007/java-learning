import { create } from "zustand";

const useGameStore = create((set, get) => ({
  notifications: [],
  levelUpData: null,
  achievementQueue: [],

  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, { id: Date.now(), ...notification }],
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  showLevelUp: (level) => set({ levelUpData: { level, timestamp: Date.now() } }),
  hideLevelUp: () => set({ levelUpData: null }),

  queueAchievement: (achievement) =>
    set((state) => ({
      achievementQueue: [...state.achievementQueue, { ...achievement, id: Date.now() }],
    })),

  dequeueAchievement: () =>
    set((state) => ({
      achievementQueue: state.achievementQueue.slice(1),
    })),
}));

export default useGameStore;
