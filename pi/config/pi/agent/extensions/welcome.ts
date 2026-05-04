/**
 * Welcome splash screen extension for pi.
 * Shows a compact two-column popup at startup and via /welcome.
 */

import type { ExtensionAPI, ExtensionContext, Theme } from "@mariozechner/pi-coding-agent";
import { SessionManager } from "@mariozechner/pi-coding-agent";
import { matchesKey, truncateToWidth, visibleWidth } from "@mariozechner/pi-tui";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";

// ─── helpers ──────────────────────────────────────────────────────────────────

function relativeTime(date: Date): string {
	const diff = Date.now() - date.getTime();
	const secs  = Math.floor(diff / 1000);
	const mins  = Math.floor(secs  / 60);
	const hours = Math.floor(mins  / 60);
	const days  = Math.floor(hours / 24);
	if (secs  <  5) return "just now";
	if (secs  < 60) return `${secs}s ago`;
	if (mins  < 60) return `${mins}m ago`;
	if (hours < 24) return `${hours}h ago`;
	return `${days}d ago`;
}

/** Pad a (possibly ANSI-coloured) string to exactly `width` visible chars. */
function padToWidth(s: string, width: number): string {
	const vw = visibleWidth(s);
	if (vw >= width) return truncateToWidth(s, width);
	return s + " ".repeat(width - vw);
}

/** Centre a string (with known visible width `vw`) inside `colWidth`. */
function centreIn(s: string, vw: number, colWidth: number): string {
	const pad = Math.max(0, Math.floor((colWidth - vw) / 2));
	return " ".repeat(pad) + s;
}

function getPiVersion(): string {
	try {
		const pkgPath = path.join(
			path.dirname(require.resolve("@mariozechner/pi-coding-agent")),
			"../../package.json",
		);
		return (JSON.parse(fs.readFileSync(pkgPath, "utf-8")).version as string) ?? "?";
	} catch {
		return "?";
	}
}

function countContextFiles(cwd: string): number {
	const seen = new Set<string>();
	let dir = cwd;
	while (true) {
		const candidate = path.join(dir, "AGENTS.md");
		if (fs.existsSync(candidate)) seen.add(candidate);
		const parent = path.dirname(dir);
		if (parent === dir) break;
		dir = parent;
	}
	const global = path.join(os.homedir(), ".pi", "agent", "AGENTS.md");
	if (fs.existsSync(global)) seen.add(global);
	return seen.size;
}

function sessionDisplayName(s: { name?: string; path: string; firstMessage: string }): string {
	if (s.name) return s.name;
	const clean = s.firstMessage.replace(/\s+/g, " ").trim();
	if (clean.length > 0) return clean.slice(0, 18) + (clean.length > 18 ? "…" : "");
	const base  = path.basename(s.path, ".jsonl");
	const parts = base.split("_");
	return parts[1]?.slice(0, 8) ?? base.slice(0, 8);
}

// ─── π logo ───────────────────────────────────────────────────────────────────

/**
 * Renders a block-art π logo.
 * Each "pixel" = "██" (2 visible chars) so logo visible width = cols × 2.
 * Returns ANSI-coloured lines (no leading whitespace – caller centres them).
 */
function buildLogo(): { lines: string[]; visW: number } {
	// 8-pixel wide shape: top bar + two legs with a 2-pixel gap
	const shape = [
		[1, 1, 1, 1, 1, 1, 1, 1],
		[0, 1, 1, 0, 0, 1, 1, 0],
		[0, 1, 1, 0, 0, 1, 1, 0],
		[0, 1, 1, 0, 0, 1, 1, 0],
		[0, 1, 1, 0, 0, 1, 1, 0],
	];
	const cols = shape[0].length;
	const rows = shape.length;
	const visW = cols * 2;

	// Gradient: coral-pink → electric-cyan (diagonal, top-left → bottom-right)
	const fR = 255, fG = 100, fB = 180;   // #ff64b4
	const tR =  80, tG = 230, tB = 255;   // #50e6ff

	const lines = shape.map((row, y) =>
		row.map((cell, x) => {
			if (!cell) return "  ";
			const t = (x / (cols - 1) + y / (rows - 1)) / 2;
			const r = Math.round(fR + (tR - fR) * t);
			const g = Math.round(fG + (tG - fG) * t);
			const b = Math.round(fB + (tB - fB) * t);
			return `\x1b[38;2;${r};${g};${b}m██\x1b[0m`;
		}).join("")
	);

	return { lines, visW };
}

