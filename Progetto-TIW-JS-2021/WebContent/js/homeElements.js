/**
 * Home Elements: Elementi ausiliari utilizzati dalla pagina di home per Progetto-TIW-JS-2021
 */

/** 
 * Prodotto visualizzato in caso di ricerca, espandibile tramite 
 * una tabella delle offerte
 * @param {GestorePagina} gestore Gestore della pagina che contiene il prodotto
 * @param {Node} listaProdotti Nodo che contiene la lista dei prodotti
 */
function Prodotto(gestore, listaProdotti) {
	
	this.listaProdotti = listaProdotti;
	this.listaOfferte;
	
	this.update = function(prodotto) {
		
		var self = this;
		
		var tabellaProdotto, riga1, riga2, riga3, cellaImmagine, immagine, 
			cellaCategoria, cellaNome, cellaPrezzo, cellaDescrizione, 
			cellaOfferte, divOfferte; 
		
		// Funzione utilizzata per caricare le offerte del prodotto
		var caricaOfferte = (e) => {
			if(self.listaOfferte.isHidden()) {
				var idSelezionato = e.target.getAttribute("idProdotto");
				// Notifica che il prodotto è stato visualizzato dall'utente
				aggiungiVisualizzato(idSelezionato);
				self.listaOfferte.carica();
				self.listaOfferte.show();
			}
			else
				self.listaOfferte.hide();
		}
		
		tabellaProdotto = document.createElement("table");
		this.listaProdotti.appendChild(tabellaProdotto);
		
		riga1 = document.createElement("tr");
		tabellaProdotto.appendChild(riga1);
		
		riga2 = document.createElement("tr");
		tabellaProdotto.appendChild(riga2);
		
		riga3 = document.createElement("tr");
		riga3.colSpan = "4";
		tabellaProdotto.appendChild(riga3);
		
		// Sezione offerte
		cellaOfferte = document.createElement("td");
		cellaOfferte.colSpan = "4";
		riga3.appendChild(cellaOfferte);
		
		divOfferte = document.createElement("div");	//TODO: id?
		cellaOfferte.appendChild(divOfferte);
		
		this.listaOfferte = new ListaOggetti(gestore, Offerta, divOfferte,
			function() {
				caricaLista(this, "GET", "CercaProdotto?idProdotto=" + prodotto.ID, 
					null, gestore.messaggio);
			}
		);
		this.listaOfferte.hide();	// Le offerte sono sempre nascoste al momento della creazione
		
		//Sezione immagine
		cellaImmagine = document.createElement("td");
		cellaImmagine.rowSpan = "2";
		riga1.appendChild(cellaImmagine);
		
		immagine = document.createElement("img");
		immagine.src = "data:image/png;base64," + prodotto.immagine;
		immagine.className = "immagineGrande";
		immagine.setAttribute("idProdotto", prodotto.ID);
		immagine.addEventListener("click", caricaOfferte, false);
		cellaImmagine.appendChild(immagine);
		
		//Sezione categoria
		cellaCategoria = document.createElement("td");
		cellaCategoria.textContent = prodotto.categoria;
		riga1.appendChild(cellaCategoria);
		
		//Sezione nome
		cellaNome = document.createElement("td");
		cellaNome.textContent = prodotto.nome;
		cellaNome.setAttribute("idProdotto", prodotto.ID);
		cellaNome.addEventListener("click", caricaOfferte, false);
		riga1.appendChild(cellaNome);
		
		//Sezione prezzo
		cellaPrezzo = document.createElement("td");
		cellaPrezzo.textContent = prodotto.prezzo.toFixed(2) + " \u20AC";
		riga1.appendChild(cellaPrezzo);
		
		//Sezione descrizione
		cellaDescrizione = document.createElement("td");
		cellaDescrizione.textContent = prodotto.descrizione;
		cellaDescrizione.colSpan = "3";
		riga2.appendChild(cellaDescrizione);
		
		
	};
}

/** 
 * Ordine visualizzato nella sezione ordini, non possiede elementi interattivi
 * @param {GestorePagina} gestore Gestore della pagina che contiene l'ordine
 * @param {Node} listaOrdini Nodo che contiene la lista degli ordini
 */
