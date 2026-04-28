const form = document.getElementById("assessment-form");
const errorText = document.getElementById("form-error");
const resultsCard = document.getElementById("results-card");

const scoreEl = document.getElementById("readiness-score");
const levelEl = document.getElementById("readiness-level");
const companyEl = document.getElementById("result-company");
const weakAreasEl = document.getElementById("weak-areas");
const recommendationsEl = document.getElementById("recommendations");
const bookButton = document.getElementById("book-session");

const questionMap = {
  capital: "Capital Strength",
  governance: "Governance & Leadership",
  operations: "Operational Efficiency",
  technology: "Technology Capacity",
  product: "Product Innovation",
  brand: "Brand Equity",
  distribution: "Distribution Strength",
  regulatory: "Regulatory Readiness",
};

const recommendationMap = {
  technology: "Digital Transformation",
  governance: "Board Retreat",
  distribution: "Sales Bootcamp",
  product: "Product Innovation Lab",
  brand: "Brand Recalibration",
};

function getReadinessLevel(totalScore) {
  if (totalScore <= 16) return "Weak";
  if (totalScore <= 24) return "Emerging";
  if (totalScore <= 32) return "Competitive";
  return "Market Leader";
}

function appendListItems(container, items, fallbackText) {
  container.innerHTML = "";

  if (!items.length) {
    const li = document.createElement("li");
    li.textContent = fallbackText;
    container.appendChild(li);
    return;
  }

  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    container.appendChild(li);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  errorText.textContent = "";

  if (!form.checkValidity()) {
    errorText.textContent = "Please complete all required fields with ratings from 1 to 5.";
    return;
  }

  const formData = new FormData(form);
  let totalScore = 0;
  const weakAreas = [];
  const recommendations = new Set();

  for (const [key, label] of Object.entries(questionMap)) {
    const score = Number(formData.get(key));

    if (!Number.isFinite(score) || score < 1 || score > 5) {
      errorText.textContent = "Each rating must be a number between 1 and 5.";
      return;
    }

    totalScore += score;

    if (score < 3) {
      weakAreas.push(label);
      if (recommendationMap[key]) {
        recommendations.add(recommendationMap[key]);
      }
    }
  }

  const percentage = Math.round((totalScore / 40) * 100);
  const readinessLevel = getReadinessLevel(totalScore);

  scoreEl.textContent = `${totalScore}/40 (${percentage}%)`;
  levelEl.textContent = readinessLevel;
  companyEl.textContent = `${formData.get("companyName")} • ${formData.get("email")}`;

  appendListItems(weakAreasEl, weakAreas, "No immediate weak areas detected.");
  appendListItems(
    recommendationsEl,
    Array.from(recommendations),
    "Current profile indicates balanced readiness across key categories."
  );

  resultsCard.classList.remove("hidden");
  resultsCard.scrollIntoView({ behavior: "smooth", block: "start" });
});

bookButton.addEventListener("click", () => {
  window.alert("Thank you. A strategy advisor will reach out to schedule your session.");
});
