/* Generic enquiry form: <form class="enq-form" data-subject="..."> with fields
   carrying data-label (and data-required). Builds an email or WhatsApp message. */
(function () {
  var EMAIL = "info@iptengineering.com", WA = "447912023945";
  document.querySelectorAll("form.enq-form").forEach(function (f) {
    var msg = f.querySelector(".enq-msg");
    var els = Array.prototype.slice.call(f.querySelectorAll("[data-label]"));
    function v(e) { return (e.value || "").trim(); }
    function build() {
      var lines = [f.getAttribute("data-subject"), ""];
      els.forEach(function (e) { if (v(e)) lines.push(e.getAttribute("data-label") + ": " + v(e)); });
      lines.push("", "Sent from " + location.href);
      return lines.join("\n");
    }
    function ok() {
      var miss = els.filter(function (e) { return e.hasAttribute("data-required") && !v(e); })
                    .map(function (e) { return e.getAttribute("data-label").toLowerCase(); });
      if (miss.length) { msg.textContent = "Please add: " + miss.join(", ") + "."; msg.style.display = "block"; return false; }
      msg.style.display = "none"; return true;
    }
    f.querySelector(".enq-email").addEventListener("click", function (e) {
      e.preventDefault(); if (!ok()) return;
      location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(f.getAttribute("data-subject")) + "&body=" + encodeURIComponent(build());
    });
    f.querySelector(".enq-wa").addEventListener("click", function (e) {
      e.preventDefault(); if (!ok()) return;
      window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(build()), "_blank", "noopener");
    });
    f.querySelector(".enq-copy").addEventListener("click", function (e) {
      e.preventDefault(); if (!ok()) return; var b = this;
      navigator.clipboard.writeText("To: " + EMAIL + "\n\n" + build()).then(function () { b.textContent = "Copied: paste into a new email"; }, function () { b.textContent = "Copy failed"; });
    });
  });
})();
