const bl = ["mailinator", "ailinator"];
let wtTrip;
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
  "00N8c00000gac9Z": "Total_Number_Days__c",
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
const date = document.getElementById("start_date");
document.getElementById("form-title").value =
  formTitle ?? "BOOK YOUR TOUR TODAY";
document.getElementById("form-title-2").value =
  formTitle ?? "BOOK YOUR TOUR TODAY";

const dateValidation = (event) => {
  let selDate = new Date(event.target.value);
  const month = selDate.getUTCMonth() + 1; // months from 1-12
  const day = selDate.getUTCDate();
  const year = selDate.getUTCFullYear();

  //days difference between sedDate and now
  const days = Math.ceil((selDate - new Date()) / (1000 * 60 * 60 * 24));

  const invalidDates = [
    {
      year: 2024,
      month: 3,
      day: 29,
      message:
        "Selected dates are in high demand. To book, please write to info@happygringo.com",
    },
    {
      year: 2024,
      month: 3,
      day: 30,
      message:
        "Selected dates are in high demand. To book, please write to info@happygringo.com",
    },
    {
      year: 2024,
      month: 3,
      day: 31,
      message:
        "Selected dates are in high demand. To book, please write to info@happygringo.com",
    },
    {
      month: 12,
      day: 24,
      message:
        "Selected dates are in high demand. To book, please write to info@happygringo.com",
    },
    {
      month: 12,
      day: 25,
      message:
        "Selected dates are in high demand. To book, please write to info@happygringo.com",
    },
    {
      month: 12,
      day: 31,
      message:
        "Selected dates are in high demand. To book, please write to info@happygringo.com",
    },
    {
      month: 1,
      day: 1,
      message:
        "Selected dates are in high demand. To book, please write to info@happygringo.com",
    },
  ];
  const invalidDate = invalidDates.find(
    (d) => (d.year === year || !d.year) && d.month === month && d.day === day
  );
  if (days < 7) {
    event.target.setCustomValidity(
      "For bookings within the next seven days, please write to info@happygringo.com"
    );
    event.target.reportValidity();
  } else if (invalidDate) {
    event.target.setCustomValidity(invalidDate.message);
    event.target.reportValidity();
  } else {
    event.target.setCustomValidity("");
  }
};

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

const nextFormWT = (event) => {
  event.preventDefault();
  const currentform = event.target;
  const submitform = document.getElementById("salesforceform");
  fields = currentform.querySelectorAll("input,select,textArea");
  for (f of fields) {
    let copied = submitform.querySelector(`input[name='${f.name}']`);
    if (!copied) {
      copied = document.createElement("input");
      submitform.appendChild(copied);
    }
    copied.name = f.name;
    copied.value = f.value;
    copied.type = "hidden";
  }
  document.getElementById("page1").classList.add("hidden");
  document.getElementById("page2").classList.remove("hidden");
  createTrip();
  return false;
};

const createTrip = async (event) => {
  const formData = getFormData();

  unitPrice = Object.values(pricetable)[Object.values(pricetable).length - 1];
  console.log(formData);
  if (
    formData?.Ages_0_4__c == "1" &&
    formData?.Ages_5_11__c == "2" &&
    formData?.Ages_12_20__c == "3" &&
    formData?.Ages_21_29__c == "4" &&
    formData?.Ages_30_44__c == "5" &&
    formData?.Ages_45_64__c == "6" &&
    formData?.Ages_65__c == "7"
  ) {
    unitPrice = 1 / 28;
  } else if (pricetable[formData.Total_Number_Pax__c]) {
    unitPrice = pricetable[formData.Total_Number_Pax__c];
  }

  //get checked from pick_from_hotel input

  console.log({ formData });
  //formData.group_min = formData.Total_Number_Pax__c;
  //formData.group_max = formData.Total_Number_Pax__c;
  formData.price = unitPrice * formData.Total_Number_Pax__c;
  formData.lead_source = "WEBSITE FORM - INSIDE TWO STEPS CONTACT FORM";
  formData.title = tourTitle ?? "DAY TOUR";
  formData.url =
    "https://wordpress-314336-3661924.cloudwaysapps.com/wp-content/uploads/2021/08/happy-logo.jpg";

  const response = await fetch(
    `${wtLambda}/?data=` + encodeURIComponent(JSON.stringify(formData))
  );
  wtTrip = await response.json();
  document.getElementById("btn-send").classList.remove("hidden");
};

