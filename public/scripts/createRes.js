function submitForm(event) {
  event.preventDefault();
  const form = document.getElementById("createRestaurant");
  const formData = new FormData(form);
  const name = formData.get("name");
  const token = formData.get("x-csrf-token");
  const link = formData.get("link");
  const url = "/api/v1/res/add";
  const options = {
    method: "POST",
    body: JSON.stringify({ name: name, link: link }),
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
        window.location.href = "/admin/dvls/googlereviews/adminpannel";
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

const form = document.getElementById("createRestaurant");
form.addEventListener("submit", submitForm);
