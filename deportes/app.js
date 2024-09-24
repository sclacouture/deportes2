// app.js

// Tu API Key de OpenWeatherMap
const apiKey = "69745e0a93fd6669ac153df0aad9550f"; // <-- Reemplaza con tu API Key

// Elementos del DOM
const button = document.getElementById("get-activity");
const recommendationDiv = document.getElementById("recommendation");

// Lista de actividades según el clima
const activities = {
  sunny: [
    { name: "Voleibol de playa", players: "4 a 6 personas" },
    { name: "Natación", players: "Individual o grupo" },
    { name: "Ciclismo", players: "Individual o grupo" },
    { name: "Padel", players: "4 personas" },
  ],
  cloudy: [
    { name: "Fútbol", players: "10 personas o más" },
    { name: "Baloncesto", players: "6 personas" },
    { name: "Tenis", players: "2 o 4 personas" },
    { name: "Correr", players: "Individual o grupo" },
    { name: "Yoga al aire libre", players: "Individual o grupo" },
  ],
  rainy: [
    { name: "Gimnasio bajo techo", players: "Individual o grupo" },
    { name: "Natación en piscina cubierta", players: "Individual o grupo" },
    { name: "Bádminton", players: "2 o 4 personas" },
    { name: "Squash", players: "2 personas" },
  ],
};

// Función para obtener el clima actual
async function getWeather() {
  const city = "Barranquilla,CO";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=es`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener el clima:", error);
    return null;
  }
}

// Función para seleccionar una actividad según el clima
function selectActivity(weather) {
  const condition = weather.weather[0].main.toLowerCase();
  const temperature = weather.main.temp;

  let suitableActivities = [];

  if (
    condition.includes("rain") ||
    condition.includes("lluvia") ||
    condition.includes("storm")
  ) {
    suitableActivities = activities.rainy;
  } else if (temperature > 28) {
    suitableActivities = activities.sunny;
  } else {
    suitableActivities = activities.cloudy;
  }

  // Seleccionar una actividad aleatoria
  const activity =
    suitableActivities[Math.floor(Math.random() * suitableActivities.length)];

  return {
    activity: activity.name,
    players: activity.players,
    temperature: temperature.toFixed(1),
    description: weather.weather[0].description,
  };
}

// Evento al hacer clic en el botón
button.addEventListener("click", async () => {
  recommendationDiv.textContent = "Obteniendo recomendación...";

  const weather = await getWeather();

  if (weather) {
    const { activity, players, temperature, description } =
      selectActivity(weather);

    recommendationDiv.innerHTML = `
            <p><strong>Clima actual en Barranquilla:</strong> ${description}, ${temperature}°C</p>
            <p><strong>Actividad recomendada:</strong> ${activity}</p>
            <p><strong>Número de personas necesarias:</strong> ${players}</p>
        `;
  } else {
    recommendationDiv.textContent =
      "No se pudo obtener el clima. Intenta nuevamente más tarde.";
  }
});
