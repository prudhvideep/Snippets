<div align="center">

<h1>
<code>Snippets</code>
<br clear="all">
<a href="/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="License" align="left"></a>
</h1>

**[Features] • [Deployment] • [Usage]**

[Features]: #features
[Deployment]: #deployment
[Usage]: /docs/USAGE.md

<img alt="Snippets" src="/public/snippets.png" width=full>
<p></p>

</div>

`Snippets` is a note taking web application designed to strip away unnecessary visual noise found in traditional note-taking tools. It's interface keeps users focused only on capturing notes.

> [!IMPORTANT]
>
> Snippets is not fully implemented yet; It still needs a lot of work to get it closer to my vision

## Features
- <code>snippets</code> supports <code>rich text editing</code>.
- <code>Snippets</code> seamlessy backs up your notes to the cloud.
- <code>Snippets</code> can be self hosted.

## Deployment

- Clone the repository
```bash
git clone https://github.com/prudhvideep/Snippets.git
```

- Install dpendencies

```bash
bun install
```

- Fow now snippets backs up notes to `supabase.` This will be replaced in the future to support a generic storage interface.

```bash
VITE_SUPABASE_URL = ** Your Db Url **
VITE_SUPABASE_ANON_KEY = ** Your key **
```

- Start the development server

```bash
bun dev
```