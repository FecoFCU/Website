/* Butterfly valve quotation form: builds an email or WhatsApp message */
(function () {
  var EMAIL = "info@iptengineering.com", WA = "447912023945";
  var f = document.getElementById("vq-form"); if (!f) return;
  var msg = document.getElementById("vq-msg");
  var fields = [
    ["vq-type", "Valve type"], ["vq-size", "Size (DN)"], ["vq-qty", "Quantity"],
    ["vq-pressure", "Working pressure"], ["vq-flange", "Flange / pipe standard"],
    ["vq-body", "Body material"], ["vq-disc", "Disc material"], ["vq-seat", "Seat / liner"],
    ["vq-medium", "Medium"], ["vq-temp", "Temperature range"], ["vq-op", "Operation"],
    ["vq-atex", "ATEX required"], ["vq-delivery", "Delivery location / required by"],
    ["vq-name", "Name / company"], ["vq-contact", "Email / phone"], ["vq-notes", "Notes"]
  ];
  function val(id) { var e = document.getElementById(id); return e ? e.value.trim() : ""; }
  function build() {
    var lines = ["Butterfly valve quotation request", ""];
    fields.forEach(function (x) { var v = val(x[0]); if (v) lines.push(x[1] + ": " + v); });
    lines.push("", "Sent from " + location.href);
    return lines.join("\n");
  }
  function ok() {
    var missing = [["vq-size","size"],["vq-qty","quantity"],["vq-medium","medium"],["vq-contact","email or phone"]].filter(function (x) { return !val(x[0]); }).map(function (x) { return x[1]; });
    if (missing.length) { msg.textContent = "Please add: " + missing.join(", ") + "."; msg.style.display = "block"; return false; }
    msg.style.display = "none"; return true;
  }
  function subject() { return "Butterfly valve quote: " + [val("vq-size"), val("vq-type")].filter(Boolean).join(" ") + (val("vq-qty") ? " x " + val("vq-qty") : ""); }
  document.getElementById("vq-email").addEventListener("click", function (e) {
    e.preventDefault(); if (!ok()) return;
    location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject()) + "&body=" + encodeURIComponent(build());
  });
  document.getElementById("vq-wa").addEventListener("click", function (e) {
    e.preventDefault(); if (!ok()) return;
    window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(build()), "_blank", "noopener");
  });
  document.getElementById("vq-copy").addEventListener("click", function (e) {
    e.preventDefault(); if (!ok()) return; var b = this;
    navigator.clipboard.writeText("To: " + EMAIL + "\n\n" + build()).then(function () { b.textContent = "Copied: paste into a new email"; }, function () { b.textContent = "Copy failed"; });
  });
})();
