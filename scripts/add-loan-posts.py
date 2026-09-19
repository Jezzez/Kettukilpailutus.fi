# -*- coding: utf-8 -*-
"""
Lisää kolme lainakategorian artikkelia data/posts.json-tiedostoon.

MIKSI SKRIPTI EIKÄ KÄSIN EDITOINTI: posts.json on 28 artikkelia ja yli
300 kt. Käsin tehty lisäys keskelle tiedostoa on tilaisuus rikkoa JSON
niin, että virhe näkyy vasta Vercelin buildissa. Skripti lataa JSONin,
lisää alkiot oikeaan kohtaan ja kirjoittaa saman muotoilun takaisin.

Ajetaan kertaluonteisesti. Ei ole osa buildia.
"""
import json
import io
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PATH = os.path.join(ROOT, "data", "posts.json")

POSTS = []

# ---------------------------------------------------------------------------
# 1. Paljonko lainaa voin saada
# ---------------------------------------------------------------------------
POSTS.append({
    "slug": "paljonko-lainaa-voin-saada",
    "title": "Paljonko lainaa voin saada? Näin summa lasketaan maksuvarasta",
    "category": "Lainat",
    "date": "2026-09-19",
    "readMinutes": 9,
    "excerpt": "Lainasumma ei tule tulojen kertoimesta vaan maksuvarasta. Käymme läpi laskuesimerkillä, mitä maksuvara tarkoittaa, miten koronnousun testi vaikuttaa ja miksi laina-aika muuttaa vastausta enemmän kuin palkka.",
    "body": [
        "Lyhyt vastaus: lainan enimmäismäärää ei lasketa tuloista kertoimella. Luotonantaja ottaa nettotulot, vähentää niistä asumisen ja arjen menot sekä nykyisten velkojen kuukausierät, ja katsoo paljonko jää. Se, mikä jää, ratkaisee kuukausierän. Kuukausierä yhdessä laina-ajan ja koron kanssa ratkaisee lainasumman.",

        "Tämä artikkeli käy laskennan läpi vaihe vaiheelta yhdellä kuvitteellisella taloudella. Luvut ovat Kettukilpailutuksen omia laskelmia tasaerälainasta, eivät kenenkään luotonantajan hinnastosta. Ne näyttävät mekanismin, eivät sinun summaasi.",

        "## Maksuvara ratkaisee, ei palkkakerroin",

        "Moni etsii nyrkkisääntöä tyyliin \"lainaa saa kolme kertaa vuosipalkan verran\". Kuluttajaluotoissa sellaista sääntöä ei ole. Luotonantajan on lain mukaan arvioitava ennen luottosopimuksen tekoa, kykeneekö kuluttaja maksamaan luoton takaisin, ja arvio on tehtävä riittävien tietojen perusteella kuluttajan tuloista, menoista ja muista taloudellisista oloista.",

        "Arvio tehdään käytännössä kahdessa vaiheessa. Ensin lasketaan maksuvara, eli mitä nettotuloista jää pakollisten menojen jälkeen. Sen jälkeen katsotaan, riittääkö maksuvara kuukausierään myös silloin, kun olosuhteet ovat huonommat kuin hakupäivänä.",

        "## Näin maksuvara lasketaan",

        "Otetaan yhden hengen talous, jonka nettotulot ovat 2 600 euroa kuukaudessa. Menot ovat tavanomaisia, eikä talous ole velaton: autolainaa maksetaan 210 euroa ja korttivelkaa 60 euroa kuukaudessa.",

        "| Erä | Euroa kuukaudessa",
        "| Nettotulot | 2 600",
        "| Asuminen, sähkö ja vesi | -950",
        "| Ruoka ja muu arki | -600",
        "| Liikkuminen | -180",
        "| Vakuutukset, puhelin ja netti | -90",
        "| Nykyisten lainojen kuukausierät | -270",
        "| Jää maksuvaraksi | 510",

        "Maksuvara on siis 510 euroa kuukaudessa. Se ei tarkoita, että uusi laina voisi viedä siitä kaiken. Maksuvara on laskettu tämän päivän menoilla, ja yksi rikkoutunut pesukone tai kolme kuukautta osa-aikaista sairauslomaa syö sen kokonaan. Käytetään jatkossa oletuksena, että uuden lainan erä saa olla 300 euroa.",

        "## Kuukausierä ratkaisee summan, laina-aika ratkaisee hinnan",

        "Kun kuukausierä on tiedossa, lainasumma seuraa siitä suoraan. Alla sama 300 euron erä ja sama yhdeksän prosentin korko kolmella eri laina-ajalla.",

        "| Laina-aika | Lainasumma | Takaisin yhteensä | Korkoa yhteensä",
        "| 3 vuotta | 9 434 € | 10 800 € | 1 366 €",
        "| 5 vuotta | 14 452 € | 18 000 € | 3 548 €",
        "| 8 vuotta | 20 478 € | 28 800 € | 8 322 €",

        "Sama maksuvara tuottaa siis 9 400 euron tai 20 500 euron lainan sen mukaan, kuinka pitkäksi se venytetään. Kysymykseen \"paljonko lainaa saan\" ei voi vastata ennen kuin laina-aika on päätetty.",

        "Huomaa myös hinta. Kahdeksan vuoden laina on runsaat kaksi kertaa suurempi kuin kolmen vuoden laina, mutta korkoa siitä maksetaan kuusi kertaa enemmän. Pisin laina-aika antaa suurimman summan ja on lähes aina kallein vaihtoehto. Sama ilmiö on purettu tarkemmin artikkelissa [todellinen vuosikorko selitettynä](/blogi/todellinen-vuosikorko).",

        "## Testaa summa korkeammalla korolla",

        "Asuntolainoissa maksukykyä ei arvioida hakupäivän korolla. Finanssivalvonnan suosituksen mukaan asuntolainanhakijan kaikkien lainojen hoitomenot eivät saisi pääsääntöisesti ylittää 60 prosenttia nettotuloista tilanteessa, jossa lainan korko olisi kuusi prosenttia ja laina-aika 25 vuotta. Suositus tuli voimaan vuoden 2023 alussa, ja pankit ovat käyttäneet samaa kuuden prosentin ja 25 vuoden testiä jo yli vuosikymmenen.",

        "Suositus koskee asuntolainoja, joten kulutusluoton hakijaa se ei sido. Testin idea kannattaa silti lainata. Laske erä korolla, joka on selvästi hakupäivän korkoa korkeampi, ja katso mahtuuko se yhä maksuvaraan. Jos ei mahdu, laina on liian suuri riippumatta siitä, minkä summan luotonantaja olisi valmis myöntämään.",

        "Esimerkkitaloudessa 60 prosenttia 2 600 euron nettotuloista olisi 1 560 euroa kuukaudessa, ja siitä on jo varattu 270 euroa nykyisille lainoille. Tuo 1 560 euroa on yläraja, ei tavoite: se on suurin rasitus, jonka asuntolainan myöntäjä hyväksyisi, eikä summa, jonka varaan kannattaa rakentaa arkea.",

        "## Mikä nostaa summaa ja mikä laskee",

        "Summaa nostavat vakinainen työsuhde ja pitkä työhistoria, säännölliset ja todennettavat tulot, vakuus sekä se, että nykyisiä luottoja on vähän. Yhteishakija muuttaa lopputulosta usein enemmän kuin mikään muu yksittäinen tekijä, koska maksuvara lasketaan silloin yhteisistä tuloista ja menoista.",

        "Summaa laskevat määräaikainen tai juuri alkanut työsuhde, vaihtelevat tulot ja useat pienet luotot. Myös jatkuvat luotot, kuten korttiluotot ja luotolliset tilit, vaikuttavat: ne ilmoitetaan positiiviseen luottotietorekisteriin, joten ne ovat luotonantajan tiedossa myös silloin, kun limiittiä ei ole nostettu.",

        "## Rekisteri poisti mahdollisuuden pyöristää velkoja",

        "Positiivista luottotietorekisteriä ylläpitää Verohallinto. Kuluttajaluotot on ilmoitettu rekisteriin 1.2.2024 alkaen, ja luotonantajilla on ollut velvollisuus tarkistaa hakijan tiedot rekisteristä 1.4.2024 alkaen. Joulukuun 2025 alusta velvollisuus laajeni myös yksityisten elinkeinonharjoittajien yritysluottoihin.",

        "Seuraus on yksinkertainen: hakemuksessa ilmoitetut velat eivät ole enää arvio, jonka luotonantaja uskoo tai jättää uskomatta. Ne näkyvät rekisteristä. Omat tietonsa voi tarkistaa maksutta, ja se kannattaa tehdä ennen hakemista. Mitä rekisterissä tarkalleen on, käydään läpi artikkelissa [mitä pankki näkee kun haet lainaa](/blogi/mita-pankki-nakee-kun-haet-lainaa).",

        "## Näin arvioit summan itse ennen hakemista",

        "Laske maksuvara kolmen viime kuukauden tiliotteista, ei muistista. Muistinvarainen ruokabudjetti on lähes aina liian pieni, ja juuri se virhe tekee lainasta liian suuren.",

        "Päätä sen jälkeen kuukausierä, jonka maksaisit myös huonona kuukautena. Vasta sitten katso, minkä kokoinen laina siitä syntyy sillä laina-ajalla, jonka olet valmis hyväksymään. Tässä järjestyksessä lainasumma on lopputulos. Toisin päin tehtynä summa päätetään ensin ja erä venytetään siihen sopivaksi, mikä tarkoittaa pitkää laina-aikaa ja isoa korkolaskua.",

        "Jos lainaa on tarkoitus käyttää vanhojen velkojen maksuun, laske erikseen myös vaihtoehto, jossa vanhat luotot yhdistetään. Yhdistämisen kannattavuus ratkeaa kolmesta luvusta, ja ne on käyty läpi artikkelissa [lainojen yhdistäminen](/blogi/lainojen-yhdistaminen).",

        "## Yhteenveto",

        "Lainan enimmäismäärä on kolmen luvun tulos: maksuvara, laina-aika ja korko. Näistä vain maksuvaran voit laskea itse etukäteen, ja se on samalla ainoa luku, joka kertoo mitä sinulla on varaa maksaa. Kaksi muuta tulevat tarjouksista.",

        "Järkevä järjestys on siis laskea maksuvara ensin ja pyytää sitten tarjoukset usealta luotonantajalta, jotta näet mitä eri korot ja laina-ajat tarkoittavat juuri sinun maksuvarallasi. Tarjouksen pyytäminen ei sido mihinkään eikä maksa mitään. Kettukilpailutus ohjaa lainavertailun kumppanilleen, joka pyytää tarjoukset yhdellä hakemuksella.",

        "[Vertaa lainatarjoukset](/lainat)",

        "## Lähteet",

        "Luotonantajan velvollisuus arvioida kuluttajan luottokelpoisuus tulojen ja menojen perusteella: [Kilpailu- ja kuluttajavirasto, kuluttaja-asiamiehen linjaus kuluttajaluottojen tarjoamisesta](https://www.kkv.fi/kuluttaja-asiat/tietoa-ja-ohjeita-yrityksille/kuluttaja-asiamiehen-linjaukset/kuluttajaluottojen-tarjoaminen/). Asuntolainanhakijan stressattu lainanhoitorasitus, 60 prosentin yläraja sekä kuuden prosentin koron ja 25 vuoden laina-ajan testi: [Finanssivalvonnan makrovakauspäätös 2022](https://www.finanssivalvonta.fi/tiedotteet-ja-julkaisut/lehdistotiedotteet/2022/makrovakauspaatos-suositus-asuntolainanhakijoiden-lainanhoitorasituksen-ylarajaksi---myos-luottolaitosten-paaomavaatimuksia-tarkennettiin/). Positiivisen luottotietorekisterin ylläpitäjä ja käyttöönoton aikataulu: [Verohallinto, positiivinen luottotietorekisteri](https://www.vero.fi/positiivinenluottotietorekisteri/yksityishenkiloille/tietosi-rekisteriss%C3%A4/). Maksuvara- ja lainalaskelmat ovat Kettukilpailutuksen omia laskelmia tasaerälainasta eivätkä perustu minkään luotonantajan hinnastoon.",
    ],
})