const handleSubmit = async (event) => {
  //document.getElementById("btn-send").classList.add("hidden");
  //document.getElementById("loading-send").classList.remove("hidden");

  event.preventDefault();

  if (wtTrip?.data?.uuid) {
    document.getElementById("wetravel-uuid").value = wtTrip.data.uuid;
    document.getElementById("loading-send").classList.add("hidden");
    const wtButton = document.getElementsByClassName(
      "wtrvl-checkout_button"
    )[0];
    wtButton.setAttribute("data-uuid", wtTrip.data.uuid); //  = wtTrip.data.uuid;
    wtButton.setAttribute(
      "href",
      `https://www.wetravel.com/checkout_embed?uuid=${wtTrip.data.uuid}`
    );
    wtButton.click();
  }

  //return true;
};

const getFormData = () => {
  var datosJSON = {};

  const form = document.getElementById("salesforceform");
  const inputData = document.getElementById(getFieldId("Travel_Request__c"));

  var formData = new FormData(form);
  // Itera a través de los pares clave/valor en formData y los agrega al objeto datosJSON
  formData.forEach(function (value, key) {
    if (!value) {
      return;
    }
    if (fieldMapping[key]) {
      datosJSON[fieldMapping[key]] = value;
    } else {
      if (key === "email") {
        for (b of bl) {
          if (value.includes(b)) {
            event.preventDefault();
          }
        }
      }
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

  var checkedBoxes = document.querySelectorAll("input[type=checkbox]");
  for (cb of checkedBoxes) {
    datosJSON[cb.name] = cb.checked;
  }

  // Convierte el objeto datosJSON a una cadena JSON
  inputData.value = JSON.stringify(datosJSON, null, 4);
  console.log({ datosJSON });
  return datosJSON;
};

const showById = (id, show) => {
  const element = document.getElementById(id);
  element.classList.toggle("hidden", !show);
};

//TRAVELERS
const removeFocus = (event) => {
  if (event.pointerType != "mouse") return;
  document.activeElement.blur();
};

const updateTravelers = (event) => {
  const totalNumberOfTravelersModal = document.getElementById(
    "total-number-of-travelers"
  );
  const totalNumberOfTravelers = document.getElementById("00N8c00000ga5o5");
  totalNumberOfTravelers.setCustomValidity("");

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
  var now = new Date();
  var nextweek = new Date();
  nextweek.setDate(now.getDate() + 7);
  d.min = now.toISOString().split("T")[0];
}

//RECALCULATE END DATE
const recalculateDates = (event) => {
  const numberOfDays =
    document.getElementById("number_of_days") ??
    document.createElement("input");
  numberOfDays.setCustomValidity("");
  const startDate = document.getElementById("start_date");

  const endDate =
    document.getElementById("end_date") ?? document.createElement("input");
  endDate.setCustomValidity("");
  const Start_Date__c = document.getElementById(getFieldId("Start_Date__c"));
  const End_Date__c = document.getElementById(getFieldId("End_Date__c"));

  const sd = new Date(Date.parse(startDate.value));
  const ed = new Date(Date.parse(endDate.value));

  const days = Math.ceil((ed - sd) / (1000 * 60 * 60 * 24)) + 1;

  if (!startDate.value) {
    startDate.focus();
    return;
  }
  switch (event.target.id) {
    case "number_of_days":
      if (!endDate.value || numberOfDays.value > days) {
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
      }
      break;
    case "start_date":
    case "end_date":
      if (!numberOfDays.value || numberOfDays.value > days) {
        numberOfDays.value = days;
      }
      break;
  }

  if (startDate.value !== "") {
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
};

//CONFIRM
const eventMethod = window.addEventListener
  ? "addEventListener"
  : "attachEvent";
const eventer = window[eventMethod];
const messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

eventer(messageEvent, (e) => {
  if (e.data.type === "bookingConfirmed") {
    console.log("Success Payed");
    document.getElementById("payed").value = "true";
    getFormData();
    document.getElementById("salesforceform").submit();
  }
});

Date.prototype.addDays = function (days) {
  const date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

const onlyNumbers = (event) => {
  filtered = event.target.value.replace(/[^\d.+\s]/g, "");
  if (event.target.value !== filtered) event.target.value = filtered;
};
