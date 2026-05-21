const input = document.querySelector("#file-input");
const results = document.querySelector("#results");
const fileCount = document.querySelector("#file-count");
const interestForm = document.querySelector("#interest-form");

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), 3);
  const value = bytes / 1024 ** index;
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

async function sha256(file) {
  const buffer = await file.arrayBuffer();
  const hash = await crypto.subtle.digest("SHA-256", buffer);
  return [...new Uint8Array(hash)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

input.addEventListener("change", async (event) => {
  const files = [...event.target.files];
  fileCount.textContent = files.length.toString();
  results.innerHTML = "";

  for (const file of files) {
    const hash = await sha256(file);
    const row = document.createElement("article");
    row.className = "file-row";
    row.innerHTML = `
      <strong>${file.name}</strong>
      <span>${formatBytes(file.size)} - ${file.type || "application/octet-stream"}</span>
      <code>${hash}</code>
    `;
    results.append(row);
  }
});

interestForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.querySelector("#lead-email").value.trim();
  const useCase = document.querySelector("#lead-use-case").value;
  const details = document.querySelector("#lead-details").value.trim();
  const subject = encodeURIComponent("Quiero probar Carpeta Certificada");
  const body = encodeURIComponent(
    [
      "Hola, quiero probar Carpeta Certificada.",
      "",
      `Email: ${email}`,
      `Caso de uso: ${useCase}`,
      `Detalle: ${details || "Sin detalle"}`,
      "",
      "Me interesa validar el certificado completo por 4,90 EUR si encaja con mi caso.",
    ].join("\n"),
  );

  window.location.href = `mailto:programacioniphonesdk@gmail.com?subject=${subject}&body=${body}`;
});
