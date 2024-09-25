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
  const activityTypeInputs = document.getElementsByName("activity-type");
  const individualLabel = document.getElementById("individual-label");
  const groupLabel = document.getElementById("group-label");

  console.log("DOM Elements:", {
    button,
    recommendationDiv,
    cityInput,
    esBtn,
    enBtn,
    dateTimeDiv,
    title,
    activityTypeInputs,
  });

  let language = "es";
  let userLocation = null;

  // **Solicitar la ubicación al cargar la página**
  // Convertimos la obtención de la ubicación en una función que retorna una promesa
  async function getUserLocation() {
    return new Promise((resolve, reject) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            userLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            console.log("User location obtained:", userLocation);
            resolve(userLocation);
          },
          (error) => {
            console.error("Error obtaining location:", error);
            alert(
              language === "es"
                ? "No se pudo obtener tu ubicación. Algunas funciones pueden no estar disponibles."
                : "Could not obtain your location. Some features may not be available."
            );
            resolve(null); // Continuar sin ubicación
          }
        );
      } else {
        alert(
          language === "es"
            ? "La geolocalización no es soportada por tu navegador."
            : "Geolocation is not supported by your browser."
        );
        resolve(null); // Continuar sin ubicación
      }
    });
  }

  // Llamamos a getUserLocation al cargar la página
  getUserLocation();

  // Lista de actividades según el clima
  const activities = {
    sunny: [
      // Actividades para clima soleado
      {
        name: { es: "Voleibol de playa", en: "Beach Volleyball" },
        players: { es: "4 a 6 personas", en: "4 to 6 people" },
        type: "group",
        place: {
          name: "Complejo Deportivo Puerta de Oro",
          address: "Vía 40 #79B-06, Barranquilla, Colombia",
          schedule: "6:00 AM - 6:00 PM",
          cost: "Entrada gratuita",
        },
      },
      // ... Añade más actividades aquí
    ],
    cloudy: [
      // Actividades para clima nublado

      // Actividades Individuales
      {
        name: { es: "Running", en: "Running" },
        players: { es: "Individual", en: "Individual" },
        type: "individual",
        place: {
          name: "Malecón del Río",
          address: "Vía 40, Barranquilla, Colombia",
          schedule: "Abierto 24 horas",
          cost: "Entrada gratuita",
        },
      },
      {
        name: { es: "Yoga al aire libre", en: "Outdoor Yoga" },
        players: { es: "Individual o grupo", en: "Individual or group" },
        type: "individual",
        place: {
          name: "Parque Sagrado Corazón",
          address: "Carrera 42F #74-85, Barranquilla, Colombia",
          schedule: "6:00 AM - 10:00 PM",
          cost: "Entrada gratuita",
        },
      },
      // Actividades Grupales
      {
        name: { es: "Fútbol", en: "Football" },
        players: { es: "10 personas o más", en: "10 people or more" },
        type: "group",
        place: {
          name: "Cancha La Magdalena",
          address: "Calle 45 #14-100, Barranquilla, Colombia",
          schedule: "8:00 AM - 10:00 PM",
          cost: "Entrada gratuita",
        },
      },
      {
        name: { es: "Baloncesto", en: "Basketball" },
        players: { es: "6 personas", en: "6 people" },
        type: "group",
        place: {
          name: "Parque Los Andes",
          address: "Carrera 21 #63B-20, Barranquilla, Colombia",
          schedule: "6:00 AM - 9:00 PM",
          cost: "Entrada gratuita",
        },
      },
      // ... Añade más actividades aquí
    ],
    rainy: [
      // Actividades para clima lluvioso
      // Asegúrate de incluir la propiedad 'type'
      // ... Añade actividades aquí
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

  // Función para obtener las coordenadas de una dirección
  async function getCoordinates(address) {
    console.log("getCoordinates called with address:", address);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      address
    )}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        console.log(`Coordinates for ${address}:`, { lat, lon });
        return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
      } else {
        console.error("No coordinates found for address:", address);
        return null;
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  }

  // Función actualizada para seleccionar actividades según el clima y tipo
  async function selectActivities(weather, activityType) {
    console.log(
      "selectActivities called with weather:",
      weather,
      "activityType:",
      activityType
    );
    const condition = weather.weather[0].main.toLowerCase();
    const temperature = weather.main.temp;

    console.log("Weather condition:", condition);
    console.log("Temperature:", temperature);

    let suitableActivities = [];

    // Determinar las actividades según el clima
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

    // Mostrar las actividades antes de filtrar por tipo
    console.log("Suitable activities before filtering:", suitableActivities);

    // Filtrar por tipo de actividad
    suitableActivities = suitableActivities.filter(
      (activity) => activity.type === activityType
    );

    console.log("Filtered activities:", suitableActivities);

    // Obtener las coordenadas de cada actividad
    for (const activity of suitableActivities) {
      if (!activity.place.coordinates) {
        const coords = await getCoordinates(activity.place.address);
        if (coords) {
          activity.place.coordinates = coords;
        } else {
          // Si no se obtienen coordenadas, eliminamos la actividad de la lista
          console.warn(
            "Removing activity due to missing coordinates:",
            activity
          );
          suitableActivities = suitableActivities.filter((a) => a !== activity);
        }
      }
    }

    return {
      activities: suitableActivities,
      temperature: temperature.toFixed(1),
      description: weather.weather[0].description,
    };
  }

  // Calcular distancia entre dos coordenadas usando la fórmula de Haversine
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance; // Distancia en km
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
    individualLabel.textContent =
      language === "es" ? "Individual" : "Individual";
    groupLabel.textContent = language === "es" ? "Grupal" : "Group";
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

    // Obtener el tipo de actividad seleccionado
    let activityType = "individual";
    for (const input of activityTypeInputs) {
      if (input.checked) {
        activityType = input.value;
        break;
      }
    }

    recommendationDiv.innerHTML =
      language === "es"
        ? "Obteniendo recomendaciones..."
        : "Fetching recommendations...";

    // Asegurarnos de que la ubicación del usuario esté obtenida
    if (!userLocation) {
      await getUserLocation();
    }

    const weather = await getWeather(city);

    if (weather) {
      const result = await selectActivities(weather, activityType);
      if (result && result.activities.length > 0) {
        const { activities, temperature, description } = result;

        // Si se obtuvo la ubicación del usuario, calcular distancias
        if (userLocation) {
          for (const activity of activities) {
            activity.distance = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              activity.place.coordinates.latitude,
              activity.place.coordinates.longitude
            );
          }

          // Ordenar las actividades por distancia
          activities.sort((a, b) => a.distance - b.distance);
        }

        // Construir la recomendación
        let recommendationHTML = `
                  <p><strong>${
                    language === "es" ? "Clima actual en" : "Current weather in"
                  } ${city}:</strong> ${description}, ${temperature}°C</p>
              `;

        for (const activity of activities) {
          recommendationHTML += `
                      <div class="activity-details">
                          <p><strong>${
                            language === "es" ? "Actividad" : "Activity"
                          }:</strong> ${activity.name[language]}</p>
                          <p><strong>${
                            language === "es"
                              ? "Número de personas necesarias"
                              : "Number of people needed"
                          }:</strong> ${activity.players[language]}</p>
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
                  `;

          if (userLocation && activity.distance !== undefined) {
            recommendationHTML += `<p><strong>${
              language === "es" ? "Distancia" : "Distance"
            }:</strong> ${activity.distance.toFixed(2)} km</p>`;
          }

          // Añadir enlaces de compartir y obtener direcciones
          const placeEncoded = encodeURIComponent(activity.place.address);

          // Actualización para ofrecer opciones entre Google Maps y Waze
          const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${placeEncoded}`;
          const wazeUrl = `https://waze.com/ul?ll=${activity.place.coordinates.latitude},${activity.place.coordinates.longitude}&navigate=yes`;

          // Texto para compartir
          const shareText = `${
            language === "es" ? "¡Vamos a" : "Let's go to"
          } ${activity.name[language]} ${language === "es" ? "en" : "at"} ${
            activity.place.name
          }!`;

          // Enlaces de compartir y obtener direcciones
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
                          <p><strong>${
                            language === "es"
                              ? "Obtener Direcciones:"
                              : "Get Directions:"
                          }</strong></p>
                          <a href="${mapsUrl}" target="_blank">
                              ${
                                language === "es"
                                  ? "Abrir en Google Maps"
                                  : "Open in Google Maps"
                              }
                          </a><br>
                          <a href="${wazeUrl}" target="_blank">
                              ${
                                language === "es"
                                  ? "Abrir en Waze"
                                  : "Open in Waze"
                              }
                          </a>
                      </div>
                      <hr>
                  `;
        }

        recommendationDiv.innerHTML = recommendationHTML;
      } else {
        showError(
          language === "es"
            ? "No hay actividades disponibles para tus criterios."
            : "No activities available for your criteria."
        );
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