function Ordine(gestore, listaOrdini) {
	
	this.listaOrdini = listaOrdini;
	
	this.update = function(ordine) {
		
		var tabellaOrdine, riga1, riga2, riga3, cellaAcquisto, 
		cellaIndirizzo, cellaLista, listaProdotti; 
			
		tabellaOrdine = document.createElement("table");
		this.listaOrdini.appendChild(tabellaOrdine);
		
		riga1 = document.createElement("tr");
		tabellaOrdine.appendChild(riga1);
		
		riga2 = document.createElement("tr");
		tabellaOrdine.appendChild(riga2);
		
		riga3 = document.createElement("tr");
		tabellaOrdine.appendChild(riga3);
		
		// Sezione informazioni acquisto
		cellaAcquisto = document.createElement("td");
		cellaAcquisto.textContent = "Acquisto effettuato in data " + ordine.data + "\n" +
									"Presso il venditore " + ordine.fornitore.nome + " - " + 
									"Totale: " + ordine.totale;
		cellaAcquisto.style = "white-space:pre";	//TODO: da fare in CSS 
		riga1.appendChild(cellaAcquisto);
		
		// Sezione indirizzo di spedizione
		cellaIndirizzo = document.createElement("td");
		cellaIndirizzo.textContent =	"Con indirizzo di spedizione:" + "\n" +
									 	indirizzo(ordine.indirizzo);
		cellaIndirizzo.style = "white-space:pre";	//TODO: da fare in CSS 
		riga2.appendChild(cellaIndirizzo);
		
		// Sezione elenco dei prodotti acquistati
		cellaLista = document.createElement("td");
		riga3.appendChild(cellaLista);
		
		listaProdotti = document.createElement("ul");
		cellaLista.appendChild(listaProdotti);
		
		ordine.prodotti.forEach((prodotto) => {
			
			var entryProdotto = document.createElement("li");
			entryProdotto.textContent = prodotto.nome + " x" + prodotto.quantita;
			listaProdotti.appendChild(entryProdotto);
		});
		
	};
}

/**
 * Carrello di prodotti associati ad uno specifico fornitore, se il flag "display" è posto a true
 * vengono omesse le informazioni relative all'indirizzo di spedizione e al nome del fornitore 
 * durante la visualizzazione
 * @param {GestorePagina} gestore Gestore della pagina che contiene il carrello
 * @param {Node} listaCarrelli Nodo che contiene la lista dei carrelli
 * @param {Boolean} display Flag che identifica il tipo di visualizzazione del carrello
 */
