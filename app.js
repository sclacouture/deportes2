// app.js

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");

  // Tu API Key de OpenWeatherMap
  const apiKey = "69745e0a93fd6669ac153df0aad9550f"; // Reemplaza con tu API Key

  // Elementos del DOM
  const button = document.getElementById("get-activity");
  const recommendationDiv = document.getElementById("recommendation");
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
    esBtn,
    enBtn,
    dateTimeDiv,
    title,
    activityTypeInputs,
  });

  let language = "es";
  let userLocation = null;

  // Obtener la ciudad seleccionada de localStorage
  let city = localStorage.getItem("selectedCity");
  if (!city) {
    // Si no hay ciudad seleccionada, redirigir a la página de inicio
    window.location.href = "index.html";
  } else {
    // Actualizar el título con la ciudad seleccionada
    updateTitleWithCity();
  }

  // Verificar si existe una ubicación particular en localStorage
  let particularLocation = localStorage.getItem("particularLocation");
  if (particularLocation) {
    userLocation = JSON.parse(particularLocation);
    console.log("Using particular location:", userLocation);
  } else {
    // Solicitar la ubicación del usuario al cargar la página
    getUserLocation();
  }

  // Función para actualizar el título con la ciudad seleccionada
  function updateTitleWithCity() {
    const cityName = city.split(",")[0]; // Obtenemos el nombre de la ciudad
    title.textContent =
      language === "es"
        ? `¿Qué deporte puedo practicar ahora en ${cityName}?`
        : `What sport can I practice now in ${cityName}?`;
  }

  // Función para obtener la ubicación geolocalizada del usuario
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

  // Lista de actividades según el clima y tipo
  const activities = {
    sunny: [
      // Actividades para clima soleado
      {
        name: { es: "Fútbol", en: "Football" },
        players: { es: "10 personas o más", en: "10 people or more" },
        type: "group",
        places: [
          {
            name: "Cancha La Magdalena",
            address: "Calle 45 #14-100, Barranquilla, Colombia",
            schedule: "8:00 AM - 10:00 PM",
            cost: "Entrada gratuita",
            phone: "+573001234567",
            website: "https://www.canchalamagdalena.com",
          },
          {
            name: "Estadio Metropolitano",
            address: "Avenida Circunvalar, Barranquilla, Colombia",
            schedule: "9:00 AM - 6:00 PM",
            cost: "20,000 COP por hora",
            phone: "+573009876543",
            website: "https://www.estadiometropolitano.com",
          },
          // ... más lugares
        ],
      },
      // ... otras actividades
    ],
    cloudy: [
      // Actividades para clima nublado
      {
        name: { es: "Running", en: "Running" },
        players: { es: "Individual", en: "Individual" },
        type: "individual",
        places: [
          {
            name: "Malecón del Río",
            address: "Vía 40, Barranquilla, Colombia",
            schedule: "Abierto 24 horas",
            cost: "Entrada gratuita",
            website: "https://www.malecondelrio.com",
          },
          {
            name: "Parque Sagrado Corazón",
            address: "Carrera 42F #74-85, Barranquilla, Colombia",
            schedule: "6:00 AM - 10:00 PM",
            cost: "Entrada gratuita",
            website: "https://www.parquesagradocorazon.com",
          },
          // ... más lugares
        ],
      },
      // ... otras actividades
    ],
    rainy: [
      // Actividades para clima lluvioso

      // Añadimos Padel como actividad grupal en clima lluvioso
      {
        name: { es: "Padel", en: "Padel" },
        players: { es: "4 personas (dos parejas)", en: "4 people (two pairs)" },
        type: "group",
        warning:
          language === "es"
            ? "Ten en cuenta que está lloviendo y esto puede impedir el acceso al lugar. Llama antes para confirmar."
            : "Keep in mind that it is raining and this may prevent access to the place. Call ahead to confirm.",
        places: [
          {
            name: "Club de Padel Barranquilla",
            address: "Calle 85 #64-75, Barranquilla, Colombia",
            schedule: "7:00 AM - 10:00 PM",
            cost: "30,000 COP por hora",
            phone: "+573005551234",
            website: "https://www.clubpadelbarranquilla.com",
          },
          {
            name: "Padel Premium",
            address: "Carrera 51B #94-110, Barranquilla, Colombia",
            schedule: "6:00 AM - 11:00 PM",
            cost: "35,000 COP por hora",
            phone: "+573004443333",
            website: "https://www.padelpremium.com",
          },
          // ... más lugares
        ],
      },

      // Actividad de Natación en Piscina Cubierta
      {
        name: { es: "Natación en piscina cubierta", en: "Indoor Swimming" },
        players: { es: "Individual o grupo", en: "Individual or group" },
        type: "individual",
        places: [
          {
            name: "Centro Acuático Olímpico",
            address: "Calle 47 #18-50, Barranquilla, Colombia",
            schedule: "7:00 AM - 9:00 PM",
            cost: "10,000 COP",
            phone: "+573002221111",
            website: "https://www.centroacuatico.com",
          },
          // ... más lugares
        ],
      },
      // Añadimos una actividad grupal adicional
      {
        name: { es: "Boliche", en: "Bowling" },
        players: { es: "2 a 6 personas", en: "2 to 6 people" },
        type: "group",
        places: [
          {
            name: "Strike Bowling",
            address: "Carrera 53 #79-279, Barranquilla, Colombia",
            schedule: "12:00 PM - 12:00 AM",
            cost: "15,000 COP por persona",
            phone: "+573006667777",
            website: "https://www.strikebowling.com",
          },
          // ... más lugares
        ],
      },
      // ... otras actividades
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

  // Calcular distancia entre dos coordenadas
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
    // Actualizamos el título con la ciudad
    updateTitleWithCity();
    button.textContent =
      language === "es" ? "Recomendar Actividad" : "Recommend Activity";
    individualLabel.textContent =
      language === "es" ? "Individual" : "Individual";
    groupLabel.textContent = language === "es" ? "Grupal" : "Group";
  }

  // Evento al hacer clic en el botón
  button.addEventListener("click", async () => {
    console.log("Get Activity button clicked");

    recommendationDiv.innerHTML =
      language === "es"
        ? "Obteniendo recomendaciones..."
        : "Fetching recommendations...";

    // Asegurarnos de que la ubicación del usuario esté obtenida
    if (!userLocation && !particularLocation) {
      await getUserLocation();
    }

    const weather = await getWeather(city);

    if (weather) {
      const activityType = getSelectedActivityType();
      const result = await selectIdealActivity(weather, activityType);
      if (result) {
        const { activity, temperature, description, closestPlaces } = result;

        // Construir la recomendación
        let recommendationHTML = `
                  <p><strong>${
                    language === "es" ? "Clima actual en" : "Current weather in"
                  } ${
          city.split(",")[0]
        }:</strong> ${description}, ${temperature}°C</p>
              `;

        recommendationHTML += `
                  <div class="activity-details">
                      <h3>${
                        language === "es"
                          ? "Actividad Recomendada"
                          : "Recommended Activity"
                      }</h3>
                      <p><strong>${
                        language === "es" ? "Actividad" : "Activity"
                      }:</strong> ${activity.name[language]}</p>
                      <p><strong>${
                        language === "es"
                          ? "Número de personas necesarias"
                          : "Number of people needed"
                      }:</strong> ${activity.players[language]}</p>
              `;

        // Añadir advertencia si existe
        if (activity.warning) {
          recommendationHTML += `
                      <p style="color: orange;"><strong>${
                        language === "es" ? "Advertencia" : "Warning"
                      }:</strong> ${activity.warning}</p>
                  `;
        }

        // Mostrar hasta dos lugares más cercanos
        for (let i = 0; i < Math.min(2, closestPlaces.length); i++) {
          const place = closestPlaces[i];
          recommendationHTML += `
                      <div class="place-details">
                          <h4>${language === "es" ? "Lugar" : "Place"} ${
            i + 1
          }:</h4>
                          <p><strong>${
                            language === "es" ? "Nombre" : "Name"
                          }:</strong> ${place.name}</p>
                          <p><strong>${
                            language === "es" ? "Dirección" : "Address"
                          }:</strong> ${place.address}</p>
                          <p><strong>${
                            language === "es" ? "Horario" : "Schedule"
                          }:</strong> ${place.schedule}</p>
                          <p><strong>${
                            language === "es" ? "Costo de entrada" : "Entry fee"
                          }:</strong> ${place.cost}</p>
                  `;

          // Añadir número de teléfono si existe
          if (place.phone) {
            const phoneLink = `<a href="tel:${place.phone}">${place.phone}</a>`;
            recommendationHTML += `
                          <p><strong>${
                            language === "es" ? "Teléfono" : "Phone"
                          }:</strong> ${phoneLink}</p>
                      `;
          }

          // Añadir sitio web si existe
          if (place.website) {
            const websiteLink = `<a href="${place.website}" target="_blank">${place.website}</a>`;
            recommendationHTML += `
                          <p><strong>${
                            language === "es" ? "Sitio web" : "Website"
                          }:</strong> ${websiteLink}</p>
                      `;
          }

          if (userLocation && place.distance !== undefined) {
            recommendationHTML += `<p><strong>${
              language === "es" ? "Distancia" : "Distance"
            }:</strong> ${place.distance.toFixed(2)} km</p>`;
          }

          // Añadir enlaces de compartir y obtener direcciones
          const placeEncoded = encodeURIComponent(place.address);

          // Actualización para ofrecer opciones entre Google Maps y Waze
          const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${placeEncoded}`;
          const wazeUrl = `https://waze.com/ul?ll=${place.coordinates.latitude},${place.coordinates.longitude}&navigate=yes`;

          // Texto para compartir
          const shareText = `${
            language === "es" ? "¡Vamos a" : "Let's go to"
          } ${activity.name[language]} ${language === "es" ? "en" : "at"} ${
            place.name
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

  // Función para obtener el tipo de actividad seleccionado
  function getSelectedActivityType() {
    let activityType = "individual";
    for (const input of activityTypeInputs) {
      if (input.checked) {
        activityType = input.value;
        break;
      }
    }
    return activityType;
  }

  // Función para seleccionar la actividad ideal
  async function selectIdealActivity(weather, activityType) {
    console.log(
      "selectIdealActivity called with weather:",
      weather,
      "activityType:",
      activityType
    );
    const condition = weather.weather[0].main.toLowerCase();
    const temperature = weather.main.temp;

    console.log("Weather condition:", condition);
    console.log("Temperature:", temperature);

    let possibleActivities = [];

    // Determinar las actividades según el clima
    if (
      condition.includes("rain") ||
      condition.includes("lluvia") ||
      condition.includes("storm") ||
      condition.includes("drizzle") ||
      condition.includes("thunderstorm")
    ) {
      possibleActivities = activities.rainy;
      console.log("Condition matched: rainy");
    } else if (condition.includes("snow") || condition.includes("sleet")) {
      possibleActivities = activities.rainy; // Asumimos actividades bajo techo
      console.log("Condition matched: snowy");
    } else if (
      condition.includes("mist") ||
      condition.includes("fog") ||
      condition.includes("haze")
    ) {
      possibleActivities = activities.cloudy;
      console.log("Condition matched: cloudy (mist/fog/haze)");
    } else if (condition.includes("clear")) {
      possibleActivities = activities.sunny;
      console.log("Condition matched: sunny (clear)");
    } else if (condition.includes("clouds") || condition.includes("nubes")) {
      possibleActivities = activities.cloudy;
      console.log("Condition matched: cloudy");
    } else if (temperature > 28) {
      possibleActivities = activities.sunny;
      console.log("Condition matched: sunny (temperature)");
    } else {
      // Por defecto, usamos actividades para clima nublado
      possibleActivities = activities.cloudy;
      console.log("Condition matched: default to cloudy");
    }

    // Filtrar por tipo de actividad
    possibleActivities = possibleActivities.filter(
      (activity) => activity.type === activityType
    );

    console.log("Possible activities:", possibleActivities);

    if (possibleActivities.length === 0) {
      return null;
    }

    // Seleccionar la actividad ideal (puedes definir criterios adicionales aquí)
    const idealActivity = possibleActivities[0]; // Por simplicidad, tomamos la primera

    // Obtener coordenadas y distancias de cada lugar
    for (const place of idealActivity.places) {
      if (!place.coordinates) {
        const coords = await getCoordinates(place.address);
        if (coords) {
          place.coordinates = coords;
        } else {
          // Si no se obtienen coordenadas, eliminamos el lugar de la lista
          console.warn("Removing place due to missing coordinates:", place);
          idealActivity.places = idealActivity.places.filter(
            (p) => p !== place
          );
          continue;
        }
      }

      if (userLocation) {
        place.distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          place.coordinates.latitude,
          place.coordinates.longitude
        );
      }
    }

    if (userLocation) {
      // Ordenar los lugares por distancia
      idealActivity.places.sort((a, b) => a.distance - b.distance);
    }

    // Tomar los lugares más cercanos
    const closestPlaces = idealActivity.places;

    return {
      activity: idealActivity,
      temperature: temperature.toFixed(1),
      description: weather.weather[0].description,
      closestPlaces: closestPlaces,
    };
  }

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
