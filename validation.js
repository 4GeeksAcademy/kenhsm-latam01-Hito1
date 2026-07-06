const cityByCountry = {
  CO: ["Medellin", "Bogota", "Cali"],
  US: ["Miami", "Orlando"]
};

const locationByCountryCity = {
  "CO|Medellin": [
    "Brasaland El Poblado",
    "Brasaland Laureles",
    "Brasaland Envigado",
    "Brasaland Sabaneta"
  ],
  "CO|Bogota": ["Brasaland Usaquen", "Brasaland Chapinero", "Brasaland Zona Rosa"],
  "CO|Cali": ["Brasaland Granada", "Brasaland Ciudad Jardin", "Brasaland Unicentro"],
  "US|Miami": ["Brasaland Brickell", "Brasaland Coral Gables"],
  "US|Orlando": ["Brasaland Downtown", "Brasaland International Drive"]
};

const form = document.getElementById("application-form");
const country = document.getElementById("country");
const city = document.getElementById("city");
const favoriteLocation = document.getElementById("favoriteLocation");
const successMessage = document.getElementById("success-message");

function setFieldState(fieldElement, hasError) {
  if (!fieldElement) {
    return;
  }
  if (hasError) {
    fieldElement.setAttribute("aria-invalid", "true");
    fieldElement.classList.add("border-red-500", "focus:border-red-500", "focus:ring-red-200");
    fieldElement.classList.remove("border-coal/20", "focus:border-ember-500", "focus:ring-ember-200");
  } else {
    fieldElement.setAttribute("aria-invalid", "false");
    fieldElement.classList.remove("border-red-500", "focus:border-red-500", "focus:ring-red-200");
    fieldElement.classList.add("border-coal/20", "focus:border-ember-500", "focus:ring-ember-200");
  }
}

function setError(fieldId, message) {
  const errorElement = document.getElementById(fieldId + "-error");
  const fieldElement = document.getElementById(fieldId);
  if (!errorElement) {
    return;
  }

  if (message) {
    errorElement.textContent = message;
    errorElement.classList.remove("hidden");
    setFieldState(fieldElement, true);
  } else {
    errorElement.textContent = "";
    errorElement.classList.add("hidden");
    setFieldState(fieldElement, false);
  }
}

function populateSelect(selectElement, options, defaultLabel) {
  selectElement.innerHTML = "";
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = defaultLabel;
  selectElement.appendChild(defaultOption);

  options.forEach((optionValue) => {
    const option = document.createElement("option");
    option.value = optionValue;
    option.textContent = optionValue;
    selectElement.appendChild(option);
  });
}

function updateCities() {
  const selectedCountry = country.value;
  const cities = cityByCountry[selectedCountry] || [];
  populateSelect(city, cities, "Selecciona tu ciudad");
  city.disabled = cities.length === 0;
  updateLocations();
}

function updateLocations() {
  const selectedCountry = country.value;
  const selectedCity = city.value;
  const key = selectedCountry + "|" + selectedCity;
  const locations = locationByCountryCity[key] || [];
  populateSelect(favoriteLocation, locations, "Selecciona una ubicación (opcional)");
  favoriteLocation.disabled = locations.length === 0;
}

function isAdult(birthDateString) {
  if (!birthDateString) {
    return false;
  }
  const birthDate = new Date(birthDateString + "T00:00:00");
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }
  return age >= 18;
}

function validateFullName() {
  const value = document.getElementById("fullName").value.trim();
  if (value.split(/\s+/).filter(Boolean).length < 2) {
    setError("fullName", "Ingresa tu nombre completo (nombre y apellido)");
    return false;
  }
  setError("fullName", "");
  return true;
}

function validateEmail() {
  const value = document.getElementById("email").value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    setError("email", "Ingresa un email válido (ejemplo: <nombre@correo.com>)");
    return false;
  }
  setError("email", "");
  return true;
}

function validatePhone() {
  const value = document.getElementById("phone").value.trim();
  const phoneRegex = /^\+\d[\d\s]{6,}$/;
  const validPrefix =
    (country.value === "CO" && value.startsWith("+57")) ||
    (country.value === "US" && value.startsWith("+1")) ||
    (!country.value && (value.startsWith("+57") || value.startsWith("+1")));

  if (!phoneRegex.test(value) || !validPrefix) {
    setError("phone", "El teléfono debe incluir código de país (ejemplo: +57 300 123 4567 o +1 305 123 4567)");
    return false;
  }
  setError("phone", "");
  return true;
}

function validateCountry() {
  if (!country.value) {
    setError("country", "Selecciona tu país");
    return false;
  }
  setError("country", "");
  return true;
}

function validateCity() {
  if (!city.value) {
    setError("city", "Selecciona tu ciudad");
    return false;
  }
  setError("city", "");
  return true;
}

function validateSource() {
  const source = document.getElementById("source");
  if (!source.value) {
    setError("source", "Cuéntanos cómo conociste Brasaland");
    return false;
  }
  setError("source", "");
  return true;
}

function validateBirthDate() {
  const value = document.getElementById("birthDate").value;
  if (!isAdult(value)) {
    setError("birthDate", "Debes ser mayor de 18 años para registrarte en Brasa Points");
    return false;
  }
  setError("birthDate", "");
  return true;
}

function validateTerms() {
  const terms = document.getElementById("terms");
  if (!terms.checked) {
    setError("terms", "Debes aceptar los términos del programa Brasa Points para continuar");
    return false;
  }
  setError("terms", "");
  return true;
}

function validateAll() {
  const validations = [
    validateFullName(),
    validateEmail(),
    validatePhone(),
    validateCountry(),
    validateCity(),
    validateSource(),
    validateBirthDate(),
    validateTerms()
  ];
  return validations.every(Boolean);
}

country.addEventListener("change", () => {
  updateCities();
  validateCountry();
  validateCity();
  validatePhone();
});

city.addEventListener("change", () => {
  updateLocations();
  validateCity();
});

document.getElementById("source").addEventListener("change", validateSource);
document.getElementById("birthDate").addEventListener("change", validateBirthDate);
document.getElementById("terms").addEventListener("change", validateTerms);

const realtimeFields = {
  fullName: validateFullName,
  email: validateEmail,
  phone: validatePhone
};

Object.entries(realtimeFields).forEach(([fieldId, validator]) => {
  const field = document.getElementById(fieldId);
  field.addEventListener("input", validator);
  field.addEventListener("blur", validator);
});

["country", "city", "source", "birthDate"].forEach((fieldId) => {
  const field = document.getElementById(fieldId);
  field.addEventListener("blur", () => {
    if (fieldId === "country") {
      validateCountry();
      return;
    }
    if (fieldId === "city") {
      validateCity();
      return;
    }
    if (fieldId === "source") {
      validateSource();
      return;
    }
    validateBirthDate();
  });
});

form.addEventListener("reset", () => {
  ["fullName", "email", "phone", "country", "city", "source", "birthDate", "terms"].forEach((id) => {
    setError(id, "");
  });
  successMessage.classList.add("hidden");
  setTimeout(() => {
    updateCities();
    updateLocations();
  }, 0);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  successMessage.classList.add("hidden");

  if (!validateAll()) {
    return;
  }

  form.reset();
  updateCities();
  updateLocations();
  successMessage.classList.remove("hidden");
  successMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

updateCities();
updateLocations();
