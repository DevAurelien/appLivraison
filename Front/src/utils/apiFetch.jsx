import { useState } from "react";

export default async function apiFetch(
  endPoint,
  method = "GET",
  options = {},
) {
  const backend_URL = import.meta.env.VITE_BACKEND_URL;

  const token = localStorage.getItem("accessToken");

  try {
    let res = await fetch(`${backend_URL}${endPoint}`, {
      ...options,
      method,
      credentials: "include",
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },
    });

    if (
      res.status === 401 &&
      !endPoint.startsWith("/auth")
    ) {
      const resRefresh = await fetch(
        `${backend_URL}/auth/refresh`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!resRefresh.ok) {
        localStorage.removeItem("accessToken");

        window.dispatchEvent(
          new CustomEvent("session-expiree"),
        );

        throw new Error("RefreshToken invalide");
      }

      const resRefreshJson =
        await resRefresh.json();

      const nouveauToken =
        resRefreshJson.accessToken;

      const user = resRefreshJson.user;
      console.log(user)

      if (!nouveauToken) {
        localStorage.removeItem("accessToken");

        window.dispatchEvent(
          new CustomEvent("session-expiree"),
        );

        throw new Error(
          "Nouveau accessToken absent",
        );
      }

      localStorage.setItem(
        "accessToken",
        nouveauToken,
      );

      res = await fetch(
        `${backend_URL}${endPoint}`,
        {
          ...options,
          method,
          credentials: "include",
          headers: {
            ...options.headers,
            "Content-Type": "application/json",
            Authorization: `Bearer ${nouveauToken}`,
          },
        },
      );
    }

    return res;
  } catch (e) {
    throw new Error(
      `${e.message || e} - Une erreur est survenue pendant la requête`,
    );
  }
}