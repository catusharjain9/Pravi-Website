import { firebaseConfig } from '../../firebase-config.js';
const grid=document.querySelector('[data-cms-articles]');
if(grid && firebaseConfig?.apiKey && !firebaseConfig.apiKey.startsWith('REPLACE_')){
  try{
    const [{initializeApp},{getFirestore,collection,getDocs,query,where,orderBy}]=await Promise.all([import('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js'),import('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js')]);
    const app=initializeApp(firebaseConfig),db=getFirestore(app);
    const snap=await getDocs(query(collection(db,'articles'),where('status','==','published'),orderBy('publishedAt','desc')));
    snap.forEach(docSnap=>{const a=docSnap.data();const card=document.createElement('article');card.className='insight-card';const tag=document.createElement('span');tag.className='resource-tag';tag.textContent=a.category||'PRAVI Insights';const h=document.createElement('h2');h.textContent=a.title||'Article';const p=document.createElement('p');p.textContent=a.summary||'';const link=document.createElement('a');link.className='text-link';link.href='article.html?slug='+encodeURIComponent(docSnap.id);link.textContent='Read article →';card.append(tag,h,p,link);grid.append(card);});
  }catch(e){console.warn('Published CMS articles are unavailable; static articles remain visible.',e);}
}
