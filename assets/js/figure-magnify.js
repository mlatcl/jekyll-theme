function magnifyFigure(idstub) {
  if (!idstub) {
    console.warn("magnifyFigure: empty figure label");
    return;
  }
  var modal = document.getElementById("modal-frame");
  if (!modal) {
    console.warn(
      "magnifyFigure: #modal-frame missing (lecture layout with modal required)"
    );
    return;
  }
  modal.style.display = "block";
  document.body.classList.add("modal-open");
  var modalObject = document.getElementById("modal01");
  var object =
    document.getElementById(idstub.concat("-figure")) ||
    document.getElementById(idstub.concat("-table"));
  if (!object || !modalObject) {
    console.warn("magnifyFigure: missing content for", idstub);
    return;
  }
  modalObject.innerHTML = object.innerHTML;
  var caption = document.getElementById(idstub.concat("-caption"));
  var captionText = document.getElementById("modal-caption");
  if (caption && captionText) {
    captionText.innerHTML = caption.innerHTML;
  }
}

function closeMagnify() {
  var modal = document.getElementById("modal-frame");
  if (!modal) {
    return;
  }
  modal.style.display = "none";
  document.body.classList.remove("modal-open");
}

function initFigureMagnify() {
  var modal = document.getElementById("modal-frame");
  if (!modal || modal.dataset.magnifyInit === "true") {
    return;
  }
  modal.dataset.magnifyInit = "true";

  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeMagnify();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modal.style.display === "block") {
      closeMagnify();
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFigureMagnify);
} else {
  initFigureMagnify();
}
