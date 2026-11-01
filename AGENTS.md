<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Android CI builds use Nitro's `node-middleware` preset only for local shell rendering; the packaging script resolves Nitro and legacy TanStack output paths into Capacitor's `dist/client` webDir so hosted deployment settings remain unchanged.
- Fonts and official app icons remain bundled in public assets and are referenced through same-origin paths so Capacitor and the PWA precache include them without any CDN dependency.
