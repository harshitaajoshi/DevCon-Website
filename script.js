document.addEventListener('DOMContentLoaded',()=>{
  if(window.location.hash)history.replaceState(null,null,' ');
  window.scrollTo(0,0);
  initHero3D();initCursor();initNav();initReveal();initFAQ();initReg();initCounters();initTilt();initMagnetic();initSlideshow();initSpeakerModals();initCountdown();
});

/* ============================================
   THREE.JS — 3D Interactive Swirl
   ============================================ */
function initHero3D(){
  const canvas=document.getElementById('hero3d');
  if(!canvas||typeof THREE==='undefined')return;

  const W=()=>innerWidth, H=()=>innerHeight;

  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(45,W()/H(),0.1,1000);
  camera.position.set(0,0,60);

  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  renderer.setSize(W(),H());
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.0;

  const geo=new THREE.TorusKnotGeometry(9,3.5,300,64,2,3);
  const mat=new THREE.MeshPhongMaterial({
    color:0x181818,
    specular:0x666666,
    shininess:90,
    side:THREE.DoubleSide
  });
  const knot=new THREE.Mesh(geo,mat);
  knot.position.set(0,0,0);
  knot.scale.set(1.25,1.25,1.25);
  scene.add(knot);

  scene.add(new THREE.AmbientLight(0xffffff,0.25));

  const l1=new THREE.DirectionalLight(0xffffff,2.2);
  l1.position.set(8,12,10);
  scene.add(l1);

  const l2=new THREE.DirectionalLight(0xffffff,1.4);
  l2.position.set(-10,-8,-6);
  scene.add(l2);

  const l3=new THREE.DirectionalLight(0xeeeeee,0.8);
  l3.position.set(-6,8,-8);
  scene.add(l3);

  const l4=new THREE.DirectionalLight(0xffffff,0.6);
  l4.position.set(5,-10,6);
  scene.add(l4);

  const l5=new THREE.DirectionalLight(0xffffff,0.5);
  l5.position.set(-3,0,12);
  scene.add(l5);

  let mx=0,my=0,tx=0,ty=0;
  window.addEventListener('mousemove',e=>{
    mx=(e.clientX/W()-0.5)*2;
    my=(e.clientY/H()-0.5)*2;
  });

  (function tick(){
    requestAnimationFrame(tick);
    tx+=(mx-tx)*0.04;
    ty+=(my-ty)*0.04;
    const t=performance.now()*0.001;
    knot.rotation.x=t*0.12+ty*0.6;
    knot.rotation.y=t*0.2+tx*0.6;
    renderer.render(scene,camera);
  })();

  window.addEventListener('resize',()=>{
    camera.aspect=W()/H();
    camera.updateProjectionMatrix();
    renderer.setSize(W(),H());
  });
}

/* ============================================
   Custom Cursor
   ============================================ */
function initCursor(){
  if(innerWidth<768)return;
  const d=document.getElementById('cDot'),r=document.getElementById('cRing');
  let mx=0,my=0,dx=0,dy=0,rx=0,ry=0;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});
  (function loop(){
    dx+=(mx-dx)*.2;dy+=(my-dy)*.2;rx+=(mx-rx)*.07;ry+=(my-ry)*.07;
    d.style.left=dx+'px';d.style.top=dy+'px';r.style.left=rx+'px';r.style.top=ry+'px';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a,button,[data-tilt],[data-magnetic],input,select,.pill-btn,.hero-cta').forEach(el=>{
    el.addEventListener('mouseenter',()=>{d.classList.add('hov');r.classList.add('hov')});
    el.addEventListener('mouseleave',()=>{d.classList.remove('hov');r.classList.remove('hov')});
  });
}

/* Nav */
function initNav(){
  const b=document.getElementById('burger'),m=document.getElementById('mobMenu');
  if(!b||!m)return;
  b.addEventListener('click',()=>{
    b.classList.toggle('active');m.classList.toggle('active');
    document.body.style.overflow=m.classList.contains('active')?'hidden':'';
  });
  m.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    b.classList.remove('active');m.classList.remove('active');document.body.style.overflow='';
  }));
}

