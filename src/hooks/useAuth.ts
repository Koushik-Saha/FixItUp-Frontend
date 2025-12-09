// src/hooks/useAuth.ts
"use client";

import { useAuthStore } from "@/store/authStore";

export const useAuth = () => useAuthStore();
