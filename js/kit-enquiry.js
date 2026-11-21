/* Adds Email / WhatsApp enquiry buttons to each row of the kit tables */
(function () {
  var EMAIL = "info@iptengineering.com";
  var WA = "447912023945";
  /* Stripe Payment Links, keyed by kit part number. Rows with a link get a "Buy now" button. */
  var K1416 = "https://buy.stripe.com/cNibJ096k6K93HnbWjco001";
  var BUY = {
    HOFKFCU14: K1416, HOFKFCU16: K1416, HIFKSFU390: K1416, HIFK14SCR6: K1416, HIFK16SCR6: K1416
  };
  var css = ".kit-enq{white-space:nowrap}" +
    ".kit-enq a{display:inline-block;margin:2px 4px 2px 0;padding:6px 12px;border-radius:3px;color:#fff!important;" +
    "font-family:'Open Sans',sans-serif;font-size:.85em;font-weight:bold;text-decoration:none;line-height:1.2}" +
    ".kit-enq a.kit-email{background:#036}.kit-enq a.kit-wa{background:#25a35a}.kit-enq a.kit-buy{background:#c45500}" +
    ".kit-enq a:hover{opacity:.85}" +
    "@media screen and (max-width:768px){td.kit-enq{white-space:normal}td.kit-enq:before{content:'Enquire'!important}" +
    "table[data-price-col] td.kit-enq:before{content:'Order / Enquire'!important}}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  var h1 = document.querySelector("h1");
  var product = h1 ? h1.textContent.trim().replace(/s$/, "") : "Fluid coupling kit";

  document.querySelectorAll("table").forEach(function (table) {
    var headRow = table.querySelector("thead tr");
    if (!headRow) return;
    /* Tables with data-price-col="N" show a UK price in column N (0-based): buttons send an order instead of an enquiry */
    var priceCol = table.hasAttribute("data-price-col") ? parseInt(table.getAttribute("data-price-col"), 10) : -1;
    var th = document.createElement("th"); th.textContent = priceCol >= 0 ? "Order / Enquire" : "Enquire"; headRow.appendChild(th);
    table.querySelectorAll("tbody tr").forEach(function (tr) {
      var cells = tr.querySelectorAll("td");
      if (cells.length < 2) return;
      var size = cells[0].textContent.trim();
      var part = table.hasAttribute("data-no-part") ? "" : cells[1].textContent.trim();
      var prod = table.getAttribute("data-product") || product;
      var title = prod + ", size " + size + (part && !/ask|^[–-]$/i.test(part) ? " (" + part + ")" : "");
      var price = priceCol >= 0 && cells[priceCol] ? cells[priceCol].textContent.trim() : "";
      if (price.indexOf("£") !== 0) price = ""; /* e.g. "Request a quote" rows send a normal enquiry */
      var kind = price ? "Order" : "Enquiry";
      var msg = price
        ? "Order: " + title + " at " + price + " + VAT each, UK delivered\n\nQuantity required:\nCoupling serial number:\nName / company:\nDelivery address:\nContact number:\n\nSent from " + location.href
        : "Enquiry: " + title + "\n\nQuantity required:\nName / company:\nContact number:\n\nSent from " + location.href;
      var td = document.createElement("td"); td.className = "kit-enq";
      var em = document.createElement("a"); em.className = "kit-email"; em.textContent = "Email";
      em.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(kind + ": " + title) + "&body=" + encodeURIComponent(msg);
      em.setAttribute("aria-label", "Email an enquiry for " + title);
      var wa = document.createElement("a"); wa.className = "kit-wa"; wa.textContent = "WhatsApp";
      wa.href = "https://wa.me/" + WA + "?text=" + encodeURIComponent(msg);
      wa.target = "_blank"; wa.rel = "noopener";
      wa.setAttribute("aria-label", "WhatsApp an enquiry for " + title);
      if (price && BUY[part]) {
        var buy = document.createElement("a"); buy.className = "kit-buy"; buy.textContent = "Buy now";
        buy.href = BUY[part]; buy.target = "_blank"; buy.rel = "noopener";
        buy.setAttribute("aria-label", "Buy now: " + title + " at " + price + " + VAT");
        buy.addEventListener("click", function () { if (window.iptLead) window.iptLead("stripe"); });
        td.appendChild(buy);
      }
      td.appendChild(em); td.appendChild(wa); tr.appendChild(td);
    });
  });
})();