/* Reveal */
function initReveal(){
  const o=new IntersectionObserver(e=>{e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('vis');o.unobserve(x.target)}})},{threshold:.05,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.rv').forEach(el=>o.observe(el));
}

/* FAQ */
function initFAQ(){
  document.querySelectorAll('.fq-q').forEach(b=>{
    b.addEventListener('click',()=>{
      const i=b.parentElement,w=i.classList.contains('open');
      document.querySelectorAll('.fq.open').forEach(x=>x.classList.remove('open'));
      if(!w)i.classList.add('open');
    });
  });
}

/* Register */
function initReg(){
  const f=document.getElementById('regForm'),ok=document.getElementById('regOk');
  if(!f||!ok)return;
  f.addEventListener('submit',e=>{
    e.preventDefault();
    const btn=f.querySelector('.pill-btn');btn.style.opacity='.5';btn.style.pointerEvents='none';
    btn.querySelector('span:first-child').textContent='REGISTERING...';
    setTimeout(()=>{f.style.display='none';ok.classList.add('show');ok.scrollIntoView({behavior:'smooth',block:'center'})},1500);
  });
}

/* Counters */
function initCounters(){
  const o=new IntersectionObserver(e=>{e.forEach(x=>{if(x.isIntersecting){anim(x.target);o.unobserve(x.target)}})},{threshold:.5});
  document.querySelectorAll('.st-n[data-target]').forEach(el=>o.observe(el));
}
function anim(el){
  const tgt=+el.dataset.target,dur=2200,st=performance.now();
  (function fr(now){
    const p=Math.min((now-st)/dur,1),v=1-Math.pow(1-p,4);
    el.textContent=Math.floor(v*tgt);
    p<1?requestAnimationFrame(fr):el.textContent=tgt;
  })(st);
}

/* Tilt */
function initTilt(){
  if(innerWidth<768)return;
  document.querySelectorAll('[data-tilt]').forEach(c=>{
    c.addEventListener('mousemove',e=>{
      const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      c.style.transform=`perspective(600px) rotateY(${x*10}deg) rotateX(${-y*10}deg) scale(1.02)`;
    });
    c.addEventListener('mouseleave',()=>{c.style.transform='';c.style.transition='transform .6s cubic-bezier(.16,1,.3,1)'});
    c.addEventListener('mouseenter',()=>{c.style.transition='transform .1s ease-out'});
  });
}

/* Magnetic */
function initMagnetic(){
  if(innerWidth<768)return;
  document.querySelectorAll('[data-magnetic]').forEach(el=>{
    el.addEventListener('mousemove',e=>{
      const r=el.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;
      el.style.transform=`translate(${x*.3}px,${y*.3}px)`;
    });
    el.addEventListener('mouseleave',()=>{el.style.transform='';el.style.transition='transform .5s cubic-bezier(.16,1,.3,1)'});
    el.addEventListener('mouseenter',()=>{el.style.transition='transform .15s ease-out'});
  });
}

function initSlideshow(){
  const slides=document.querySelectorAll('.slide');
  const dotsContainer=document.querySelector('.slideshow-dots');
  const counterCur=document.querySelector('.counter-cur');
  const counterTotal=document.querySelector('.counter-total');
  const prevBtn=document.querySelector('.ss-prev');
  const nextBtn=document.querySelector('.ss-next');
  if(!slides.length||!dotsContainer)return;
  let cur=0;
  let timer;
  const total=slides.length;
  const INTERVAL=5000;
  if(counterTotal)counterTotal.textContent=String(total).padStart(2,'0');
  slides[0].classList.add('active');
  slides.forEach((_,i)=>{
    const d=document.createElement('button');
    d.classList.add('s-dot');
    const fill=document.createElement('span');
    fill.classList.add('s-dot-fill');
    d.appendChild(fill);
    if(i===0)d.classList.add('active');
    d.addEventListener('click',()=>{goTo(i);resetTimer()});
    dotsContainer.appendChild(d);
  });
  const dots=dotsContainer.querySelectorAll('.s-dot');
  function goTo(n){
    slides[cur].classList.remove('active');
    dots[cur].classList.remove('active');
    cur=n;
    slides[cur].classList.add('active');
    dots[cur].classList.add('active');
    if(counterCur)counterCur.textContent=String(cur+1).padStart(2,'0');
  }
  function next(){goTo((cur+1)%total)}
  function prev(){goTo((cur-1+total)%total)}
  function resetTimer(){clearInterval(timer);timer=setInterval(next,INTERVAL)}
  if(prevBtn)prevBtn.addEventListener('click',()=>{prev();resetTimer()});
  if(nextBtn)nextBtn.addEventListener('click',()=>{next();resetTimer()});
  resetTimer();
}