// ─── popup ───────────────────────────────────────────────────────────────────

interface WelcomeProps {
	theme: Theme;
	done: () => void;
	version: string;
	modelName: string;
	provider: string;
	contextFileCount: number;
	extensionCount: number;
	skillCount: number;
	templateCount: number;
	sessions: Array<{ name?: string; path: string; firstMessage: string; modified: Date }>;
}

class WelcomePopup {
	private cache?: { width: number; lines: string[] };
	private logo = buildLogo();

	constructor(private p: WelcomeProps) {}

	handleInput(data: string): void {
		if (matchesKey(data, "return") || matchesKey(data, "escape") || matchesKey(data, "ctrl+c")) {
			this.p.done();
		}
	}

	invalidate(): void { this.cache = undefined; }

	render(width: number): string[] {
		if (this.cache?.width === width) return this.cache.lines;
		const lines = this.build(width);
		this.cache = { width, lines };
		return lines;
	}

	// ── main frame ─────────────────────────────────────────────────────────────

	private build(W: number): string[] {
		const { theme: th, version } = this.p;
		const bd = (s: string) => th.fg("border", s);

		const innerW = W - 2;                              // strip two │ borders
		const leftW  = Math.floor(innerW * 0.42);
		const rightW = innerW - leftW - 1;                 // -1 for centre divider

		const left  = this.buildLeft(leftW);
		const right = this.buildRight(rightW);

		const bodyH = Math.max(left.length, right.length);
		while (left.length  < bodyH) left.push("");
		while (right.length < bodyH) right.push("");

		const out: string[] = [];

		// title border
		const title  = ` pi agent v${version} `;
		const tVW    = visibleWidth(title);
		const spare  = innerW - tVW;
		out.push(
			bd("╭") + bd("─".repeat(Math.floor(spare / 2))) +
			th.fg("accent", title) +
			bd("─".repeat(Math.ceil(spare / 2))) + bd("╮"),
		);

		// body
		for (let i = 0; i < bodyH; i++) {
			out.push(bd("│") + padToWidth(left[i]!, leftW) + bd("│") + padToWidth(right[i]!, rightW) + bd("│"));
		}

		// footer
		const hint   = " Press Enter to continue ";
		const hVW    = visibleWidth(hint);
		const hSpare = innerW - hVW;
		out.push(
			bd("├") + bd("─".repeat(Math.floor(hSpare / 2))) +
			th.fg("dim", hint) +
			bd("─".repeat(Math.ceil(hSpare / 2))) + bd("┤"),
		);

		out.push(bd("╰") + bd("─".repeat(innerW)) + bd("╯"));
		return out;
	}

	// ── left column ────────────────────────────────────────────────────────────

	private buildLeft(W: number): string[] {
		const { theme: th, modelName, provider } = this.p;
		const { lines: logoLines, visW: logoVW } = this.logo;
		const lines: string[] = [];

		const c = (s: string, vw: number) => truncateToWidth(centreIn(s, vw, W), W);

		lines.push("");
		const welcomeText = "Welcome back!";
		lines.push(c(th.fg("accent", welcomeText), visibleWidth(welcomeText)));
		lines.push("");

		for (const ll of logoLines) {
			lines.push(c(ll, logoVW));
		}

		lines.push("");

		// Strip "(latest)" / "(latest-X)" suffix to keep it short
		const shortModel = modelName.replace(/\s*\([^)]*\)\s*$/, "");
		const mVW        = Math.min(visibleWidth(shortModel), W);
		const mTrunc     = truncateToWidth(shortModel, W);
		lines.push(c(th.bold(mTrunc), mVW));

