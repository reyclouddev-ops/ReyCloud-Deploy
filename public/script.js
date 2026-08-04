const form = document.getElementById("deployForm");
const fileInput = document.getElementById("project");
const fileText = document.getElementById("fileText");
const button = document.getElementById("deployButton");

const progressBox = document.getElementById("progressBox");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const progressPercent = document.getElementById("progressPercent");

const steps = [
  document.getElementById("step1"),
  document.getElementById("step2"),
  document.getElementById("step3"),
  document.getElementById("step4")
];

const result = document.getElementById("result");

fileInput.addEventListener("change", () => {
  if (!fileInput.files.length) {
    fileText.textContent = "Pilih project";
    return;
  }

  fileText.textContent =
    fileInput.files[0].name;
});

function setProgress(
  step,
  percent,
  text
) {
  steps.forEach(
    (item, index) => {
      item.classList.remove(
        "active"
      );

      if (index < step) {
        item.classList.add(
          "done"
        );
      }

      if (index === step) {
        item.classList.add(
          "active"
        );
      }
    }
  );

  progressFill.style.width =
    `${percent}%`;

  progressPercent.textContent =
    `${percent}%`;

  progressText.textContent =
    text;
}

function setAllDone() {
  steps.forEach(step => {
    step.classList.remove(
      "active"
    );

    step.classList.add(
      "done"
    );
  });

  progressFill.style.width =
    "100%";

  progressPercent.textContent =
    "100%";

  progressText.textContent =
    "Deployment berhasil!";
}

function showError(message) {
  result.innerHTML = `
    <div class="error">
      ❌ ${message}
    </div>
  `;
}

form.addEventListener(
  "submit",
  async event => {
    event.preventDefault();

    if (!fileInput.files.length) {
      showError(
        "Pilih file project terlebih dahulu."
      );

      return;
    }

    const projectName =
      document
        .getElementById(
          "subdomain"
        )
        .value
        .trim();

    if (!projectName) {
      showError(
        "Nama project wajib diisi."
      );

      return;
    }

    const formData =
      new FormData(form);

    button.disabled = true;

    button.textContent =
      "⏳ Deploying...";

    result.innerHTML = "";

    progressBox.style.display =
      "block";

    try {
      setProgress(
        0,
        10,
        "📦 Memuat file..."
      );

      await new Promise(
        resolve =>
          setTimeout(
            resolve,
            500
          )
      );

      setProgress(
        1,
        30,
        "☁️ Meminta request API Vercel..."
      );

      const response =
        await fetch(
          "/api/deploy",
          {
            method: "POST",
            body: formData
          }
        );

      setProgress(
        2,
        65,
        "📤 Data berhasil di-upload..."
      );

      const data =
        await response.json();

      if (!response.ok ||
          !data.status) {
        throw new Error(
          data.message ||
          "Deployment gagal."
        );
      }

      setProgress(
        3,
        90,
        "🚀 Menuju tahap akhir..."
      );

      await new Promise(
        resolve =>
          setTimeout(
            resolve,
            700
          )
      );

      setAllDone();

      result.innerHTML = `
        <div class="success">
          ✅ <strong>Deployment berhasil!</strong>

          <br><br>

          🌐 Domain
          <br>

          <a
            class="result-link"
            href="${data.customDomain}"
            target="_blank"
            rel="noopener noreferrer"
          >
            ${data.customDomain}
          </a>

          <br><br>

          🔗 Vercel
          <br>

          <a
            class="result-link"
            href="${data.vercelUrl}"
            target="_blank"
            rel="noopener noreferrer"
          >
            ${data.vercelUrl}
          </a>

          <br><br>

          📦 ${data.files} file
        </div>
      `;
    } catch (error) {
      showError(
        error.message
      );
    } finally {
      button.disabled = false;

      button.textContent =
        "🚀 Deploy Sekarang";
    }
  }
);
