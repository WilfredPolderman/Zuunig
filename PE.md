# Permanente evaluatie

**Vul hieronder verder aan zoals beschreven in de [projectopgave](https://javascript.pit-graduaten.be/evaluatie/mobile/pe.html).**

## Scherm 1 **DASHBOARD**
<img width="348" height="766" alt="afbeelding" src="https://github.com/user-attachments/assets/57623480-7be0-4deb-9842-435e6469e47b" />

Voor scherm 1 heb ik gekozen om een prototype te maken voor de dashboard van mijn toekomstige budgetting app.

Laten we van boven beginnen. 

Wat je als eerst ziet is de naam van op welke pagina je zit, in dit geval dus het dashboard. Naast de naam van het huidige scherm staat de huidige maand incl het jaar. Zoals je ziet staat er een optie om hiervan een dropdown te maken, waar je een overzicht van alle maanden kan zien en zo per maand kunt gaan wisselen om jouw budget voor die maand in tekijken, of zelfs aan te passen.

Nu komen we bij de eerste card aan. Aan de bovenkant vind je het totaal budget wat de gebruiker heeft ingevuld voor deze maand. Daaronder vind je 2 kolommen: het resterend budget en de uitgaven van de maand. Zo heeft de gebruiker een duidelijk zicht van hoeveel de gebruiker te besteden heeft in de maand.

Hieronder zien we 2 aparte kaarten. "Vandaag uitgegeven", laat de gebruiker zien wat er op de huidige datum is uitgegeven, dit zal elke dag vanaf 00:00 resetten. Het weekgemiddelde is hiernaast te zien.

Daaronder vinden wij de laatste card. Hier krijgt de gebruiker een direct zicht op de laatste 3 ingevoerde uitgaven. De gebruiker kan de naam ingeven van waar er betaald is, de datum en bij welke categorie dit behoort. Daarond vind zich een knop "Maand overzicht". Als de gebruiker dit selecteerd opent dit een apart scherm waar de gebruiker een compleet overzicht heeft van alle ingevoerde uitgaven van de maand en kan deze bekijken, aanpassen, verwijderen of toevoegen.

Daaronder vind zicht een grote knop waar de gebruiker een nieuwe uitgave kan invoeren of het maandbudget kan aanpassen. Hierover is meer terug te vinden bij de uitleg van scherm 2.

Als laatste zien wij een navigatiebar onderaan de applicatie. Hier kan de gebruiker wisselen tussen het "Dashboard", "Categorieën" (scherm 3) en "Doelen" (scherm 4). Hierover kunt u meer informatie vinden bij de respectievelijke schermen. 

## Scherm 2 **UITGAVEN**

<img width="434" height="937" alt="afbeelding" src="https://github.com/user-attachments/assets/161cc06f-3e7b-46f3-81db-299007a04af7" />


Je komt op dit scherm door op de grote + knop te drukken van scherm 1.

Hier zie je bovenaan op welke pagina je nu zit. Daarnaast is het ook mogelijk om van maand te wisselen. 

De eerste kaart laat zien wat de gebruiker heeft ingesteld als maandbudget voor die specifieke maand. door op de potlood icoon te klikken kan je het maandbudget aanpassen.

daaronder vind je een grote kaart waar je het bedrag kan invoeren dat je hebt uitgegeven, de datum hiervan en in welke categorie dit behoort.

Onderaan vind je 3 knoppen

1: annuleren, het is mogelijk om de actie te annuleren en dan kom je weer terug bij scherm 1.
2: camera, het is mogelijk om een foto te nemen van bijvoorbeeld een bonnetje en zo deze te koppelen aan de uitgave
3: opslaan, als je hierop klikt wordt de uitgave opgeslagen

## Scherm 3 **CATEGORIEËN**

Op deze pagina krijgt de gebruiker een overzicht te zien van alle categorieën, zoals Boodschappen, Vervoer, Entertainement, etc... 

Elke categorie heeft een icoon, de naam en daarachter hoeveel van het budget in de maand is gebruikt in die categorie. Als de gebruiker op de categorie klikt, kan de gebruiker alle transacties van die maand zien voor die specifieke categorie.

Het is ook mogelijk voor de gebruiker om zelf een categorie toe te voegen via een knop die hiervoor wordt aangeduid als "Categorie toevoegen". Uiteraard worden al deze categorieën incl de uitgaven bewaard in Firebase Firestore.

## Scherm 4 **DOELEN**

De doelen pagina geeft de gebruiker de mogelijheid om persoonlijke financiële doelen vast te leggen. Een voorbeeld hiervan: "€400 sparen voor een Playstation 5".

De gebruiker krijgt alle doelen te zien als een lijst waarbij elk doel een kaart is met: De naam, spaardoel bedrag, hoeveel er al is gespaard en een voortgangsbalk.

Als er op het doel getikt wordt is het mogelijk om meer details te bekijken, je ziet de geschiedenis van bijdragen aan het doel. Via een button is het mogelijk om een nieuw doel toe te voegen.

Deze pagina zal gebruik maken van een long press en swipte gestures. De long press wordt gebruikt om het doel aan te passen en de swipe om het doel te verwijderen.

Als de gebruiker een nieuw doel toevoegd zal dit aan de lijst worden toegevoegd via een animatie. De voorgangsbalk zal ook geanimeerd worden. Dus als een gebruiker geld toevoegd aan zijn doel zal de balk stijgen naar het totaal behaalde % van het doel is. 

## Native modules
1: react-native-vision-camera. Als de gebruiker een uitgave toevoegd, heeft de gebruiker de optie om een foto toe te voegen zoals een bonnetje. Zoals in het prototype te zien is, wordt hiervoor een camera icoon voor voorzien.

2: react-native-notifications. Om 20:00 local time voor de gebruiker wil ik een push notification sturen als een reminder om hun dagelijkse uitgaven toe te voegen in de app.
(https://reactnative.directory/?search=notification) als ik hier kijk zie ik wel een ? staan dus ik zal moeten testen of dit effectief gaat werken.

3: react-native-haptic-feedback. Als de gebruik een uitgave opslaat wil ik dat dit een kleine haptic feedback geeft als extra confirmatie en ook om de app zo interactiever te maken voor de gebruiker. 

## Online services

Ik ben van plan om Firebase Firestore te gebruiken. Firestore zal mijn database worden waar alle uitgaven, budgetten, etc... van de gebruiker in worden opgeslagen

Note na feedback: Ik ga ook nog de mogelijkheid geven om een account te maken en in- en uit te loggen.

Extra note: API currency converter?

## Gestures & animaties

In scherm 4 ben ik van plan meerdere animaties en gestures te implementeren.

Als een gebruiker een nieuw doel toevoegd zal dit via een animatie worden toegevoegd aan een lijst zodat het meer dynamisch is. 
Ook zal de voortgangsbalk geanimeerd zijn. Als de gebruiker geld toevoegd aan het doel, zal de balk omhoog gaan naar het percentage van waar het doel staat.

Voor nu heb ik 2 gestures in gedachten om te gebruiken.

Long press: De gebruiker kan een doel ingedrukt houden en krijgt dan de optie om het doel te bewerken
Swipe: De gebruiker kan het doel swipen en krijgt dan de vraag of ze het doel willen verwijderen. 

# Feedback

- De afbeeldingen werken niet lokaal in deze markdown!
- De UI ziet er momenteel nog wat somber uit.
- Vergeet zeker niet te kijken naar de uitgebreide vereisten: https://javascript.pit-graduaten.be/evaluatie/mobile/project.html#uitgebreide-vereisten
    - Deze vereisten staan op 20%!

**TLDR: Ziet er goed uit!**

