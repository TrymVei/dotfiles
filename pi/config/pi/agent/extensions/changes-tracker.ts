/**
 * Changes Tracker Extension
 *
 * Tracks all file modifications (write, edit, bash) made by the AI.
 * /changes  → scrollable list, press Enter on a row to see the full diff/content.
 * /changes-clear → clear history
 */

import type { ExtensionAPI, ExtensionContext, Theme } from "@mariozechner/pi-coding-agent";
import { isEditToolResult, isToolCallEventType } from "@mariozechner/pi-coding-agent";
import { matchesKey, truncateToWidth, wrapTextWithAnsi } from "@mariozechner/pi-tui";

// ─── Types ───────────────────────────────────────────────────────────────────

type ChangeKind = "write" | "edit" | "bash";

interface Change {
	kind: ChangeKind;
	target: string; // file path or short command
	turnIndex: number;
	timestamp: number;
	toolCallId: string;
	// kind-specific payloads (captured at call time)
	writeContent?: string;
	editEdits?: Array<{ oldText: string; newText: string }>;
	editDiff?: string; // populated later from tool_result
	bashCommand?: string; // full command
}

// ─── Detail component ─────────────────────────────────────────────────────────

class DetailComponent {
	private lines: string[];
	private theme: Theme;
	private onClose: () => void;
	private requestRender: () => void;
	private scrollOffset = 0;
	private cachedWidth?: number;
	private cachedLines?: string[];

	constructor(change: Change, theme: Theme, onClose: () => void, requestRender: () => void) {
		this.theme = theme;
		this.onClose = onClose;
		this.requestRender = requestRender;
		this.lines = DetailComponent.buildLines(change);
	}

	private static buildLines(change: Change): string[] {
		const lines: string[] = [];
		if (change.kind === "write" && change.writeContent !== undefined) {
			lines.push(...change.writeContent.split("\n"));
		} else if (change.kind === "edit") {
			if (change.editDiff) {
				lines.push(...change.editDiff.split("\n"));
			} else if (change.editEdits) {
				for (const [i, e] of change.editEdits.entries()) {
					if (i > 0) lines.push("", "──────────────────────────────────────", "");
					lines.push(`── Edit ${i + 1} ──`);
					lines.push("  oldText:");
					lines.push(...e.oldText.split("\n").map((l) => "  " + l));
					lines.push("  newText:");
					lines.push(...e.newText.split("\n").map((l) => "  " + l));
				}
			}
		} else if (change.kind === "bash" && change.bashCommand) {
			lines.push(...change.bashCommand.split("\n"));
		}
		return lines;
	}

	handleInput(data: string): void {
		if (matchesKey(data, "escape") || matchesKey(data, "ctrl+c") || matchesKey(data, "q")) {
			this.onClose();
		} else if (matchesKey(data, "up") || matchesKey(data, "k")) {
			this.scrollOffset = Math.max(0, this.scrollOffset - 1);
			this.invalidate();
			this.requestRender();
		} else if (matchesKey(data, "down") || matchesKey(data, "j")) {
			this.scrollOffset = Math.min(Math.max(0, this.lines.length - 1), this.scrollOffset + 1);
			this.invalidate();
			this.requestRender();
		} else if (matchesKey(data, "g") || matchesKey(data, "home")) {
			this.scrollOffset = 0;
			this.invalidate();
			this.requestRender();
		} else if (matchesKey(data, "G") || matchesKey(data, "end")) {
			this.scrollOffset = Math.max(0, this.lines.length - 1);
			this.invalidate();
			this.requestRender();
		}
	}

	render(width: number): string[] {
		if (this.cachedLines && this.cachedWidth === width) return this.cachedLines;

		const th = this.theme;
		const out: string[] = [];

		out.push("");
		const title = th.fg("accent", " Detail ");
		out.push(truncateToWidth(th.fg("borderMuted", "───") + title + th.fg("borderMuted", "─".repeat(Math.max(0, width - 11))), width));
		out.push("");

		const contentWidth = width - 2;
		const visibleLines = this.lines.slice(this.scrollOffset);

		for (const line of visibleLines) {
			// Colour diff lines if they look like a unified diff
			let rendered = line;
			if (line.startsWith("+") && !line.startsWith("+++")) rendered = th.fg("success", line);
			else if (line.startsWith("-") && !line.startsWith("---")) rendered = th.fg("error", line);
			else if (line.startsWith("@@")) rendered = th.fg("accent", line);
			else rendered = th.fg("muted", line);

			for (const wrapped of wrapTextWithAnsi(rendered, contentWidth)) {
				out.push("  " + wrapped);
			}
		}

		if (this.scrollOffset > 0) {
			out.push("");
			out.push(truncateToWidth("  " + th.fg("dim", `↑ ${this.scrollOffset} lines above`), width));
		}

		out.push("");
		out.push(truncateToWidth("  " + th.fg("dim", "↑/↓  k/j  scroll   g/G  top/bottom   q/Esc  back"), width));
		out.push("");

		this.cachedWidth = width;
		this.cachedLines = out;
		return out;
	}

