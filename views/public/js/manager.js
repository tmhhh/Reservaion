document.querySelector(".add_product").addEventListener("click", function () {
  window.location.replace("/manager/product/add");
});

document
  .querySelector(".manage_product")
  .addEventListener("click", function () {
    window.location.replace("/manager/product/edit");
  });
document.querySelector(".booking_list").addEventListener("click", function () {
  window.location.replace("/manager/BookingList");
});
