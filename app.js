// app.js

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");

  // Tu API Key de OpenWeatherMap
  const apiKey = "69745e0a93fd6669ac153df0aad9550f"; // Reemplaza con tu API Key

  // Elementos del DOM
  const button = document.getElementById("get-activity");
  const recommendationDiv = document.getElementById("recommendation");
  const cityInput = document.getElementById("city-input");
  const esBtn = document.getElementById("es-btn");
  const enBtn = document.getElementById("en-btn");
  const dateTimeDiv = document.getElementById("date-time");
  const title = document.getElementById("main-title");

  console.log("DOM Elements:", {
    button,
    recommendationDiv,
    cityInput,
    esBtn,
    enBtn,
    dateTimeDiv,
    title,
  });

  let language = "es";

  // Lista de actividades según el clima
  const activities = {
    sunny: [
      {
        name: { es: "Voleibol de playa", en: "Beach Volleyball" },
        players: { es: "4 a 6 personas", en: "4 to 6 people" },
        place: {
          name: "Complejo Deportivo Puerta de Oro",
          address: "Vía 40 #79B-06, Barranquilla",
          schedule: "6:00 AM - 6:00 PM",
          cost: "Entrada gratuita",
        },
      },
      {
        name: { es: "Natación", en: "Swimming" },
        players: { es: "Individual o grupo", en: "Individual or group" },
        place: {
          name: "Piscina Olímpica",
          address: "Carrera 54 #53-122, Barranquilla",
          schedule: "7:00 AM - 5:00 PM",
          cost: "Costo de entrada: $10,000 COP",
        },
      },
      {
        name: { es: "Ciclismo", en: "Cycling" },
        players: { es: "Individual o grupo", en: "Individual or group" },
        place: {
          name: "Parque Washington",
          address: "Calle 79B #42F, Barranquilla",
          schedule: "Abierto 24 horas",
          cost: "Entrada gratuita",
        },
      },
      {
        name: { es: "Pádel", en: "Padel" },
        players: { es: "4 personas", en: "4 people" },
        place: {
          name: "Club Lagos del Caujaral",
          address: "Kilómetro 12 Vía al Mar, Puerto Colombia",
          schedule: "8:00 AM - 8:00 PM",
          cost: "Costo de entrada: $15,000 COP",
        },
      },
    ],
    cloudy: [
      {
        name: { es: "Fútbol", en: "Football" },
        players: { es: "10 personas o más", en: "10 people or more" },
        place: {
          name: "Cancha La Magdalena",
          address: "Calle 45 #14-100, Barranquilla",
          schedule: "8:00 AM - 10:00 PM",
          cost: "Entrada gratuita",
        },
      },
      {
        name: { es: "Baloncesto", en: "Basketball" },
        players: { es: "6 personas", en: "6 people" },
        place: {
          name: "Parque Los Andes",
          address: "Carrera 21 #63B-20, Barranquilla",
          schedule: "6:00 AM - 9:00 PM",
          cost: "Entrada gratuita",
        },
      },
      {
        name: { es: "Tenis", en: "Tennis" },
        players: { es: "2 o 4 personas", en: "2 or 4 people" },
        place: {
          name: "Liga de Tenis del Atlántico",
          address: "Calle 94 #49C-55, Barranquilla",
          schedule: "7:00 AM - 7:00 PM",
          cost: "Costo de entrada: $20,000 COP",
        },
      },
      {
        name: { es: "Correr", en: "Running" },
        players: { es: "Individual o grupo", en: "Individual or group" },
        place: {
          name: "Malecón del Río",
          address: "Vía 40, Barranquilla",
          schedule: "Abierto 24 horas",
          cost: "Entrada gratuita",
        },
      },
      {
        name: { es: "Yoga al aire libre", en: "Outdoor Yoga" },
        players: { es: "Individual o grupo", en: "Individual or group" },
        place: {
          name: "Parque Sagrado Corazón",
          address: "Carrera 42F #74-85, Barranquilla",
          schedule: "6:00 AM - 10:00 PM",
          cost: "Entrada gratuita",
        },
      },
    ],
    rainy: [
      {
        name: { es: "Gimnasio bajo techo", en: "Indoor Gym" },
        players: { es: "Individual o grupo", en: "Individual or group" },
        place: {
          name: "Gimnasio BodyTech",
          address: "Carrera 51B #80-58, Barranquilla",
          schedule: "5:00 AM - 10:00 PM",
          cost: "Membresía requerida",
        },
      },
      {
        name: { es: "Natación en piscina cubierta", en: "Indoor Swimming" },
        players: { es: "Individual o grupo", en: "Individual or group" },
        place: {
          name: "Club Campestre",
          address: "Vía 40 #79-300, Barranquilla",
          schedule: "6:00 AM - 9:00 PM",
          cost: "Membresía requerida",
        },
      },
      {
        name: { es: "Bádminton", en: "Badminton" },
        players: { es: "2 o 4 personas", en: "2 or 4 people" },
        place: {
          name: "Coliseo Elías Chegwin",
          address: "Calle 72 #47-50, Barranquilla",
          schedule: "8:00 AM - 8:00 PM",
          cost: "Costo de entrada: $10,000 COP",
        },
      },
      {
        name: { es: "Squash", en: "Squash" },
        players: { es: "2 personas", en: "2 people" },
        place: {
          name: "Squash Club Barranquilla",
          address: "Carrera 55 #75-99, Barranquilla",
          schedule: "7:00 AM - 9:00 PM",
          cost: "Costo de entrada: $15,000 COP",
        },
      },
    ],
  };

  // Función para obtener el clima actual
  async function getWeather(city) {
    console.log("getWeather called with city:", city);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${apiKey}&units=metric&lang=${language}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        // Respuesta exitosa
        console.log("Weather data received:", data);
        return data;
      } else {
        // Manejar errores
        showError(`${data.message} (Error ${data.cod})`);
        return null;
      }
    } catch (error) {
      console.error("Error al obtener el clima:", error);
      showError(
        language === "es"
          ? "Error al conectar con el servicio de clima."
          : "Error connecting to the weather service."
      );
      return null;
    }
  }

  // Función actualizada para seleccionar una actividad según el clima
  function selectActivity(weather) {
    console.log("selectActivity called with weather:", weather);
    const condition = weather.weather[0].main.toLowerCase();
    const temperature = weather.main.temp;

    console.log("Weather condition:", condition);
    console.log("Temperature:", temperature);

    let suitableActivities = [];

    if (
      condition.includes("rain") ||
      condition.includes("lluvia") ||
      condition.includes("storm") ||
      condition.includes("drizzle") ||
      condition.includes("thunderstorm")
    ) {
      suitableActivities = activities.rainy;
      console.log("Condition matched: rainy");
    } else if (condition.includes("snow") || condition.includes("sleet")) {
      suitableActivities = activities.rainy; // Asumimos actividades bajo techo
      console.log("Condition matched: snowy");
    } else if (
      condition.includes("mist") ||
      condition.includes("fog") ||
      condition.includes("haze")
    ) {
      suitableActivities = activities.cloudy;
      console.log("Condition matched: cloudy (mist/fog/haze)");
    } else if (condition.includes("clear")) {
      suitableActivities = activities.sunny;
      console.log("Condition matched: sunny (clear)");
    } else if (condition.includes("clouds") || condition.includes("nubes")) {
      suitableActivities = activities.cloudy;
      console.log("Condition matched: cloudy");
    } else if (temperature > 28) {
      suitableActivities = activities.sunny;
      console.log("Condition matched: sunny (temperature)");
    } else {
      // Por defecto, usamos actividades para clima nublado
      suitableActivities = activities.cloudy;
      console.log("Condition matched: default to cloudy");
    }

    console.log("Suitable activities:", suitableActivities);

    // Verificar si suitableActivities es undefined o vacío
    if (!suitableActivities || suitableActivities.length === 0) {
      console.error(
        "No hay actividades disponibles para las condiciones climáticas actuales."
      );
      showError(
        language === "es"
          ? "No hay actividades disponibles para el clima actual."
          : "No activities available for the current weather."
      );
      return null;
    }

    // Seleccionar una actividad aleatoria
    const activity =
      suitableActivities[Math.floor(Math.random() * suitableActivities.length)];

    console.log("Selected activity:", activity);

    return {
      activity,
      temperature: temperature.toFixed(1),
      description: weather.weather[0].description,
    };
  }

  // Mostrar error
  function showError(message) {
    console.error("Error:", message);
    recommendationDiv.innerHTML = `<p style="color: red;">${message}</p>`;
  }

  // Función para actualizar la fecha y hora
  function updateDateTime() {
    const now = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    dateTimeDiv.textContent = now.toLocaleDateString(
      language === "es" ? "es-ES" : "en-US",
      options
    );
  }

  // Actualizar cada minuto
  setInterval(updateDateTime, 60000);
  updateDateTime();

  // Actualizar el título según el idioma
  function updateTitle() {
    console.log("Updating title and placeholders");
    title.textContent =
      language === "es"
        ? "¿Qué deporte puedo practicar ahora?"
        : "What sport can I practice now?";
    button.textContent =
      language === "es" ? "Recomendar Actividad" : "Recommend Activity";
    cityInput.placeholder =
      language === "es"
        ? "Ingresa tu ciudad (Ej: Barranquilla,CO)"
        : "Enter your city (e.g., Barranquilla,CO)";
  }

  // Evento al hacer clic en el botón
  button.addEventListener("click", async () => {
    console.log("Get Activity button clicked");
    const city =
      cityInput.value.trim() ||
      (language === "es" ? "Barranquilla,CO" : "Barranquilla,CO");

    if (!city) {
      showError(
        language === "es"
          ? "Por favor, ingresa una ciudad."
          : "Please enter a city."
      );
      return;
    }

    recommendationDiv.innerHTML =
      language === "es"
        ? "Obteniendo recomendación..."
        : "Fetching recommendation...";

    const weather = await getWeather(city);

    if (weather) {
      const result = selectActivity(weather);
      if (result) {
        const { activity, temperature, description } = result;

        // Construir la recomendación
        let recommendationHTML = `
                  <p><strong>${
                    language === "es" ? "Clima actual en" : "Current weather in"
                  } ${city}:</strong> ${description}, ${temperature}°C</p>
                  <p><strong>${
                    language === "es"
                      ? "Actividad recomendada"
                      : "Recommended activity"
                  }:</strong> ${activity.name[language]}</p>
                  <p><strong>${
                    language === "es"
                      ? "Número de personas necesarias"
                      : "Number of people needed"
                  }:</strong> ${activity.players[language]}</p>
                  <div class="activity-details">
                      <p><strong>${
                        language === "es" ? "Lugar" : "Place"
                      }:</strong> ${activity.place.name}</p>
                      <p><strong>${
                        language === "es" ? "Dirección" : "Address"
                      }:</strong> ${activity.place.address}</p>
                      <p><strong>${
                        language === "es" ? "Horario" : "Schedule"
                      }:</strong> ${activity.place.schedule}</p>
                      <p><strong>${
                        language === "es" ? "Costo de entrada" : "Entry fee"
                      }:</strong> ${activity.place.cost}</p>
                  </div>
              `;

        // Añadir enlaces de compartir y obtener direcciones
        const placeEncoded = encodeURIComponent(activity.place.address);
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${placeEncoded}`;

        // Texto para compartir
        const shareText = `${language === "es" ? "¡Vamos a" : "Let's go to"} ${
          activity.name[language]
        } ${language === "es" ? "en" : "at"} ${activity.place.name}!`;

        // Enlaces de compartir
        recommendationHTML += `
                  <div class="share-links">
                      <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        shareText
                      )}" target="_blank">
                          ${
                            language === "es"
                              ? "Compartir en Twitter"
                              : "Share on Twitter"
                          }
                      </a>
                      <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(
                        shareText
                      )}" target="_blank">
                          ${
                            language === "es"
                              ? "Compartir en WhatsApp"
                              : "Share on WhatsApp"
                          }
                      </a>
                  </div>
                  <div class="get-directions">
                      <a href="${mapsUrl}" target="_blank">
                          ${
                            language === "es"
                              ? "Obtener Direcciones"
                              : "Get Directions"
                          }
                      </a>
                  </div>
              `;

        recommendationDiv.innerHTML = recommendationHTML;
      }
    }
  });

  // Cambio de idioma
  esBtn.addEventListener("click", () => {
    console.log("Spanish button clicked");
    language = "es";
    esBtn.disabled = true;
    enBtn.disabled = false;
    updateTitle();
    updateDateTime();
  });

  enBtn.addEventListener("click", () => {
    console.log("English button clicked");
    language = "en";
    esBtn.disabled = false;
    enBtn.disabled = true;
    updateTitle();
    updateDateTime();
  });

  // Desactivar botón de idioma actual al cargar la página
  if (language === "es") {
    esBtn.disabled = true;
    enBtn.disabled = false;
  } else {
    esBtn.disabled = false;
    enBtn.disabled = true;
  }

  // Inicializar título y placeholders
  updateTitle();
});