# ---------------------------------------------------------------------------
# 2. Yrityslaina pienyrittäjälle
# ---------------------------------------------------------------------------
POSTS.append({
    "slug": "yrityslaina-pienyrittajalle",
    "title": "Yrityslaina pienyrittäjälle: mistä rahoitus saadaan kun vakuudet eivät riitä",
    "category": "Lainat",
    "date": "2026-09-19",
    "readMinutes": 10,
    "excerpt": "Pankkirahoitusta hakeneista pk-yrityksistä 28 prosenttia kertoi, että rahoituksen saanti edellytti Finnveran takausta. Käymme läpi alkutakauksen ja pk-takauksen ehdot, takauksen hinnan ja sen, mitä yrittäjä itse takaa.",
    "body": [
        "Lyhyt vastaus: pienyrityksen laina haetaan pankista, mutta este on harvoin korko. Este on vakuus. Siihen on kaksi valtion rahoitusyhtiön Finnveran takausta, alkutakaus alle kolme vuotta vanhalle yritykselle ja pk-takaus sitä vanhemmalle. Molemmissa Finnvera takaa enintään 80 prosenttia lainasta, ja hakemuksen tekee pankki yrityksen puolesta.",

        "Tämä artikkeli käy läpi kumpaan kuulut, mitä takaus maksaa ja mitä yrittäjä joutuu itse takaamaan. Takausten ehdot ja hinnat ovat Finnveran omista tuote-ehdoista, ja ne on tarkistettu syyskuussa 2026. Esimerkkilaskelmat ovat Kettukilpailutuksen omia laskelmia noista ehdoista.",

        "## Rahoituksen saatavuus on kiristynyt, ja se näkyy luvuissa",

        "Suomen Yrittäjien, Finnveran ja työ- ja elinkeinoministeriön Pk-yritysbarometri 1/2026 perustuu 4 393 pk-yrityksen vastauksiin. Sen mukaan selvästi alle puolella pk-yrityksistä on lainaa pankista tai muusta rahoituslaitoksesta, ja lähes puolet vastaajista ilmoitti rahoituksen yleisen saatavuuden heikentyneen. Osuus oli kuusi prosenttiyksikköä korkeampi kuin vuotta aiemmin ja 13 prosenttiyksikköä korkeampi kuin kaksi vuotta aiemmin.",

        "Sama barometri kertoo, miksi takaus on tämän artikkelin aihe: pankkirahoitusta hakeneista 28 prosenttia kertoi, että rahoituksen saatavuus edellytti Finnveran takausta. Joka viides rahoituksen hakua suunnittelevista kertoi kääntyvänsä Finnveran puoleen. Takaus ei siis ole poikkeusjärjestely vaan tavallinen osa pienyrityksen lainaa.",

        "## Alkutakaus vai pk-takaus",

        "Jako menee yrityksen iän mukaan. Alkutakaus on tarkoitettu yritykselle, jonka kaupparekisterimerkinnästä on kulunut enintään kolme vuotta. Pk-takaus on tarkoitettu yritykselle, joka on tätä vanhempi. Molemmat sopivat osakeyhtiölle ja rekisteröidylle toiminimelle, mutta eivät osuuskunnalle eivätkä rekisteröidylle yhdistykselle.",

        "| Ehto | Alkutakaus | Pk-takaus",
        "| Yrityksen ikä | Enintään 3 vuotta kaupparekisteristä | Yli 3 vuotta kaupparekisteristä",
        "| Finnveran takausosuus | Enintään 80 % | Enintään 80 %",
        "| Takauksen vähimmäismäärä | 10 000 € | 10 000 €",
        "| Yksittäisen takauksen enimmäismäärä | 80 000 € | 200 000 €",
        "| Yhteensä samalle yritykselle | 160 000 € | 300 000 € (1.1.2024 jälkeen myönnetyt)",
        "| Uusi takaus aiemman jälkeen | Aikaisintaan 2 kk kuluttua | Aikaisintaan 3 kk kuluttua",
        "| Takausprovisio | 1,75 % vuodessa | 0,95 % tai 1,95 % vuodessa luokituksen mukaan",
        "| Palvelumaksu | 1,0 % takauksesta, vähintään 150 € | 1,0 % takauksesta, vähintään 150 € ja enintään 1 000 €",
        "| Yrittäjän oma takaus | Vaaditaan, kattaa 25 % takauksesta | Ei vaadita",
        "| Omarahoitusosuus | Ei vaadita | Ei vaadita",

        "Huomaa takausosuuden merkitys. Takaus kattaa enintään 80 prosenttia lainasta, joten loput 20 prosenttia jäävät pankin omalle riskille tai muun vakuuden varaan. Takaus ei siis poista vakuuskeskustelua kokonaan, vaan pienentää sen viidennekseen.",

        "## Mitä takaus maksaa",

        "Takaus ei ole ilmainen, ja sen hinta lasketaan takauksen määrästä, ei lainan määrästä. Otetaan pk-takaus 100 000 euron lainalle, jossa Finnvera takaa 80 prosenttia eli 80 000 euroa.",

        "| Erä | Euroa",
        "| Takausprovisio ensimmäiseltä vuodelta, luokka AAA tai AA+ (0,95 %) | 760",
        "| Takausprovisio ensimmäiseltä vuodelta, luokka AA, A+ tai A (1,95 %) | 1 560",
        "| Palvelumaksu, 1,0 % takauksesta (katto 1 000 €) | 800",

        "Provisio peritään kolmen kuukauden välein takaussaldosta, jonka pankki ilmoittaa. Saldo pienenee lainan lyhentyessä, joten provisio pienenee vuosittain. Tämä on syytä laskea mukaan lainan kokonaishintaan: provisio ei näy lainan korossa, mutta se näkyy yrityksen tilillä.",

        "Alkutakauksessa provisio on kiinteä 1,75 prosenttia vuodessa, eikä palvelumaksussa ole ylärajaa. Esimerkiksi 50 000 euron lainalla, jossa takaus on 80 prosenttia eli 40 000 euroa, provisio on ensimmäiseltä vuodelta 700 euroa ja palvelumaksu 400 euroa.",

        "## Alkutakauksessa yrittäjä takaa itse neljänneksen",

        "Tämä on alkutakauksen tärkein yksityiskohta, ja se jää tavallisesti huomaamatta. Finnvera vaatii takausta hakevan yrityksen pääomistajilta omavelkaiset erityistakaukset, joissa takaajan vastuu on rajattu sovittuun euromäärään. Takausten on katettava 25 prosenttia alkutakauksen määrästä takauksen myöntämishetkellä, ja yhden omavelkaisen takauksen vähimmäismäärä on 3 000 euroa.",

        "Käytännössä tämä tarkoittaa, että esimerkin 40 000 euron alkutakaus vaatii omistajilta yhteensä 10 000 euron henkilökohtaisen takausvastuun. Se on oikeaa rahaa omasta taloudesta, jos yritys ei pysty maksamaan. Pk-takauksessa vastaavaa vaatimusta ei ole.",

        "Henkilötakaus on juuri se kohta, jossa yrityksen riski siirtyy yrittäjän omaan talouteen. Mitä vakuus ja takaus käytännössä tarkoittavat lainan hinnalle ja riskille, on purettu artikkelissa [vakuudeton vai vakuudellinen laina](/blogi/vakuudeton-vai-vakuudellinen-laina).",

        "## Kuka ei saa Finnveran takausta",

        "Rajoitukset kannattaa tarkistaa ennen kuin käyttää aikaa hakemukseen. Finnvera rahoittaa lähes kaikkia toimialoja, mutta maatalous, metsätalous ja perustajaurakointi jäävät rahoituksen ulkopuolelle. Lisäksi Finnveran luottopolitiikka rajaa joitakin muita aloja pois, ja niistä on erillinen lista.",

        "Käyttötarkoitus on rajattu samalla tavalla. Kumpaakaan takausta ei voi käyttää omien osakkeiden hankintaan, toimitilojen ostoon eikä vientirahoitukseen. Pk-takausta ei voi käyttää osakekauppana tehtyyn yrityskauppaan, eikä myöskään erääntyneiden maksujen hoitamiseen tai rahoittajien vastuiden järjestelyyn. Pk-takausta ei myönnetä, jos yrityksen oma pääoma on viimeisessä vahvistetussa tilinpäätöksessä negatiivinen.",

        "Pk-takauksessa on lisäksi luokitusehto: yrityksellä on oltava vähintään Suomen Asiakastiedon Rating Alfa -luokitus A, ja vähintään 50 prosenttia yrityksestä on oltava yksityishenkilöiden omistuksessa. Yrityksen ja vastuuhenkilöiden luottotietojen on oltava kunnossa.",

        "## Hakemuksen tekee pankki, ei yrittäjä",

        "Tämä hämmentää usein. Finnveran takausta ei haeta Finnverasta vaan pankista. Yrittäjä esittää luottohakemuksen pankille, pankki tekee luottopäätöksen ja hakee takausta Finnveralta verkkopalvelussa yrityksen puolesta. Finnvera tekee oman päätöksensä, ja pankki on sen jälkeen yhteydessä yrittäjään.",

        "Takaus perustuu Finnveran ja pankkien väliseen sopimukseen, joten kaikki pankit eivät ole mukana. Jos oma pankki ei kuulu sopimukseen, rahoitusta voi hakea suoraan Finnveran verkkopalvelusta. Alkutakaushakemukset Finnvera käsittelee omien tietojensa mukaan yleensä kolmessa työpäivässä.",

        "## Yksinyrittäjä, toiminimi ja henkilökohtainen laina",

        "Toiminimi kelpaa kumpaankin takaukseen, mutta toiminimiyrittäjän kannattaa huomata yksi muutos. Joulukuun 2025 alusta myös yksityisten elinkeinonharjoittajien yritysluotot ilmoitetaan Verohallinnon positiiviseen luottotietorekisteriin. Yritysluotto näkyy siis jatkossa myös silloin, kun haet henkilökohtaista lainaa.",

        "Jos rahoitustarve on pieni ja yritystoiminta vasta alkamassa, vaihtoehtona on kuluttajaluotto omalla nimellä. Se on hallinnollisesti kevyempi mutta lähes aina kalliimpi, ja vastuu on joka tapauksessa henkilökohtainen. Lainasumman määrää silloin oma maksuvara, ei yrityksen liikevaihto, ja sen laskeminen on käyty läpi artikkelissa [paljonko lainaa voin saada](/blogi/paljonko-lainaa-voin-saada).",

        "## Yhteenveto",

        "Pienyrityksen rahoituskysymys on vakuuskysymys. Finnveran takaus kattaa siitä enintään 80 prosenttia, ja kumpi takaus koskee sinua ratkeaa yrityksen iästä. Alkutakaus on pienempi, kalliimpi provisioltaan ja vaatii omistajilta henkilökohtaisen takauksen neljännekseen asti. Pk-takaus on suurempi ja ilman henkilötakausta, mutta vaatii kolme vuotta historiaa ja luokituksen kunnossa.",

        "Kaikissa tapauksissa hakemus kulkee pankin kautta, joten ensimmäinen puhelu on omaan pankkiin. Jos rahoitustarve on henkilökohtainen tai pieni, vertaa myös kuluttajaluoton hinta samalla vaivalla. Kettukilpailutus ohjaa lainavertailun kumppanilleen, joka pyytää tarjoukset yhdellä hakemuksella, eikä hakemus sido mihinkään.",

        "[Vertaa lainatarjoukset](/lainat)",

        "## Lähteet",

        "Pk-takauksen ehdot, takausosuus, enimmäismäärät, hinnoittelu, toimiala- ja käyttötarkoitusrajaukset sekä hakuprosessi: [Finnvera, pk-takaus](https://www.finnvera.fi/rahoitus/takaukset/pk-takaus). Alkutakauksen ehdot, enimmäismäärät, provisio ja omistajien omavelkainen erityistakaus: [Finnvera, alkutakaus](https://www.finnvera.fi/rahoitus/takaukset/alkutakaus). Rahoituksen saatavuutta ja Finnveran takauksen osuutta koskevat luvut: [Suomen Yrittäjät, Pk-yritysbarometri 1/2026](https://www.yrittajat.fi/ajankohtaista/tutkimukset/pk-yritysbarometri-1-2026/). Yritysluottojen ilmoittaminen positiiviseen luottotietorekisteriin: [Verohallinto, positiivinen luottotietorekisteri](https://www.vero.fi/positiivinenluottotietorekisteri/yksityishenkiloille/tietosi-rekisteriss%C3%A4/). Finnveran ehdot on tarkistettu 19.9.2026. Takausprovisio- ja palvelumaksuesimerkit ovat Kettukilpailutuksen omia laskelmia näistä ehdoista.",
    ],
})


