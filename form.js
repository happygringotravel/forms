fieldMapping = {
  "00N8c00000ga5nz": "Full_Name__c",
  "00N8c00000PAX7A": "Start_Date__c",
  "00N8c00000PAcBf": "End_Date__c",
  "00N8c00000ga5nw": "Booking_Class__c",
  "00N8c00000ga5o5": "Total_Number_Pax__c",
  "00N8c00000ga5o2": "Observations__c",
  "00N8c00000dTKt1": "How_did_you_find_us__c",
  "00N8c00000ga5nx": "Country_Code__c",
  "00N8c00000ga5o6": "Travel_Request__c",
  "00N8c00000ga5o0": "How_did_you_find_us_other__c",
  "00N8c00000ga5o1": "Main_Product_Type__c",
  "00N8c00000ga5np": "Ages_0_4__c",
  "00N8c00000ga5nu": "Ages_5_11__c",
  "00N8c00000ga5nq": "Ages_12_20__c",
  "00N8c00000ga5nr": "Ages_21_29__c",
  "00N8c00000ga5ns": "Ages_30_44__c",
  "00N8c00000ga5nt": "Ages_45_64__c",
  "00N8c00000ga5nv": "Ages_65__c",
  "00N8c00000dTKtD": "SEND_TO_HAPPY_GRINGO__c",
};

//fill url
document.getElementById("url").value = window.location.href;
const getFieldId = (name) => {
  return Object.entries(fieldMapping).find((fm) => fm[1] === name)?.[0];
};

const input = document.querySelector("#phone");
window.intlTelInput(input, {
  nationalMode: false,
  preferredCountries: [
    "us",
    "gb",
    "ca",
    "au",
    "de",
    "ch",
    "nl",
    "fr",
    "be",
    "nz",
  ],
  utilsScript:
    "https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js",
});

const flag = document.querySelector(".iti__flag-container");
const selectedflag = document.querySelector(".iti__selected-flag");
const countryCode = document.querySelector("input[title='Country_Code']");

const fillCountryCode = () => {
  const countryPair = selectedflag.title.split(":");
  const extentionNumber = countryPair[1].trim();
  countryCode.value = countryPair[0].replace(/ *\([^)]*\) */g, "").trim();
  input.value =
    extentionNumber + " " + input.value.replace(extentionNumber, "").trim();
};

flag.addEventListener("click", (event) => {
  fillCountryCode();
});

const handleSubmit = (event) => {
  //event.preventDefault();
  // Crea un objeto FormData a partir del formulario
  const form = document.getElementById("salesforceform");
  const inputData = document.getElementById(getFieldId("Travel_Request__c"));

  var formData = new FormData(form);

  // Crea un objeto vacío para almacenar los datos
  var datosJSON = {};

  // Itera a través de los pares clave/valor en formData y los agrega al objeto datosJSON
  formData.forEach(function (value, key) {
    if (!value) {
      return;
    }
    if (fieldMapping[key]) {
      datosJSON[fieldMapping[key]] = value;
    } else {
      if (datosJSON[key]) {
        if (!Array.isArray(datosJSON[key])) {
          datosJSON[key] = [datosJSON[key]];
        }
        datosJSON[key].push(value);
      } else {
        datosJSON[key] = value;
      }
    }
  });

  // Convierte el objeto datosJSON a una cadena JSON
  inputData.value = JSON.stringify(datosJSON, null, 4);

  return true;
};

const showById = (id, show) => {
  const element = document.getElementById(id);
  element.classList.toggle("hidden", !show);
};

//TRAVELERS
const removeFocus = (event) => {
  if (event.pointerType != "mouse") return;
  console.log(event);
  document.activeElement.blur();
};

const updateTravelers = (event) => {
  const totalNumberOfTravelersModal = document.getElementById(
    "total-number-of-travelers"
  );
  const totalNumberOfTravelers = document.getElementById("00N8c00000ga5o5");

  const travelerInputs = document.querySelectorAll(
    "#number-travelers-modal .number-travelers-input"
  );

  let total = 0;
  for (const input of travelerInputs) {
    if (input.value) {
      total += parseInt(input.value) ?? 0;
    }
  }

  totalNumberOfTravelersModal.value = total;

  totalNumberOfTravelers.value = total;
};

//MAX CHECKBOX
const checkMaxSelected = (event) => {
  const checkboxes = document.querySelectorAll("input[name='Type_of_Tour']");
  selected = 0;
  for (checkbox of checkboxes) {
    if (checkbox.checked) {
      selected++;
    }
  }
  if (selected >= 3) {
    for (checkbox of checkboxes) {
      if (!checkbox.checked) {
        checkbox.disabled = true;
      }
    }
  } else {
    for (checkbox of checkboxes) {
      checkbox.disabled = false;
    }
  }
};
const checkboxes = document.querySelectorAll("input[name='Type_of_Tour']");
for (const checkbox of checkboxes) {
  checkbox.addEventListener("click", checkMaxSelected);
}

//MIN DATES
const dates = document.querySelectorAll(".salesforceform input[type=date]");
for (const d of dates) {
  d.min = new Date().toISOString().split("T")[0];
}

//RECALCULATE END DATE
const recalculateDates = (event) => {
  const numberOfDays =
    document.getElementById("number_of_days") ??
    document.createElement("input");
  const startDate = document.getElementById("start_date");
  const endDate =
    document.getElementById("end_date") ?? document.createElement("input");
  const Start_Date__c = document.getElementById(getFieldId("Start_Date__c"));
  const End_Date__c = document.getElementById(getFieldId("End_Date__c"));

  const sd = new Date(Date.parse(startDate.value));
  const ed = new Date(Date.parse(endDate.value));

  const days = Math.ceil((ed - sd) / (1000 * 60 * 60 * 24)) + 1;

  if (!startDate.value) {
    startDate.focus();
    return;
  }

  switch (event.target.name) {
    case "number_of_days":
      const newEndDate = new Date(Date.parse(startDate.value)).addDays(
        parseInt(numberOfDays.value)
      );
      endDate.value = newEndDate.toLocaleString("en-CA", {
        timeZone: "UTC",
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
      End_Date__c.value = newEndDate.toLocaleString("es-EC", {
        timeZone: "UTC",
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
      break;
    case "start_date":
    case "end_date":
      numberOfDays.value = days;
      break;
  }

  if (startDate.value !== "") {
    console.log(startDate.value);
    endDate.setAttribute("min", startDate.value);
  }

  Start_Date__c.value = new Date(Date.parse(startDate.value)).toLocaleString(
    "es-EC",
    {
      timeZone: "UTC",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }
  );

  End_Date__c.value =
    !endDate?.value || endDate.value === "Invalid Date"
      ? null
      : new Date(Date.parse(endDate.value)).toLocaleString("es-EC", {
          timeZone: "UTC",
          year: "numeric",
          month: "numeric",
          day: "numeric",
        });
  console.log(startDate.value, Start_Date__c.value, End_Date__c.value);
};

Date.prototype.addDays = function (days) {
  const date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

const onlyNumbers = (event) => {
  filtered = event.target.value.replace(/[^\d.+\s]/g, "");
  if (event.target.value !== filtered) event.target.value = filtered;
};
