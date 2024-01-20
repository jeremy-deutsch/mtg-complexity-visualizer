import allSets from "./allSets.json" with { type: "json" };
import fs from "node:fs/promises";

/** @typedef {{
 * 		name: string
 *		oracle_text?: string
 *		rarity: "common" | "uncommon" | "special" | "rare" | "mythic" | "bonus"
 *		card_faces?: Array<{
 *			oracle_text?: string
 *		}>
 * 	}} Card */

/** @type {Array<{
 * 		name: string;
 * 		code: string;
 *		averageWordCounts: {
 * 			common: number;
 * 			uncommon: number;
 * 			rare: number;
 * 			overall: number;
 *		},
 *		averageWordCountsWithReminderText: {
 * 			common: number;
 * 			uncommon: number;
 * 			rare: number;
 * 			overall: number;
 *		}
 * 	}>} */
const setAttributes = [];

const reminderTextRegex = /\(.*\)/g;

const whitespaceRegex = /\s+/g;

/** @typedef {{
			name: string;
			rarity: "common" | "uncommon" | "special" | "rare" | "mythic" | "bonus";
			wordCountWithReminderText: number;
			wordCountWithoutReminderText: number;
		}} CardDetails */

/**
 * @param {CardDetails[]} array
 * @param {(details: CardDetails) => boolean} test
 * @param {(details: CardDetails) => number} value
 */
function averageWhere(array, test, value) {
	let count = 0;
	let total = 0;
	for (const detail of array) {
		if (test(detail)) {
			count++;
			total += value(detail);
		}
	}

	return total / count;
}

for (const set of allSets.data) {
	if (set.set_type === "core" || set.set_type === "expansion") {
		console.log(`Loading data for ${set.name}`);
		const url = new URL("https://api.scryfall.com/cards/search");
		url.searchParams.set("q", `e:${set.code}+is:booster`);
		const json = await (await fetch(url)).json();

		/** @type {Card[]} */
		const cards = json.data;

		const cardDetails = cards.map((card) => {
			const totalOracleText =
				card.oracle_text ??
				card.card_faces?.map((face) => face.oracle_text ?? "").join(" ") ??
				"";

			const oracleTextWithoutReminderText = totalOracleText.replaceAll(
				reminderTextRegex,
				"",
			);

			return {
				name: card.name,
				rarity: card.rarity,
				wordCountWithReminderText: totalOracleText
					.split(whitespaceRegex)
					.filter(Boolean).length,
				wordCountWithoutReminderText: oracleTextWithoutReminderText
					.split(whitespaceRegex)
					.filter(Boolean).length,
			};
		});

		setAttributes.push({
			name: set.name,
			code: set.code,
			averageWordCounts: {
				common: averageWhere(
					cardDetails,
					(details) => details.rarity === "common",
					(details) => details.wordCountWithoutReminderText,
				),
				uncommon: averageWhere(
					cardDetails,
					(details) => details.rarity === "uncommon",
					(details) => details.wordCountWithoutReminderText,
				),
				rare: averageWhere(
					cardDetails,
					(details) => details.rarity === "rare" || details.rarity === "mythic",
					(details) => details.wordCountWithoutReminderText,
				),
				overall: averageWhere(
					cardDetails,
					() => true,
					(details) => details.wordCountWithoutReminderText,
				),
			},
			averageWordCountsWithReminderText: {
				common: averageWhere(
					cardDetails,
					(details) => details.rarity === "common",
					(details) => details.wordCountWithReminderText,
				),
				uncommon: averageWhere(
					cardDetails,
					(details) => details.rarity === "uncommon",
					(details) => details.wordCountWithReminderText,
				),
				rare: averageWhere(
					cardDetails,
					(details) => details.rarity === "rare" || details.rarity === "mythic",
					(details) => details.wordCountWithReminderText,
				),
				overall: averageWhere(
					cardDetails,
					() => true,
					(details) => details.wordCountWithReminderText,
				),
			},
		});

		await new Promise((res) => setTimeout(res, Math.random() * 700 + 300));
	}
}

await fs.writeFile("./src/lib/setData.json", JSON.stringify(setAttributes));
console.log("done!");

