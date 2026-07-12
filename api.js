const BelleApi = (() => {
  const isStaticLocalPreview =
    window.location.protocol === "file:" ||
    ["5500", "5501"].includes(window.location.port);

  const API_BASE = isStaticLocalPreview
    ? "http://localhost:8080/api"
    : `${window.location.origin}/api`;

  async function request(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });

    if (response.status === 404) {
      throw new Error("Backend endpoint not found. Start the Java API server first.");
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data.message || "Server request failed");
      error.status = response.status;
      throw error;
    }
    return data;
  }

  return {
    health: () => request("/health"),
    products: (category = "all") => request(`/products?category=${encodeURIComponent(category)}`),
    login: (payload) => request("/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
    signup: (payload) => request("/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
    placeOrder: (payload) => request("/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
    seirraa: (payload) => request("/seirraa", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  };
})();
