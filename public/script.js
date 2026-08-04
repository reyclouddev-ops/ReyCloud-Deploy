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

  fileText.textContent = fileInput.files[0].name;
});

function setProgress(step, percent, text) {
  steps.forEach((item, index) => {
    item.classList.remove("active");

    if (index < step) {
      item.classList.add("done");
    }

    if (index === step) {
      item.classList.add("active");
    }
  });

  progressFill.style.width = `${percent}%`;
  progressPercent.textContent = `${percent}%`;
  progressText.textContent = text;
}

form.addEventListener("submit", event => {
  event.preventDefault();

  if (!fileInput.files.length) {
    return;
  }

  progressBox.style.display = "block";
  result.innerHTML = "";

  button.disabled = true;
  button.textContent = "⏳ Menyiapkan...";

  setProgress(0, 10, "Memuat file...");
});
