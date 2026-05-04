/**
 * Startup Dashboard Extension
 *
 * Viser et velkomst-dashboard ved oppstart med:
 * - Gjeldende modell
 * - Antall aktive verktøy og extension-kommandoer
 * - Et tilfeldig tips
 * - De 3 siste sessions
 *
 * Dashboardet forsvinner automatisk når du sender første melding.
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { SessionManager } from "@mariozechner/pi-coding-agent";

const TIPS = [
	"Bruk /tree for å navigere session-historikken og hoppe mellom branches",
	"Ctrl+P bytter mellom modeller raskt (sett opp scoped models med /scoped-models)",
	"/compact frigjør kontekstplass uten å miste historikken – full logg er alltid i filen",
	"Skriv @filnavn for å søke opp og inkludere filer direkte i prompten",
	"!kommando kjører bash og sender output til modellen – !!kommando kjører uten å sende",
	"/fork lager en ny session fra et tidligere punkt i samtalen",
	"/clone dupliserer gjeldende branch til en ny session-fil",
	"Shift+Tab sykler gjennom thinking-nivåer (off → minimal → low → medium → high)",
	"Ctrl+O kollapser/ekspanderer tool-output i meldingsvisningen",
	"/share laster opp sessionen som en privat GitHub gist med delbar lenke",
	"Bruk /name <navn> for å gi sessionen et beskrivende navn – vises i /resume",
	"Esc to ganger åpner /tree – rask måte å hoppe tilbake i historikken",
	"Bruk @screenshot.png (Ctrl+V for å lime inn) for å sende bilder til modellen",
	"/export lagrer sessionen som en HTML-fil du kan dele eller arkivere",
	"Sett opp AGENTS.md i prosjektet ditt for kontekstfiler pi laster automatisk",
];

function formatDate(date: Date): string {
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffDays === 0) return "i dag";
	if (diffDays === 1) return "i går";
	if (diffDays < 7) return `${diffDays}d siden`;
	return date.toLocaleDateString("nb-NO", { month: "short", day: "numeric" });
}

function truncate(str: string, maxLen: number): string {
	if (str.length <= maxLen) return str;
	return str.slice(0, maxLen - 1) + "…";
}

export default function (_pi: ExtensionAPI) {
	// Startup-widget er erstattet av welcome.ts-popupen.
}
