function submitForm(event) {
  event.preventDefault();
  const form = document.getElementById("pass-form");
  const formData = new FormData(form);
  const email = formData.get("email");
  const password1 = formData.get("password1");
  const token = formData.get("x-csrf-token");
  const password = formData.get("password");
  const url = "/api/v1/auth/user/forgotpass";
  const options = {
    method: "POST",
    body: JSON.stringify({ email, password, password1 }),
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

const form = document.getElementById("pass-form");
form.addEventListener("submit", submitForm);
