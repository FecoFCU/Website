/* Generic enquiry form: <form class="enq-form" data-subject="..."> with fields
   carrying data-label (and data-required). Builds an email or WhatsApp message. */
(function () {
  var EMAIL = "info@iptengineering.com", WA = "447912023945";
  document.querySelectorAll("form.enq-form").forEach(function (f) {
    var msg = f.querySelector(".enq-msg");
    var els = Array.prototype.slice.call(f.querySelectorAll("[data-label]"));
    function v(e) { return (e.value || "").trim(); }
    function build() {
      var lines = [f.getAttribute("data-subject"), ""], last = null;
      els.forEach(function (e) {
        if (!v(e)) return;
        var fs = e.closest("fieldset"), lg = fs && fs.querySelector("legend");
        var sec = lg ? lg.textContent.trim() : null;
        if (sec && sec !== last) { if (last !== null) lines.push(""); lines.push(sec.toUpperCase()); last = sec; }
        lines.push(e.getAttribute("data-label") + ": " + v(e));
      });
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
      var text = build(), subj = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(f.getAttribute("data-subject"));
      if (encodeURIComponent(text).length < 1800) { location.href = subj + "&body=" + encodeURIComponent(text); return; }
      // Long enquiries can be cut off by some email programs: copy the full text and ask for it to be pasted.
      var go = function (copied) {
        msg.textContent = copied ? "Your details are copied. Paste them into the email that opens (Ctrl+V or long-press, Paste)."
                                 : "Your enquiry is long: please use \"Or copy the details\" and paste into an email to " + EMAIL + ".";
        msg.style.display = "block";
        if (copied) location.href = subj + "&body=" + encodeURIComponent("Please paste the copied enquiry details here.\n\n");
      };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { go(true); }, function () { go(false); });
      else go(false);
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