function Carrello(gestore, listaCarrelli, display) {
	
	this.listaCarrelli = listaCarrelli;
	this.display = display;
	
	this.update = function(carrello) {
		var tabellaCarrello, rigaFornitore, riga1, riga2, riga3, cellaFornitore, cellaTotale, 
		cellaPrezzoSpedizione, cellaSpedizione, formSpedizione, testoCitta, testoVia, testoNumero, 
		testoCAP, bottoneSpedizione, label, linebreak;
		
		var utente = infoUtente();
		var indirizzo = utente.indirizzo;
			
		tabellaCarrello = document.createElement("table");
		tabellaCarrello.className = "tabellaProdotti";
		this.listaCarrelli.appendChild(tabellaCarrello);
		
		// Nome del fornitore
		if(!display) {
			rigaFornitore = document.createElement("tr");
			rigaFornitore.colSpan = "4";
			tabellaCarrello.appendChild(rigaFornitore);
			
			cellaFornitore = document.createElement("td");
			cellaFornitore.textContent = carrello.fornitore.nome;
			rigaFornitore.appendChild(cellaFornitore);
		}
		
		// Lista di prodotti all'interno del carrello
		carrello.prodotti.forEach((prodotto) => {
			
			var riga, cellaImmagine, immagine, cellaNome, cellaQuantita, cellaPrezzo;
		
			riga = document.createElement("tr");
			tabellaCarrello.appendChild(riga);
			
			// Immagine del prodotto
			cellaImmagine = document.createElement("td");
			riga.appendChild(cellaImmagine);
			
			immagine = document.createElement("img");
			immagine.src = "data:image/png;base64," + prodotto.immagine;
			immagine.className = "immagineMedia";
			cellaImmagine.appendChild(immagine);
			
			// Informazioni sul prodotto (nome, quantità e prezzo)
			cellaNome = document.createElement("td");
			cellaNome.textContent = prodotto.nome;
			riga.appendChild(cellaNome);
			
			cellaQuantita = document.createElement("td");
			cellaQuantita.textContent = "x" + prodotto.quantita;
			riga.appendChild(cellaQuantita);
			
			cellaPrezzo = document.createElement("td");
			cellaPrezzo.textContent = prodotto.prezzo.toFixed(2) + " \u20AC";
			riga.appendChild(cellaPrezzo);
			
		});
		
		if(!display) {
			riga1 = document.createElement("tr");
			riga1.colSpan = "4";
			tabellaCarrello.appendChild(riga1);
			
			riga2 = document.createElement("tr");
			riga2.colSpan = "4";
			tabellaCarrello.appendChild(riga2);
			
			riga3 = document.createElement("tr");
			riga3.colSpan = "4";
			tabellaCarrello.appendChild(riga3);
			
			// Informazioni sul singolo ordine del carrello (totale e prezzo di spedizione)
			cellaTotale = document.createElement("td");
			cellaTotale.textContent = carrello.totaleCosto.toFixed(2) + " \u20AC";
			riga1.appendChild(cellaTotale);
			
			cellaPrezzoSpedizione = document.createElement("td");
			cellaPrezzoSpedizione.textContent = carrello.costoSpedizione.toFixed(2) + " \u20AC";
			riga2.appendChild(cellaPrezzoSpedizione);
			
			// Form per la personalizzazione della spedizione	TODO: metodo a parte(?)
			cellaSpedizione = document.createElement("td");
			riga3.appendChild(cellaSpedizione);
			
			formSpedizione = document.createElement("form");
			formSpedizione.action = "#";
			formSpedizione.id = "formSpedizione";
			cellaSpedizione.appendChild(formSpedizione);
			
			label = document.createElement("label");
	        label.innerHTML = "Città: ";
			formSpedizione.appendChild(label);
			
			testoCitta = document.createElement("input");
			testoCitta.name = "citta";
			testoCitta.type = "text";
			testoCitta.value = indirizzo.citta;
			formSpedizione.appendChild(testoCitta);
			
			linebreak = document.createElement("br");
			formSpedizione.appendChild(linebreak);
			
			label = document.createElement("label");
	        label.innerHTML = "Via: ";
			formSpedizione.appendChild(label);
			
			testoVia = document.createElement("input");
			testoVia.name = "via";
			testoVia.type = "text";
			testoVia.value = indirizzo.via;
			formSpedizione.appendChild(testoVia);
			
			linebreak = document.createElement("br");
			formSpedizione.appendChild(linebreak);
			
			label = document.createElement("label");
	        label.innerHTML = "Numero: ";
			formSpedizione.appendChild(label);
			
			testoNumero = document.createElement("input");
			testoNumero.name = "numero";
			testoNumero.type = "number";
			testoNumero.value = indirizzo.numero;
			formSpedizione.appendChild(testoNumero);
			
			linebreak = document.createElement("br");
			formSpedizione.appendChild(linebreak);
			
			label = document.createElement("label");
	        label.innerHTML = "CAP: ";
			formSpedizione.appendChild(label);
			
			testoCAP = document.createElement("input");
			testoCAP.name = "cap";
			testoCAP.type = "number";
			testoCAP.value = indirizzo.cap;
			formSpedizione.appendChild(testoCAP);
			
			linebreak = document.createElement("br");
			formSpedizione.appendChild(linebreak);
			
			var carrelloForm = document.createElement("input");
			carrelloForm.hidden = true;
			carrelloForm.name = "carrello";
			carrelloForm.value = "";
			formSpedizione.appendChild(carrelloForm);
			
			bottoneSpedizione = document.createElement("input");
			bottoneSpedizione.type = "button";
			bottoneSpedizione.value = "Ordina";
			bottoneSpedizione.addEventListener("click", (e) => {
				var form = e.target.closest("form");
				if(form.checkValidity()) {
					// Se il form per la spedizione risulta valido, vengono caricate le 
					// informazioni relative al carrello dai cookie
					carrelloForm.value = ritornaCookieCarrelloDaFornitore(utente.id, 
						carrello.fornitore.ID);
					// Viene fatta una chiamata al server per aggiungere l'ordine
					makeCall("POST", "AggiungiOrdine", new FormData(form), gestore.messaggio, 
						function() {
							// Se la chiamata va a buon fine i cookie relativi al carrello
							// vengono eliminati e vengono visualizzati gli ordini
							carrelloForm.value = "";
		              		cancellaCookieCarrello(utente.id, carrello.fornitore.ID);
							gestore.visOrdini();
			        	}
					);
				}
				else
					form.reportValidity();
			}, false);
			formSpedizione.appendChild(bottoneSpedizione);
		}
		
	};
}