const huatli = {
	object: "card",
	id: "57df2563-18d4-4526-a8bc-0c114e6fd4d9",
	oracle_id: "2e6ed3e6-d2b8-4b75-b7e1-0773da4987a1",
	multiverse_ids: [636904, 636905],
	mtgo_id: 118204,
	arena_id: 87344,
	tcgplayer_id: 517518,
	cardmarket_id: 734658,
	name: "Huatli, Poet of Unity // Roar of the Fifth People",
	lang: "en",
	released_at: "2023-11-17",
	uri: "https://api.scryfall.com/cards/57df2563-18d4-4526-a8bc-0c114e6fd4d9",
	scryfall_uri:
		"https://scryfall.com/card/lci/189/huatli-poet-of-unity-roar-of-the-fifth-people?utm_source=api",
	layout: "transform",
	highres_image: true,
	image_status: "highres_scan",
	cmc: 3.0,
	type_line: "Legendary Creature — Human Warrior Bard // Enchantment — Saga",
	color_identity: ["G", "R", "W"],
	keywords: ["Transform"],
	produced_mana: ["G", "R", "W"],
	card_faces: [
		{
			object: "card_face",
			name: "Huatli, Poet of Unity",
			mana_cost: "{2}{G}",
			type_line: "Legendary Creature — Human Warrior Bard",
			oracle_text:
				"When Huatli, Poet of Unity enters the battlefield, search your library for a basic land card, reveal it, put it into your hand, then shuffle.\n{3}{R/W}{R/W}: Exile Huatli, then return her to the battlefield transformed under her owner's control. Activate only as a sorcery.",
			colors: ["G"],
			power: "2",
			toughness: "3",
			watermark: "desparked",
			artist: "Tyler Jacobson",
			artist_id: "522af130-8db4-4b4b-950c-6e2b246339cf",
			illustration_id: "00b0d676-6d9a-4b6d-94e1-e3ba39648ae8",
			image_uris: {
				small:
					"https://cards.scryfall.io/small/front/5/7/57df2563-18d4-4526-a8bc-0c114e6fd4d9.jpg?1699044416",
				normal:
					"https://cards.scryfall.io/normal/front/5/7/57df2563-18d4-4526-a8bc-0c114e6fd4d9.jpg?1699044416",
				large:
					"https://cards.scryfall.io/large/front/5/7/57df2563-18d4-4526-a8bc-0c114e6fd4d9.jpg?1699044416",
				png: "https://cards.scryfall.io/png/front/5/7/57df2563-18d4-4526-a8bc-0c114e6fd4d9.png?1699044416",
				art_crop:
					"https://cards.scryfall.io/art_crop/front/5/7/57df2563-18d4-4526-a8bc-0c114e6fd4d9.jpg?1699044416",
				border_crop:
					"https://cards.scryfall.io/border_crop/front/5/7/57df2563-18d4-4526-a8bc-0c114e6fd4d9.jpg?1699044416",
			},
		},
		{
			object: "card_face",
			name: "Roar of the Fifth People",
			flavor_name: "",
			mana_cost: "",
			type_line: "Enchantment — Saga",
			oracle_text:
				"(As this Saga enters and after your draw step, add a lore counter. Sacrifice after IV.)\nI — Create two 3/3 green Dinosaur creature tokens.\nII — Roar of the Fifth People gains \"Creatures you control have '{T}: Add {R}, {G}, or {W}.'\"\nIII — Search your library for a Dinosaur card, reveal it, put it into your hand, then shuffle.\nIV — Dinosaurs you control gain double strike and trample until end of turn.",
			colors: ["G", "R", "W"],
			color_indicator: ["G", "R", "W"],
			artist: "Tyler Jacobson",
			artist_id: "522af130-8db4-4b4b-950c-6e2b246339cf",
			illustration_id: "1392eb92-c780-43e7-b727-b401f9fa53a8",
			image_uris: {
				small:
					"https://cards.scryfall.io/small/back/5/7/57df2563-18d4-4526-a8bc-0c114e6fd4d9.jpg?1699044416",
				normal:
					"https://cards.scryfall.io/normal/back/5/7/57df2563-18d4-4526-a8bc-0c114e6fd4d9.jpg?1699044416",
				large:
					"https://cards.scryfall.io/large/back/5/7/57df2563-18d4-4526-a8bc-0c114e6fd4d9.jpg?1699044416",
				png: "https://cards.scryfall.io/png/back/5/7/57df2563-18d4-4526-a8bc-0c114e6fd4d9.png?1699044416",
				art_crop:
					"https://cards.scryfall.io/art_crop/back/5/7/57df2563-18d4-4526-a8bc-0c114e6fd4d9.jpg?1699044416",
				border_crop:
					"https://cards.scryfall.io/border_crop/back/5/7/57df2563-18d4-4526-a8bc-0c114e6fd4d9.jpg?1699044416",
			},
		},
	],
	all_parts: [
		{
			object: "related_card",
			id: "2bbb7151-cf71-49bc-8d99-b0230d5465e5",
			component: "token",
			name: "Dinosaur",
			type_line: "Token Creature — Dinosaur",
			uri: "https://api.scryfall.com/cards/2bbb7151-cf71-49bc-8d99-b0230d5465e5",
		},
		{
			object: "related_card",
			id: "3cdeebd8-28d4-42a5-9a99-3c72771359ea",
			component: "combo_piece",
			name: "Huatli, Poet of Unity // Roar of the Fifth People",
			type_line:
				"Legendary Creature — Human Warrior Bard // Enchantment — Saga",
			uri: "https://api.scryfall.com/cards/3cdeebd8-28d4-42a5-9a99-3c72771359ea",
		},
	],
	legalities: {
		standard: "legal",
		future: "legal",
		historic: "legal",
		timeless: "legal",
		gladiator: "legal",
		pioneer: "legal",
		explorer: "legal",
		modern: "legal",
		legacy: "legal",
		pauper: "not_legal",
		vintage: "legal",
		penny: "not_legal",
		commander: "legal",
		oathbreaker: "legal",
		brawl: "legal",
		historicbrawl: "legal",
		alchemy: "legal",
		paupercommander: "not_legal",
		duel: "legal",
		oldschool: "not_legal",
		premodern: "not_legal",
		predh: "not_legal",
	},
	games: ["paper", "arena", "mtgo"],
	reserved: false,
	foil: true,
	nonfoil: true,
	finishes: ["nonfoil", "foil"],
	oversized: false,
	promo: false,
	reprint: false,
	variation: false,
	set_id: "70169a6e-89d1-4a3a-aef7-3152958d55ac",
	set: "lci",
	set_name: "The Lost Caverns of Ixalan",
	set_type: "expansion",
	set_uri: "https://api.scryfall.com/sets/70169a6e-89d1-4a3a-aef7-3152958d55ac",
	set_search_uri:
		"https://api.scryfall.com/cards/search?order=set&q=e%3Alci&unique=prints",
	scryfall_set_uri: "https://scryfall.com/sets/lci?utm_source=api",
	rulings_uri:
		"https://api.scryfall.com/cards/57df2563-18d4-4526-a8bc-0c114e6fd4d9/rulings",
	prints_search_uri:
		"https://api.scryfall.com/cards/search?order=released&q=oracleid%3A2e6ed3e6-d2b8-4b75-b7e1-0773da4987a1&unique=prints",
	collector_number: "189",
	digital: false,
	rarity: "mythic",
	artist: "Tyler Jacobson",
	artist_ids: ["522af130-8db4-4b4b-950c-6e2b246339cf"],
	border_color: "black",
	frame: "2015",
	frame_effects: ["legendary"],
	security_stamp: "oval",
	full_art: false,
	textless: false,
	booster: true,
	story_spotlight: false,
	edhrec_rank: 9157,
	prices: {
		usd: "1.49",
		usd_foil: "1.88",
		usd_etched: null,
		eur: "1.84",
		eur_foil: "3.44",
		tix: "0.66",
	},
	related_uris: {
		gatherer:
			"https://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=636904&printed=false",
		tcgplayer_infinite_articles:
			"https://tcgplayer.pxf.io/c/4931599/1830156/21018?subId1=api&trafcat=infinite&u=https%3A%2F%2Finfinite.tcgplayer.com%2Fsearch%3FcontentMode%3Darticle%26game%3Dmagic%26partner%3Dscryfall%26q%3DHuatli%252C%2BPoet%2Bof%2BUnity%2B%252F%252F%2BRoar%2Bof%2Bthe%2BFifth%2BPeople",
		tcgplayer_infinite_decks:
			"https://tcgplayer.pxf.io/c/4931599/1830156/21018?subId1=api&trafcat=infinite&u=https%3A%2F%2Finfinite.tcgplayer.com%2Fsearch%3FcontentMode%3Ddeck%26game%3Dmagic%26partner%3Dscryfall%26q%3DHuatli%252C%2BPoet%2Bof%2BUnity%2B%252F%252F%2BRoar%2Bof%2Bthe%2BFifth%2BPeople",
		edhrec: "https://edhrec.com/route/?cc=Huatli%2C+Poet+of+Unity",
	},
	purchase_uris: {
		tcgplayer:
			"https://tcgplayer.pxf.io/c/4931599/1830156/21018?subId1=api&u=https%3A%2F%2Fwww.tcgplayer.com%2Fproduct%2F517518%3Fpage%3D1",
		cardmarket:
			"https://www.cardmarket.com/en/Magic/Products/Search?referrer=scryfall&searchString=Huatli%2C+Poet+of+Unity&utm_campaign=card_prices&utm_medium=text&utm_source=scryfall",
		cardhoarder:
			"https://www.cardhoarder.com/cards/118204?affiliate_id=scryfall&ref=card-profile&utm_campaign=affiliate&utm_medium=card&utm_source=scryfall",
	},
};
