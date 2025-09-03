import React, { useEffect, useState, useCallback } from 'react';
import { FadeIn } from '../components/FadeIn';
import { useLocation } from 'react-router-dom'; // NEW
import { seedBlogPosts, seedPackages, seedProjects } from '@/data/seedContent';

// /* === Local storage + utility helpers (ADD ONCE NEAR TOP, before component) === */
const LS_KEY_BASE = 'cms_collection_';
function storageKey(col) { return `${LS_KEY_BASE}${col}`; }
function readLocal(col) {
  try { return JSON.parse(localStorage.getItem(storageKey(col))) || []; } catch { return []; }
}
function writeLocal(col, items) {
  try { localStorage.setItem(storageKey(col), JSON.stringify(items)); } catch { /* ignore */ }
}
function genId(prefix, col) {
  return `${prefix}-${col}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
}
/* === END helpers === */

const API_DEBUG = import.meta.env.VITE_API_DEBUG === '1';

export default function ContentManagerPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [editing, setEditing] = useState(null); // post object or null
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState(''); // was []
  const [attemptLog, setAttemptLog] = useState([]);
  const [unauthorized, setUnauthorized] = useState(false); // NEW
  const [collection, setCollection] = useState('posts'); // NEW: 'posts' | 'packages' | 'projects'
  const location = useLocation(); // NEW

  // DEFINE loadLocal (fixes runtime "loadLocal is not defined")
  const loadLocal = useCallback(() => readLocal(collection), [collection]);
  const saveLocal = useCallback(items => writeLocal(collection, items), [collection]);

  const makeSlug = (v='') =>
    v.toLowerCase()
      .trim()
      .replace(/\s+/g,'-')
      .replace(/[^a-z0-9\-]/g,'')
      .replace(/\-+/g,'-');

  // NEW: normalize posts so every item has a stable string id
  const normalizePosts = useCallback((arr) => {
    return (arr || []).map((p, i) => {
      if (!p || typeof p !== 'object') return { id: `null-${i}-${Date.now()}`, title: '(Invalid item)' };
      if (typeof p.id !== 'string' || !p.id.trim()) {
        return { ...p, id: `gen-${i}-${Date.now()}` };
      }
      return p;
    });
  }, []);

  // SINGLE mergedPosts (remove any duplicate definitions below)
  const mergedPosts = useCallback(() => {
    const local = loadLocal();
    const seedArr =
      collection === 'posts' ? seedBlogPosts :
      collection === 'packages' ? seedPackages :
      seedProjects;
    const map = new Map();
    [...seedArr, ...local].forEach(p => {
      if (!p) return;
      const id = (p.id && String(p.id).trim()) || genId('seed', collection);
      map.set(id, { ...p, id });
    });
    return Array.from(map.values()).sort(
      (a,b)=>(b?.created_at||'').localeCompare(a?.created_at||'')
    );
  }, [collection, loadLocal]);

  // SYNC state (keep only one set)
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState(null);
  const [lastSyncAt, setLastSyncAt] = useState(null);

  // Unsynced + CRUD helpers
  const isUnsynced = p => !!p && (p._unsynced || (typeof p.id === 'string' && p.id.startsWith('local-')));
  const getUnsynced = useCallback(() => loadLocal().filter(isUnsynced), [loadLocal]);
  const markUnsynced = useCallback(p => ({ ...p, _unsynced: true }), []);
  const upsertLocal = useCallback(item => {
    const list = loadLocal();
    const i = list.findIndex(p => p.id === item.id);
    if (i >= 0) list[i] = item; else list.push(item);
    saveLocal(list);
  }, [loadLocal, saveLocal]);
  const deleteLocal = useCallback(id => {
    saveLocal(loadLocal().filter(p => p.id !== id));
  }, [loadLocal, saveLocal]);
  const replaceLocal = useCallback((oldId, newPost) => {
    let list = loadLocal();
    list = list.filter(p =>
      p.id !== oldId &&
      !(newPost.slug && p.slug === newPost.slug && p.id !== newPost.id)
    );
    list.push(newPost);
    saveLocal(list);
    return list;
  }, [loadLocal, saveLocal]);

  // UPDATE refresh: dynamic endpoints
  const refresh = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    setUnauthorized(false);
    const attempts = [];
    const baseSegments = {
      posts: ['cms/posts'],
      packages: ['packages'],
      projects: ['projects']
    }[collection];
    const candidates = [
      `/api/${baseSegments[0]}`,
      `/api/${baseSegments[0]}/`,
      `/${baseSegments[0]}`,
      `/${baseSegments[0]}/`
    ];
    let data = null;
    for (const url of candidates) {
      try {
        const res = await fetch(url, { credentials:'include', headers:{ Accept:'application/json' } });
        const ct = res.headers.get('content-type') || '';
        if (res.status === 401) {
          attempts.push({ url, note:'unauthorized' });
          setUnauthorized(true);
          break;
        }
        if (!res.ok) { attempts.push({ url, note:`status_${res.status}` }); continue; }
        if (!/json/i.test(ct)) { attempts.push({ url, note:'non_json' }); continue; }
        const json = await res.json();
        if (Array.isArray(json)) { data = json; attempts.push({ url, note:'ok' }); break; }
        if (json && Array.isArray(json.results)) { data = json.results; attempts.push({ url, note:'ok_nested' }); break; }
        attempts.push({ url, note:'unexpected_shape' });
      } catch {
        attempts.push({ url, note:'fetch_err' });
        continue;
      }
    }
    setAttemptLog(attempts);
    if (!data) {
      data = mergedPosts();
      if (!unauthorized) setApiError(`Remote ${collection} API unavailable (using local seed + edits).`);
    } else {
      const local = loadLocal();
      const m = new Map();
      data.forEach(p => m.set(p.id, p));
      local.forEach(p => m.set(p.id, p));
      data = Array.from(m.values());
    }
    setPosts(data);
    setLoading(false);
  }, [collection, mergedPosts, unauthorized, loadLocal]);

  // UPDATE effect dependencies
  useEffect(()=>{ refresh(); }, [refresh, collection]);

  const startCreate = () => {
    const base = {
      id: '',
      created_at: new Date().toISOString()
    };
    if (collection === 'posts') {
      setEditing({ ...base, title:'', slug:'', excerpt:'', body:'', author:'You' });
    } else if (collection === 'packages') {
      setEditing({ ...base, name:'', price:'', description:'', slug:'' });
    } else {
      setEditing({ ...base, name:'', imageUrl:'', description:'', slug:'' });
    }
  };

  const startEdit = (p) => setEditing({ ...p });

  const cancelEdit = () => setEditing(null);

  // UPDATE handleChange: map generic fields
  const handleChange = (field, value) =>
    setEditing(e => {
      if (!e) return e;
      const next = { ...e, [field]: value };
      if (collection === 'posts') {
        if (field === 'title' && (!e.slug || e.slug === makeSlug(e.title||''))) next.slug = makeSlug(value);
        if (field === 'slug') next.slug = makeSlug(value);
      } else {
        // for packages/projects use name -> slug
        if (field === 'name' && (!e.slug || e.slug === makeSlug(e.name||''))) next.slug = makeSlug(value);
        if (field === 'slug') next.slug = makeSlug(value);
      }
      return next;
    });

  // ADD helper (place before onSave)
  const attemptRemoteSave = useCallback(async ({
    resourcePath,
    payload,
    isNew,
    token
  }) => {
    const headers = {
      'Content-Type':'application/json',
      Accept:'application/json',
      ...(token ? { Authorization:`Bearer ${token}` } : {})
    };
    // If new: POST only
    if (isNew) {
      try {
        const res = await fetch(resourcePath, {
          method:'POST',
          headers,
          credentials:'include',
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error(`POST ${res.status}`);
        const ct = (res.headers.get('content-type')||'').toLowerCase();
        if (!ct.includes('json')) throw new Error('POST non-json');
        return { ok:true, data: await res.json(), created:true };
      } catch (e) {
        if (API_DEBUG) console.warn('[CMS] POST failed (will stay local)', e);
        return { ok:false };
      }
    }
    // Update path (PUT first)
    try {
      const res = await fetch(`${resourcePath}/${payload.id}`, {
        method:'PUT',
        headers,
        credentials:'include',
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        // Fallback: slug/id not found -> try create
        if ([400,404].includes(res.status)) {
          if (API_DEBUG) console.warn('[CMS] PUT fallback to POST', payload.id);
          const createRes = await fetch(resourcePath, {
            method:'POST',
            headers,
            credentials:'include',
            body: JSON.stringify(payload)
          });
            if (!createRes.ok) throw new Error(`POST-after-PUT ${createRes.status}`);
            const ct2 = (createRes.headers.get('content-type')||'').toLowerCase();
            if (!ct2.includes('json')) throw new Error('POST-after-PUT non-json');
            return { ok:true, data: await createRes.json(), created:true, replaced:true };
        }
        throw new Error(`PUT ${res.status}`);
      }
      const ct = (res.headers.get('content-type')||'').toLowerCase();
      if (!ct.includes('json')) throw new Error('PUT non-json');
      return { ok:true, data: await res.json(), created:false };
    } catch (e) {
      if (API_DEBUG) console.warn('[CMS] update failed', e);
      return { ok:false };
    }
  }, []);

  // Ensure onSave uses markUnsynced & upsertLocal (patch existing version)
  // Find existing onSave and replace its core remote logic with:
  const onSave = async () => {
    if (!editing) return;
    setSaving(true);
    const isNew = !editing.id;
    const baseSlugSource = editing.slug || editing.title || editing.name || `item-${Date.now()}`;
    const resourcePath =
      collection === 'posts' ? '/api/cms/posts' :
      collection === 'packages' ? '/api/packages' :
      '/api/projects';

    const provisionalId = editing.id || `local-${Date.now()}`;
    const payload = {
      ...editing,
      id: provisionalId,
      slug: baseSlugSource.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,''),
      created_at: editing.created_at || new Date().toISOString()
    };
    if (collection !== 'posts') {
      payload.title = payload.name;
      payload.excerpt = payload.description || payload.excerpt || '';
    }

    const token = localStorage.getItem('jwt_token') || localStorage.getItem('token');
    let saved = null;
    let remoteOk = false;

    try {
      const { ok, data } = await attemptRemoteSave({
        resourcePath,
        payload,
        isNew,
        token
      });
      if (ok && data && typeof data === 'object') {
        saved = { ...payload, ...data, _unsynced: undefined };
        if (!saved.id) saved.id = payload.id; // ensure id
        remoteOk = true;
      } else {
        saved = markUnsynced(payload);
      }
    } catch {
      saved = markUnsynced(payload);
    } finally {
      if (!saved.id) saved.id = provisionalId;
      upsertLocal(saved);
      setEditing(null);
      setPosts(ps => {
        const map = new Map(ps.map(p => [p.id, p]));
        map.set(saved.id, saved);
        return Array.from(map.values());
      });
      if (!remoteOk) {
        setApiError('Draft saved locally (will sync).');
        setTimeout(()=>setApiError(null), 5000);
      }
      setSaving(false);
      refresh();
    }
  };

  const onDelete = async (post) => {
    if (!post) return;
    if (!window.confirm('Delete this item?')) return;
    const pid = typeof post.id === 'string' ? post.id : null;
    const resourcePath =
      collection === 'posts' ? '/api/cms/posts' :
      collection === 'packages' ? '/api/packages' :
      '/api/projects';

    let remoteOk = false;
    if (pid && !pid.startsWith('local-')) {
      try {
        const token = localStorage.getItem('jwt_token') || localStorage.getItem('token');
        const res = await fetch(`${resourcePath}/${pid}`, {
          method:'DELETE',
          headers: {
            Accept:'application/json',
            ...(token ? { Authorization:`Bearer ${token}` } : {})
          },
          credentials:'include'
        });
        if (res.ok || res.status === 404) remoteOk = true; // treat 404 as gone
      } catch (e) {
        if (API_DEBUG) console.warn('[CMS] delete failed (offline?)', e);
      }
    }
    if (pid) deleteLocal(pid);
    setPosts(ps => ps.filter(p => p.id !== pid));
    if (editing && editing.id === pid) setEditing(null);
    if (!remoteOk && pid && !pid.startsWith('local-')) {
      setApiError('Remote delete failed – removed locally.');
      setTimeout(()=>setApiError(null), 4000);
    }
  };

  // UPDATE filtered to include name/description for other collections
  const filtered = posts.filter(p => {
    const f = filter.toLowerCase();
    if (!f) return true;
    return [
      p.title, p.slug, p.name, p.excerpt, p.description
    ].some(v => (v||'').toLowerCase().includes(f));
  });

  const unsyncedCount = getUnsynced().length; // NEW count

  // NOTE: ensure these helpers already exist: loadLocal, saveLocal, getUnsynced, replaceLocal
  // If attemptSyncAll was removed and is now undefined, re-add it here.
  // Remove any earlier duplicate before applying this.
  const attemptSyncAll = useCallback(async () => {
    if (syncing) return;
    const token = localStorage.getItem('jwt_token') || localStorage.getItem('token');
    if (!token) return;
    const unsynced = getUnsynced();
    if (!unsynced.length) {
      setSyncMsg('No drafts to sync.');
      setTimeout(()=>setSyncMsg(null), 1800);
      return;
    }
    setSyncing(true);
    const resourcePath =
      collection === 'posts' ? '/api/cms/posts' :
      collection === 'packages' ? '/api/packages' :
      '/api/projects';

    let success = 0;
    for (const draft of unsynced) {
      const isNew = !draft.id || draft.id.startsWith('local-');
      const payload = { ...draft };
      delete payload._unsynced;
      try {
        const res = await fetch(isNew ? resourcePath : `${resourcePath}/${draft.id}`, {
          method: isNew ? 'POST' : 'PUT',
          headers: {
            'Content-Type':'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          },
          credentials: 'include',
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error();
        const ct = (res.headers.get('content-type')||'').toLowerCase();
        if (!ct.includes('json')) throw new Error();
        const saved = await res.json();
        const final = { ...draft, ...saved, _unsynced: undefined };
        replaceLocal(draft.id, final);
        success++;
      } catch {
        // leave unsynced
      }
    }
    // Refresh displayed list from local
    setPosts(prev => {
      const map = new Map(prev.map(p => [p.id, p]));
      loadLocal().forEach(p => map.set(p.id, p));
      return Array.from(map.values());
    });
    setSyncing(false);
    setLastSyncAt(Date.now());
    setSyncMsg(success ? `Synced ${success}` : 'Sync incomplete.');
    setTimeout(()=>setSyncMsg(null), 3200);
  }, [collection, syncing, getUnsynced, replaceLocal, loadLocal]); 

  // --- UI CHANGES (toolbar + list + editor) ---
  return (
    <FadeIn>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Content Manager</h1>
        {/* NEW sync message */}
        {syncMsg && (
          <div className="mb-3 text-xs px-3 py-2 rounded bg-blue-50 text-blue-700 border border-blue-200">
            {syncMsg}
          </div>
        )}
        {unauthorized && (
          <div className="mb-4 p-3 text-sm border border-red-400 bg-red-50 text-red-700 rounded flex flex-wrap gap-3 items-center">
            <span>Authentication required to load live posts.</span>
            <button
              onClick={() => {
                const next = encodeURIComponent(location.pathname);
                window.location.href = `/login?next=${next}`;
              }}
              className="px-3 py-1 text-xs font-medium rounded bg-red-600 text-white hover:bg-red-700"
            >
              Login
            </button>
          </div>
        )}
        {apiError && !unauthorized && (
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
              {/* NEW collection picker */}
              <div className="flex gap-1 text-xs">
                {['posts','packages','projects'].map(c => (
                  <button
                    key={c}
                    onClick={()=> { setCollection(c); setEditing(null); }}
                    className={`px-3 py-1 rounded border ${collection===c?'bg-faded-teal text-white':'bg-white hover:bg-gray-50'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <button
                onClick={startCreate}
                className="px-4 py-2 bg-faded-teal text-white rounded hover:bg-soft-charcoal transition text-sm"
              >New {collection.slice(0,-1)}</button>
              <input
                placeholder="Filter..."
                value={filter}
                onChange={e=>setFilter(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              />
              {/* NEW clear filter */}
              {filter && (
                <button
                  onClick={()=>setFilter('')}
                  className="px-2 py-1 text-xs border rounded hover:bg-gray-50"
                >Clear</button>
              )}
              <button
                onClick={refresh}
                className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
              >
                Refresh
              </button>
              <button
                onClick={attemptSyncAll}
                disabled={syncing || !unsyncedCount}
                className="px-3 py-1 border rounded text-sm disabled:opacity-40 hover:bg-gray-50"
              >
                {syncing ? 'Syncing...' : unsyncedCount ? `Sync (${unsyncedCount})` : 'Sync'}
              </button>
              {lastSyncAt && (
                <span className="text-[10px] text-gray-400">
                  Last sync {new Date(lastSyncAt).toLocaleTimeString()}
                </span>
              )}
              <div className="text-xs text-gray-500">
                {attemptLog.length ? `Attempts: ${attemptLog.map(a=>`${a.note}@${a.url}`).join(' | ')}` : null}
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2 space-y-3">
                {loading && <div className="text-sm text-gray-500">Loading...</div>}
                  {!loading && filtered.map((p, idx) => {
                    const localFlag = typeof p.id === 'string' && p.id.startsWith('local-');
                    const unsynced = p._unsynced;
                    return (
                      <div key={p.id || idx} className="border rounded p-4 bg-white flex flex-col gap-2 shadow-sm">
                        <div className="flex justify-between items-center gap-3">
                          <h2 className="font-semibold text-soft-charcoal truncate">
                            {p.title || p.name || '(Untitled)'}
                          </h2>
                          <div className="flex gap-2">
                            <button onClick={()=>startEdit(p)} className="text-xs px-2 py-1 border rounded hover:bg-gray-50">Edit</button>
                            <button onClick={()=>onDelete(p)} className="text-xs px-2 py-1 border rounded text-red-600 hover:bg-red-50">Delete</button>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 flex flex-wrap gap-2 items-center">
                          {p.slug && <span>{p.slug}</span>}
                          {collection === 'packages' && p.price && <span>${p.price}</span>}
                          {collection === 'projects' && p.imageUrl && <span className="truncate max-w-[120px]">{p.imageUrl}</span>}
                          {unsynced && <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded">unsynced</span>}
                          {localFlag && !unsynced && <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded">local</span>}
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {p.excerpt || p.description || ''}
                        </p>
                      </div>
                    );
                  })}
                  {!loading && !filtered.length && (
                    <div className="text-sm text-gray-400">No {collection} match.</div>
                  )}
              </div>

              <div className="md:col-span-1">
                {!editing && (
                  <div className="border rounded p-4 bg-white text-sm text-gray-600">
                    <p>Select or create {collection === 'posts' ? 'a post' : collection === 'packages' ? 'a package' : 'a project'}.</p>
                    <p className="mt-3 text-xs">
                      Drafts are kept locally if offline and sync later.
                    </p>
                  </div>
                )}
                {editing && (
                  <div className="border rounded p-4 bg-white flex flex-col gap-3">
                    <h3 className="font-semibold text-soft-charcoal mb-1 text-sm">
                      {editing.id ? `Edit ${collection.slice(0,-1)}` : `New ${collection.slice(0,-1)}`}
                    </h3>

                    {/* Conditional fields */}
                    {collection === 'posts' && (
                      <>
                        <label className="text-xs font-medium">Title
                          <input className="mt-1 w-full border rounded px-2 py-1 text-sm"
                            value={editing.title}
                            onChange={e=>handleChange('title', e.target.value)} />
                        </label>
                        <label className="text-xs font-medium">Slug
                          <input className="mt-1 w-full border rounded px-2 py-1 text-sm"
                            value={editing.slug}
                            onChange={e=>handleChange('slug', e.target.value)} />
                        </label>
                        <label className="text-xs font-medium">Excerpt
                          <textarea rows={2} className="mt-1 w-full border rounded px-2 py-1 text-sm"
                            value={editing.excerpt}
                            onChange={e=>handleChange('excerpt', e.target.value)} />
                        </label>
                        <label className="text-xs font-medium">Body
                          <textarea rows={6} className="mt-1 w-full border rounded px-2 py-1 text-sm font-mono"
                            value={editing.body}
                            onChange={e=>handleChange('body', e.target.value)} />
                        </label>
                      </>
                    )}

                    {collection === 'packages' && (
                      <>
                        <label className="text-xs font-medium">Name
                          <input className="mt-1 w-full border rounded px-2 py-1 text-sm"
                            value={editing.name}
                            onChange={e=>handleChange('name', e.target.value)} />
                        </label>
                        <label className="text-xs font-medium">Price
                          <input className="mt-1 w-full border rounded px-2 py-1 text-sm"
                            value={editing.price}
                            onChange={e=>handleChange('price', e.target.value)} />
                        </label>
                        <label className="text-xs font-medium">Slug
                          <input className="mt-1 w-full border rounded px-2 py-1 text-sm"
                            value={editing.slug}
                            onChange={e=>handleChange('slug', e.target.value)} />
                        </label>
                        <label className="text-xs font-medium">Description
                          <textarea rows={5} className="mt-1 w-full border rounded px-2 py-1 text-sm"
                            value={editing.description || ''}
                            onChange={e=>handleChange('description', e.target.value)} />
                        </label>
                      </>
                    )}

                    {collection === 'projects' && (
                      <>
                        <label className="text-xs font-medium">Name
                          <input className="mt-1 w-full border rounded px-2 py-1 text-sm"
                            value={editing.name}
                            onChange={e=>handleChange('name', e.target.value)} />
                        </label>
                        <label className="text-xs font-medium">Image URL
                          <input className="mt-1 w-full border rounded px-2 py-1 text-sm"
                            value={editing.imageUrl || ''}
                            onChange={e=>handleChange('imageUrl', e.target.value)} />
                        </label>
                        <label className="text-xs font-medium">Slug
                          <input className="mt-1 w-full border rounded px-2 py-1 text-sm"
                            value={editing.slug}
                            onChange={e=>handleChange('slug', e.target.value)} />
                        </label>
                        <label className="text-xs font-medium">Description
                          <textarea rows={5} className="mt-1 w-full border rounded px-2 py-1 text-sm"
                            value={editing.description || ''}
                            onChange={e=>handleChange('description', e.target.value)} />
                        </label>
                      </>
                    )}

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
                        Local-only draft.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
         </div>
         {saving && (
          <div className="mb-2 text-xs text-gray-500">
            Saving{apiError ? ' (with issues)' : '...'}
          </div>
        )}
      </div>
    </FadeIn>
  );
}