	invalidate(): void {
		this.cachedWidth = undefined;
		this.cachedLines = undefined;
	}
}

// ─── List component ───────────────────────────────────────────────────────────

class ChangesListComponent {
	private changes: Change[];
	private theme: Theme;
	private onClose: () => void;
	private onSelect: (change: Change) => void;
	private requestRender: () => void;
	private selectedIndex = 0;
	private cachedWidth?: number;
	private cachedLines?: string[];

	constructor(
		changes: Change[],
		theme: Theme,
		onClose: () => void,
		onSelect: (change: Change) => void,
		requestRender: () => void,
	) {
		this.changes = changes;
		this.theme = theme;
		this.onClose = onClose;
		this.onSelect = onSelect;
		this.requestRender = requestRender;
		// Start at the last change
		this.selectedIndex = Math.max(0, changes.length - 1);
	}

	handleInput(data: string): void {
		if (matchesKey(data, "escape") || matchesKey(data, "ctrl+c") || matchesKey(data, "q")) {
			this.onClose();
		} else if (matchesKey(data, "up") || matchesKey(data, "k")) {
			this.selectedIndex = Math.max(0, this.selectedIndex - 1);
			this.invalidate();
			this.requestRender();
		} else if (matchesKey(data, "down") || matchesKey(data, "j")) {
			this.selectedIndex = Math.min(this.changes.length - 1, this.selectedIndex + 1);
			this.invalidate();
			this.requestRender();
		} else if (matchesKey(data, "enter")) {
			if (this.changes.length > 0) {
				this.onSelect(this.changes[this.selectedIndex]);
			}
		}
	}

	render(width: number): string[] {
		if (this.cachedLines && this.cachedWidth === width) return this.cachedLines;

		const th = this.theme;
		const out: string[] = [];

		out.push("");
		const title = th.fg("accent", " Changes ");
		const pad = "─".repeat(Math.max(0, width - 11));
		out.push(truncateToWidth(th.fg("borderMuted", "───") + title + th.fg("borderMuted", pad), width));
		out.push("");

		if (this.changes.length === 0) {
			out.push(truncateToWidth("  " + th.fg("dim", "No changes recorded yet."), width));
		} else {
			const count = th.fg("muted", `${this.changes.length} change${this.changes.length !== 1 ? "s" : ""}`);
			out.push(truncateToWidth("  " + count, width));
			out.push("");

			for (const [i, change] of this.changes.entries()) {
				const isSelected = i === this.selectedIndex;
				const kindColor = change.kind === "write" ? "success" : change.kind === "edit" ? "accent" : "warning";
				const kindBadge = th.fg(kindColor, th.bold(`[${change.kind.padEnd(5)}]`));
				const turnBadge = th.fg("dim", `T${change.turnIndex}`);
				const target = isSelected ? th.fg("text", th.bold(change.target)) : th.fg("text", change.target);
				const time = th.fg("dim", new Date(change.timestamp).toLocaleTimeString());
				const cursor = isSelected ? th.fg("accent", "▶ ") : "  ";

				out.push(truncateToWidth(`${cursor}${kindBadge} ${turnBadge} ${target}  ${time}`, width));
			}
		}

		out.push("");
		out.push(
			truncateToWidth(
				"  " + th.fg("dim", "↑/↓  k/j  navigate   Enter  view detail   q/Esc  close"),
				width,
			),
		);
		out.push("");

		this.cachedWidth = width;
		this.cachedLines = out;
		return out;
	}

	invalidate(): void {
		this.cachedWidth = undefined;
		this.cachedLines = undefined;
	}
}

// ─── Extension ───────────────────────────────────────────────────────────────