/**
 * Offerta relativa ad un prodotto ed al suo fornitore
 * @param {GestorePagina} gestore Gestore della pagina che contiene l'offerta
 * @param {Node} listaOfferte Nodo che contiene la lista delle offerte
 */
function Offerta(gestore, listaOfferte) {
	
	this.listaOfferte = listaOfferte;
		
	this.update = function(offerta) {

		var rigaOff = new Array();
		var tabellaOfferta, cellaFornitore, cellaCarrello, divSoglia, divNCarrello, 
		divOverlayCarrello, divPrezzoCarrello, formCarrello, numeroCarrello, bottoneCarrello;
		
		tabellaOfferta = document.createElement("table");
		tabellaOfferta.className = "tabellaRisultati";	//TODO: css
		this.listaOfferte.appendChild(tabellaOfferta);
		
		rigaOff[0] = document.createElement("tr");
		tabellaOfferta.appendChild(rigaOff[0]);
		
		// Fornitore dell'offerta
		cellaFornitore = document.createElement("td");
		cellaFornitore.textContent =	offerta.fornitore.nome + " - " + 
										offerta.fornitore.valutazione + " \u2605 - " + 
										offerta.prezzo.toFixed(2) + " \u20AC";
		cellaFornitore.rowSpan = offerta.fornitore.politica.length;
		rigaOff[0].appendChild(cellaFornitore);
		
		// Politiche di spedizione dell'offerta
		for(let i = 0; i < offerta.fornitore.politica.length; i++) {
			
			var politica = offerta.fornitore.politica[i];
			var rigaPolitica, cellaSpedizione, cellaMinimo, cellaMassimo
			
			if(rigaOff[i] !== undefined)
				rigaPolitica = rigaOff[i];
			else {
				rigaPolitica = document.createElement("tr");
				tabellaOfferta.appendChild(rigaPolitica);
				rigaOff[i] = rigaPolitica;
			}
			
			cellaSpedizione = document.createElement("td");
			cellaSpedizione.textContent = 	"Fascia di spedizione: " + 
											politica.prezzo.toFixed(2) + " \u20AC";
			rigaPolitica.appendChild(cellaSpedizione);
			
			cellaMinimo = document.createElement("td");
			cellaMinimo.textContent = "Numero minimo prodotti: " + politica.min;
			rigaPolitica.appendChild(cellaMinimo);
			
			cellaMassimo = document.createElement("td");
			cellaMassimo.textContent = "Numero massimo prodotti: " + politica.max;
			rigaPolitica.appendChild(cellaMassimo);
		}
		
		// Resoconto dell'offerta e azioni sul carrello
		cellaCarrello = document.createElement("td");
		cellaCarrello.rowSpan = offerta.fornitore.politica.length;
		rigaOff[0].appendChild(cellaCarrello);
		
		divSoglia = document.createElement("div");
		divSoglia.textContent =	"La soglia per la spedizione gratis \xE9 di " + 
								offerta.fornitore.soglia + " \u20AC";
		cellaCarrello.appendChild(divSoglia);
		
		// Numero di prodotti nel carrello
		divNCarrello = document.createElement("div");
		divNCarrello.classList.add('overlaySource');	//TODO: css
		divNCarrello.textContent = "Numero di prodotti gi\xE1 nel carrello: " + 
			numeroCookieProdottiDaFornitore(infoUtente().id, offerta.fornitore.ID);
		
		// Overlay relativo al numero di prodotti nel carrello, visualizzato al passaggio del mouse								
		divOverlayCarrello = document.createElement("div");
		divOverlayCarrello.classList.add('overlay');	//TODO: css
		divOverlayCarrello.hidden = true;
		
		// Lista dei prodotti visualizzati all'interno dell'overlay
		var listaOverlay = new ListaOggetti(this, Carrello, divOverlayCarrello, 
			function() {
				// Il contenuto dell'overlay è ottenuto tramite una chiamata al server per la
				// visualizzazione del contenuto di un carrello specifico
				caricaLista(this, "POST", "CaricaCarrello", 
					ritornaCookieCarrelloDaFornitore(infoUtente().id, offerta.fornitore.ID), true);
			},
		true);
		
		// Listener per regolare l'apertura e la chiusura dell'overlay
		divNCarrello.addEventListener("mouseenter", () => {
			// Se l'overlay deve essere aperto, viene aggiornato con i contenuti del carrello
			divOverlayCarrello.hidden = false;
			listaOverlay.carica();
		}, false);
		divNCarrello.addEventListener("mouseleave", () => {
			divOverlayCarrello.hidden = true;
		}, false);
		divOverlayCarrello.addEventListener("mouseleave", () => {
			divOverlayCarrello.hidden = true;
		}, false);

		cellaCarrello.appendChild(divNCarrello);
		divNCarrello.appendChild(divOverlayCarrello);
		
		divPrezzoCarrello = document.createElement("div");
		divPrezzoCarrello.textContent =	"Valore dei prodotti gi\xE1 nel carrello: " + 
										offerta.valore + " \u20AC";
		cellaCarrello.appendChild(divPrezzoCarrello);
		
		// Form per l'aggiunta dell'offerta al carrello
		formCarrello = document.createElement("form");
		formCarrello.action = "#";
		cellaCarrello.appendChild(formCarrello);
		
		// Numero di prodotti da aggiungere
		numeroCarrello = document.createElement("input");
		numeroCarrello.name = "quantita";
		numeroCarrello.type = "number";
		numeroCarrello.min = "1";
		numeroCarrello.value = "1";
		numeroCarrello.addEventListener("keypress", (e) => {
			if (e.code === ENTER_KEY_CODE)
				e.preventDefault();	// Previene l'invio del form dalla number box 
		}, false);
		formCarrello.appendChild(numeroCarrello);
		
		// Bottone d'invio del form
		bottoneCarrello = document.createElement("input");
		bottoneCarrello.type = "button";
		bottoneCarrello.value = "Inserisci";
		bottoneCarrello.addEventListener("click", (e) => {
			var form = e.target.closest("form");
			if(form.checkValidity()) {
				// Se il form è valido i prodotti selezionati vengono aggiunti al carrello 
				// tramite cookie e viene visualizzato il carrello
				aggiungiCookieProdotto(infoUtente().id, offerta.fornitore.ID, 
					offerta.ID, form.quantita.value);	//TODO: limitare max prodotti
				gestore.visCarrello();
			}
			else
				form.reportValidity();
		}, false);
		formCarrello.appendChild(bottoneCarrello);
	}
}

