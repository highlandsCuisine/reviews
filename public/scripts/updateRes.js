// update res
function submitForm1(event) {
  event.preventDefault();
  const form1 = document.getElementById("updateRestaurant");
  const formData = new FormData(form1);
  const name = formData.get("name");
  const link = formData.get("link");
  const rid = formData.get("id");
  const url = "/api/v1/reviews/update";
  const options = {
    method: "POST",
    body: JSON.stringify({ name: name, rid: rid, link: link }),
    headers: {
      "Content-Type": "application/json",
    },
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
        form1.reset();
        window.location.href = "/admin/dvls/googlereviews/adminpannel";
      }
    })
    .catch((error) => {
      displayErrorMessages(error.message);
    });
}

function displayErrorMessages(message) {
  const errorMessageContainer = document.getElementById("error-container1");
  errorMessageContainer.textContent = message;
  errorMessageContainer.style.color = "red";
  errorMessageContainer.style.fontWeight = "bold";
}

const form1 = document.getElementById("updateRestaurant");
form1.addEventListener("submit", submitForm1);
