const RecipeApp = (function () {
  let recipes = [];

  // ---------- INIT ----------
  function init(data) {
    recipes = data;
    renderRecipes(recipes);
    attachEvents();
  }

  // ---------- RENDER RECIPES ----------
  function renderRecipes(list) {
    const container = document.getElementById("recipes-container");
    container.innerHTML = "";

    list.forEach(recipe => {
      const card = document.createElement("div");
      card.className = "recipe-card";
      card.dataset.id = recipe.id;

      card.innerHTML = `
        <h3>${recipe.title}</h3>
        <p>Category: ${recipe.category}</p>
        <p>Time: ${recipe.time} mins</p>

        <button data-action="toggle-ingredients">Show Ingredients</button>
        <button data-action="toggle-steps">Show Steps</button>

        <div class="ingredients hidden">
          <ul>
            ${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}
          </ul>
        </div>

        <div class="steps hidden">
          ${renderSteps(recipe.steps)}
        </div>
      `;

      container.appendChild(card);
    });
  }


  function renderSteps(steps) {
    let html = "<ul>";

    steps.forEach(step => {
      if (typeof step === "string") {
        html += `<li>${step}</li>`;
      } else {
        html += `<li>${step.text}`;
        html += renderSteps(step.substeps); // 🔁 recursion
        html += `</li>`;
      }
    });

    html += "</ul>";
    return html;
  }

  // ---------- EVENT DELEGATION ----------
  function attachEvents() {
    document
      .getElementById("recipes-container")
      .addEventListener("click", function (e) {
        const action = e.target.dataset.action;
        if (!action) return;

        const card = e.target.closest(".recipe-card");

        if (action === "toggle-ingredients") {
          toggleSection(card, ".ingredients", e.target);
        }

        if (action === "toggle-steps") {
          toggleSection(card, ".steps", e.target);
        }
      });
  }

  function toggleSection(card, selector, button) {
    const section = card.querySelector(selector);
    section.classList.toggle("hidden");
    button.textContent = section.classList.contains("hidden")
      ? button.textContent.replace("Hide", "Show")
      : button.textContent.replace("Show", "Hide");
  }

  return {
    init
  };
})();