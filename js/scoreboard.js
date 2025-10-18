const tableBody = document.querySelector("#scoreboardTable tbody");
const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");

let leaderboardData = [];

fetch("data.json")
  .then((res) => res.json())
  .then((data) => {
    leaderboardData = data.sort((a, b) => b.score - a.score);
    leaderboardData.sort((a, b) => {
      const scoreA =
        (parseInt(a["# of Skill Badges Completed"]) || 0) +
        (parseInt(a["# of Arcade Games Completed"]) || 0);
      const scoreB =
        (parseInt(b["# of Skill Badges Completed"]) || 0) +
        (parseInt(b["# of Arcade Games Completed"]) || 0);
      return scoreB - scoreA;
    });

    renderTable(leaderboardData);
    searchInput.addEventListener("input", filterData);
    filterSelect.addEventListener("change", filterData);
  })
  .catch((err) => {
    console.error("Error loading data.json:", err);
    tableBody.innerHTML =
      "<tr><td colspan='5'>Error loading leaderboard!</td></tr>";
  });

function renderTable(data) {
  tableBody.innerHTML = "";

  if (!data.length) {
    tableBody.innerHTML =
      "<tr><td colspan='5'>No participants found.</td></tr>";
    return;
  }
  data.forEach((user, index) => {
    const rank = index + 1;

    const name = user["User Name"];
    const email = user["User Email"];
    const profile = user["Google Cloud Skills Boost Profile URL"];

    const badges = parseInt(user["# of Skill Badges Completed"]) || 0;
    const games = parseInt(user["# of Arcade Games Completed"]) || 0;
    const score = badges + games;
    const completed = score >= 20 ? "Yes" : "No";

    const tr = document.createElement("tr");
    if (rank <= 3) tr.classList.add(`rank-${rank}`);

    tr.innerHTML = `
    <td>${rank}</td>
    <td><a href="${profile}" target="_blank">${name}</a></td>
    <td>${email}</td>
    <td>${score}</td>
    <td>${completed}</td>
  `;
    tableBody.appendChild(tr);
  });
}
function filterData() {
  const query = searchInput.value.toLowerCase();
  const filter = filterSelect.value;

  let filtered = leaderboardData.filter(
    (user) =>
      (user["User Name"] || "").toLowerCase().includes(query) ||
      (user["User Email"] || "").toLowerCase().includes(query)
  );

  if (filter === "completed") {
    filtered = filtered.filter((user) => {
      const badges = parseInt(user["# of Skill Badges Completed"]) || 0;
      const games = parseInt(user["# of Arcade Games Completed"]) || 0;
      return badges + games >= 20;
    });
  }

  renderTable(filtered);
}