export default function (pi: ExtensionAPI) {
	const changes: Change[] = [];
	let currentTurn = 0;

	pi.on("turn_start", async (event) => {
		currentTurn = event.turnIndex;
	});

	// Capture changes at call time
	pi.on("tool_call", async (event, ctx) => {
		if (isToolCallEventType("write", event)) {
			changes.push({
				kind: "write",
				target: event.input.path ?? "(unknown)",
				turnIndex: currentTurn,
				timestamp: Date.now(),
				toolCallId: event.toolCallId,
				writeContent: event.input.content,
			});
			updateStatusWidget(ctx, changes);
		}

		if (isToolCallEventType("edit", event)) {
			changes.push({
				kind: "edit",
				target: event.input.path ?? "(unknown)",
				turnIndex: currentTurn,
				timestamp: Date.now(),
				toolCallId: event.toolCallId,
				editEdits: event.input.edits,
			});
			updateStatusWidget(ctx, changes);
		}

		if (isToolCallEventType("bash", event)) {
			const cmd = event.input.command ?? "";
			const looksLikeChange =
				/\b(mkdir|touch|cp|mv|rm|chmod|chown|tee|sed\s+-i|awk|git\s+(add|commit|checkout|reset|rm|mv))\b|>>?/.test(
					cmd,
				);
			if (looksLikeChange) {
				const short = cmd.replace(/\s+/g, " ").slice(0, 80) + (cmd.length > 80 ? "…" : "");
				changes.push({
					kind: "bash",
					target: short,
					turnIndex: currentTurn,
					timestamp: Date.now(),
					toolCallId: event.toolCallId,
					bashCommand: cmd,
				});
				updateStatusWidget(ctx, changes);
			}
		}
	});

	// Attach unified diff from edit tool result
	pi.on("tool_result", async (event) => {
		if (isEditToolResult(event)) {
			const entry = changes.findLast((c) => c.toolCallId === event.toolCallId);
			if (entry && event.details?.diff) {
				entry.editDiff = event.details.diff;
			}
		}
	});

	pi.on("session_start", async () => {
		changes.length = 0;
		currentTurn = 0;
	});

	// ── /changes command ──────────────────────────────────────────────────────
	pi.registerCommand("changes", {
		description: "Show all file changes made this session (Enter to view diff/content)",
		handler: async (_args, ctx) => {
			if (!ctx.hasUI) {
				if (changes.length === 0) {
					ctx.ui.notify("No changes recorded yet.", "info");
					return;
				}
				for (const c of changes) ctx.ui.notify(`[${c.kind}] T${c.turnIndex} ${c.target}`, "info");
				return;
			}

			// Show list, then optionally drill into detail
			let selectedChange: Change | null = null;

			await ctx.ui.custom<void>((tui, theme, _kb, done) => {
				return new ChangesListComponent(
					[...changes],
					theme,
					() => done(),
					(change) => {
						selectedChange = change;
						done();
					},
					() => tui.requestRender(),
				);
			});

			// If user pressed Enter on a row, show detail view
			if (selectedChange) {
				await ctx.ui.custom<void>((tui, theme, _kb, done) => {
					return new DetailComponent(
						selectedChange!,
						theme,
						() => done(),
						() => tui.requestRender(),
					);
				});
			}
		},
	});

	pi.registerCommand("changes-clear", {
		description: "Clear the changes history",
		handler: async (_args, ctx) => {
			const count = changes.length;
			changes.length = 0;
			currentTurn = 0;
			ctx.ui.setWidget("changes-tracker", []);
			ctx.ui.notify(`Cleared ${count} change${count !== 1 ? "s" : ""}.`, "success");
		},
	});
}

// ─── Widget helper ────────────────────────────────────────────────────────────

function updateStatusWidget(ctx: ExtensionContext, changes: Change[]): void {
	if (changes.length === 0) {
		ctx.ui.setWidget("changes-tracker", []);
		return;
	}
	const writes = changes.filter((c) => c.kind === "write").length;
	const edits = changes.filter((c) => c.kind === "edit").length;
	const bashes = changes.filter((c) => c.kind === "bash").length;
	const parts: string[] = [];
	if (writes > 0) parts.push(`✎ ${writes} write${writes !== 1 ? "s" : ""}`);
	if (edits > 0) parts.push(`✏ ${edits} edit${edits !== 1 ? "s" : ""}`);
	if (bashes > 0) parts.push(`$ ${bashes} bash`);
	const last = changes[changes.length - 1];
	const lastTarget = last.target.length > 40 ? "…" + last.target.slice(-38) : last.target;
	ctx.ui.setWidget("changes-tracker", [
		`  📝 Changes: ${parts.join("  ·  ")}   last: ${lastTarget}   /changes to view`,
	]);
}
