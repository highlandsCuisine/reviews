function submitForm(event) {
  event.preventDefault();
  const form = document.getElementById("reset-form");
  const formData = new FormData(form);
  const email = formData.get("email");
  const token = formData.get("x-csrf-token");
  const url = "/api/v1/user/reset/password";
  const options = {
    method: "POST",
    body: JSON.stringify({ email }),
    headers: {
      "x-csrf-token": token,
      "Content-Type": "application/json",
    },
    credentials: "include",
  };

  fetch(url, options)
    .then(async (response) => {
      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message);
      }
      return res;
    })
    .then((data) => {
      if (data) {
        form.reset();
        window.location.href = "/admin/dvls/googlereviews/login";
      }
    })
    .catch((error) => {
      displayErrorMessage(error.message);
    });
}

function displayErrorMessage(message) {
  const errorMessageContainer = document.getElementById("error-container");
  errorMessageContainer.textContent = message;
  errorMessageContainer.style.color = "red";
  errorMessageContainer.style.fontWeight = "bold";
}

const form = document.getElementById("reset-form");
form.addEventListener("submit", submitForm);
