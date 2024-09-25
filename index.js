// index.js

document.addEventListener("DOMContentLoaded", () => {
  let userLocation = null;
  let selectedCity = null;

  // Obtener la geolocalización del usuario al cargar la página
  getUserLocation();

  // Función para obtener la ubicación geolocalizada del usuario
  function getUserLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          console.log("User location obtained:", userLocation);
        },
        (error) => {
          console.error("Error obtaining location:", error);
          alert(
            "No se pudo obtener tu ubicación. Algunas funciones pueden no estar disponibles."
          );
          userLocation = null; // Continuar sin ubicación
        }
      );
    } else {
      alert("La geolocalización no es soportada por tu navegador.");
      userLocation = null; // Continuar sin ubicación
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

  // Función para calcular la distancia entre dos coordenadas
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

  document
    .getElementById("continue-button")
    .addEventListener("click", async () => {
      selectedCity = document.getElementById("city-select").value;
      if (selectedCity) {
        // Guardar la ciudad seleccionada en el almacenamiento local
        localStorage.setItem("selectedCity", selectedCity);

        if (userLocation) {
          // Obtener coordenadas de la ciudad seleccionada
          const cityCoordinates = await getCoordinates(selectedCity);

          if (cityCoordinates) {
            // Calcular la distancia entre la ubicación del usuario y la ciudad seleccionada
            const distance = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              cityCoordinates.latitude,
              cityCoordinates.longitude
            );

            console.log(`Distance to selected city: ${distance.toFixed(2)} km`);

            if (distance > 80) {
              // Mostrar mensaje de advertencia y ofrecer ingresar ubicación particular
              if (
                confirm(
                  "Parece que estás a más de 80 km de la ciudad seleccionada. ¿Deseas ingresar una ubicación particular?"
                )
              ) {
                const particularLocation = prompt(
                  "Ingresa tu ubicación (dirección):"
                );
                if (particularLocation) {
                  // Obtener coordenadas de la ubicación particular
                  const locationCoordinates = await getCoordinates(
                    particularLocation
                  );
                  if (locationCoordinates) {
                    // Guardar ubicación particular en localStorage
                    localStorage.setItem(
                      "particularLocation",
                      JSON.stringify(locationCoordinates)
                    );
                  } else {
                    alert(
                      "No se pudo obtener las coordenadas de la dirección proporcionada. Continuaremos sin ubicación particular."
                    );
                    localStorage.removeItem("particularLocation");
                  }
                } else {
                  // Usuario no ingresó una ubicación particular
                  localStorage.removeItem("particularLocation");
                }
              } else {
                // Usuario decidió no ingresar una ubicación particular
                localStorage.removeItem("particularLocation");
              }
            } else {
              // Usuario está dentro de los 80 km, continuar sin advertencia
              localStorage.removeItem("particularLocation");
            }

            // Establecer una bandera en sessionStorage para indicar navegación desde index.html
            sessionStorage.setItem("fromIndex", "true");

            // Redirigir a main.html
            window.location.href = "main.html";
          } else {
            alert(
              "No se pudo obtener las coordenadas de la ciudad seleccionada. Por favor, intenta nuevamente."
            );
          }
        } else {
          // Ubicación del usuario no disponible
          // Proceder sin verificaciones de distancia
          // Eliminar cualquier ubicación particular existente
          localStorage.removeItem("particularLocation");

          // Establecer una bandera en sessionStorage para indicar navegación desde index.html
          sessionStorage.setItem("fromIndex", "true");

          // Redirigir a main.html
          window.location.href = "main.html";
        }
      } else {
        alert("Por favor, selecciona una ciudad.");
      }
    });
});