# ---------------------------------------------------------------------------
# 3. Vakuudeton vai vakuudellinen laina
# ---------------------------------------------------------------------------
POSTS.append({
    "slug": "vakuudeton-vai-vakuudellinen-laina",
    "title": "Vakuudeton vai vakuudellinen laina? Näin vakuus muuttaa hinnan ja riskin",
    "category": "Lainat",
    "date": "2026-09-19",
    "readMinutes": 9,
    "excerpt": "Vakuus ei muuta lainan määrää vaan sen hintaa ja sitä, mitä menetät jos maksaminen katkeaa. Laskemme korkoeron euroiksi ja näytämme, milloin vakuuden antaminen kannattaa ja milloin ei.",
    "body": [
        "Lyhyt vastaus: vakuudellinen laina on korkokuluissa halvempi, koska luotonantajan tappio on rajattu vakuuteen. Vakuudeton laina on kalliimpi, mutta et menetä asuntoasi jos maksaminen katkeaa. Kysymys ei siis ole kumpi on halvempi, vaan kumman riskin otat, ja kannattaako korkoero sen arvoinen juuri sinun lainasummallasi.",

        "Tässä artikkelissa korkoero lasketaan euroiksi. Luvut ovat Kettukilpailutuksen omia laskelmia tasaerälainasta valituilla korko-oletuksilla, eivät kenenkään luotonantajan hinnastosta. Korko-oletukset ovat esimerkkejä, joilla mekanismi näkyy.",

        "## Vakuus ja takaus ovat eri asioita",

        "Arkikielessä molempia sanotaan vakuudeksi, mutta seuraukset ovat erilaiset.",

        "Reaalivakuus on esine tai omaisuuserä, joka pantataan lainan vakuudeksi. Tavallisimmin se on asunto tai kiinteistö, toisinaan arvopaperit. Jos maksaminen katkeaa lopullisesti, luotonantaja voi realisoida vakuuden, mutta tappio rajautuu siihen omaisuuteen, joka on pantattu.",

        "Takaus on henkilön tai yrityksen sitoumus vastata toisen velasta. Se ei rajaa vastuuta esineeseen vaan laajentaa sen toisen ihmisen talouteen. Takaajan vastuun laajuus, esimerkiksi se onko se rajattu tiettyyn euromäärään, sovitaan takaussitoumuksessa. Se on ainoa paperi, joka kertoo mitä on luvattu, ja siksi se on luettava ennen allekirjoitusta eikä sen jälkeen.",

        "## Korkoero euroina, ei prosentteina",

        "Prosenttiero kuulostaa pieneltä ja euromäärä ei. Alla sama 20 000 euron laina neljällä tavalla: kaksi laina-aikaa ja kaksi korko-oletusta, joista matalampi vastaa vakuudellista ja korkeampi vakuudetonta lainaa.",

        "| Laina | Korko-oletus | Kuukausierä | Takaisin yhteensä | Korkoa yhteensä",
        "| 20 000 €, 5 vuotta | 4,5 % | 372,86 € | 22 372 € | 2 372 €",
        "| 20 000 €, 5 vuotta | 9,0 % | 415,17 € | 24 910 € | 4 910 €",
        "| 20 000 €, 10 vuotta | 4,5 % | 207,28 € | 24 873 € | 4 873 €",
        "| 20 000 €, 10 vuotta | 9,0 % | 253,35 € | 30 402 € | 10 402 €",

        "Viiden vuoden lainassa vakuus säästää 2 538 euroa ja kymmenen vuoden lainassa 5 529 euroa. Mitä pidempi laina, sitä enemmän vakuus on rahassa arvoinen, koska korkoero kertyy pidemmältä ajalta.",

        "Taulukossa on myös toinen havainto, joka kannattaa lukea kahdesti. Kymmenen vuoden laina matalalla korolla maksaa korkoa 4 873 euroa ja viiden vuoden laina korkealla korolla 4 910 euroa. Ne ovat käytännössä sama summa. Vakuudella saatu matalampi korko voi siis kulua kokonaan siihen, että laina otetaan samalla kaksi kertaa pidemmäksi. Vakuus kannattaa käyttää halvempaan lainaan, ei pidempään.",

        "## Korkokatto kertoo, kuinka kalliiksi vakuudeton voi käydä",

        "Kuluttajaluoton korko ei saa ylittää korkolain mukaista viitekorkoa lisättynä 15 prosenttiyksiköllä, ja enimmäiskorko on joka tapauksessa 20 prosenttia. Viitekoron vahvistaa Suomen Pankki puolivuosittain. Heinäkuun 2026 alussa alkaneelle ja vuoden 2026 loppuun kestävälle kaudelle viitekorko on 2,5 prosenttia, joten kuluttajaluoton korkokatto on tällä hetkellä 17,5 prosenttia.",

        "Tuo katto on hyvä pitää mielessä mittatikkuna. Sama 20 000 euron viiden vuoden laina 17,5 prosentin korolla tarkoittaisi 502,44 euron kuukausierää ja 10 147 euroa korkoa, eli yli nelinkertaisesti sen mitä vakuudellinen 4,5 prosentin laina samassa ajassa. Laillinen ei siis tarkoita järkevää. Lainakustannusten muut rajat ja se, mitä todellinen vuosikorko sisältää, on käyty läpi artikkelissa [todellinen vuosikorko selitettynä](/blogi/todellinen-vuosikorko).",

        "## Kun vakuutena on oma asunto",

        "Asuntovakuus on halvin vakuus, koska se on luotonantajan kannalta selkein. Hinta siitä maksetaan kahdella tavalla, joista vain toinen näkyy korossa.",

        "Ensimmäinen on ilmeinen: jos maksaminen katkeaa lopullisesti, vakuus voidaan realisoida. Toinen on hiljaisempi: pantattu vakuusarvo on pois käytöstä niin kauan kuin laina on maksamatta. Jos asunnon vakuusarvo on kiinni kulutusluotossa, se ei ole käytettävissä silloin kun sitä tarvitaan johonkin suurempaan, esimerkiksi remonttiin tai asunnonvaihtoon.",

        "Käytännön sääntö seuraa tästä. Asunnon vakuusarvo kannattaa säästää niihin lainoihin, joissa se tuottaa suurimman koronalennuksen euroina, eli suurimpiin ja pisimpiin. Pienen ja lyhyen lainan panttaaminen samalla vakuudella on huono kauppa, koska korkoero euroina on pieni ja vakuusarvo on silti kiinni.",

        "## Kun vakuutena on toisen ihmisen allekirjoitus",

        "Henkilötakaus on kohta, jossa lainan riski siirtyy jonkun muun talouteen. Takaajalle se tarkoittaa kahta asiaa. Ensimmäinen on selvä: jos velallinen ei maksa, maksuvaatimus tulee takaajalle sitoumuksessa sovitussa laajuudessa. Toinen huomataan yleensä vasta myöhemmin: takausvastuu vaikuttaa takaajan omaan maksuvaraan ja siten siihen, paljonko hän itse voi lainata. Maksuvaran laskenta on käyty läpi artikkelissa [paljonko lainaa voin saada](/blogi/paljonko-lainaa-voin-saada).",

        "Rajattu takaus on takaajan kannalta aina parempi kuin rajaamaton, ja sellaisia käytetään myös ammattimaisessa rahoituksessa. Valtion rahoitusyhtiö Finnvera vaatii alkutakauksessaan yrityksen pääomistajilta omavelkaiset erityistakaukset, joissa takaajan vastuu on nimenomaan rajattu sovittuun euromäärään ja joiden on katettava 25 prosenttia takauksen määrästä. Jos valtion rahoittaja rajaa oman takaajansa vastuun euromäärään, sama kannattaa tehdä myös silloin, kun takaaja on oma sukulainen. Yritysrahoituksen takaukset on käyty läpi artikkelissa [yrityslaina pienyrittäjälle](/blogi/yrityslaina-pienyrittajalle).",

        "## Milloin vakuudeton on parempi valinta",

        "Vakuudeton laina on järkevä, kun summa on pieni ja laina-aika lyhyt. Korkoero euroina jää silloin pieneksi, eikä vakuuden järjestäminen ole vaivan arvoista. Se on järkevä myös silloin, kun et halua sitoa asuntoa tai pyytää ketään takaajaksi, ja kun tulot ovat riittävät lyhyeen takaisinmaksuun.",

        "Kolmas tilanne on ajallinen. Vakuudellisen lainan järjestäminen vaatii arvion vakuudesta ja tavallisesti käynnin pankissa. Jos raha tarvitaan nopeasti, vakuudeton laina on usein ainoa toteutuva vaihtoehto. Silloin kannattaa varmistaa kaksi asiaa: että laina-aika on lyhyin mahdollinen ja että lainan saa maksaa pois etuajassa.",

        "## Milloin vakuudellinen kannattaa",

        "Vakuudellinen laina kannattaa, kun summa on suuri, laina-aika pitkä ja vakuus on jo olemassa ilman uusia järjestelyjä. Näissä tilanteissa korkoero on euroina niin suuri, että se maksaa vaivan monikertaisesti takaisin, kuten taulukon kymmenen vuoden esimerkki näyttää.",

        "Yksi varoitus on silti paikallaan. Jos vakuus joudutaan hankkimaan pyytämällä joku toinen takaajaksi, laskelmaan tulee erä, jota ei voi laskea euroissa. Ero on 2 500 euroa viiden vuoden lainassa, ja se on suoraan suhteessa siihen, mitä velkasuhde tekee ihmissuhteelle jos maksaminen katkeaa.",

        "## Kolme kysymystä ennen kuin annat vakuuden",

        "Ensimmäinen: mitä tapahtuu, jos maksaminen katkeaa kuudeksi kuukaudeksi? Vastaa se ääneen ennen allekirjoitusta, älä sen jälkeen. Vakuudettomassa lainassa vastaus on perintä ja mahdollinen maksuhäiriömerkintä. Vakuudellisessa lainassa vastaus koskee myös vakuutta.",

        "Toinen: onko vakuus minun vai jonkun toisen? Jos toisen, kysymys ei ole enää rahoituskysymys.",

        "Kolmas: paljonko korkoero on euroina, ei prosentteina? Pyydä molemmista vaihtoehdoista todellinen vuosikorko ja takaisinmaksettava kokonaissumma samalle laina-ajalle. Prosenttiero näyttää aina pieneltä. Euromäärä näyttää sen, mitä vakuudesta oikeasti saa.",

        "## Yhteenveto",

        "Vakuus on hinnanalennus, jonka maksat riskillä. Alennus on euroina sitä suurempi, mitä isompi ja pidempi laina on, ja sitä pienempi, mitä pienempi ja lyhyempi laina on. Siksi pieni laina kannattaa yleensä ottaa vakuudettomana ja iso vakuudellisena, ja siksi vakuusarvoa ei kannata sitoa pieneen lainaan.",

        "Vertailu ratkeaa kahdella luvulla: todellinen vuosikorko ja takaisinmaksettava kokonaissumma, molemmat samalle laina-ajalle. Ne saa vain pyytämällä. Kettukilpailutus ohjaa lainavertailun kumppanilleen, joka pyytää tarjoukset yhdellä hakemuksella, eikä hakemus sido sinua mihinkään.",

        "[Vertaa lainatarjoukset](/lainat)",

        "## Lähteet",

        "Kuluttajaluoton korkokatto ja muut luottokustannuksia koskevat rajat: [Kilpailu- ja kuluttajavirasto, kuluttaja-asiamiehen linjaus kuluttajaluottojen tarjoamisesta](https://www.kkv.fi/kuluttaja-asiat/tietoa-ja-ohjeita-yrityksille/kuluttaja-asiamiehen-linjaukset/kuluttajaluottojen-tarjoaminen/). Korkolain mukainen viitekorko 2,5 prosenttia heinäkuun 2026 alusta vuoden loppuun: [Suomen Pankki, korkolain perusteella vahvistettu viitekorko](https://www.suomenpankki.fi/fi/tilastot/taulukot-ja-kuviot/korot/taulukot2/korot_taulukot/viitekorko_fi/). Esimerkki rajatusta omavelkaisesta takauksesta ja sen 25 prosentin kattavuusvaatimuksesta: [Finnvera, alkutakaus](https://www.finnvera.fi/rahoitus/takaukset/alkutakaus). Kuukausierä-, kokonaissumma- ja korkolaskelmat ovat Kettukilpailutuksen omia laskelmia tasaerälainasta valituilla korko-oletuksilla eivätkä perustu minkään luotonantajan hinnastoon.",
    ],
})


def main():
    with io.open(PATH, encoding="utf-8") as f:
        data = json.load(f)

    posts = data["posts"]
    existing = {p["slug"] for p in posts}
    new = [p for p in POSTS if p["slug"] not in existing]
    if not new:
        print("Ei lisättävää, kaikki slugit ovat jo tiedostossa.")
        return

    # Lainakategorian artikkelit pysyvät yhdessä nipussa: sijoitetaan
    # viimeisen Lainat-artikkelin perään. Kolme ensimmäistä alkiota eivät
    # siirry, koska GuideBoxes näyttää nimenomaan ne.
    last_loan = max(i for i, p in enumerate(posts) if p["category"] == "Lainat")
    posts[last_loan + 1: last_loan + 1] = new

    with io.open(PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print("Lisätty %d artikkeli(a): %s" % (len(new), ", ".join(p["slug"] for p in new)))
    print("Artikkeleita yhteensä nyt %d." % len(posts))


if __name__ == "__main__":
    main()
