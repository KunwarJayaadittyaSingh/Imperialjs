document.addEventListener("DOMContentLoaded", () => {

  (() => {
    // =======================
    // DOM ELEMENTS
    // =======================
    const searchInput = document.getElementById("searchInput");
    const favoritesOnlyCheckbox = document.getElementById("favoritesOnly");
    const recipeCards = Array.from(document.querySelectorAll(".recipe-card"));
    const recipeCounter = document.getElementById("recipeCounter");

    // ❗ SAFETY CHECK
    if (!searchInput || !favoritesOnlyCheckbox || recipeCards.length === 0) {
      console.warn("Required DOM elements not found");
      return;
    }

    // =======================
    // STATE
    // =======================
    let favorites = new Set(
      JSON.parse(localStorage.getItem("favorites")) || []
    );

    let debounceTimer;

    // =======================
    // INIT
    // =======================
    initializeFavorites();
    updateView();

    // =======================
    // EVENT LISTENERS
    // =======================
    searchInput.addEventListener("input", () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(updateView, 300);
    });

    favoritesOnlyCheckbox.addEventListener("change", updateView);

    recipeCards.forEach(card => {
      card.querySelector(".favorite-btn")
        .addEventListener("click", () => toggleFavorite(card));
    });

    // =======================
    // FUNCTIONS
    // =======================
    function initializeFavorites() {
      recipeCards.forEach(card => {
        if (favorites.has(card.dataset.id)) {
          card.classList.add("favorited");
        }
      });
    }

    function toggleFavorite(card) {
      const id = card.dataset.id;

      favorites.has(id)
        ? favorites.delete(id)
        : favorites.add(id);

      card.classList.toggle("favorited");

      localStorage.setItem("favorites", JSON.stringify([...favorites]));
      updateView();
    }

    function updateView() {
      const searchText = searchInput.value.toLowerCase();
      const showFavoritesOnly = favoritesOnlyCheckbox.checked;
      let visibleCount = 0;

      recipeCards.forEach(card => {
        const matchesSearch =
          card.dataset.title.toLowerCase().includes(searchText) ||
          card.dataset.ingredients.toLowerCase().includes(searchText);

        const matchesFavorite =
          !showFavoritesOnly || favorites.has(card.dataset.id);

        const shouldShow = matchesSearch && matchesFavorite;

        card.style.display = shouldShow ? "block" : "none";
        if (shouldShow) visibleCount++;
      });

      recipeCounter.textContent =
        `Showing ${visibleCount} of ${recipeCards.length} recipes`;
    }

  })();

});