		const pVW = Math.min(visibleWidth(provider), W);
		lines.push(c(th.fg("muted", truncateToWidth(provider, W)), pVW));
		lines.push("");

		return lines;
	}

	// ── right column ───────────────────────────────────────────────────────────

	private buildRight(W: number): string[] {
		const { theme: th, contextFileCount, extensionCount, skillCount, templateCount, sessions } = this.p;
		const div    = th.fg("border", "─".repeat(W));
		const check  = th.fg("success", "✓");
		const bullet = th.fg("accent",  "•");
		const t      = (s: string) => truncateToWidth(s, W);
		const lines: string[] = [];

		// Tips
		lines.push("");
		lines.push(t(` ${th.fg("warning", "Tips")}`));
		lines.push(t(`  ${th.fg("muted", "?")}  keyboard shortcuts`));
		lines.push(t(`  ${th.fg("muted", "/")}  commands`));
		lines.push(t(`  ${th.fg("muted", "!")}  run bash`));
		lines.push(div);

		// Loaded
		lines.push(t(` ${th.fg("warning", "Loaded")}`));
		lines.push(t(`  ${check} ${contextFileCount} context files`));
		lines.push(t(`  ${check} ${extensionCount} extensions`));
		lines.push(t(`  ${check} ${skillCount} skills`));
		lines.push(t(`  ${check} ${templateCount} prompt templates`));
		lines.push(div);

		// Recent sessions
		lines.push(t(` ${th.fg("warning", "Recent sessions")}`));
		if (sessions.length === 0) {
			lines.push(t(`  ${th.fg("dim", "no sessions yet")}`));
		} else {
			for (const s of sessions.slice(0, 3)) {
				const name    = sessionDisplayName(s);
				const timeStr = th.fg("dim", `(${relativeTime(s.modified)})`);
				const timeVW  = visibleWidth(timeStr);
				const maxName = Math.max(2, W - 4 - timeVW - 1);
				const n       = truncateToWidth(name, maxName);
				const nVW     = visibleWidth(n);
				const gap     = Math.max(1, W - 4 - nVW - timeVW);
				lines.push(t(`  ${bullet} ${n}${" ".repeat(gap)}${timeStr}`));
			}
		}
		lines.push("");

		return lines;
	}
}

// ─── extension entry ─────────────────────────────────────────────────────────

export default function (pi: ExtensionAPI) {
	async function showWelcome(ctx: ExtensionContext) {
		const model    = ctx.model;
		const version  = getPiVersion();

		const commands      = pi.getCommands();
		const skillCount    = commands.filter(c => c.source === "skill").length;
		const templateCount = commands.filter(c => c.source === "prompt").length;

		const extFiles = new Set<string>();
		for (const t of pi.getAllTools())
			if (t.sourceInfo.source !== "builtin" && t.sourceInfo.source !== "sdk")
				extFiles.add(t.sourceInfo.path);
		for (const c of commands.filter(c => c.source === "extension"))
			extFiles.add(c.sourceInfo.path);

		const sessions = await SessionManager.list(ctx.cwd);

		await ctx.ui.custom<void>(
			(_tui, theme, _kb, done) =>
				new WelcomePopup({
					theme, done, version,
					modelName:        model ? (model.name ?? model.id) : "unknown",
					provider:         model?.provider ?? "unknown",
					contextFileCount: countContextFiles(ctx.cwd),
					extensionCount:   extFiles.size,
					skillCount,
					templateCount,
					sessions:         sessions.slice(0, 3),
				}),
			{
				overlay: true,
				overlayOptions: { anchor: "center", width: 44, minWidth: 44 },
			},
		);
	}

	pi.on("session_start", async (event, ctx) => {
		if (event.reason === "startup") await showWelcome(ctx);
	});

	pi.registerCommand("welcome", {
		description: "Show the welcome screen",
		handler: async (_args, ctx) => showWelcome(ctx),
	});
}
