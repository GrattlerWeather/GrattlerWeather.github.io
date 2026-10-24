import { prepareEntry, suggestionKind } from './uebernehmen.mjs';

export function prepareChange(issue, collection) {
  if (!/### Verwendung\s+- \[[xX]\]/u.test(issue.body ?? '')) {
    throw new Error('Die Erklärung zur Verwendung muss bestätigt sein.');
  }
  const entry = prepareEntry({ body: issue.body, url: issue.html_url }, collection);
  entry.provenance.note = 'Redaktionell über GitHub angenommen. Quellen- und Sprecherangaben der Einreichung sind keine unabhängig verifizierten Originalzitate.';
  return { ...collection, entries: [...collection.entries, entry] };
}

export async function propose({ github, context }) {
  const { owner, repo } = context.repo;
  const number = context.issue.number;
  const permission = await github.rest.repos.getCollaboratorPermissionLevel({ owner, repo, username: context.actor });
  if (!['admin', 'maintain', 'write'].includes(permission.data.permission)) {
    throw new Error('Nur die Projektpflege darf Vorschläge annehmen.');
  }
  const { data: issue } = await github.rest.issues.get({ owner, repo, issue_number: number });
  if (issue.state !== 'open' || !issue.labels.some(label => label.name === 'angenommen')) return;
  const branch = `spruch/issue-${number}`;
  const existing = await github.rest.pulls.list({ owner, repo, head: `${owner}:${branch}`, state: 'all' });
  if (existing.data.length) return; // Never overwrite a reviewed branch or import a merged issue twice.
  const { data: ref } = await github.rest.git.getRef({ owner, repo, ref: 'heads/main' });
  const sha = ref.object.sha;
  const path = `content/${suggestionKind(issue) === 'ticker' ? 'ticker' : 'sprueche'}.json`;
  const { data: file } = await github.rest.repos.getContent({ owner, repo, path, ref: sha });
  const collection = JSON.parse(Buffer.from(file.content, 'base64').toString('utf8'));
  const updated = prepareChange(issue, collection);
  const { data: commit } = await github.rest.git.getCommit({ owner, repo, commit_sha: sha });
  const { data: tree } = await github.rest.git.createTree({ owner, repo, base_tree: commit.tree.sha,
    tree: [{ path, mode: '100644', type: 'blob', content: JSON.stringify(updated, null, 2) + '\n' }] });
  const { data: next } = await github.rest.git.createCommit({ owner, repo, message: `Spruch aus Issue #${number} übernehmen`, tree: tree.sha, parents: [sha] });
  // An existing ref causes an error instead of replacing any human edits.
  await github.rest.git.createRef({ owner, repo, ref: `refs/heads/${branch}`, sha: next.sha });
  const pr = await github.rest.pulls.create({ owner, repo, head: branch, base: 'main',
    title: `Vorschlag #${number} übernehmen`,
    body: `Übernimmt den geprüften Vorschlag in \`${path}\`. Bitte Text, Wetterbedingungen und Herkunft im Diff prüfen. Nach dem manuellen Merge veröffentlicht GitHub Pages die Änderung.\n\nCloses #${number}` });
  await github.rest.issues.createComment({ owner, repo, issue_number: number,
    body: `Zur Annahme bitte den Änderungsvorschlag prüfen und zusammenführen: ${pr.data.html_url}` });
}
