/**
 * Initial content for the mock client.
 * This file is the only source of seeded makers, products, inquiries, and community posts.
 *
 * Demo accounts (plain-text passwords, for the mock login only):
 * - Maker:     amara@sisterhood.test
 * - Supporter: lena@sisterhood.test
 * - Password:  sisterhood
 *
 * Every other seeded account uses the same password.
 */
import type {
  CommunityPost,
  Inquiry,
  MakerProfile,
  Product,
  User
} from '#shared/types'

export const demoMakerEmail = 'amara@sisterhood.test'
export const demoSupporterEmail = 'lena@sisterhood.test'
export const demoPassword = 'sisterhood'

const amaraId = 'usr_amara'
const lenaId = 'usr_lena'
const wanjiruId = 'usr_wanjiru'
const achiengId = 'usr_achieng'
const njeriId = 'usr_njeri'
const gretaId = 'usr_greta'
const marenId = 'usr_maren'
const eliseId = 'usr_elise'

const amaraCollarId = 'prd_amara_brass_collar'

function unsplash(id: string, width = 1200) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`
}

export const users: User[] = [
  {
    id: amaraId,
    email: demoMakerEmail,
    displayName: 'Amara Okello',
    password: demoPassword,
    attested: true,
    isMaker: true
  },
  {
    id: lenaId,
    email: demoSupporterEmail,
    displayName: 'Lena Berger',
    password: demoPassword,
    attested: true,
    isMaker: false
  },
  {
    id: wanjiruId,
    email: 'wanjiru@sisterhood.test',
    displayName: 'Wanjiru Mwangi',
    password: demoPassword,
    attested: true,
    isMaker: true
  },
  {
    id: achiengId,
    email: 'achieng@sisterhood.test',
    displayName: 'Achieng Otieno',
    password: demoPassword,
    attested: true,
    isMaker: true
  },
  {
    id: njeriId,
    email: 'njeri@sisterhood.test',
    displayName: 'Njeri Kamau',
    password: demoPassword,
    attested: true,
    isMaker: true
  },
  {
    id: gretaId,
    email: 'greta@sisterhood.test',
    displayName: 'Greta Hoffmann',
    password: demoPassword,
    attested: true,
    isMaker: true
  },
  {
    id: marenId,
    email: 'maren@sisterhood.test',
    displayName: 'Maren Keller',
    password: demoPassword,
    attested: true,
    isMaker: true
  },
  {
    id: eliseId,
    email: 'elise@sisterhood.test',
    displayName: 'Elise Brunner',
    password: demoPassword,
    attested: true,
    isMaker: true
  }
]

export const makerProfiles: MakerProfile[] = [
  {
    userId: amaraId,
    place: 'Nairobi, Kenya',
    bio: {
      en: 'I dye and stitch cloth in a room behind my sister\'s shop in Eastlands. The cotton comes from weavers in Kisumu. Indigo and marigold grow in pots on the stairs, and I look after the vat more often than I talk about it.',
      de: 'Ich färbe und nähe Stoffe in einem Raum hinter dem Laden meiner Schwester in Eastlands. Die Baumwolle kommt von Weberinnen in Kisumu. Indigo und Ringelblume wachsen in Töpfen auf der Treppe, und ich kümmere mich öfter um die Küpe, als ich darüber rede.'
    },
    portraitImageUrl: unsplash('1531123897727-8f129e1688ce', 800)
  },
  {
    userId: wanjiruId,
    place: 'Kisumu, Kenya',
    bio: {
      en: 'I throw pots with clay we dig on the lake shore when the water drops. The kiln sits under a tin roof behind my mother\'s house. I fire with wood, so the bowls come out grey-brown and never quite the same.',
      de: 'Ich drehe Gefäße aus Ton, den wir am Seeufer graben, wenn das Wasser fällt. Der Ofen steht unter einem Blechdach hinter dem Haus meiner Mutter. Ich brenne mit Holz, deshalb werden die Schalen graubraun und nie ganz gleich.'
    },
    portraitImageUrl: unsplash('1531384441138-2736e62e0919', 800)
  },
  {
    userId: achiengId,
    place: 'Lamu, Kenya',
    bio: {
      en: 'Most mornings I work on the verandah in Lamu before the town is loud. I string cowries and old silver, and I bottle coconut oil while the nuts are fresh. If a finding has to come by boat, the piece waits.',
      de: 'Meistens arbeite ich morgens auf der Veranda in Lamu, bevor die Stadt laut wird. Ich fädle Kauris und altes Silber auf und fülle Kokosöl ab, solange die Nüsse frisch sind. Wenn eine Fassung erst mit dem Boot kommt, wartet das Stück.'
    },
    portraitImageUrl: unsplash('1523824921871-d6f1a15151f1', 800)
  },
  {
    userId: njeriId,
    place: 'Nakuru, Kenya',
    bio: {
      en: 'I carve spoons, boards, and low stools from wood the yard cannot sell as timber. Mostly olive and cypress. I sand until the spoon sits quietly in the hand, then I oil it and leave it for a week.',
      de: 'Ich schnitze Löffel, Bretter und niedrige Hocker aus Holz, das der Holzplatz nicht als Balken verkaufen kann. Meist Olive und Zypresse. Ich schleife, bis der Löffel ruhig in der Hand liegt, dann öle ich ihn und lasse ihn eine Woche ruhen.'
    },
    portraitImageUrl: unsplash('1589156280159-27698a70f29e', 800)
  },
  {
    userId: gretaId,
    place: 'Leipzig, Germany',
    bio: {
      en: 'I cut linoleum at a kitchen table in Plagwitz and print on paper and on linen offcuts. The blocks are the canal, the market, and the weeds in the cobbles. I stop a run when the block starts to soften.',
      de: 'Ich schneide Linoleum am Küchentisch in Plagwitz und drucke auf Papier und auf Leinenreste. Die Stöcke zeigen den Kanal, den Markt und das Unkraut zwischen den Pflastersteinen. Ich höre mit einer Auflage auf, wenn der Stock weich wird.'
    },
    portraitImageUrl: unsplash('1438761681033-6461ffad8d80', 800)
  },
  {
    userId: marenId,
    place: 'Graz, Austria',
    bio: {
      en: 'The wheel is in the old laundry, and the preserving pans are in the kitchen above it. I throw plain tableware and put up fruit from the trees along the Mur. A bowl with a hairline crack stays in the kitchen for the apricots.',
      de: 'Die Töpferscheibe steht in der alten Waschküche, die Einkochkessel in der Küche darüber. Ich drehe schlichtes Geschirr und koche Obst von den Bäumen an der Mur ein. Eine Schale mit einem Haarriss bleibt in der Küche für die Marillen.'
    },
    portraitImageUrl: unsplash('1544005313-94ddf0286df2', 800)
  },
  {
    userId: eliseId,
    place: 'Bern, Switzerland',
    bio: {
      en: 'I make small things for the table from offcuts, and balm from my brother\'s bees. The bench is a corner of a joinery in the Länggasse. Every tin is labelled with the hive and the month I filled it.',
      de: 'Ich mache kleine Dinge für den Tisch aus Reststücken und Salbe von den Bienen meines Bruders. Die Hobelbank steht in einer Ecke einer Schreinerei in der Länggasse. Auf jeder Dose stehen der Bienenstock und der Monat, in dem ich sie abgefüllt habe.'
    },
    portraitImageUrl: unsplash('1580489944761-15a19d654956', 800)
  }
]

export const products: Product[] = [
  {
    id: 'prd_amara_indigo_cloth',
    makerId: amaraId,
    title: {
      en: 'Indigo day cloth',
      de: 'Indigotuch für den Tag'
    },
    description: {
      en: 'A light cotton throw, dyed in three dips. The middle stayed paler where I tied it with raffia. It covers the foot of a bed, or a child\'s shoulders on a cool morning.',
      de: 'Ein leichtes Baumwolltuch, dreimal in die Küpe getaucht. In der Mitte blieb es heller, dort habe ich es mit Raffia abgebunden. Es deckt das Fußende eines Bettes ab oder die Schultern eines Kindes an einem kühlen Morgen.'
    },
    category: 'Textiles',
    price: { amount: 4800, currency: 'KES' },
    imageUrls: [
      unsplash('1558171813-4c088753af8f'),
      unsplash('1528459801416-a9e53bbf4e17')
    ],
    createdAt: '2026-06-02T08:00:00.000Z'
  },
  {
    id: 'prd_amara_marigold_napkins',
    makerId: amaraId,
    title: {
      en: 'Marigold napkins, set of four',
      de: 'Ringelblumen-Servietten, vier Stück'
    },
    description: {
      en: 'Four cotton napkins dyed with marigold from the pots on the stairs. The yellow deepens after the first wash. I hem them by hand in the evening, when the vat is resting.',
      de: 'Vier Baumwollservietten, gefärbt mit Ringelblume aus den Töpfen auf der Treppe. Das Gelb wird nach der ersten Wäsche tiefer. Die Säume nähe ich abends von Hand, wenn die Küpe ruht.'
    },
    category: 'Textiles',
    price: { amount: 2200, currency: 'KES' },
    imageUrls: [unsplash('1620799140408-edc6dcb6d633')],
    createdAt: '2026-06-18T08:00:00.000Z'
  },
  {
    id: amaraCollarId,
    makerId: amaraId,
    title: {
      en: 'Brass and glass collar',
      de: 'Collier aus Messing und Glas'
    },
    description: {
      en: 'A short collar of brass discs and recycled glass beads on waxed linen. I cut the discs from offcuts a jeweller in Ngara keeps for me. The length is fixed. The tie is what holds it.',
      de: 'Ein kurzes Collier aus Messingscheiben und recycelten Glasperlen auf gewachstem Leinen. Die Scheiben schneide ich aus Resten, die eine Goldschmiedin in Ngara für mich aufhebt. Die Länge ist fest. Das Band hält es.'
    },
    category: 'Jewelry',
    imageUrls: [unsplash('1515562141207-7a88fb7ce338')],
    createdAt: '2026-07-09T08:00:00.000Z'
  },
  {
    id: 'prd_amara_sisal_basket',
    makerId: amaraId,
    title: {
      en: 'Sisal market basket',
      de: 'Sisal-Marktkorb'
    },
    description: {
      en: 'A round basket for tomatoes and greens. I coil sisal over a core of maize husk, the way my aunt taught me, and I leave one side soft so it sits against the hip.',
      de: 'Ein runder Korb für Tomaten und Grünzeug. Ich wickle Sisal um einen Kern aus Maisblättern, so wie meine Tante es mir gezeigt hat, und lasse eine Seite weich, damit er an der Hüfte anliegt.'
    },
    category: 'Fiber & Basketry',
    price: { amount: 3500, currency: 'KES' },
    imageUrls: [unsplash('1606923829579-0cb981a83e2e')],
    createdAt: '2026-08-01T08:00:00.000Z'
  },
  {
    id: 'prd_wanjiru_serving_bowl',
    makerId: wanjiruId,
    title: {
      en: 'Lake shore serving bowl',
      de: 'Servierschale vom Seeufer'
    },
    description: {
      en: 'Thrown from clay we dig when the lake is low. The ash glaze broke in the wood fire and left a pale ring inside. It holds rice for four, or greens if you do not mind the weight.',
      de: 'Gedreht aus Ton, den wir graben, wenn der See niedrig steht. Die Ascheglasur ist im Holzfeuer aufgerissen und hat innen einen hellen Ring hinterlassen. Sie fasst Reis für vier, oder Grünzeug, wenn dir das Gewicht nichts ausmacht.'
    },
    category: 'Ceramics',
    price: { amount: 3200, currency: 'KES' },
    imageUrls: [unsplash('1493106641515-6b5631de4bb9')],
    createdAt: '2026-05-14T08:00:00.000Z'
  },
  {
    id: 'prd_wanjiru_tea_cups',
    makerId: wanjiruId,
    title: {
      en: 'Four tea cups',
      de: 'Vier Teeschalen'
    },
    description: {
      en: 'Small cups without handles, the way we drink chai. Each one sat in a different part of the kiln, so the rims run from smoke grey to a warm brown. They stack, but only just.',
      de: 'Kleine Schalen ohne Henkel, so wie wir Chai trinken. Jede stand an einer anderen Stelle im Ofen, deshalb laufen die Ränder von Rauchgrau zu einem warmen Braun. Sie lassen sich stapeln, aber nur knapp.'
    },
    category: 'Ceramics',
    price: { amount: 4100, currency: 'KES' },
    imageUrls: [unsplash('1610701596007-11502861dcfa')],
    createdAt: '2026-06-20T08:00:00.000Z'
  },
  {
    id: 'prd_wanjiru_water_jar',
    makerId: wanjiruId,
    title: {
      en: 'Unglazed water jar',
      de: 'Unglasierter Wassertopf'
    },
    description: {
      en: 'A jar for the corner of the kitchen. Unglazed, so the clay sweats and keeps the water cooler. I do not ship these. Come to the house in Kisumu and pick the one whose mouth fits your hand.',
      de: 'Ein Topf für die Ecke der Küche. Unglasiert, damit der Ton schwitzt und das Wasser kühler bleibt. Ich verschicke sie nicht. Komm zum Haus in Kisumu und such dir den aus, dessen Öffnung in deine Hand passt.'
    },
    category: 'Ceramics',
    imageUrls: [unsplash('1578749556568-bc2c40e68b61')],
    createdAt: '2026-07-22T08:00:00.000Z'
  },
  {
    id: 'prd_wanjiru_soap_dish',
    makerId: wanjiruId,
    title: {
      en: 'Clay soap dish',
      de: 'Seifenschale aus Ton'
    },
    description: {
      en: 'A low dish with a slit so the soap does not sit in water. Same lake clay as the bowls, left unglazed on the inside. It will darken where the soap rests. That is the clay taking up the oil.',
      de: 'Eine flache Schale mit einem Schlitz, damit die Seife nicht im Wasser steht. Derselbe Seeton wie bei den Schüsseln, innen unglasiert. Sie wird dunkler, wo die Seife liegt. Das ist der Ton, der das Öl aufnimmt.'
    },
    category: 'Care & Beauty',
    price: { amount: 900, currency: 'KES' },
    imageUrls: [unsplash('1565191999001-551c187427bb')],
    createdAt: '2026-08-11T08:00:00.000Z'
  },
  {
    id: 'prd_achieng_cowrie_cuffs',
    makerId: achiengId,
    title: {
      en: 'Cowrie ear cuffs',
      de: 'Kauri-Ohrmanschetten'
    },
    description: {
      en: 'A pair, strung from shells my aunt kept in a tin. They clip, so they do not need a piercing. The shells are old and a little worn at the lip. I am not replacing them with new ones from the market.',
      de: 'Ein Paar, aufgezogen aus Muscheln, die meine Tante in einer Dose aufbewahrt hat. Sie werden angeklemmt, ein Ohrloch braucht es nicht. Die Muscheln sind alt und am Rand etwas abgenutzt. Ich ersetze sie nicht durch neue vom Markt.'
    },
    category: 'Jewelry',
    price: { amount: 1800, currency: 'KES' },
    imageUrls: [unsplash('1535632066927-ab7c9ab60908')],
    createdAt: '2026-04-08T08:00:00.000Z'
  },
  {
    id: 'prd_achieng_mangrove_ring',
    makerId: achiengId,
    title: {
      en: 'Mangrove silver ring',
      de: 'Silberring, Mangrove'
    },
    description: {
      en: 'A narrow band with a cut that follows a mangrove root. I carve the wax here and send it to a caster on the mainland when the boat is going. If your size is not on the cushion, write before you count on it.',
      de: 'Ein schmaler Reif mit einem Schnitt, der einer Mangrovenwurzel folgt. Ich schnitze das Wachs hier und schicke es zu einer Gießerin auf dem Festland, wenn das Boot fährt. Wenn deine Größe nicht auf dem Kissen liegt, schreib, bevor du damit rechnest.'
    },
    category: 'Jewelry',
    imageUrls: [unsplash('1605100804763-247f67b3557e')],
    createdAt: '2026-05-28T08:00:00.000Z'
  },
  {
    id: 'prd_achieng_jasmine_oil',
    makerId: achiengId,
    title: {
      en: 'Jasmine coconut oil',
      de: 'Kokosöl mit Jasmin'
    },
    description: {
      en: 'Coconut oil from nuts we pressed this month, with jasmine from the lane behind the house. I bottle it while the scent is still green, not sweet. A little on the ends of the hair, or on a dry wrist.',
      de: 'Kokosöl aus Nüssen, die wir diesen Monat gepresst haben, mit Jasmin aus der Gasse hinter dem Haus. Ich fülle es ab, solange der Duft noch grün ist und nicht süß. Ein wenig auf die Haarspitzen oder auf ein trockenes Handgelenk.'
    },
    category: 'Care & Beauty',
    price: { amount: 750, currency: 'KES' },
    imageUrls: [unsplash('1608571423902-eed4a5ad8108')],
    createdAt: '2026-07-03T08:00:00.000Z'
  },
  {
    id: 'prd_achieng_waist_beads',
    makerId: achiengId,
    title: {
      en: 'Glass and cowrie waist beads',
      de: 'Taillenperlen aus Glas und Kauri'
    },
    description: {
      en: 'A strand to tie at the waist, glass beads with three cowries at the centre. I string them loose so they move when you walk. Tell me the length if you want them to sit above the hip and not slide.',
      de: 'Eine Schnur zum Binden an der Taille, Glasperlen mit drei Kauris in der Mitte. Ich fädle sie locker, damit sie sich beim Gehen bewegen. Sag mir die Länge, wenn sie über der Hüfte sitzen sollen und nicht rutschen.'
    },
    category: 'Jewelry',
    price: { amount: 1500, currency: 'KES' },
    imageUrls: [unsplash('1611591437281-460bfbe1220a')],
    createdAt: '2026-09-02T08:00:00.000Z'
  },
  {
    id: 'prd_njeri_olive_spoons',
    makerId: njeriId,
    title: {
      en: 'Olive wood spoons, pair',
      de: 'Olivenholzlöffel, ein Paar'
    },
    description: {
      en: 'Two spoons from one branch the yard could not sell as a plank. One is deep for stew, one is shallow for serving. I sanded them until the grain went quiet, then oiled them and left them a week.',
      de: 'Zwei Löffel aus einem Ast, den der Holzplatz nicht als Bohle verkaufen konnte. Einer ist tief für Eintopf, einer flach zum Anrichten. Ich habe geschliffen, bis die Maserung ruhig wurde, sie dann geölt und eine Woche liegen lassen.'
    },
    category: 'Wood',
    price: { amount: 2800, currency: 'KES' },
    imageUrls: [unsplash('1416879595882-3373a0480b5b')],
    createdAt: '2026-05-02T08:00:00.000Z'
  },
  {
    id: 'prd_njeri_cypress_board',
    makerId: njeriId,
    title: {
      en: 'Cypress cutting board',
      de: 'Schneidebrett aus Zypresse'
    },
    description: {
      en: 'A board with a juice groove I cut after the first buyer said the onions ran off the edge. Cypress, from a short offcut. Oil it when the surface looks pale. Do not leave it soaking.',
      de: 'Ein Brett mit einer Saftrille, die ich geschnitten habe, nachdem die erste Käuferin sagte, die Zwiebeln laufen über den Rand. Zypresse, aus einem kurzen Reststück. Öl es, wenn die Fläche blass wird. Lass es nicht im Wasser liegen.'
    },
    category: 'Wood',
    price: { amount: 4500, currency: 'KES' },
    imageUrls: [unsplash('1606760227091-3dd870d97f1d')],
    createdAt: '2026-06-11T08:00:00.000Z'
  },
  {
    id: 'prd_njeri_low_stool',
    makerId: njeriId,
    title: {
      en: 'Low stool',
      de: 'Niedriger Hocker'
    },
    description: {
      en: 'A three-leg stool for a child, or for sitting at the fire. I cut the seat to the height you ask for, so I do not keep a pile of them finished. Write the height from the floor to the seat.',
      de: 'Ein dreibeiniger Hocker für ein Kind oder zum Sitzen am Feuer. Die Sitzhöhe schneide ich so, wie du sie brauchst, deshalb habe ich keinen Stapel fertiger Hocker. Schreib mir die Höhe vom Boden bis zur Sitzfläche.'
    },
    category: 'Wood',
    imageUrls: [unsplash('1611486212557-88be5ff6f941')],
    createdAt: '2026-08-19T08:00:00.000Z'
  },
  {
    id: 'prd_njeri_sisal_tray',
    makerId: njeriId,
    title: {
      en: 'Sisal and wood tray',
      de: 'Tablett aus Sisal und Holz'
    },
    description: {
      en: 'A flat tray, sisal coiled inside a cypress rim. I made it for carrying cups from the kitchen without a cloth. It is not a basket. It has no handle, and it should stay dry.',
      de: 'Ein flaches Tablett, Sisal gewickelt in einem Rand aus Zypresse. Ich habe es gemacht, um Tassen ohne Tuch aus der Küche zu tragen. Es ist kein Korb. Es hat keinen Henkel und soll trocken bleiben.'
    },
    category: 'Fiber & Basketry',
    price: { amount: 2600, currency: 'KES' },
    imageUrls: [unsplash('1578500494198-246f612d3b3d')],
    createdAt: '2026-09-15T08:00:00.000Z'
  },
  {
    id: 'prd_greta_canal_linocut',
    makerId: gretaId,
    title: {
      en: 'Canal linocut',
      de: 'Linolschnitt, Kanal'
    },
    description: {
      en: 'A print of the canal behind the studio in Plagwitz, cut in linoleum and printed in a blue I mix myself. A4, on cream paper. The edition is thirty. The number is in pencil under the image.',
      de: 'Ein Druck vom Kanal hinter der Werkstatt in Plagwitz, in Linoleum geschnitten und in einem Blau gedruckt, das ich selbst mische. A4, auf cremefarbenem Papier. Die Auflage ist dreißig. Die Nummer steht mit Bleistift unter dem Bild.'
    },
    category: 'Print & Paper',
    price: { amount: 45, currency: 'EUR' },
    imageUrls: [unsplash('1513364776144-60967b0f800f')],
    createdAt: '2026-09-01T08:00:00.000Z'
  },
  {
    id: 'prd_greta_plant_cards',
    makerId: gretaId,
    title: {
      en: 'Plant postcards, set of three',
      de: 'Pflanzenpostkarten, drei Stück'
    },
    description: {
      en: 'Thistle, nettle, and the weed that grows in the cobbles outside the door. Small linocuts, printed on offcuts from the canal edition. They are cards. Write on the back.',
      de: 'Distel, Brennnessel und das Unkraut, das draußen zwischen den Pflastersteinen wächst. Kleine Linolschnitte, gedruckt auf den Resten der Kanal-Auflage. Es sind Karten. Die Rückseite ist zum Schreiben.'
    },
    category: 'Print & Paper',
    price: { amount: 12, currency: 'EUR' },
    imageUrls: [unsplash('1456735190827-d1262f71b8a3')],
    createdAt: '2026-09-20T08:00:00.000Z'
  },
  {
    id: 'prd_greta_thistle_towel',
    makerId: gretaId,
    title: {
      en: 'Thistle tea towel',
      de: 'Geschirrtuch, Distel'
    },
    description: {
      en: 'The thistle block printed on a linen offcut I hemmed to towel size. The linen was already a little grey. I did not bleach it. It washes well, and the print softens rather than cracks.',
      de: 'Der Druckstock mit der Distel, gedruckt auf einen Leinenrest, den ich auf Tuchgröße gesäumt habe. Das Leinen war schon etwas grau. Ich habe es nicht gebleicht. Es verträgt die Wäsche, und der Druck wird weicher, statt zu brechen.'
    },
    category: 'Textiles',
    price: { amount: 38, currency: 'EUR' },
    imageUrls: [unsplash('1620799140188-3b2a02fd9a77')],
    createdAt: '2026-10-04T08:00:00.000Z'
  },
  {
    id: 'prd_greta_night_market',
    makerId: gretaId,
    title: {
      en: 'Night market, artist proof',
      de: 'Nachtmarkt, Probedruck'
    },
    description: {
      en: 'The proof I pulled before the edition, with a slip in the registration you can see in the stall lights. I am not selling the proof. If you want the finished print, write and I will say when the next run is dry.',
      de: 'Der Probedruck, den ich vor der Auflage gezogen habe, mit einem Verrutschen im Passer, das man in den Lichtern der Stände sieht. Den Probedruck verkaufe ich nicht. Wenn du den fertigen Druck willst, schreib mir, dann sage ich, wann der nächste Lauf trocken ist.'
    },
    category: 'Print & Paper',
    imageUrls: [unsplash('1460661419201-fd4cecdf8a8b')],
    createdAt: '2026-10-12T08:00:00.000Z'
  },
  {
    id: 'prd_maren_breakfast_bowl',
    makerId: marenId,
    title: {
      en: 'Speckled breakfast bowl',
      de: 'Frühstücksschale, gesprenkelt'
    },
    description: {
      en: 'A bowl for yoghurt or soup, thrown in the old laundry. The speckles are iron in the clay, not paint. It is a little heavy, which is what I want when the spoon hits the side in the morning.',
      de: 'Eine Schale für Joghurt oder Suppe, gedreht in der alten Waschküche. Die Sprenkel sind Eisen im Ton, keine Farbe. Sie ist etwas schwer. Genau das will ich, wenn der Löffel morgens an den Rand stößt.'
    },
    category: 'Ceramics',
    price: { amount: 42, currency: 'EUR' },
    imageUrls: [unsplash('1565193566173-7a0ee3dbe261')],
    createdAt: '2026-06-08T08:00:00.000Z'
  },
  {
    id: 'prd_maren_apricot',
    makerId: marenId,
    title: {
      en: 'Apricot preserve, 2026',
      de: 'Marillenmarmelade, 2026'
    },
    description: {
      en: 'From the trees along the Mur, cooked in small pans so the fruit stays in pieces. No pectin from a packet. A jar is 220 grams. Keep it cool after you open it. The rest of the batch is in the cellar.',
      de: 'Von den Bäumen an der Mur, in kleinen Kesseln gekocht, damit das Obst in Stücken bleibt. Kein Pektin aus der Packung. Ein Glas hat 220 Gramm. Nach dem Öffnen kühl stellen. Der Rest der Charge liegt im Keller.'
    },
    category: 'Food & Preserve',
    price: { amount: 9, currency: 'EUR' },
    imageUrls: [unsplash('1471943311424-646960669fbc')],
    createdAt: '2026-07-28T08:00:00.000Z'
  },
  {
    id: 'prd_maren_pouring_jug',
    makerId: marenId,
    title: {
      en: 'Pouring jug',
      de: 'Ausgusskrug'
    },
    description: {
      en: 'A jug with a lip that actually pours, which took me longer than the throwing. I keep these in the kitchen and let one go when someone asks, because the good ones get used here first.',
      de: 'Ein Krug mit einer Tülle, die wirklich gießt. Daran habe ich länger gesessen als am Drehen. Die guten stehen bei mir in der Küche, und ich gebe einen ab, wenn jemand fragt. Frag, ob gerade einer übrig ist.'
    },
    category: 'Ceramics',
    imageUrls: ['https://images.pexels.com/photos/5705491/pexels-photo-5705491.jpeg?auto=compress&cs=tinysrgb&w=1200'],
    createdAt: '2026-08-16T08:00:00.000Z'
  },
  {
    id: 'prd_maren_elderflower',
    makerId: marenId,
    title: {
      en: 'Elderflower syrup',
      de: 'Holunderblütensirup'
    },
    description: {
      en: 'Picked in June along the path behind the house, steeped the same day. The syrup is pale and smells like the flowers, not like sweets. A spoon in cold water is enough. The bottle is 250 millilitres.',
      de: 'Im Juni am Weg hinter dem Haus gepflückt und am selben Tag angesetzt. Der Sirup ist blass und riecht nach den Blüten, nicht nach Süßigkeiten. Ein Löffel in kaltes Wasser reicht. Die Flasche hat 250 Milliliter.'
    },
    category: 'Food & Preserve',
    price: { amount: 11, currency: 'EUR' },
    imageUrls: [unsplash('1474979266404-7eaacbcd87c5')],
    createdAt: '2026-06-01T08:00:00.000Z'
  },
  {
    id: 'prd_elise_ash_comb',
    makerId: eliseId,
    title: {
      en: 'Ash pocket comb',
      de: 'Taschenkamm aus Esche'
    },
    description: {
      en: 'A comb cut from an ash offcut the joinery would have burned. The teeth are wide enough for hair that tangles. I oil it with the same wax I use for the tins. Keep it dry.',
      de: 'Ein Kamm aus einem Eschenrest, den die Schreinerei verheizt hätte. Die Zinken sind weit genug für Haar, das sich verheddert. Ich öle ihn mit demselben Wachs wie die Dosen. Halt ihn trocken.'
    },
    category: 'Wood',
    price: { amount: 28, currency: 'EUR' },
    imageUrls: [unsplash('1504148455328-c376907d081c')],
    createdAt: '2026-04-22T08:00:00.000Z'
  },
  {
    id: 'prd_elise_hand_balm',
    makerId: eliseId,
    title: {
      en: 'Beeswax hand balm',
      de: 'Handbalsam aus Bienenwachs'
    },
    description: {
      en: 'Wax from my brother\'s hives above Bern, with a little oil so it melts into the skin and does not sit on it. The tin is labelled with the hive and the month. This one is August, from the hive by the pear tree.',
      de: 'Wachs von den Völkern meines Bruders oberhalb von Bern, mit etwas Öl, damit es in die Haut zieht und nicht darauf liegen bleibt. Auf der Dose stehen Bienenstock und Monat. Diese ist August, vom Volk am Birnbaum.'
    },
    category: 'Care & Beauty',
    price: { amount: 14, currency: 'EUR' },
    imageUrls: [unsplash('1556228578-0d85b1a4d571')],
    createdAt: '2026-08-30T08:00:00.000Z'
  },
  {
    id: 'prd_elise_oak_box',
    makerId: eliseId,
    title: {
      en: 'Oak salt box',
      de: 'Salzdose aus Eiche'
    },
    description: {
      en: 'A box with a sliding lid, for salt by the stove. I make them when a board is too short for anything else. The fit of the lid is the part that takes the time. Say whether it should hold a week of salt or a month.',
      de: 'Eine Dose mit Schiebedeckel, für Salz am Herd. Ich mache sie, wenn ein Brett für alles andere zu kurz ist. Der Sitz des Deckels ist der Teil, der Zeit braucht. Sag, ob sie Salz für eine Woche oder einen Monat fassen soll.'
    },
    category: 'Wood',
    imageUrls: [unsplash('1533090161767-e6ffed986c88')],
    createdAt: '2026-09-08T08:00:00.000Z'
  },
  {
    id: 'prd_elise_linden_buttons',
    makerId: eliseId,
    title: {
      en: 'Linden buttons, set of six',
      de: 'Lindenknöpfe, sechs Stück'
    },
    description: {
      en: 'Six buttons from linden, with two holes and a slight dome. I cut them for a mender nearby who wanted wood that would not scratch a press. They are light. Sew them with a strong thread.',
      de: 'Sechs Knöpfe aus Linde, mit zwei Löchern und einer leichten Wölbung. Ich habe sie für eine Änderin in der Nachbarschaft geschnitten, die Holz wollte, das eine Presse nicht verkratzt. Sie sind leicht. Näh sie mit einem festen Faden.'
    },
    category: 'Wood',
    price: { amount: 22, currency: 'EUR' },
    imageUrls: [unsplash('1611486212557-88be5ff6f941')],
    createdAt: '2026-10-02T08:00:00.000Z'
  }
]

export const inquiries: Inquiry[] = [
  {
    id: 'inq_lena_brass_collar',
    productId: amaraCollarId,
    makerUserId: amaraId,
    inquirerUserId: lenaId,
    createdAt: '2026-10-18T09:12:00.000Z',
    messages: [
      {
        id: 'msg_lena_collar_1',
        authorUserId: lenaId,
        body: 'The brass and glass collar is the one I keep opening. It looks as if it sits high on the throat. I have a short neck. Can you add a little drop, or does the length have to stay as it is so the tie holds?',
        createdAt: '2026-10-18T09:12:00.000Z'
      },
      {
        id: 'msg_amara_collar_1',
        authorUserId: amaraId,
        body: 'It sits at the base of the throat, and the tie is what holds it, not the length of the discs. I can add one more row, about two centimetres. The glass beads stay on the lower edge. Tell me if you want a bow at the back or a small brass hook.',
        createdAt: '2026-10-18T16:40:00.000Z'
      },
      {
        id: 'msg_lena_collar_2',
        authorUserId: lenaId,
        body: 'The extra row, and a brass hook. I will wear it over a plain shirt. Thank you for saying how the tie works.',
        createdAt: '2026-10-19T08:05:00.000Z'
      }
    ]
  }
]

export const communityPosts: CommunityPost[] = [
  {
    id: 'post_indigo_vat',
    authorUserId: amaraId,
    tag: 'Skills',
    title: 'Keeping a small indigo vat through the dry months',
    body: 'My vat is a plastic drum behind the stairs, not a pit. When the dye goes pale I feed it banana and a little lime, then I wait a day before I dip anything I care about. The cloth in my listing took three dips and a night on the line. If the vat smells sharp, like ammonia, it is hungry. It is not dead.',
    createdAt: '2026-10-22T07:30:00.000Z',
    replies: [
      {
        id: 'reply_indigo_wanjiru',
        authorUserId: wanjiruId,
        body: 'I wait like that with the ash water for my glaze. The waiting is the part I still rush, and the bowls show it.',
        createdAt: '2026-10-22T18:15:00.000Z'
      }
    ]
  },
  {
    id: 'post_plagwitz_market',
    authorUserId: gretaId,
    tag: 'Opportunities',
    title: 'A spare table at the Plagwitz winter market',
    body: 'The market gave me two tables for 5 and 6 December and I only need one. If you print, mend, or bring small work that can sit on a table, take the other. We split the fee, 40 euro for the weekend. I will be there from eight, with the press in the car.',
    createdAt: '2026-10-28T11:00:00.000Z',
    replies: [
      {
        id: 'reply_market_maren',
        authorUserId: marenId,
        body: 'I can bring jars and a few bowls. I will write which train I am on.',
        createdAt: '2026-10-29T08:20:00.000Z'
      }
    ]
  },
  {
    id: 'post_aunt_cowries',
    authorUserId: achiengId,
    tag: 'Stories',
    title: 'The cowries were already in the tin',
    body: 'I was going to buy shells at the market. My aunt opened a tin she had kept since her wedding and told me to use those first. The ear cuffs start with her shells. When the tin is empty I will stop that shape. I do not want new shells standing in for hers.',
    createdAt: '2026-11-02T06:45:00.000Z',
    replies: []
  },
  {
    id: 'post_spoon_oil',
    authorUserId: njeriId,
    tag: 'Questions',
    title: 'Which oil stays sound on a spoon in a warm kitchen?',
    body: 'I have been wiping the olive spoons with a light mineral oil. After a month in Nakuru it goes sticky, and people do wash them. What are you using that stays food-safe and does not soften or smell?',
    createdAt: '2026-11-06T09:10:00.000Z',
    replies: [
      {
        id: 'reply_oil_elise',
        authorUserId: eliseId,
        body: 'I use a boiled linseed, thinned with a little citrus oil, and I leave the spoon a week before it leaves the bench. It still wants a fresh wipe after a hard wash.',
        createdAt: '2026-11-06T14:05:00.000Z'
      },
      {
        id: 'reply_oil_maren',
        authorUserId: marenId,
        body: 'On boards I rub walnut oil and keep them out of the sun. Sticky usually means the oil was left sitting on the surface instead of being wiped back.',
        createdAt: '2026-11-07T07:40:00.000Z'
      }
    ]
  }
]

export const seed = {
  users,
  makerProfiles,
  products,
  inquiries,
  communityPosts
}
