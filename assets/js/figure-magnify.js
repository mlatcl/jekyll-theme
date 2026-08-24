var magnifyRestore = null;

function restoreMagnifiedContent() {
  if (!magnifyRestore) {
    return;
  }
  var node = magnifyRestore.node;
  var placeholder = magnifyRestore.placeholder;
  if (node && placeholder && placeholder.parentNode) {
    placeholder.parentNode.insertBefore(node, placeholder);
    placeholder.parentNode.removeChild(placeholder);
  }
  magnifyRestore = null;
  var modalObject = document.getElementById("modal01");
  if (modalObject) {
    modalObject.textContent = "";
  }
}

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
  var modalObject = document.getElementById("modal01");
  var object =
    document.getElementById(idstub.concat("-figure")) ||
    document.getElementById(idstub.concat("-table"));
  if (!object || !modalObject) {
    console.warn("magnifyFigure: missing content for", idstub);
    return;
  }

  // Move the live figure node (keeps canvas, listeners, running scripts).
  // innerHTML copy breaks interactive figures such as entropy billiards.
  restoreMagnifiedContent();

  var placeholder = document.createElement("span");
  placeholder.className = "magnify-placeholder";
  placeholder.hidden = true;
  placeholder.setAttribute("aria-hidden", "true");
  object.parentNode.insertBefore(placeholder, object);

  magnifyRestore = { node: object, placeholder: placeholder };

  modalObject.textContent = "";
  modalObject.appendChild(object);

  var caption = document.getElementById(idstub.concat("-caption"));
  var captionText = document.getElementById("modal-caption");
  if (caption && captionText) {
    captionText.innerHTML = caption.innerHTML;
  } else if (captionText) {
    captionText.textContent = "";
  }

  modal.style.display = "block";
  document.body.classList.add("modal-open");

  window.dispatchEvent(new Event("resize"));
  document.dispatchEvent(
    new CustomEvent("figure-magnified", {
      detail: { id: idstub, node: object },
    })
  );
}

function closeMagnify() {
  var modal = document.getElementById("modal-frame");
  restoreMagnifiedContent();
  if (!modal) {
    return;
  }
  modal.style.display = "none";
  document.body.classList.remove("modal-open");
  var captionText = document.getElementById("modal-caption");
  if (captionText) {
    captionText.textContent = "";
  }
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