function initSpeakerModals(){
  const speakerData={
    ej:{
      name:'Eric Johnson',
      photo:'images/ej.png',
      role:'Principal Developer Advocate',
      company:'Amazon Web Services (AWS)',
      loc:'Colorado, US',
      linkedin:'https://www.linkedin.com/in/singledigit/',
      talk:'Building Distributed Video Approval Pipelines',
      abstract:'In this session, we\'ll build a distributed pipeline that reviews videos at scale. The system breaks the problem into stages — audio transcription, on-screen text extraction, and visual analysis — and combines the results to make approval decisions based on rules for things like toxic language, hate speech, and personally identifiable information (PII). We\'ll walk through how the pipeline is structured, how stages communicate, and how results are aggregated into a final decision. The focus is on orchestration, consistency, and handling conflicting signals across steps. You\'ll see practical patterns for designing distributed systems that scale with demand, remain predictable, and support evolving moderation rules over time.'
    },
    mina:{
      name:'Mina Ghashami',
      photo:'images/mina.png',
      role:'ML Engineer · O\'Reilly Author',
      company:'Meta',
      loc:'San Francisco, CA',
      linkedin:'https://www.linkedin.com/in/minaghashami/',
      talk:'The Evolution of Generative AI: Milestones That Changed the Industry',
      abstract:'Generative AI has evolved at an incredible pace: from chatbots that surprised the world to intelligent systems that can reason, use tools, and interact with the digital world. In this talk, I will tell that story through the major milestones of the last few years, including ChatGPT, GPT-4, open models, reasoning models, agents, and MCP. We will also look at how these breakthroughs changed the industry, influenced what companies are building, and reshaped the skills that matter for the next generation of engineers. For students, this is not just a story about AI\'s past; it is a guide to understanding the future they are stepping into and the roles the industry increasingly demands.'
    },
    sachin:{
      name:'Sachin Paryani',
      photo:'images/sachin.png',
      role:'Senior Software Engineer · AI Platform',
      company:'Netflix',
      loc:'Seattle, WA',
      linkedin:'https://www.linkedin.com/in/sachinparyani/',
      talk:'How I Think About Systems Now (vs. When I Was in College)',
      abstract:'In this session, Sachin will share how his approach to building and understanding systems has evolved since graduating from college and working on real-world production systems. In school, the focus is often on writing correct code, optimizing algorithms, and solving well-defined problems. In industry, however, engineering is often about making good decisions under constraints, working with ambiguity, handling failures, and understanding how different parts of a system interact over time. Through concrete examples, Sachin will walk through how he breaks down systems today, reasons about trade-offs like latency and reliability, and approaches situations where there isn\'t a single "right" answer. He\'ll also highlight key mindset shifts that weren\'t obvious as a student. This session aims to give students a realistic picture of how engineers think in industry and provide a mental framework they can start building even before they graduate.'
    },
    vaidehi:{
      name:'Vaidehi S. Tripathi',
      photo:'images/cloudguru.png',
      role:'Google Developer Expert · ML',
      company:'Elevance Health',
      loc:'Indianapolis, IN',
      linkedin:'https://www.linkedin.com/in/thecloudguru/',
      talk:'Building Next Gen Apps with Google Antigravity IDE',
      abstract:'The demo session will guide you from an introduction to the Google Antigravity IDE to developing a custom application. The initial application can be further enhanced to add more features later. The IDE not only builds but also auto tests in the agent-controlled browser. Documentation: Yes, it generates a complete plan and artifacts including test screenshots. That\'s a mind-shift in how applications will be built, with multiple agents working on separate tasks simultaneously, playing different job roles and you the builder, are in charge of all.'
    }
  };

  const guestData={
    faller:{
      name:'Roland Faller, Ph.D.',
      photo:'images/rolland.jpeg',
      role:'Dean',
      company:'Edward E. Whitacre Jr. College of Engineering',
      loc:'Texas Tech University',
      linkedin:'https://www.linkedin.com/in/rolanbadrislamov/',
      bio:'Dr. Roland Faller is the Dean of the Edward E. Whitacre Jr. College of Engineering at Texas Tech University, a role he has held since August 2023. Before arriving at Texas Tech, he spent over two decades at UC Davis, where he rose from Assistant Professor to Executive Associate Dean of Engineering, overseeing graduate programs, capital projects, and the construction of the Diane Bryant Engineering Student Design Center.\n\nOriginally trained as a theoretical physicist at the University of Bayreuth and the Max Planck Institute for Polymer Research in Germany, Dr. Faller earned his doctorate from the University of Mainz in 2000. His postdoctoral work at the University of Wisconsin led him to pivot into chemical engineering, a move that would define the next chapter of his career.\n\nHis research in multiscale modeling of soft materials has earned him a Department of Energy Early Career Award, the Joe & Essie Smith Endowed Chair in Chemical Engineering, and over 150 published scientific papers. His work spans polymer brushes, biological membranes, ceramics, proteins, COVID-19 spike protein interactions, and theoretical models of 3D printing, with collaborations spanning Lawrence Livermore National Lab, Los Alamos, and institutions around the world.\n\nA champion of education and diversity, Dr. Faller chaired graduate programs as an associate professor, led a Department of Education GAANN project for over a decade, and grew UC Davis\'s Chemical Engineering department into an independent powerhouse. At Texas Tech, he continues to push the boundaries of engineering education and research excellence across West Texas and beyond.'
    },
    yongchen:{
      name:'Yong Chen',
      photo:'images/YongChen_2023.jpg',
      role:'Professor & Department Chair',
      company:'Department of Computer Science',
      loc:'Texas Tech University',
      linkedin:'https://www.linkedin.com/in/yong-chen-92174410/',
      bio:'Dr. Yong Chen is a Professor and Department Chair of Computer Science at Texas Tech University, where he has been a faculty member for over 15 years. He earned his doctorate in Computer Science from the Illinois Institute of Technology and completed postdoctoral research at Oak Ridge National Laboratory. His research spans parallel computing, high-performance computing, big data systems, and storage architectures, with deep expertise in parallel file systems and data-intensive computing. He has organized and contributed to major international conferences including NPC and has built a reputation as a leader in scalable computing infrastructure. Under his leadership, the CS department at Texas Tech continues to grow in research excellence, student engagement, and industry collaboration.'
    },
    atharva:{
      name:'Atharva Lade',
      photo:'images/AtharvaLade.jpg',
      role:'Contributor · Guest Speaker',
      company:'The Apache Software Foundation (Iggy)',
      loc:'Austin, TX',
      linkedin:'https://www.linkedin.com/in/atharvalade/',
      bio:'Atharva Lade is a 13-time hackathon champion with over $65,000 in prize winnings, a core contributor to Apache Iggy, a next-generation ultra-low-latency message streaming engine built in Rust, and a two-time Dell Technologies ML/Gen AI intern who architected systems projecting $131M in savings. He publishes technical deep-dives on Medium and is graduating from Texas Tech with a 4.0 GPA in Computer Science and Mathematics. Invited by Google to I/O and their Munich office, Atharva embodies the kind of relentless curiosity and execution that DevCon was built to celebrate.',
      talk:'Every Millisecond Counts: Message Streaming and the New Shape of Low-Latency Infrastructure',
      abstract:'Have you ever wondered how massive distributed systems handle millions of events in real-time? For years, traditional message queues handled this by passing transient messages between services. But as data scale exploded, the industry had to evolve from simple queuing to persistent message streaming giving rise to append-only log architectures like Apache Kafka. In this session, we\'ll break down this critical shift, starting from the ground up to explain why modern microservices desperately rely on high-throughput streaming infrastructure to survive. But what happens when the industry standard becomes the bottleneck? Enter Apache Iggy. Drawing on my experience as a core contributor, I\'ll take you under the hood of this next-generation, ultra-low latency streaming engine. We\'ll explore the mechanics of high-performance infrastructure and see exactly why Iggy is fundamentally faster: leveraging Rust, thread-per-core architectures, and lock-free processing to easily handle over a million messages per second without the heavy JVM overhead or garbage collection pauses of older systems. Finally, we\'ll transition from raw performance to practical deployment by introducing LaserData, a fully managed, cloud-native implementation of Apache Iggy. We\'ll discuss how LaserData strips away infrastructure complexity so developers can harness next-generation streaming speed without the operational headaches. Whether you are a student or an entry-level engineer, you will leave this talk with a solid understanding of modern event streaming and the tools powering the fastest systems in the world.'
    }
  };

  const modal=document.getElementById('spkModal');
  if(!modal)return;
  const overlay=modal.querySelector('.spk-modal-overlay');
  const closeBtn=modal.querySelector('.spk-modal-close');
  const talkSection=document.getElementById('modalTalkSection');
  const bioSection=document.getElementById('modalBioSection');
  const linkedinEl=document.getElementById('modalLinkedin');

  function openModal(key,isGuest){
    const d=isGuest?guestData[key]:speakerData[key];
    if(!d)return;
    document.getElementById('modalPhoto').src=d.photo;
    document.getElementById('modalPhoto').alt=d.name;
    document.getElementById('modalName').textContent=d.name;
    document.getElementById('modalRole').textContent=d.role;
    document.getElementById('modalCompany').textContent=d.company;
    document.getElementById('modalLoc').textContent=d.loc||'';
    if(isGuest){
      if(d.linkedin){linkedinEl.style.display='';linkedinEl.href=d.linkedin;}else{linkedinEl.style.display='none';}
      bioSection.style.display='block';
      document.getElementById('modalBio').textContent=d.bio;
      if(d.talk&&d.abstract){
        talkSection.style.display='block';
        document.getElementById('modalTalk').textContent=d.talk;
        document.getElementById('modalAbstract').textContent=d.abstract;
      }else{
        talkSection.style.display='none';
      }
    }else{
      linkedinEl.style.display='';
      linkedinEl.href=d.linkedin;
      talkSection.style.display='block';
      bioSection.style.display='none';
      document.getElementById('modalTalk').textContent=d.talk;
      document.getElementById('modalAbstract').textContent=d.abstract;
    }
    modal.classList.add('active');
    document.body.style.overflow='hidden';
  }

  function closeModal(){
    modal.classList.remove('active');
    document.body.style.overflow='';
  }

  document.querySelectorAll('[data-speaker]').forEach(card=>{
    card.style.cursor='pointer';
    card.addEventListener('click',e=>{
      if(e.target.closest('.spk-link'))return;
      openModal(card.dataset.speaker,false);
    });
  });

  document.querySelectorAll('[data-guest]').forEach(card=>{
    card.style.cursor='pointer';
    card.addEventListener('click',e=>{
      if(e.target.closest('.spk-link'))return;
      openModal(card.dataset.guest,true);
    });
  });

  closeBtn.addEventListener('click',closeModal);
  overlay.addEventListener('click',closeModal);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
}

function initCountdown(){
  const target=new Date('2026-04-08T17:30:00-05:00').getTime();
  const dEl=document.getElementById('cdDays');
  const hEl=document.getElementById('cdHours');
  const mEl=document.getElementById('cdMins');
  const sEl=document.getElementById('cdSecs');
  if(!dEl)return;
  function update(){
    const diff=Math.max(0,target-Date.now());
    const d=Math.floor(diff/(1000*60*60*24));
    const h=Math.floor((diff%(1000*60*60*24))/(1000*60*60));
    const m=Math.floor((diff%(1000*60*60))/(1000*60));
    const s=Math.floor((diff%(1000*60))/1000);
    const p=n=>String(n).padStart(2,'0');
    dEl.textContent=p(d);
    hEl.textContent=p(h);
    mEl.textContent=p(m);
    sEl.textContent=p(s);
  }
  update();
  setInterval(update,1000);
}
