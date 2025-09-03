import React, { useEffect, useState, useCallback } from 'react';
import { seedBlogPosts } from '@/data/seedContent';
import { FadeIn } from '../components/FadeIn';

const LS_KEY = 'cms_posts_local_v1';

function loadLocalEdits() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch { return []; }
}
function saveLocalEdits(posts) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(posts)); } catch { /* ignore */ }
}

async function tryApi(method, path, body) {
  try {
    const res = await fetch(path, {
      method,
      headers: { 'Content-Type':'application/json', 'Accept':'application/json' },
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const ct = res.headers.get('content-type') || '';
    if (/json/i.test(ct)) return await res.json();
    return null;
  } catch (e) {
    throw e;
  }
}

export default function ContentManagerPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [editing, setEditing] = useState(null); // post object or null
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState([]);
  const [attemptLog, setAttemptLog] = useState([]);

  const mergedPosts = useCallback(() => {
    const local = loadLocalEdits();
    const map = new Map();
    [...seedBlogPosts, ...local].forEach(p => map.set(p.id, p));
    return Array.from(map.values()).sort((a,b)=> (b.created_at||'').localeCompare(a.created_at||''));
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    const attempts = [];
    const candidates = [
      '/api/cms/posts', '/api/cms/posts/',
      '/cms/posts', '/cms/posts/',
    ];
    let data = null;
    for (const url of candidates) {
      try {
        const res = await fetch(url, { credentials:'include', headers:{ Accept:'application/json' } });
        const ct = res.headers.get('content-type') || '';
        if (!res.ok) {
          attempts.push({ url, note:`status_${res.status}` });
          continue;
        }
        if (!/json/i.test(ct)) {
          attempts.push({ url, note:'non_json' });
          continue;
        }
        const json = await res.json();
        if (Array.isArray(json)) { data = json; attempts.push({ url, note:'ok' }); break; }
        if (json && Array.isArray(json.results)) { data = json.results; attempts.push({ url, note:'ok_nested' }); break; }
        attempts.push({ url, note:'unexpected_shape' });
      } catch (e) {
        attempts.push({ url, note:'fetch_err' });
        continue;
      }
    }
    setAttemptLog(attempts);
    if (!data) {
      // Fallback merge seeds + local edits
      data = mergedPosts();
      setApiError('Remote API unavailable (using local seed + edits).');
    } else {
      // Merge remote with local overrides (local wins for same id)
      const local = loadLocalEdits();
      const map = new Map();
      data.forEach(p => map.set(p.id, p));
      local.forEach(p => map.set(p.id, p));
      data = Array.from(map.values());
    }
    setPosts(data);
    setLoading(false);
  }, [mergedPosts]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const startCreate = () => {
    setEditing({
      id: '',
      title: '',
      slug: '',
      excerpt: '',
      body: '',
      created_at: new Date().toISOString(),
      author: 'You'
    });
  };

  const startEdit = (p) => setEditing({ ...p });

  const cancelEdit = () => setEditing(null);

  const handleChange = (field, value) =>
    setEditing(e => ({ ...e, [field]: value }));

  const upsertLocal = (post) => {
    const local = loadLocalEdits();
    const idx = local.findIndex(p => p.id === post.id);
    if (idx >= 0) local[idx] = post; else local.push(post);
    saveLocalEdits(local);
  };

  const deleteLocal = (id) => {
    const local = loadLocalEdits().filter(p => p.id !== id);
    saveLocalEdits(local);
  };

  const onSave = async () => {
    if (!editing) return;
    setSaving(true);
    let isNew = !editing.id;
    const payload = {
      ...editing,
      slug: editing.slug || editing.title.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9\-]/g,''),
    };
    try {
      let saved = null;
      if (isNew) {
        saved = await tryApi('POST', '/api/cms/posts', payload)
          .catch(()=> null);
        if (!saved) {
          // offline/local fallback
          saved = { ...payload, id:`local-${Date.now()}` };
        }
      } else {
        saved = await tryApi('PUT', `/api/cms/posts/${editing.id}`, payload)
          .catch(()=> null);
        if (!saved) saved = payload; // local override
      }
      if (!saved.id) saved.id = payload.id || `local-${Date.now()}`;
      upsertLocal(saved);
      setEditing(null);
      refresh();
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (post) => {
    if (!window.confirm('Delete this post?')) return;
    let remoteOk = false;
    if (post.id && !post.id.startsWith('local-')) {
      try {
        await tryApi('DELETE', `/api/cms/posts/${post.id}`);
        remoteOk = true;
      } catch { /* offline */ }
    }
    deleteLocal(post.id);
    if (remoteOk) {
      setPosts(ps => ps.filter(p => p.id !== post.id));
    } else {
      setPosts(ps => ps.filter(p => p.id !== post.id));
    }
    if (editing && editing.id === post.id) setEditing(null);
  };

  const filtered = posts.filter(p =>
    !filter ||
    (p.title||'').toLowerCase().includes(filter.toLowerCase()) ||
    (p.slug||'').toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <FadeIn>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Content Manager</h1>
        {apiError && (
          <div className="mb-4 p-3 text-sm border border-yellow-400 bg-yellow-50 text-yellow-800 rounded">
            {apiError}
          </div>
        )}
        {loading && (
          <div className="mb-4 text-sm text-gray-500 animate-pulse">
            Loading remote posts (showing anything cached when ready)...
          </div>
        )}
         <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex flex-wrap gap-3 items-center mb-4">
              <button
                onClick={startCreate}
                className="px-4 py-2 bg-faded-teal text-white rounded hover:bg-soft-charcoal transition text-sm"
              >
                New Post
              </button>
              <input
                placeholder="Filter..."
                value={filter}
                onChange={e=>setFilter(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              />
              <button
                onClick={refresh}
                className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
              >
                Refresh
              </button>
              <div className="text-xs text-gray-500">
                {attemptLog.length ? `Attempts: ${attemptLog.map(a=>`${a.note}@${a.url}`).join(' | ')}` : null}
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2 space-y-3">
                {loading && <div className="text-sm text-gray-500">Loading...</div>}
                  {!loading && filtered.map(p => (
                    <div
                      key={p.id}
                      className="border rounded p-4 bg-white flex flex-col gap-2 shadow-sm"
                    >
                      <div className="flex justify-between items-center gap-3">
                        <h2 className="font-semibold text-soft-charcoal truncate">{p.title || '(Untitled)'}</h2>
                        <div className="flex gap-2">
                          <button
                            onClick={()=>startEdit(p)}
                            className="text-xs px-2 py-1 border rounded hover:bg-gray-50"
                          >Edit</button>
                          <button
                            onClick={()=>onDelete(p)}
                            className="text-xs px-2 py-1 border rounded text-red-600 hover:bg-red-50"
                          >Delete</button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 flex flex-wrap gap-2">
                        <span>{p.slug}</span>
                        {p.id.startsWith('local-') && <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded">local</span>}
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">{p.excerpt}</p>
                    </div>
                  ))}
                  {!loading && !filtered.length && (
                    <div className="text-sm text-gray-400">No posts match.</div>
                  )}
              </div>

              <div className="md:col-span-1">
                {!editing && (
                  <div className="border rounded p-4 bg-white text-sm text-gray-600">
                    <p>Select a post or create a new one.</p>
                    <p className="mt-3 text-xs">
                      Offline mode: changes stored locally and merged with seeds
                      until API becomes available.
                    </p>
                  </div>
                )}
                {editing && (
                  <div className="border rounded p-4 bg-white flex flex-col gap-3">
                    <h3 className="font-semibold text-soft-charcoal mb-1 text-sm">
                      {editing.id ? 'Edit Post' : 'New Post'}
                    </h3>
                    <label className="text-xs font-medium">
                      Title
                      <input
                        className="mt-1 w-full border rounded px-2 py-1 text-sm"
                        value={editing.title}
                        onChange={e=>handleChange('title', e.target.value)}
                      />
                    </label>
                    <label className="text-xs font-medium">
                      Slug
                      <input
                        className="mt-1 w-full border rounded px-2 py-1 text-sm"
                        value={editing.slug}
                        onChange={e=>handleChange('slug', e.target.value)}
                      />
                    </label>
                    <label className="text-xs font-medium">
                      Excerpt
                      <textarea
                        rows={2}
                        className="mt-1 w-full border rounded px-2 py-1 text-sm"
                        value={editing.excerpt}
                        onChange={e=>handleChange('excerpt', e.target.value)}
                      />
                    </label>
                    <label className="text-xs font-medium">
                      Body
                      <textarea
                        rows={6}
                        className="mt-1 w-full border rounded px-2 py-1 text-sm font-mono"
                        value={editing.body}
                        onChange={e=>handleChange('body', e.target.value)}
                      />
                    </label>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={onSave}
                        disabled={saving}
                        className="px-3 py-1.5 bg-faded-teal text-white rounded text-sm disabled:opacity-50"
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={cancelEdit}
                        type="button"
                        className="px-3 py-1.5 border rounded text-sm hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                    {editing.id && editing.id.startsWith('local-') && (
                      <div className="text-[10px] text-yellow-700 bg-yellow-50 px-2 py-1 rounded">
                        Local-only draft (not yet synced).
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
         </div>
      </div>
    </FadeIn>
  );
}