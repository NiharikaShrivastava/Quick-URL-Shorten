async function shortenUrl() {
  const longUrl = document.getElementById("longUrl").value.trim();
  const result = document.getElementById("result");

  if (!longUrl) {
    result.textContent = "Please enter a URL.";
    return;
  }

  try {
    const response = await fetch("https://us-central1-quick-url-shortner-a96ca.cloudfunctions.net/api/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ originalUrl: longUrl })
    });

    if (!response.ok) {
      throw new Error("Failed to shorten URL");
    }

    const data = await response.json();
    result.innerHTML = `Short URL: <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>`;
  } catch (error) {
    result.textContent = "Error: " + error.message;
  }
}
