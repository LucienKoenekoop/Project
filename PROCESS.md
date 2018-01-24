# day 1

Voor de vizualisatie van de scatterplot, die voor x as gebaseerd is op GDP per capita, voor de y as gebaseerd op de geselecteerde topic (voor de testfase in dit geval employment), en voor de grote van de dots gebaseerd op population van een land, zijn 3 verschillende data files die worden ingeload bij de queue() nodig. Maar .data() kan maar 1 file inloaden, dus hier moet wat op gevonden worden.

Verder zijn de mousover en mouseout functies toegevoegd aan de landen van de map, waardoor de opacity van het gehoverde land van 0.7 naar 1.0 veranderd. 

# day 2

Op de manier zoals gedacht was om uit verschillende data files waardes te gebruiken om dots te maken voor de scatterplot is niet mogelijk. Er moet nu worden overgegaan op het schrijven van meerdere csv files voor alle jaren, die elk alle variabelen voor een land in dat jaar bevatten.

# day 3

Voor de jaren 2014, 2015 en 2016 zijn nu CSV files gemaakt waarin enkele van de beoogde waardes voor de final version zijn opgenomen. De slider geeft de een output waarde van het geselecteerde jaar, en deze waarde wordt nu doorgegeven naar de queue() om het bijbehorende CSV file te loaden. Ook is er een update functie toegevoegd waardoor de map en de plot opnieuw worden gemaakt wanneer er van jaar wordt veranderd. (Deze zal ook moeten worden gebruikt wanneer er van topic wordt veranderd.) Wat nu problemen oplevert is de svg elementen horizontaal naast elkaar uitlijnen.  