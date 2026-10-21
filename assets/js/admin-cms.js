import { firebaseConfig } from '../../firebase-config.js';

const ADMIN_EMAILS = ['catusharjain9@gmail.com']; // Add the second verified email here AND in firestore.rules when supplied.
const $ = id => document.getElementById(id);
const statusEl = $('status');
let auth, db, currentUser = null, editingId = null;
const fields = ['title','slug','category','summary','author','reviewed','content','seo-title','seo-description'];
const value = id => $(id).value.trim();
const setStatus = (message, error=false) => { statusEl.textContent = message; statusEl.style.background = error ? '#fbe9e7' : 'var(--sand)'; statusEl.style.color = error ? '#8a251d' : 'inherit'; };
const safeSlug = s => s.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,100);

function configReady(){return firebaseConfig && firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('REPLACE_') && firebaseConfig.projectId && !firebaseConfig.projectId.startsWith('REPLACE_');}
if (!configReady()) {
  $('sign-in').disabled = true;
  setStatus('Setup required: copy firebase-config.js.example to firebase-config.js, add your Firebase web-app settings, enable Google Authentication and create Firestore. See FIREBASE_CMS_SETUP.md.', true);
} else {
  try {
  const [{ initializeApp }, { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged }, { getFirestore, collection, doc, getDocs, setDoc, deleteDoc, query, orderBy, serverTimestamp }] = await Promise.all([
    import('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js'),
    import('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js')
  ]);
  const app = initializeApp(firebaseConfig); auth = getAuth(app); db = getFirestore(app);
  $('sign-in').addEventListener('click', async()=>{try{await signInWithPopup(auth,new GoogleAuthProvider());}catch(e){setStatus('Sign-in failed: '+e.message,true);}});
  $('sign-out').addEventListener('click',()=>signOut(auth));
  onAuthStateChanged(auth, async user => {
    currentUser = user;
    if (!user) { $('workspace').classList.add('cms-hidden'); $('sign-out').classList.add('cms-hidden'); $('sign-in').classList.remove('cms-hidden'); setStatus('Sign in with the authorised Google account.'); return; }
    if (!user.emailVerified || !ADMIN_EMAILS.includes((user.email||'').toLowerCase())) { await signOut(auth); setStatus('Access denied. This Google account is not on the authorised administrator list.',true); return; }
    $('workspace').classList.remove('cms-hidden'); $('sign-out').classList.remove('cms-hidden'); $('sign-in').classList.add('cms-hidden'); setStatus('Signed in as '+user.email+'. Drafts and publishing are protected by Firestore security rules.'); await loadArticles();
  });
  } catch (e) { $('sign-in').disabled = true; setStatus('Firebase services could not be loaded. Check the network, hosting Content Security Policy and Firebase setup, then reload.', true); }
}

$('title').addEventListener('input',()=>{if(!editingId || !value('slug')) $('slug').value=safeSlug(value('title'));});
$('new-article').addEventListener('click',clearForm); $('cancel-edit').addEventListener('click',clearForm);
$('save-draft').addEventListener('click',e=>saveArticle(e,'draft')); $('publish').addEventListener('click',e=>saveArticle(e,'published'));
$('preview').addEventListener('click',()=>{const w=window.open('','_blank'); if(w) w.opener=null; if(!w){setStatus('Preview was blocked by the browser. Allow pop-ups for this page and try again.',true);return;} const title=escapeHtml(value('title')||'Article preview'); const body=value('content').split(/\n\s*\n/).map(p=>'<p>'+escapeHtml(p).replace(/\n/g,'<br>')+'</p>').join(''); w.document.write('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>'+title+'</title><style>body{font:18px/1.75 system-ui;max-width:760px;margin:50px auto;padding:0 20px;color:#24363a}h1{line-height:1.2}</style></head><body><p>PRAVI INSIGHTS · PREVIEW</p><h1>'+title+'</h1>'+body+'</body></html>'); w.document.close();});
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function clearForm(){editingId=null;$('article-form').reset();$('editor-heading').textContent='Create article';$('slug').disabled=false;setStatus('Ready to create a new article.');}
async function saveArticle(e,status){e.preventDefault();if(!currentUser || !db)return;if(!$('article-form').reportValidity())return;const slug=value('slug');if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)){setStatus('Use a URL slug with lowercase letters, numbers and hyphens.',true);return;}const data={title:value('title'),slug,category:value('category'),summary:value('summary'),author:value('author'),reviewed:value('reviewed'),content:value('content'),seoTitle:value('seo-title'),seoDescription:value('seo-description'),status,updatedAt:serverTimestamp(),updatedBy:'PRAVI admin'};if(status==='published')data.publishedAt=serverTimestamp();try{await setDoc(doc(db,'articles',slug),data,{merge:true});editingId=slug;$('slug').disabled=true;$('editor-heading').textContent='Editing: '+data.title;setStatus(status==='published'?'Article published. It is now publicly readable.':'Draft saved privately.');await loadArticles();}catch(err){setStatus('Could not save article: '+err.message,true);}}
async function loadArticles(){if(!db)return;const list=$('article-list');list.textContent='Loading articles…';try{const snap=await getDocs(query(collection(db,'articles'),orderBy('updatedAt','desc')));list.replaceChildren();if(snap.empty){list.textContent='No articles yet. Create your first article above.';return;}snap.forEach(s=>{const a=s.data(),row=document.createElement('div');row.className='cms-row';const info=document.createElement('div'),h=document.createElement('strong'),p=document.createElement('p'),actions=document.createElement('div');h.textContent=a.title||s.id;p.textContent=(a.category||'Uncategorised')+' · '+(a.status||'draft')+' · '+s.id;info.append(h,p);actions.className='cms-row-actions';const edit=document.createElement('button');edit.className='cms-button';edit.textContent='Edit';edit.onclick=()=>{editingId=s.id;fields.forEach(id=>$(id).value=a[({'seo-title':'seoTitle','seo-description':'seoDescription'}[id]||id)]||'');$('slug').disabled=true;$('editor-heading').textContent='Editing: '+(a.title||s.id);window.scrollTo({top:0,behavior:'smooth'});};actions.append(edit);if(a.status==='published'){const view=document.createElement('a');view.className='cms-button';view.href='article.html?slug='+encodeURIComponent(s.id);view.target='_blank';view.rel='noopener';view.textContent='View';actions.append(view);}const del=document.createElement('button');del.className='cms-button cms-button-danger';del.textContent='Delete';del.onclick=async()=>{if(confirm('Delete “'+(a.title||s.id)+'”? This cannot be undone.')){try{await deleteDoc(doc(db,'articles',s.id));setStatus('Article deleted.');await loadArticles();}catch(err){setStatus('Delete failed: '+err.message,true);}}};actions.append(del);row.append(info,actions);list.append(row);});}catch(err){list.textContent='Could not load articles. Check Firestore rules and configuration.';setStatus('Loading failed: '+err.message,true);}}