/**
 * Lista di oggetti generica, utilizzata per raggruppare più oggetti all'interno di una lista
 * ai fini di una visualizzazione dinamica
 * @param {GestorePagina} gestore Gestore della pagina che contiene la lista
 * @param {Function} Oggetto Riferimento al costruttore dell'oggetto di cui si 
 *							 vuole creare la lista
 * @param {Node} divLista Nodo che contierrà la lista
 * @param {Function} fCaricamento Funzione di caricamento della lista
 * @param {Object} optOggetto Parametri opzionali per l'oggetto
 */
function ListaOggetti(gestore, Oggetto, divLista, fCaricamento, optOggetto) {
		
	this.divLista = divLista;
	
	this.carica = fCaricamento;
	
	this.update = function(oggetti) {
		this.show();
		this.divLista.innerHTML = ""; // Svuota la lista
		
		var self = this;
		
		// Inizializza ogni oggetto e chiama la funzione update su di esso
		oggetti.forEach((oggetto) => {
			var p = new Oggetto(gestore, self.divLista, optOggetto);
			p.update(oggetto);
		});
	};
	
	this.show = () => {
		this.divLista.hidden = false;
	};
	
	this.hide = () => {
		this.divLista.hidden = true;
	};
	
	this.isHidden = () => {
		return this.divLista.hidden;
	};
}
