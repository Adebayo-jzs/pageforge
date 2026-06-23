export const addDomainToVercel = async (domain: string) => {
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID;
  const authToken = process.env.VERCEL_API_TOKEN;

  if (!projectId || !authToken) {
    console.warn("Missing VERCEL_PROJECT_ID or VERCEL_API_TOKEN. Skipping Vercel domain addition.");
    return { success: false, error: "Missing Vercel API credentials" };
  }

  const url = new URL(`https://api.vercel.com/v10/projects/${projectId}/domains`);
  if (teamId) {
    url.searchParams.set("teamId", teamId);
  }

  try {
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: domain }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Failed to add domain to Vercel:", data);
      return { success: false, error: data.error?.message || "Failed to add domain" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error adding domain to Vercel:", error);
    return { success: false, error: "Network error when connecting to Vercel API" };
  }
};

export const removeDomainFromVercel = async (domain: string) => {
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID;
  const authToken = process.env.VERCEL_API_TOKEN;

  if (!projectId || !authToken) {
    console.warn("Missing VERCEL_PROJECT_ID or VERCEL_API_TOKEN. Skipping Vercel domain removal.");
    return { success: false, error: "Missing Vercel API credentials" };
  }

  const url = new URL(`https://api.vercel.com/v9/projects/${projectId}/domains/${domain}`);
  if (teamId) {
    url.searchParams.set("teamId", teamId);
  }

  try {
    const response = await fetch(url.toString(), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Failed to remove domain from Vercel:", data);
      return { success: false, error: data.error?.message || "Failed to remove domain" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error removing domain from Vercel:", error);
    return { success: false, error: "Network error when connecting to Vercel API" };
  }
};
