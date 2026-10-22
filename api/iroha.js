export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const targetPath = req.query.path || "";

    const allowedPrefixes = [
      "/v1/aio",
      "/v1/tt",
      "/v1/fbdown",
      "/v1/ytmp4",
      "/v1/yt/s/play",
      "/v1/spotify",
      "/v1/twitter"
    ];

    const isAllowed = allowedPrefixes.some((prefix) => targetPath.startsWith(prefix));
    if (!isAllowed) {
      return res.status(403).json({ status: false, error: "Route tidak diizinkan" });
    }

    const API_KEY =
      process.env.IROHA_API_KEY ||
      "iroha_267d3ed4b6d2afa34b83e7aa6747ee35bd29c9d7eea10cd6";

    const upstreamUrl = `https://api.iroha-api.web.id${targetPath}`;

    const fetchOptions = {
      method: req.method || "GET",
      headers: {
        "X-API-Key": API_KEY,
        "Accept": "application/json, */*",
        "User-Agent": "KevnaiMediaV2/2.0"
      }
    };

    if (req.method === "POST" && req.body) {
      fetchOptions.headers["Content-Type"] = "application/json";
      fetchOptions.body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    }

    const response = await fetch(upstreamUrl, fetchOptions);
    const contentType = response.headers.get("content-type") || "application/json";
    res.setHeader("Content-Type", contentType);

    const buffer = Buffer.from(await response.arrayBuffer());
    return res.status(response.status).send(buffer);
  } catch (err) {
    return res.status(500).json({
      status: false,
      error: "Gagal menghubungkan ke server pengunduh"
    });
  }
}
