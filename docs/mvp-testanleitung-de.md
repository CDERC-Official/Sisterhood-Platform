# Sisterhood MVP — Testanleitung für Kundinnen

Kurze Schritte, um den aktuellen MVP manuell zu prüfen. Alles läuft mit Mock-Daten im Browser (kein echtes Login, keine E-Mails, keine Zahlungen).

**Demo-URL:** *[hier die bereitgestellte URL eintragen]*  
Lokal alternativ: `http://localhost:3000` nach `pnpm install` und `pnpm dev`.

---

## Vor dem Start

### Demokonten

| Rolle | E-Mail | Passwort |
|-------|--------|----------|
| Makerin | `amara@sisterhood.test` | `sisterhood` |
| Unterstützerin | `lena@sisterhood.test` | `sisterhood` |

### Sprache

- Englisch (Standard): z. B. `/products`
- Deutsch: denselben Pfad mit Präfix `/de` öffnen, z. B. `/de/products`

### Was der MVP bewusst nicht enthält

Startseite-Feinschliff (Hero, Shelves), Header/Footer-Redesign, Maker-Verzeichnis, Warenkorb, Zahlungen, echte E-Mails, Admin-Moderation.

### Tipp: Demo zurücksetzen

Unter **Konto → Profil** gibt es **Demo-Daten zurücksetzen**. Danach erneut einloggen. Sinnvoll, wenn die Demo „durcheinander“ wirkt.

---

## 1. Anmeldung und Konto

1. `/de/auth` öffnen.
2. Mit **Lena** einloggen (`lena@sisterhood.test` / `sisterhood`).
3. Prüfen: Weiterleitung zum Konto; nach Browser-Reload bleibt die Session.
4. Anzeigename ändern, speichern, Seite neu laden → Name bleibt.
5. Abmelden → zurück bei Auth; geschützte Seiten (z. B. `/de/account`) leiten wieder zu Auth.
6. Optional: neues Konto unter **Beitreten** anlegen (E-Mail, Passwort, Name, Selbstbestätigung Pflicht). Mit Häkchen „Ich bin Makerin“ erscheinen später Studio und Posteingang.

---

## 2. Produktkatalog

1. `/de/products` öffnen (ohne Login möglich).
2. Liste prüfen: Bild, Titel, Makerin, Ort, Kategorie, Preis nur wenn vorhanden.
3. Eine Kategorie filtern, dann **Alle**.
4. In der Suche nach Titel oder Makerinnen-Namen suchen; Filter + Suche kombiniert testen.
5. Ein Produkt öffnen → Detailseite: Bilder wechseln (falls mehrere), Beschreibung, Kategorie, Preis.
6. Ungültige ID testen, z. B. `/de/products/gibt-es-nicht` → leerer/Fehlerzustand mit Link zurück.

---

## 3. Studio (nur Makerin)

1. Als **Amara** einloggen (`amara@sisterhood.test` / `sisterhood`).
2. `/de/account/studio` öffnen → nur Amaras Produkte.
3. Neues Produkt anlegen (`/de/account/studio/products/new`): Titel DE/EN, Beschreibung DE/EN, Kategorie, optional Preis (Betrag + EUR/KES), mindestens eine Bild-URL.
4. Speichern → Produkt erscheint im Katalog und auf der öffentlichen Produktseite.
5. Produkt bearbeiten, speichern, öffentliche Seite neu laden → Änderungen sichtbar.
6. Produkt löschen (Bestätigung im Dialog) → aus Katalog weg; alte URL zeigt „nicht gefunden“.
7. Als **Lena** prüfen: Studio und Posteingang erscheinen nicht in der Navigation; direkter Aufruf von `/de/account/studio` leitet zum Profil um.

---

## 4. Anfragen (Inquiry)

### Anfrage starten

1. Als **Lena** ein Produkt von Amara öffnen.
2. **Anfragen** klicken → Nachricht schreiben und senden.
3. Prüfen: Weiterleitung zu **Meine Anfragen** zur neuen Unterhaltung.
4. Ohne Login dieselbe Schaltfläche testen → Auth, danach zurück zum Produkt.
5. Als **Amara** das eigene Produkt öffnen → Anfragen-Schaltfläche ausgeblendet oder deaktiviert.

### Als Unterstützerin antworten

1. Als Lena `/de/account/inquiries` öffnen.
2. Seed-Thread und neue Anfragen prüfen (Produkttitel, Makerin, Vorschau, Zeit).
3. Thread öffnen, antworten → Nachricht bleibt nach Reload.

### Als Makerin antworten

1. Als Amara `/de/account/inbox` öffnen.
2. Dieselbe Unterhaltung sehen und antworten.
3. Als Lena unter **Meine Anfragen** die Antwort von Amara prüfen (eine gemeinsame Unterhaltung, keine Kopie).

---

## 5. Community

1. `/de/community` öffnen (ohne Login lesbar).
2. Filter: Alle, Skills, Opportunities, Stories, Questions — URL-Parameter `?tag=…` prüfen.
3. Eingeloggt einen Beitrag veröffentlichen (Tag, Titel, Text) → erscheint oben und unter dem Tag-Filter; bleibt nach Reload.
4. Auf einen Beitrag antworten (nur eine Ebene, keine Antwort auf Antworten).
5. Eigenen Beitrag / eigene Antwort löschen (mit Bestätigung); fremde Beiträge ohne Löschen-Aktion.
6. Als Gast Formular oder Antwort versuchen → Weiterleitung zu Auth und Rückkehr zur Community.

---

## 6. Kurzer Gesamtdurchlauf (ca. 10 Minuten)

1. Lena: einloggen → Katalog → Produkt anfragen → in Meine Anfragen antworten.
2. Abmelden → Amara: einloggen → Posteingang → antworten → Studio: Produkt anlegen → im Katalog sichtbar.
3. Community: Beitrag + Antwort.
4. `/de/...`-URLs kurz gegen Englisch (`/` ohne `de`) vergleichen.
5. Demo zurücksetzen und mit einem Demokonto erneut einloggen.

---

## Feedback bitte so notieren

Für jeden Fund bitte:

- **Seite / URL**
- **Konto** (Amara, Lena oder neu angelegt)
- **Schritte** (kurz)
- **Erwartet vs. tatsächlich**
- Optional: Screenshot

Fragen oder Blocker direkt an das Entwicklungsteam — danke fürs Testen.
