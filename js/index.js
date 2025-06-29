document.addEventListener("DOMContentLoaded", () => {
  const monsterContainer = document.getElementById("monster-container");
  const createMonster = document.getElementById("create-monster");
  const forwardBtn = document.getElementById("forward");

  let currentPage = 1;

  // Load monsters on page load
  fetchMonsters(currentPage);

  // Build and add form for new monster
  renderMonsterForm();

  // Handle pagination
  forwardBtn.addEventListener("click", () => {
    currentPage++;
    fetchMonsters(currentPage);
  });

  // Fetch monsters from the API
  function fetchMonsters(page) {
    fetch(`http://localhost:3000/monsters?_limit=50&_page=${page}`)
      .then(res => res.json())
      .then(monsters => {
        monsterContainer.innerHTML = ""; // Clear container
        monsters.forEach(renderMonster);
      });
  }

  // Render a single monster
  function renderMonster(monster) {
    const div = document.createElement("div");
    div.innerHTML = `
      <h2>${monster.name}</h2>
      <h4>Age: ${monster.age}</h4>
      <p>${monster.description}</p>
    `;
    monsterContainer.appendChild(div);
  }

  // Create and add the new monster form
  function renderMonsterForm() {
    const form = document.createElement("form");

    const nameInput = document.createElement("input");
    nameInput.placeholder = "Name";

    const ageInput = document.createElement("input");
    ageInput.placeholder = "Age";
    ageInput.type = "number";

    const descInput = document.createElement("input");
    descInput.placeholder = "Description";

    const submitBtn = document.createElement("button");
    submitBtn.innerText = "Create Monster";

    form.append(nameInput, ageInput, descInput, submitBtn);
    createMonster.appendChild(form);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const newMonster = {
        name: nameInput.value,
        age: parseFloat(ageInput.value),
        description: descInput.value
      };

      // POST new monster
      fetch("http://localhost:3000/monsters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(newMonster)
      })
        .then(res => res.json())
        .then(data => {
          renderMonster(data);
          form.reset(); // Clear form after submission
        });
    });
  }
});
