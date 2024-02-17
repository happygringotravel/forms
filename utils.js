function loadScript(src, callback) {
  var s, r, t;
  r = false;
  s = document.createElement("script");
  s.type = "text/javascript";
  s.src = src;
  s.onload = s.onreadystatechange = function () {
    if (!r && (!this.readyState || this.readyState == "complete")) {
      r = true;
      if (callback) callback();
    }
  };
  t = document.getElementsByTagName("script")[0];
  t.parentNode.insertBefore(s, t);
}

function loadHtml(url, callback) {
  fetch(url)
    .then(function (response) {
      // When the page is loaded convert it to text
      return response.text();
    })
    .then(function (html) {
      document.getElementById("external_form").innerHTML = html;
      if (callback) {
        callback();
      }
    })
    .catch(function (err) {
      console.log("Failed to fetch page: ", err);
    });
}

const nextForm = (event) => {
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
  return false;
};

const previous = (event) => {
  event.preventDefault();
  document.getElementById("page2").classList.add("hidden");
  document.getElementById("page1").classList.remove("hidden");
};
