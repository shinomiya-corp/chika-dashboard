import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Guild, User } from '../graphql/generated';

export interface IStoreFields {
  // User info
  user?: Omit<User, 'guild'>;
  setUser: (user?: User) => void;
  guilds: Guild[];
  setGuilds: (guilds: Guild[]) => void;
  unauthorized?: boolean;

  // Active guild
  activeGuild?: Guild;
  setActiveGuild: (guild?: Guild) => void;

  // Layout
  mobileOpen: boolean;
  toggleMobileOpen: () => void;

  // wow
  clearStore: () => void;
}

export const useStore = create<IStoreFields>(
  devtools(
    persist(
      (set) => ({
        // User info
        setUser: (user?: User) => set({ user }),
        guilds: [],
        setGuilds: (guilds: Guild[]) => set({ guilds }),

        // Active guild
        setActiveGuild: (guild?: Guild) => set({ activeGuild: guild }),

        // Layout
        mobileOpen: false,
        toggleMobileOpen: () =>
          set(({ mobileOpen }) => set({ mobileOpen: !mobileOpen })),

        // wow
        clearStore: () => set({}, true),
      }),
      {
        name: 'zustand-store',
        whitelist: ['user', 'guilds', 'activeGuild'],
      },
    ),
  ),
);
