export default async function apiFetch(
  endPoint,
  method = "GET",
  options = {},
) {
  const backend_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("accessToken");
try{
  let res = await fetch(`${backend_URL}${endPoint}`, {
    ...options,
    method,
    credentials: "include",
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    if (!endPoint.startsWith("/auth") && res.status === 401) {
      const resRefresh = await fetch(`${backend_URL}${"/auth/refresh"}`, {
        credentials: "include",
        headers: {
          ...options.headers,
          "Content-Type": "application/json",
        },
      });
      if (!resRefresh.ok) {
        localStorage.removeItem("accessToken");
        throw new Error("RefreshToken invalide");
        //deconnection
      }

      const resRefreshJson = await resRefresh.json();
      localStorage.setItem("accessToken", resRefreshJson.accessToken);
      res = await fetch(`${backend_URL}${endPoint}`, {
        ...options,
        method,
        credentials: "include",
        headers: {
          ...options.headers,
          "Content-Type": "application/json",
          Authorization: `Bearer ${resRefreshJson.accessToken}`
        },
      });
    }
  }

  return res;
}catch(e){
    // localStorage.removeItem("accessToken")
    throw new Error(`${e.message || e} - Une erreur est survenue pendant la requete`)
}
}
