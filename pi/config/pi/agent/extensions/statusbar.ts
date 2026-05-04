/**
 * Statusbar Extension
 *
 * Custom footer som viser:
 *   modellnavn  |  git-branch  |  workDir  |  kontekst brukt  |  tokens inn/ut + kostnad
 */

import type { AssistantMessage } from "@mariozechner/pi-ai";
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { truncateToWidth, visibleWidth } from "@mariozechner/pi-tui";

export default function (pi: ExtensionAPI) {
	pi.on("session_start", (_event, ctx) => {
		ctx.ui.setFooter((tui, theme, footerData) => {
			const unsub = footerData.onBranchChange(() => tui.requestRender());

			return {
				dispose: unsub,
				invalidate() {},
				render(width: number): string[] {
					const sep = theme.fg("dim", " │ ");

					// ── Modell ──────────────────────────────────────────────────────
					const model = ctx.model;
					const modelStr = theme.fg("accent", `🤖 ${model?.id ?? "ingen modell"}`);

					// ── Git branch ──────────────────────────────────────────────────
					const branch = footerData.getGitBranch();
					const branchStr = branch
						? theme.fg("success", `🌿 ${branch}`)
						: theme.fg("dim", "🌿 ingen git");

					// ── Arbeidsmappe ────────────────────────────────────────────────
					const home = process.env.HOME ?? "";
					const cwd = ctx.cwd.startsWith(home)
						? "~" + ctx.cwd.slice(home.length)
						: ctx.cwd;
					const cwdStr = theme.fg("text", `📁 ${cwd}`);

					// ── Token-bruk og kostnad ────────────────────────────────────────
					let inputTokens = 0;
					let outputTokens = 0;
					let totalCost = 0;

					for (const e of ctx.sessionManager.getBranch()) {
						if (e.type === "message" && e.message.role === "assistant") {
							const m = e.message as AssistantMessage;
							inputTokens += m.usage.input;
							outputTokens += m.usage.output;
							totalCost += m.usage.cost.total;
						}
					}

					const fmt = (n: number) =>
						n < 1000 ? `${n}` : `${(n / 1000).toFixed(1)}k`;

					const usageStr =
						inputTokens > 0
							? theme.fg("text", `↑${fmt(inputTokens)} ↓${fmt(outputTokens)} $${totalCost.toFixed(3)}`)
							: theme.fg("muted", "ingen bruk ennå");

					// ── Kontekst brukt ───────────────────────────────────────────────
					const usage = ctx.getContextUsage();
					let contextStr: string;

					if (usage && model?.contextWindow) {
						const pct = Math.round((usage.tokens / model.contextWindow) * 100);
						const bar = buildBar(pct, 8);
						const color =
							pct >= 90 ? "error" : pct >= 70 ? "warning" : "success";
						contextStr =
							theme.fg(color, bar) +
							theme.fg("text", ` ${fmt(usage.tokens)}/${fmt(model.contextWindow)} (${pct}%)`);
					} else {
						contextStr = theme.fg("dim", "ctx: –");
					}

					// ── Sett sammen ──────────────────────────────────────────────────
					const parts = [modelStr, branchStr, cwdStr, contextStr, usageStr];
					const line = parts.join(sep);

					return [truncateToWidth(line, width)];
				},
			};
		});
	});
}

/** Lager en enkel ASCII-progress-bar, f.eks. [████░░░░] */
function buildBar(pct: number, size: number): string {
	const filled = Math.round((pct / 100) * size);
	const empty = size - filled;
	return "[" + "█".repeat(filled) + "░".repeat(empty) + "]";
}
