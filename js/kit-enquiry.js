/* Adds Email / WhatsApp enquiry buttons to each row of the kit tables */
(function () {
  var EMAIL = "info@iptengineering.com";
  var WA = "447912023945";
  var css = ".kit-enq{white-space:nowrap}" +
    ".kit-enq a{display:inline-block;margin:2px 4px 2px 0;padding:6px 12px;border-radius:3px;color:#fff!important;" +
    "font-family:'Open Sans',sans-serif;font-size:.85em;font-weight:bold;text-decoration:none;line-height:1.2}" +
    ".kit-enq a.kit-email{background:#036}.kit-enq a.kit-wa{background:#25a35a}" +
    ".kit-enq a:hover{opacity:.85}" +
    "@media screen and (max-width:768px){td.kit-enq{white-space:normal}td.kit-enq:before{content:'Enquire'!important}}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  var h1 = document.querySelector("h1");
  var product = h1 ? h1.textContent.trim().replace(/s$/, "") : "Fluid coupling kit";

  document.querySelectorAll("table").forEach(function (table) {
    var headRow = table.querySelector("thead tr");
    if (!headRow) return;
    var th = document.createElement("th"); th.textContent = "Enquire"; headRow.appendChild(th);
    table.querySelectorAll("tbody tr").forEach(function (tr) {
      var cells = tr.querySelectorAll("td");
      if (cells.length < 2) return;
      var size = cells[0].textContent.trim();
      var part = cells[1].textContent.trim();
      var title = product + ", size " + size + " (" + part + ")";
      var msg = "Enquiry: " + title + "\n\nQuantity required:\nName / company:\nContact number:\n\nSent from " + location.href;
      var td = document.createElement("td"); td.className = "kit-enq";
      var em = document.createElement("a"); em.className = "kit-email"; em.textContent = "Email";
      em.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent("Enquiry: " + title) + "&body=" + encodeURIComponent(msg);
      em.setAttribute("aria-label", "Email an enquiry for " + title);
      var wa = document.createElement("a"); wa.className = "kit-wa"; wa.textContent = "WhatsApp";
      wa.href = "https://wa.me/" + WA + "?text=" + encodeURIComponent(msg);
      wa.target = "_blank"; wa.rel = "noopener";
      wa.setAttribute("aria-label", "WhatsApp an enquiry for " + title);
      td.appendChild(em); td.appendChild(wa); tr.appendChild(td);
    });
  });
})();
