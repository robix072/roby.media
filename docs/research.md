# Cercetare: benchmark agenții și case de producție

Data: 11.11.2026. Am analizat 11 site-uri: structura paginilor, CTA-urile, formularele, FAQ-ul și schema JSON-LD. Am preluat doar idei de structură și conversie. Niciun text și niciun design nu au fost copiate.

## Site-uri analizate

| Site | Tip | Ce merge bine | Ce e slab |
|---|---|---|---|
| vivinet.ro | Performance marketing (Google/Meta/TikTok) | Un H2 pentru fiecare platformă de ads; segmentare „Magazine online” vs „Servicii & B2B”; formular cu tab-uri **Formular / Întâlnire online**; **16 întrebări FAQ** care răspund obiecțiilor reale (buget, contract pe termen lung, „ce se întâmplă dacă nu merge”, cont existent, cost); bloc SEO lung la final | H1 umplut cu cuvinte cheie; câmpul Website e obligatoriu (pierde lead-uri) |
| themarkers.ro | Agenție full-service | **6 cifre de experiență** imediat după hero (ani, clienți, domenii, echipă, campanii, bugete); carduri pe **obiective** (Lead generation / E-commerce / Branding) în loc de lista de servicii; testimoniale; FAQ cu schema `FAQPage`; articole de blog pe Acasă; WhatsApp | Mai multe H1 pe aceeași pagină; title cu simboluri ▷ ✔️ |
| webventures.ro/performance-marketing | Pagină de serviciu | Secțiuni pe platforme, intercalate cu benzi de dovezi („am lansat zeci de proiecte”); formular cu **dropdown de serviciu + dropdown de buget**; câmp ascuns „pagina de pe care a venit lead-ul” | Formular lung (nume și prenume separate, toate obligatorii); fără FAQ |
| agentie.marketing/…-bucuresti | Landing SEO local | Metodologie în 3 piloni (Atragere → Conversie → Retenție); grilă de 12 servicii; „De ce noi” în 6 puncte; secțiune text locală; FAQ; telefon în header | Locația contează doar ca înlocuire de cuvânt cheie (risc de pagină „doorway”); fără formular în pagină |
| transilvaniamarketing.ro/…-bucuresti | Landing SEO pe oraș | **Rezumat „Pe scurt”** deasupra; logo-uri de **branduri locale**; proces în 3 pași (Kickoff & audit → Execuție → Raportare live); **FAQ local** („Lucrați cu firme din X?”, „Trebuie să venim la birou?”); formular foarte scurt (nume, telefon, site) cu un **calculator de buget** (slider); **hub de orașe** cu linkuri interne; JSON-LD bogat (`Service`, `Offer`, `FAQPage`, `BreadcrumbList`, `GeoCoordinates`) | – (cel mai bun model pentru paginile noastre de oraș) |
| brandstage.ro | Agenție TikTok, RO | H1 cu poziționare clară; cifre de impact (vizualizări totale, urmăritori, cel mai vizualizat clip); secțiunea „De ce TikTok?” educă piața; **pachete cu preț afișat** (abonamente lunare plus consultanță de 60 de minute); fondatorul vizibil; comutator RO/EN | Formular generic (Subject/Message), texte în engleză pe site-ul RO |
| inbeat.agency | Agenție UGC/creative, internațional | Servicii grupate în 4 piloni; testimoniale lungi cu nume și rol; FAQ despre proces („cum începem”, „cum măsurați”, „cum alegeți creatorii”); studii de caz cu **rezultatul în titlu** | – |
| billo.app | Platformă UGC | **Cifre de performanță comparative** (CPA, CTR, hook rate); secțiuni separate „Pentru branduri / Pentru agenții”; demo ca CTA unic | Foarte mult jargon |
| influee.co/ro | Platformă UGC, RO | „de la 63 €” pe video; liste de garanții (revizii nelimitate, drepturi de utilizare incluse); proces în pași; studii de caz cu 3 cifre fiecare | Cifrele diferă de la o pagină la alta (pierde încredere) |
| sandwich.co | Producție premium, SUA | Ton foarte sigur pe sine, minimalist; portofoliu cu **filtre pe categorii** (Spots, Explainers, Testimonial, Brand, Animation) și căutare; lucrările sunt pe primul plan | Aproape fără CTA (funcționează doar pentru un brand foarte cunoscut) |
| studioset.ro | Producție video, RO | Nu s-a putut încărca (eroare 502) | – |

## Concluzii: ce adoptăm

1. **Cifre de încredere imediat după hero** (4–6 contoare). La noi sunt placeholder în `content/stats.json`.
2. **Servicii prezentate pe obiective** pe Acasă („Vreau mai mulți clienți”, „Vreau conținut care vinde”, „Am un eveniment”, „Am nevoie de site”), cu legătură spre categoriile de servicii.
3. **Prețuri afișate „de la”** plus un badge „Cel mai ales”. Puțini concurenți RO afișează prețuri, așa că e un avantaj competitiv.
4. **Formular scurt cu dropdown de serviciu și de buget**, plus un câmp ascuns cu pagina-sursă (știm din ce landing a venit lead-ul). Doar numele, telefonul și bifa GDPR sunt obligatorii; câmpul email rămâne obligatoriu conform cerinței, restul sunt opționale.
5. **Al doilea canal lângă formular**: WhatsApp cu mesaj precompletat (în loc de „Întâlnire online”).
6. **FAQ care răspunde obiecțiilor**: buget, contract, durată, cine deține conturile de ads și fișierele brute, deplasare, revizii, termene de livrare. Între 5 și 8 întrebări pe fiecare pagină, cu `FAQPage` JSON-LD.
7. **Rezumat „Pe scurt”** la începutul paginilor de serviciu și de oraș (3–4 bullet-uri). Ajută vizitatorii grăbiți și fragmentele din Google/AI.
8. **Proces în pași** vizual (4 pași pe Acasă, 3–5 pe paginile de serviciu).
9. **Pagini de oraș cu conținut local real**: industrii locale, locații, FAQ local, deplasare și un **hub de orașe** cu linkuri interne. Orașele necompletate primesc `noindex` până se scrie conținutul.
10. **Studii de caz cu rezultatul în titlu** în portofoliu (când există un rezultat real).
11. **Portofoliu cu filtre pe categorii** și lucrările puse în față, ca la o casă de producție premium.
12. **Secțiunea „De ce TikTok?”** pe paginile de TikTok: educă clienții tradiționali (clinici, construcții, avocați).
13. **Garanții clare în pachete**: număr de revizii, drepturi de utilizare, termen de livrare.
14. **JSON-LD complet**: `Service` + `Offer` cu preț, `FAQPage`, `BreadcrumbList`.
15. **Segmentare pe tip de client** pe paginile de servicii („Pentru cine este”: clinici, HoReCa, imobiliare, e-commerce etc.).

## Ce evităm

1. Mai multe H1 pe pagină și titluri umplute cu cuvinte cheie sau simboluri (▷ ✔️).
2. Pagini de oraș în care se schimbă doar numele orașului (pagini „doorway”).
3. Formulare lungi cu multe câmpuri obligatorii (nume și prenume separate, website obligatoriu).
4. Cifre contradictorii sau neverificabile. La noi, toate cifrele sunt placeholder până le completezi.
5. Jargon și engleză nejustificată pe site-ul în română.
6. Un portofoliu fără CTA: fiecare proiect se încheie cu „Vreau ceva similar” (WhatsApp precompletat).
